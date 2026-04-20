/**
 * 批量克隆"我的AI员工"工具
 *
 * 流程：
 * 1. 读取用户"我的AI员工"列表
 * 2. 对每位员工：获取 SOUL → 本地创建 OpenClaw Agent → 回存绑定
 * 3. 返回完整的绑定映射表（sourceAgentId → cloneId）
 */

import { Type } from '@sinclair/typebox';
import { get, post } from '../client/apiClient.js';
import { createAgent } from '../utils/openclawCli.js';

export const cloneAllAIStaffTool = {
  name: 'clone_all_ai_staff',
  description: `Clone all of the user's AI staff members as real OpenClaw Agents. Fetches each member's SOUL (system prompt), creates a local OpenClaw Agent for each, then stores the bindings. Already-cloned staff are reused. Call this when user says "克隆我的AI员工" or similar. IMPORTANT: Confirm with user before cloning.`,

  parameters: Type.Object({
    confirm: Type.Optional(Type.Boolean({
      description: '确认执行批量克隆，设为 true 表示用户已确认'
    }))
  }),

  async execute(_id: string, params: any) {
    try {
      // 1. 获取"我的AI员工"列表
      const myStaffRes = await get<{ agents: any[]; total: number; message?: string }>(
        '/openclaw/ai-staff/my-staff'
      );

      if (!myStaffRes.agents || myStaffRes.agents.length === 0) {
        return {
          success: false,
          output: [
            '⚠️ **未找到"我的AI员工"数据**',
            '',
            myStaffRes.message || '您还没有在 GotoPlan 中设置"我的AI员工"。',
            '',
            '💡 请先在 GotoPlan中操作：',
            '  1. 打开 GotoPlan → AI员工页面',
            '  2. 点击员工卡片 → 点击"加入我的员工"按钮',
            '  3. 添加完成后，回到 OpenClaw 再次执行克隆'
          ].join('\n')
        };
      }

      // 2. 对每位员工：获取 SOUL → 本地创建 OpenClaw Agent
      const bindings: Array<{ agentId: string; openclawAgentId: string }> = [];
      const localFailed: Array<{ agentId: string; name: string; error: string }> = [];

      for (const staff of myStaffRes.agents) {
        try {
          const soulRes = await get<{ agentId: string; name: string; soul: string }>(
            `/openclaw/ai-staff/${staff.agentId}/soul`
          );
          const slug = `clone-${staff.agentId}`;
          const openclawAgentId = await createAgent(soulRes.name, soulRes.soul, slug);
          bindings.push({ agentId: staff.agentId, openclawAgentId });
        } catch (err: any) {
          localFailed.push({ agentId: staff.agentId, name: staff.name || staff.agentId, error: err.message });
        }
      }

      if (bindings.length === 0) {
        return {
          success: false,
          output: [
            '❌ **所有员工克隆失败**',
            '',
            ...localFailed.map(f => `  • ${f.name}: ${f.error}`),
            '',
            '💡 请检查本地是否已安装并可正常运行 openclaw CLI'
          ].join('\n')
        };
      }

      // 3. 将绑定关系批量回存后端
      const agentIds = myStaffRes.agents.map((a: any) => a.agentId);
      const cloneRes = await post<{
        total_agents: number;
        newly_cloned: number;
        already_existed: number;
        failed: number;
        cloned: Array<{ agentId: string; name: string; emoji: string; department: string; cloneId: string; openclawAgentId: string }>;
        already_existed_list: Array<{ agentId: string; name: string; emoji: string; cloneId: string; openclawAgentId: string }>;
        failed_list: Array<{ agentId: string; name: string; error: string }>;
        binding_map: Record<string, string>;
      }>('/openclaw/ai-staff/clone-all', { agentIds, bindings });

      // 4. 构建展示结果
      const lines: string[] = [
        `✅ **"我的AI员工"克隆完成！**`,
        '',
        `👥 共处理 ${cloneRes.total_agents} 位员工`,
        `🆕 新建克隆体: **${cloneRes.newly_cloned}** 个`,
        `♻️ 复用已有绑定: **${cloneRes.already_existed}** 个`,
        (cloneRes.failed > 0 || localFailed.length > 0)
          ? `❌ 失败: ${cloneRes.failed + localFailed.length} 个` : null,
        ''
      ].filter(Boolean) as string[];

      if (cloneRes.cloned && cloneRes.cloned.length > 0) {
        lines.push('**🆕 新建克隆体：**');
        cloneRes.cloned.forEach(c => {
          lines.push(`  ${c.emoji || '🤖'} **${c.name}** (${c.department || '-'})`);
          lines.push(`     🔗 cloneId: \`${c.cloneId}\`  OpenClaw Agent: \`${c.openclawAgentId}\``);
        });
        lines.push('');
      }

      if (cloneRes.already_existed_list && cloneRes.already_existed_list.length > 0) {
        lines.push('**♻️ 已存在绑定（直接复用）：**');
        cloneRes.already_existed_list.forEach(c => {
          lines.push(`  ${c.emoji || '🤖'} **${c.name}** → \`${c.cloneId}\``);
        });
        lines.push('');
      }

      const allFailed = [...(cloneRes.failed_list || []), ...localFailed];
      if (allFailed.length > 0) {
        lines.push('**❌ 克隆失败：**');
        allFailed.forEach(f => lines.push(`  • ${f.name}: ${f.error}`));
        lines.push('');
      }

      lines.push('━'.repeat(40));
      lines.push('');
      lines.push('🎯 **所有克隆体已就位，任务将由 OpenClaw 本地模型执行！**');

      return {
        success: true,
        total: cloneRes.total_agents,
        newlyCloned: cloneRes.newly_cloned,
        alreadyExisted: cloneRes.already_existed,
        bindingMap: cloneRes.binding_map,
        output: lines.join('\n')
      };
    } catch (error: any) {
      const msg = error.toUserMessage ? error.toUserMessage() : error.message;
      return {
        success: false,
        error: msg,
        output: [
          `❌ 批量克隆失败:\n\n${msg}`,
          '',
          '💡 请检查：',
          '  1. GotoPlan 中是否已设置"我的AI员工"',
          '  2. 本地是否已安装 openclaw CLI',
          '  3. API Key 是否有效'
        ].join('\n')
      };
    }
  }
};
