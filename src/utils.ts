/**
 * 判断一个值是否为字符串类型
 *
 * @param val 待判断的值
 * @returns 如果值是字符串类型，则返回true；否则返回false
 */
export function isString(val: unknown): val is string {
  return typeof val === 'string';
}

/**
 * 判断一个值是否为函数类型
 *
 * @template T 函数的类型
 * @param val 待判断的值
 * @returns 如果值为函数类型，则返回 true，否则返回 false
 */
export function isFunction<T extends (...args: any[]) => any>(val: any): val is T {
  return typeof val === 'function';
}

/**
 * 一个空函数，不执行任何操作。
 */
export function noop() { }

/**
 * 解析路径
 *
 * @param target 目标路径
 * @param current 当前路径，默认为当前页面路由
 * @returns 解析后的路径
 * @throws 当当前路径未定义且无法找到时，抛出错误
 */
export function pathResolve(target: string, current?: string) {
  if (!current) {
    const pages = getCurrentPages();
    current = pages.length > 0 ? pages[pages.length - 1].route : undefined;
  }

  if (!current) {
    throw new Error('The current path is undefined and cannot be found.');
  }
  return new URL(target, new URL(current, 'http://no-exists.com')).pathname;
}

/**
 * 延迟执行一段时间
 *
 * @param ms 延迟时间，单位为毫秒，默认为0，即不延迟
 * @returns 返回一个Promise对象
 */
export function sleep(ms = 0) {
  return new Promise<void>(resolve => setTimeout(resolve, ms));
}

/**
 * 判断传入的对象是否是具有 .then 方法的 Thenable 类型
 *
 * @param promise 需要判断的对象
 * @returns 如果传入的对象具有 .then 方法，则返回 true；否则返回 false
 */
export function isThenable(promise: any) {
  return typeof promise.then === 'function';
}

/**
 * 封装带有查询参数的 URL
 * @param baseUrl - 基础 URL
 * @param params - 要附加到 URL 的查询参数对象
 * @returns 返回附加了查询参数的完整 URL
 */
export function setParams(baseUrl: string, params: Record<string, any>): string {
  if (!Object.keys(params).length) {
    return baseUrl;
  }

  let parameters = '';

  for (const key in params) {
    if (params[key] === undefined || params[key] === null || params[key] === '') {
      continue;
    } // 检查每个参数值是否有效
    parameters += `${key}=${encodeURIComponent(params[key])}&`;
  }

  // 移除末尾多余的 '&' 并构建最终的 URL
  parameters = parameters.replace(/&$/, '');
  if (!parameters.length) {
    return baseUrl;
  }
  return (/\?$/.test(baseUrl))
    ? baseUrl + parameters
    : baseUrl.replace(/\/?$/, '?') + parameters;
}
