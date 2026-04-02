/**
 * 日期时间工具函数
 * 处理时区转换，确保使用北京时间(UTC+8)
 */

/**
 * 获取北京时间的今天日期 (格式: YYYY-MM-DD)
 * @returns 北京时间的日期字符串
 */
export function getTodayBeijing(): string {
  const now = new Date();
  // 获取 UTC 时间戳，然后加上 8 小时（北京时间 UTC+8）
  const beijingTime = new Date(now.getTime() + (8 * 60 * 60 * 1000));

  const year = beijingTime.getUTCFullYear();
  const month = String(beijingTime.getUTCMonth() + 1).padStart(2, '0');
  const day = String(beijingTime.getUTCDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

/**
 * 将日期字符串转换为北京时间的 Date 对象
 * @param dateStr 日期字符串 (YYYY-MM-DD)
 * @returns Date 对象
 */
export function parseBeijingDate(dateStr: string): Date {
  // 解析 YYYY-MM-DD 格式的日期
  const [year, month, day] = dateStr.split('-').map(Number);

  // 创建北京时间的日期 (注意：月份从 0 开始)
  // 这里使用 UTC 时间减去 8 小时来表示北京时间
  const utcTime = Date.UTC(year, month - 1, day, 0, 0, 0);
  const beijingTime = new Date(utcTime - (8 * 60 * 60 * 1000));

  return beijingTime;
}

/**
 * 获取北京时间的星期几
 * @param dateStr 日期字符串 (YYYY-MM-DD)，不提供则为今天
 * @returns 0-6 (周日-周六)
 */
export function getBeijingWeekday(dateStr?: string): number {
  if (!dateStr) {
    dateStr = getTodayBeijing();
  }

  const date = parseBeijingDate(dateStr);
  // 转换为北京时间后获取星期几
  const beijingTime = new Date(date.getTime() + (8 * 60 * 60 * 1000));
  return beijingTime.getUTCDay();
}

/**
 * 格式化北京时间日期
 * @param dateStr 日期字符串 (YYYY-MM-DD)
 * @param includeWeekday 是否包含星期几
 * @returns 格式化的日期字符串
 */
export function formatBeijingDate(dateStr: string, includeWeekday: boolean = true): string {
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

  if (includeWeekday) {
    const weekday = getBeijingWeekday(dateStr);
    return `${dateStr} ${weekdays[weekday]}`;
  }

  return dateStr;
}

/**
 * 获取北京时间的当前周范围 (周一到周日)
 * @returns { start: string, end: string } 开始和结束日期
 */
export function getBeijingWeekRange(): { start: string; end: string } {
  const today = getTodayBeijing();
  const weekday = getBeijingWeekday(today);

  // 计算本周一（weekday = 1）
  const daysFromMonday = weekday === 0 ? 6 : weekday - 1;
  const monday = new Date(parseBeijingDate(today));
  monday.setDate(monday.getDate() - daysFromMonday);

  // 计算本周日（weekday = 0）
  const daysToSunday = weekday === 0 ? 0 : 7 - weekday;
  const sunday = new Date(parseBeijingDate(today));
  sunday.setDate(sunday.getDate() + daysToSunday);

  return {
    start: formatDateToString(monday),
    end: formatDateToString(sunday)
  };
}

/**
 * 获取北京时间的上周范围 (周一到周日)
 * @returns { start: string, end: string } 开始和结束日期
 */
export function getBeijingLastWeekRange(): { start: string; end: string } {
  const thisWeek = getBeijingWeekRange();
  const lastWeekStart = new Date(parseBeijingDate(thisWeek.start));
  lastWeekStart.setDate(lastWeekStart.getDate() - 7);

  const lastWeekEnd = new Date(parseBeijingDate(thisWeek.end));
  lastWeekEnd.setDate(lastWeekEnd.getDate() - 7);

  return {
    start: formatDateToString(lastWeekStart),
    end: formatDateToString(lastWeekEnd)
  };
}

/**
 * 将 Date 对象格式化为 YYYY-MM-DD 字符串
 * @param date Date 对象
 * @returns YYYY-MM-DD 格式的字符串
 */
function formatDateToString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}
