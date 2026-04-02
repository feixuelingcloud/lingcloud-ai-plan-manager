/**
 * 插件配置管理
 * API 地址固定，用户只需配置 API Key
 */

export interface PluginConfig {
  apiBase: string;  // 固定值
  apiKey: string;   // 用户配置
  timeout: number;  // 固定值
}

// 全局配置对象
export let CONFIG: PluginConfig = {
  // 固定的后端服务器地址
  apiBase: 'https://plan.lingcloudai.com/api',
  // API Key 由用户通过 OpenClaw 设置
  apiKey: '',
  timeout: 15000
};

/**
 * 从 OpenClaw 配置系统加载配置
 */
export function loadConfig(pluginConfig: any): void {
  // 只在配置确实存在时才更新 apiKey，避免覆盖为空
  if (pluginConfig?.apiKey) {
    CONFIG.apiKey = pluginConfig.apiKey;
  }

  console.log('✅ Configuration loaded:', {
    apiBase: CONFIG.apiBase,
    hasApiKey: !!CONFIG.apiKey,
    apiKeyLength: CONFIG.apiKey.length,
    timeout: CONFIG.timeout
  });
}

/**
 * 验证配置
 */
export function validateConfig(): { valid: boolean; message?: string } {
  if (!CONFIG.apiKey) {
    return {
      valid: false,
      message: '🔑 请先配置 API Key。\n对我说:"设置计划管理 API Key 为 your_key_here"'
    };
  }

  return { valid: true };
}
