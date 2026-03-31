/**
 * 获取今日重点工具
 * 基于优先级和截止日期,推荐今日应关注的任务
 */

import { Type } from '@sinclair/typebox';
import { get } from '../client/apiClient.js';

export const getTodayFocusTool = {
  name: 'get_today_focus',
  description: 'Get today\'s focus tasks. Intelligently recommends tasks to focus on today based on priority and deadline. Returns top 5 most important tasks by default.',

  parameters: Type.Object({
    date: Type.Optional(Type.String({
      description: '日期,格式为YYYY-MM-DD。不指定则为今天',
      pattern: '^\\d{4}-\\d{2}-\\d{2}$'
    })),
    max_items: Type.Optional(Type.Number({
      description: '返回的最大任务数量,默认为5',
      minimum: 1,
      maximum: 20
    }))
  }),

  async execute(_id: string, params: { date?: string; max_items?: number }) {
    try {
      // 构建查询参数
      const queryParams = new URLSearchParams();
      if (params.date) {
        queryParams.append('date', params.date);
      }
      if (params.max_items) {
        queryParams.append('max_items', params.max_items.toString());
      }

      const queryString = queryParams.toString();
      const url = `/openclaw/focus/today${queryString ? `?${queryString}` : ''}`;

      const response = await get<{
        focus_tasks: Array<{
          task_id: string;
          title: string;
          reason: string;
        }>;
      }>(url);

      // 格式化日期显示
      const displayDate = params.date || new Date().toISOString().split('T')[0];
      const dateObj = new Date(displayDate);
      const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
      const weekday = weekdays[dateObj.getDay()];

      // 格式化输出
      const output = [
        '🎯 今日重点任务',
        '═══════════════════════════════════════',
        `📅 ${displayDate} ${weekday}`,
        ''
      ];

      if (response.focus_tasks.length === 0) {
        output.push('✨ 今天暂无重点任务');
        output.push('');
        output.push('💡 提示:');
        output.push('  • 您可以查看所有计划: list_plans');
        output.push('  • 或者检查是否有提醒: get_plan_reminders');
      } else {
        output.push(`📌 为您推荐 ${response.focus_tasks.length} 个重点任务:`);
        output.push('');

        response.focus_tasks.forEach((task, index) => {
          output.push(`${index + 1}. ${task.title}`);
          output.push(`   💡 ${task.reason}`);
          output.push(`   🆔 任务ID: ${task.task_id}`);
          if (index < response.focus_tasks.length - 1) {
            output.push('');
          }
        });

        output.push('');
        output.push('───────────────────────────────────────');
        output.push('💪 建议:');
        output.push('  • 优先处理高优先级和即将到期的任务');
        output.push('  • 使用 get_plan_detail 查看任务详情');
        output.push('  • 使用 update_task_status 更新任务状态');
      }

      return {
        success: true,
        focus_tasks: response.focus_tasks,
        count: response.focus_tasks.length,
        output: output.join('\n')
      };
    } catch (error: any) {
      const errorMessage = error.toUserMessage ? error.toUserMessage() : error.message;

      return {
        success: false,
        error: errorMessage,
        output: `❌ 获取今日重点失败:\n\n${errorMessage}`
      };
    }
  }
};
