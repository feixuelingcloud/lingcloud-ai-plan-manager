/**
 * GotoPlan OpenClaw Plugin
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
import { testConnectionTool } from './src/tools/testConnection.js';

// AI员工克隆 & 多Agent编排工具
import { listAIStaffTool } from './src/tools/listAIStaff.js';
import { cloneStaffAgentTool } from './src/tools/cloneStaffAgent.js';
import { listClonedAgentsTool } from './src/tools/listClonedAgents.js';
import { removeCloneTool } from './src/tools/removeClone.js';
import { dispatchTaskToAgentTool } from './src/tools/dispatchTaskToAgent.js';
import { getTaskStatusTool } from './src/tools/getTaskStatus.js';
import { getBossReportsTool } from './src/tools/getBossReports.js';
import { acknowledgeReportTool } from './src/tools/acknowledgeReport.js';
import { bossMorningDispatchTool } from './src/tools/bossMorningDispatch.js';
import { cloneAllAIStaffTool } from './src/tools/cloneAllAIStaff.js';

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
    apiKeyLength: pluginConfig.apiKey?.length || 0,
    hasAI_PLAN_API_KEY: !!pluginConfig.AI_PLAN_API_KEY,
    hasApiBase: !!pluginConfig.apiBase,
    hasEnvKey: !!(typeof process !== 'undefined' && process.env?.AI_PLAN_API_KEY),
    pluginConfigKeys: Object.keys(pluginConfig)
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

  // 10. 连接诊断工具（排查 Token无效/连接失败）
  api.registerTool(testConnectionTool);
  console.log('✅ Registered: test_connection');

  // ========== AI员工克隆 & 多Agent编排工具 ==========

  // 11. 列出AI员工(只读操作)
  api.registerTool(listAIStaffTool);
  console.log('✅ Registered: list_ai_staff');

  // 12. 克隆员工为Agent(写操作,optional=true)
  api.registerTool(cloneStaffAgentTool);
  console.log('✅ Registered: clone_staff_agent');

  // 13. 列出克隆体(只读操作)
  api.registerTool(listClonedAgentsTool);
  console.log('✅ Registered: list_cloned_agents');

  // 14. 停用克隆体(写操作,optional=true)
  api.registerTool(removeCloneTool);
  console.log('✅ Registered: remove_clone');

  // 15. Boss分派任务(写操作,optional=true)
  api.registerTool(dispatchTaskToAgentTool);
  console.log('✅ Registered: dispatch_task_to_agent');

  // 16. 查询任务状态(只读操作)
  api.registerTool(getTaskStatusTool);
  console.log('✅ Registered: get_task_status');

  // 17. 获取工作汇报(只读操作)
  api.registerTool(getBossReportsTool);
  console.log('✅ Registered: get_boss_reports');

  // 18. 确认报告(写操作,optional=true)
  api.registerTool(acknowledgeReportTool);
  console.log('✅ Registered: acknowledge_report');

  // 19. Boss晨间调度(写操作,optional=true) - 每天早上自动触发
  api.registerTool(bossMorningDispatchTool);
  console.log('✅ Registered: boss_morning_dispatch');

  // 20. 批量克隆"我的AI员工"(写操作,optional=true) - "克隆我的AI员工"入口
  api.registerTool(cloneAllAIStaffTool);
  console.log('✅ Registered: clone_all_ai_staff');

  console.log('✅ AI Plan Manager Plugin loaded (20 tools)');

  if (!validation.valid) {
    console.log(validation.message);
  }
}
