/**
 * OpenClaw CLI 封装
 *
 * 插件运行在用户本地机器上，通过 child_process 调用 OpenClaw CLI：
 *   - createAgent()   → openclaw agents add <name> --workspace <dir> --non-interactive --json
 *   - sendMessage()   → openclaw agent -m "<msg>" --agent <id>
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

const execAsync = promisify(exec);

const CLONES_DIR = path.join(os.homedir(), '.openclaw', 'agent-clones');

/**
 * 在本地创建一个 OpenClaw Agent，以 soulContent 作为 SOUL.md。
 * 返回 OpenClaw 分配的 agentId（即 agents add 命令返回的 JSON 中的 id）。
 */
export async function createAgent(
  name: string,
  soulContent: string,
  slug: string
): Promise<string> {
  // 1. 准备工作目录
  const workspaceDir = path.join(CLONES_DIR, slug);
  fs.mkdirSync(workspaceDir, { recursive: true });

  // 2. 写入 SOUL.md
  fs.writeFileSync(path.join(workspaceDir, 'SOUL.md'), soulContent, 'utf-8');

  // 3. 调用 CLI 创建 Agent
  // 用 slug 作为 Agent ID（避免中文名被 CLI 解析为保留字 main）
  const safeSlug = slug.replace(/"/g, '\\"');
  const safeDir = workspaceDir.replace(/"/g, '\\"');
  const cmd = `openclaw agents add "${safeSlug}" --workspace "${safeDir}" --non-interactive --json`;

  const { stdout, stderr } = await execAsync(cmd, { timeout: 30000 });

  // 4. 解析返回的 JSON，取 agentId
  const output = stdout.trim();
  try {
    const result = JSON.parse(output);
    const agentId = result.id || result.agentId || result.name;
    if (!agentId) throw new Error(`openclaw agents add 未返回 agentId。输出: ${output}`);
    return String(agentId);
  } catch {
    // 如果输出不是 JSON，说明命令可能用 slug 作为 ID
    if (stderr) throw new Error(`openclaw agents add 失败: ${stderr}`);
    // 降级：以 slug 作为 agentId
    return slug;
  }
}

/**
 * 向指定的 OpenClaw Agent 发送消息，等待响应并返回结果文本。
 * timeout 默认 2 分钟。
 */
export async function sendMessage(
  openclawAgentId: string,
  message: string,
  timeoutMs = 120000
): Promise<string> {
  const safeMsg = message.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, ' ');
  const cmd = `openclaw agent -m "${safeMsg}" --agent "${openclawAgentId}"`;

  const { stdout, stderr } = await execAsync(cmd, { timeout: timeoutMs });

  if (stderr && !stdout) throw new Error(`openclaw agent 执行失败: ${stderr}`);
  return stdout.trim();
}

/**
 * 删除本地 Agent 的工作目录（软删除时调用）
 */
export function removeAgentWorkspace(slug: string): void {
  const workspaceDir = path.join(CLONES_DIR, slug);
  if (fs.existsSync(workspaceDir)) {
    fs.rmSync(workspaceDir, { recursive: true, force: true });
  }
}
