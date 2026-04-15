/**
 * Notion 客户端工具
 * 将任务成果同步写入 Notion "2026工作计划" 页面树
 */

import { CONFIG } from '../config/index.js';

const NOTION_VERSION = '2022-06-28';
const NOTION_BASE = 'https://api.notion.com/v1';

// ── HTTP ──────────────────────────────────────────────────────────────────────

async function notionRequest(method: string, path: string, body?: unknown): Promise<any> {
  const resp = await fetch(`${NOTION_BASE}${path}`, {
    method,
    headers: {
      'Authorization': `Bearer ${CONFIG.notionApiKey}`,
      'Notion-Version': NOTION_VERSION,
      'Content-Type': 'application/json'
    },
    body: body ? JSON.stringify(body) : undefined
  });
  if (!resp.ok) {
    const errText = await resp.text();
    throw new Error(`Notion API ${resp.status}: ${errText}`);
  }
  return resp.json();
}

// ── Markdown → Notion blocks ──────────────────────────────────────────────────

const CODE_LANG_MAP: Record<string, string> = {
  js: 'javascript', javascript: 'javascript', ts: 'typescript', typescript: 'typescript',
  py: 'python', python: 'python', sh: 'shell', bash: 'shell', shell: 'shell',
  json: 'json', html: 'html', css: 'css', sql: 'sql', java: 'java',
  go: 'go', rust: 'rust', cpp: 'c++', c: 'c', md: 'markdown', markdown: 'markdown',
  yaml: 'yaml', yml: 'yaml', xml: 'xml', php: 'php', ruby: 'ruby', swift: 'swift',
  kotlin: 'kotlin', scala: 'scala', r: 'r'
};

type Annotations = Partial<{ bold: boolean; italic: boolean; strikethrough: boolean; code: boolean }>;

function makeRuns(text: string, ann: Annotations = {}): unknown[] {
  const runs: unknown[] = [];
  for (let i = 0; i < Math.max(text.length, 1); i += 2000) {
    runs.push({
      type: 'text',
      text: { content: text.slice(i, i + 2000) || '' },
      annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: 'default', ...ann }
    });
  }
  return runs;
}

/**
 * 解析行内 Markdown：**bold**, *italic*, `code`, ~~strikethrough~~
 * 注意：使用 u flag 确保 emoji 等 Unicode 字符不被拆断；
 *       去掉 _italic_ 以避免中文下划线误匹配。
 */
function parseInline(text: string): unknown[] {
  const result: unknown[] = [];
  // u flag：将字符串按 Unicode 码点处理，emoji 不会被拆成代理对
  // 不支持 _italic_：中文/emoji 文本中 _ 容易误匹配
  const re = /(\*\*(.+?)\*\*|~~(.+?)~~|`([^`\n]+)`|\*(.+?)\*)/gu;
  let last = 0;
  let m: RegExpExecArray | null;

  while ((m = re.exec(text)) !== null) {
    if (m.index > last) result.push(...makeRuns(text.slice(last, m.index)));
    if (m[0].startsWith('**'))       result.push(...makeRuns(m[2], { bold: true }));
    else if (m[0].startsWith('~~'))  result.push(...makeRuns(m[3], { strikethrough: true }));
    else if (m[0].startsWith('`'))   result.push(...makeRuns(m[4], { code: true }));
    else                             result.push(...makeRuns(m[5], { italic: true }));
    last = m.index + m[0].length;
  }
  if (last < text.length) result.push(...makeRuns(text.slice(last)));
  return result.length ? result : [{ type: 'text', text: { content: '' } }];
}

function heading(level: 1 | 2 | 3, rt: unknown[]): unknown {
  const k = `heading_${level}` as const;
  return { object: 'block', type: k, [k]: { rich_text: rt } };
}

/** Markdown 文本 → Notion blocks */
export function markdownToBlocks(text: string): unknown[] {
  const blocks: unknown[] = [];
  const lines = text.split('\n');
  let i = 0;
  let consecutiveEmpty = 0; // 连续空行计数

  while (i < lines.length) {
    const line = lines[i];
    const t = line.trim();

    // 空行：连续空行只插入一个空段落，单个空行直接跳过
    if (t === '') {
      consecutiveEmpty++;
      if (consecutiveEmpty === 2) {
        blocks.push({ object: 'block', type: 'paragraph', paragraph: { rich_text: [] } });
      }
      i++; continue;
    }

    // 非空行，重置连续空行计数
    consecutiveEmpty = 0;

    // 围栏代码块
    if (t.startsWith('```')) {
      const langRaw = t.slice(3).trim().toLowerCase();
      const language = CODE_LANG_MAP[langRaw] ?? (langRaw || 'plain text');
      const code: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) { code.push(lines[i]); i++; }
      i++;
      const content = code.join('\n');
      const rt: unknown[] = [];
      for (let j = 0; j < Math.max(content.length, 1); j += 2000)
        rt.push({ type: 'text', text: { content: content.slice(j, j + 2000) || '' } });
      blocks.push({ object: 'block', type: 'code', code: { rich_text: rt, language } });
      continue;
    }

    // 分割线
    if (/^[-*_]{3,}$/.test(t)) { blocks.push({ object: 'block', type: 'divider', divider: {} }); i++; continue; }

    // 标题
    let m: RegExpMatchArray | null;
    if ((m = line.match(/^### (.+)/))) { blocks.push(heading(3, parseInline(m[1]))); i++; continue; }
    if ((m = line.match(/^## (.+)/)))  { blocks.push(heading(2, parseInline(m[1]))); i++; continue; }
    if ((m = line.match(/^# (.+)/)))   { blocks.push(heading(1, parseInline(m[1]))); i++; continue; }

    // 引用
    if ((m = line.match(/^> (.+)/))) {
      blocks.push({ object: 'block', type: 'quote', quote: { rich_text: parseInline(m[1]) } });
      i++; continue;
    }

    // 待办
    if ((m = line.match(/^[-*+] \[x\] (.+)/i))) {
      blocks.push({ object: 'block', type: 'to_do', to_do: { rich_text: parseInline(m[1]), checked: true } });
      i++; continue;
    }
    if ((m = line.match(/^[-*+] \[ \] (.+)/))) {
      blocks.push({ object: 'block', type: 'to_do', to_do: { rich_text: parseInline(m[1]), checked: false } });
      i++; continue;
    }

    // 无序列表
    if ((m = line.match(/^[-*+] (.+)/))) {
      blocks.push({ object: 'block', type: 'bulleted_list_item', bulleted_list_item: { rich_text: parseInline(m[1]) } });
      i++; continue;
    }

    // 有序列表
    if ((m = line.match(/^\d+\. (.+)/))) {
      blocks.push({ object: 'block', type: 'numbered_list_item', numbered_list_item: { rich_text: parseInline(m[1]) } });
      i++; continue;
    }

    // 普通段落
    blocks.push({ object: 'block', type: 'paragraph', paragraph: { rich_text: parseInline(line) } });
    i++;
  }

  return blocks;
}

// ── Page helpers ──────────────────────────────────────────────────────────────

/** 在 parentId 下查找或创建 "YYYY-MM-DD 成果" 当日页面，返回其 ID */
async function findOrCreateDailyPage(parentId: string, dateStr: string): Promise<string> {
  const title = `${dateStr} 成果`;
  const data = await notionRequest('GET', `/blocks/${parentId}/children?page_size=100`);
  for (const block of (data.results ?? [])) {
    if (block.type === 'child_page' && block.child_page?.title === title) return block.id as string;
  }
  const page = await notionRequest('POST', '/pages', {
    parent: { page_id: parentId },
    properties: { title: { title: [{ type: 'text', text: { content: title } }] } }
  });
  return page.id as string;
}

/** 分批（每批 100 块）向页面追加 blocks */
async function appendBlocks(pageId: string, blocks: unknown[]): Promise<void> {
  for (let i = 0; i < blocks.length; i += 100) {
    await notionRequest('PATCH', `/blocks/${pageId}/children`, { children: blocks.slice(i, i + 100) });
  }
}

// ── 公共接口 ──────────────────────────────────────────────────────────────────

export interface TaskInfo {
  title: string;
  description?: string;
  agentName?: string;
  completedAt?: string;
  result?: string;
}

/**
 * 将任务成果同步到 Notion
 * 层级：2026工作计划 → YYYY-MM-DD 成果（当日，幂等） → 成果子页
 */
export async function syncTaskResultToNotion(
  taskInfo: TaskInfo,
  result: string
): Promise<{ success: boolean; pageId?: string; error?: string }> {
  if (!CONFIG.notionEnabled)  return { success: false, error: 'Notion 同步未启用' };
  if (!CONFIG.notionApiKey)   return { success: false, error: '未配置 notionApiKey' };
  if (!CONFIG.notionParentPageId) return { success: false, error: '未配置 notionParentPageId' };

  try {
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    const dailyPageId = await findOrCreateDailyPage(CONFIG.notionParentPageId, dateStr);

    // 创建空成果页（带 emoji 图标）
    const page = await notionRequest('POST', '/pages', {
      parent: { page_id: dailyPageId },
      icon: { type: 'emoji', emoji: '📝' },
      properties: {
        title: { title: [{ type: 'text', text: { content: taskInfo.title || '未命名任务' } }] }
      }
    });

    // 组装内容块
    const headerBlocks: unknown[] = [
      {
        object: 'block', type: 'callout',
        callout: {
          rich_text: [{
            type: 'text',
            text: { content: `👤 ${taskInfo.agentName || '未知员工'}${taskInfo.completedAt ? `  |  🕐 ${taskInfo.completedAt}` : ''}` }
          }],
          icon: { emoji: '📋' }
        }
      },
      { object: 'block', type: 'divider', divider: {} }
    ];

    const contentBlocks = markdownToBlocks(result);
    await appendBlocks(page.id as string, [...headerBlocks, ...contentBlocks]);

    return { success: true, pageId: page.id as string };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
