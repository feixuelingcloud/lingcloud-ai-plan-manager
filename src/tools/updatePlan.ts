/**
 * 修改计划工具
 * 用于修改计划的各种字段(截止日期、重要性、分类等)
 */

import { Type } from '@sinclair/typebox';
import { post } from '../client/apiClient.js';

export const updatePlanTool = {
  name: 'update_plan',
  description: 'Update plan fields (WRITE operation - requires user confirmation). Can modify deadline, start date, importance, urgency, category, notes, etc. Set optional=true to require explicit user consent.',

  parameters: Type.Object({
    plan_id: Type.String({
      description: '计划ID,可以从查询计划列表或上下文中获取'
    }),
    title: Type.Optional(Type.String({
      description: '新的计划名称'
    })),
    deadline: Type.Optional(Type.String({
      description: '新的截止日期,格式: YYYY-MM-DD,例如: 2026-04-01'
    })),
    deadlineTime: Type.Optional(Type.String({
      description: '新的截止时间,格式: HH:mm,例如: 18:00'
    })),
    startDate: Type.Optional(Type.String({
      description: '新的开始日期,格式: YYYY-MM-DD'
    })),
    startTime: Type.Optional(Type.String({
      description: '新的开始时间,格式: HH:mm'
    })),
    category: Type.Optional(Type.String({
      description: '新的分类: 工作/学习/生活/运动/兴趣/出行/休闲/其他'
    })),
    importance: Type.Optional(Type.Number({
      description: '新的重要性(1-10),例如: 8'
    })),
    urgency: Type.Optional(Type.Number({
      description: '新的紧急性(1-10),例如: 6'
    })),
    executionNotes: Type.Optional(Type.String({
      description: '新的备注或执行说明'
    })),
    status: Type.Optional(Type.String({
      description: '新的状态: pending(待办)/in_progress(进行中)/completed(已完成)/blocked(阻塞)'
    }))
  }),

  // 这是写操作,设为optional
  optional: true,

  async execute(_id: string, params: any) {
    try {
      const { plan_id, ...updateFields } = params;

      // 构建请求体(只包含需要更新的字段)
      const fieldsToUpdate: any = {};
      for (const [key, value] of Object.entries(updateFields)) {
        if (value !== undefined && value !== null) {
          fieldsToUpdate[key] = value;
        }
      }

      if (Object.keys(fieldsToUpdate).length === 0) {
        return {
          success: false,
          error: 'NO_FIELDS_PROVIDED',
          output: '❌ 没有提供需要更新的字段\n\n💡 请指定至少一个字段,如: deadline, importance, category等'
        };
      }

      const response = await post<{
        plan_id: string;
        updated_fields: string[];
        change_summary: string;
        message: string;
      }>(`/openclaw/plans/${plan_id}/update`, fieldsToUpdate);

      // 格式化返回给用户的消息
      const output = [
        '✅ 计划已成功更新!',
        '',
        `📋 计划ID: ${response.plan_id}`,
        `📝 更新的字段: ${response.updated_fields.join(', ')}`,
        '',
        '📊 变更详情:',
        response.change_summary.split('; ').map(change => `  • ${change}`).join('\n')
      ].join('\n');

      return {
        success: true,
        plan_id: response.plan_id,
        updated_fields: response.updated_fields,
        output
      };
    } catch (error: any) {
      const errorMessage = error.toUserMessage ? error.toUserMessage() : error.message;

      // 特别处理计划不存在的情况
      if (error.code === 'PLAN_NOT_FOUND') {
        return {
          success: false,
          error: 'PLAN_NOT_FOUND',
          output: [
            '❌ 计划不存在',
            '',
            '💡 建议: 先查询计划列表,确认计划ID是否正确'
          ].join('\n')
        };
      }

      return {
        success: false,
        error: errorMessage,
        output: `❌ 修改计划失败:\n\n${errorMessage}`
      };
    }
  }
};
