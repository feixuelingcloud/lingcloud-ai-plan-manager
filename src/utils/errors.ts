/**
 * 自定义错误类型
 */

/**
 * API 错误
 */
export class ApiError extends Error {
  code: string;
  suggestion: string;
  statusCode: number;

  constructor(message: string, code: string, suggestion: string, statusCode: number) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.suggestion = suggestion;
    this.statusCode = statusCode;
  }

  /**
   * 转换为用户友好的消息
   */
  toUserMessage(): string {
    let msg = `❌ ${this.message}`;

    if (this.code && this.code !== 'UNKNOWN_ERROR') {
      msg += `\n🔖 错误码: ${this.code}`;
    }

    if (this.statusCode) {
      msg += `\n📡 HTTP 状态: ${this.statusCode}`;
    }

    if (this.suggestion) {
      msg += `\n\n💡 建议: ${this.suggestion}`;
    }

    return msg;
  }
}

/**
 * 配置错误
 */
export class ConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConfigError';
  }
}

/**
 * 验证错误
 */
export class ValidationError extends Error {
  field: string;

  constructor(message: string, field: string) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}
