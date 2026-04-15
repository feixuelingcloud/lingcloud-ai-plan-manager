/**
 * 飞书 Docx 同步工具
 * 将任务成果写入飞书云文档（Docx）
 */

import { CONFIG } from '../config/index.js';

const FEISHU_BASE = 'https://open.feishu.cn/open-apis';

type TenantTokenCache = {
  token: string;
  expireAtMs: number;
} | null;

let _tenantTokenCache: TenantTokenCache = null;

async function getTenantAccessToken(): Promise<string> {
  if (_tenantTokenCache && Date.now() < _tenantTokenCache.expireAtMs - 60_000) {
    return _tenantTokenCache.token;
  }

  const resp = await fetch(`${FEISHU_BASE}/auth/v3/tenant_access_token/internal`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      app_id: CONFIG.feishuAppId,
      app_secret: CONFIG.feishuAppSecret
    })
  });

  const data: any = await resp.json().catch(() => ({}));
  // 飞书错误格式一般为 { code, msg, tenant_access_token, expire }
  if (!resp.ok || data.code !== 0 || !data.tenant_access_token) {
    const msg = data?.msg || `HTTP ${resp.status}`;
    throw new Error(`飞书鉴权失败: ${msg}`);
  }

  const expireSec = Number(data.expire || 0);
  _tenantTokenCache = {
    token: String(data.tenant_access_token),
    expireAtMs: Date.now() + Math.max(expireSec, 60) * 1000
  };
  return _tenantTokenCache.token;
}

async function feishuRequest(method: string, path: string, body?: unknown): Promise<any> {
  const token = await getTenantAccessToken();
  const resp = await fetch(`${FEISHU_BASE}${path}`, {
    method,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: body ? JSON.stringify(body) : undefined
  });
  const data: any = await resp.json().catch(() => ({}));
  if (!resp.ok || data?.code !== 0) {
    const msg = data?.msg || `HTTP ${resp.status}`;
    throw new Error(`飞书 API 失败: ${msg}`);
  }
  return data;
}

function buildPlainText(taskInfo: { title: string; agentName?: string; completedAt?: string }, result: string): string {
  const lines: string[] = [];
  lines.push(taskInfo.title || '未命名任务');
  lines.push('');
  lines.push(`员工: ${taskInfo.agentName || '未知'}`);
  if (taskInfo.completedAt) lines.push(`完成时间: ${taskInfo.completedAt}`);
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push(result || '');
  return lines.join('\n');
}

/**
 * 同步成果到飞书 Docx
 * 说明：为保证可用性，当前以“纯文本”写入为主（不做复杂 Markdown 结构化）。
 */
export async function syncTaskResultToFeishuDocx(
  taskInfo: { title: string; agentName?: string; completedAt?: string },
  result: string
): Promise<{ success: boolean; documentId?: string; url?: string; error?: string }> {
  if (!CONFIG.feishuEnabled) return { success: false, error: '飞书同步未启用' };
  if (!CONFIG.feishuAppId) return { success: false, error: '未配置 feishuAppId' };
  if (!CONFIG.feishuAppSecret) return { success: false, error: '未配置 feishuAppSecret' };

  try {
    // 1) 创建 Docx 文档
    const createBody: any = {
      title: taskInfo.title || '未命名任务'
    };
    if (CONFIG.feishuFolderToken) createBody.folder_token = CONFIG.feishuFolderToken;

    const created = await feishuRequest('POST', `/docx/v1/documents`, createBody);
    const documentId = created?.data?.document?.document_id || created?.data?.document_id;
    if (!documentId) throw new Error('创建文档成功但未返回 document_id');

    // 2) 写入内容（尽量使用 docx block batch_update）
    const content = buildPlainText(taskInfo, result);

    // Docx block API 结构在不同版本略有差异，这里采用最保守的“插入文本块”请求形式；
    // 若你的飞书租户 API 版本不同，可据实际返回错误信息微调 request 结构。
    await feishuRequest(
      'POST',
      `/docx/v1/documents/${encodeURIComponent(documentId)}/blocks/batch_update`,
      {
        requests: [
          {
            // 在文档末尾追加一个 paragraph
            request_type: 'insert',
            insert: {
              // 飞书 Docx 通常以 document_id 作为根 block；如果报错需改为返回的 root_id
              location: { block_id: documentId, index: -1 },
              block: {
                block_type: 2, // paragraph
                paragraph: {
                  elements: [
                    {
                      text_run: { content }
                    }
                  ]
                }
              }
            }
          }
        ]
      }
    );

    const url = `https://docs.feishu.cn/docx/${documentId}`;
    return { success: true, documentId, url };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

