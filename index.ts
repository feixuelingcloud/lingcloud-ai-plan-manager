/**
 * AI计划管理系统 OpenClaw Plugin
 * 主入口文件
 */

import { loadConfig, validateConfig } from './src/config/index.js';
import { createPlanDraftTool } from './src/tools/createPlanDraft.js';
import { confirmPlanTool } from './src/tools/confirmPlan.js';
import { updatePlanTool } from './src/tools/updatePlan.js';
import { getPlanRemindersTool } from './src/tools/getPlanReminders.js';
import { listPlansTool } from './src/tools/listPlans.js';
import { getPlanDetailTool } from './src/tools/getPlanDetail.js';
import { updateTaskStatusTool } from './src/tools/updateTaskStatus.js';
import { generateReportTool } from './src/tools/generateReport.js';
import { getTodayFocusTool } from './src/tools/getTodayFocus.js';

/**
 * 插件入口
 * 注册所有工具
 */
export default function definePlugin(api: any) {
  console.log('✅ AI Plan Manager Plugin loading...');

  // OpenClaw 通过 api.pluginConfig 传递用户配置
  const pluginConfig = api.pluginConfig || {};
  console.log('📋 Plugin config received:', {
    hasApiKey: !!pluginConfig.apiKey,
    apiKeyLength: pluginConfig.apiKey?.length || 0
  });

  loadConfig(pluginConfig);

  // 验证配置（不抛出错误，只是警告）
  const validation = validateConfig();
  if (!validation.valid) {
    console.warn('⚠️  Plugin configuration incomplete:', validation.message);
  }

  // ========== 注册工具 ==========

  // 1. 创建计划草稿(只读操作)
  api.registerTool(createPlanDraftTool);
  console.log('✅ Registered: create_plan_draft');

  // 2. 确认计划创建(写操作,optional=true)
  api.registerTool(confirmPlanTool);
  console.log('✅ Registered: confirm_plan');

  // 3. 修改计划(写操作,optional=true)
  api.registerTool(updatePlanTool);
  console.log('✅ Registered: update_plan');

  // 4. 获取计划提醒(只读操作)
  api.registerTool(getPlanRemindersTool);
  console.log('✅ Registered: get_plan_reminders');

  // 5. 列出计划列表(只读操作)
  api.registerTool(listPlansTool);
  console.log('✅ Registered: list_plans');

  // 6. 获取计划详情(只读操作)
  api.registerTool(getPlanDetailTool);
  console.log('✅ Registered: get_plan_detail');

  // 7. 更新任务状态(写操作,optional=true)
  api.registerTool(updateTaskStatusTool);
  console.log('✅ Registered: update_task_status');

  // 8. 生成执行报告(只读操作)
  api.registerTool(generateReportTool);
  console.log('✅ Registered: generate_execution_report');

  // 9. 获取今日重点(只读操作)
  api.registerTool(getTodayFocusTool);
  console.log('✅ Registered: get_today_focus');

  console.log('✅ AI Plan Manager Plugin loaded (9 tools)');
  
  if (!validation.valid) {
    console.log(validation.message);
  }
}
