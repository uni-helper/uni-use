import { useRouter } from './useRouter';

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
 * @param target 目标路径（不含domain）
 * @param current 当前路径（不含domain），默认为当前页面路由
 * @returns 解析后的路径
 * @throws 当当前路径未定义且无法找到时，抛出错误
 */
export function pathResolve(target: string, current?: string) {
  // 如果目标路径已经是绝对路径，则直接返回
  if (target.startsWith('/')) {
    return target;
  }

  // 如果当前路径未定义，则从路由中获取当前路径
  if (!current) {
    const { currentUrl } = useRouter();
    current = currentUrl.value;
  }

  // 如果当前路径未定义，则抛出错误
  if (!current) {
    throw new Error('The current path is undefined and cannot be found.');
  }

  // 如果目标路径为空，则直接返回当前路径
  if (!target) {
    return current;
  }

  // 如果目标路径以 ./ 开头，则递归调用 pathResolve 函数，将当前路径作为新的当前路径
  if (target.startsWith('./')) {
    return pathResolve(target.slice(2), current);
  }

  // 获取当前路径的页面路径
  let currentPaths: string[] = [];
  if (current.endsWith('/')) {
    currentPaths = current.split('/').filter(part => part !== '' && part !== '.');
  }
  else {
    currentPaths = current.split('/');
    currentPaths.pop(); // 去除最后的页面路径
    currentPaths = currentPaths.filter(part => part !== '' && part !== '.');
  }

  // 获取目标路径的页面路径和页面
  let targetPaths: string[] = [];
  let targetPage = '';
  if (target.endsWith('/')) {
    targetPaths = target.split('/').filter(part => part !== '' && part !== '.');
  }
  else {
    targetPaths = target.split('/');
    targetPage = targetPaths.pop() || ''; // 去除最后的页面路径
    targetPaths = targetPaths.filter(part => part !== '' && part !== '.');
  }

  // 合并路径
  const paths = [...currentPaths, ...targetPaths];
  const finalPaths: string[] = [];
  for (const p of paths) {
    if (p === '..') {
      finalPaths.pop();
    }
    else {
      finalPaths.push(p);
    }
  }

  // 返回最终路径
  return `/${finalPaths.join('/')}/${targetPage}`;
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
