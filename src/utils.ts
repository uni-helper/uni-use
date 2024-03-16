export const isString = (val: unknown): val is string => typeof val === 'string';

export function isFunction<T extends (...args: any[]) => any>(val: any): val is T {
  return typeof val === 'function';
}

export function noop() {}

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

export function sleep(ms = 0) {
  return new Promise<void>(resolve => setTimeout(resolve, ms));
}

export function isThenable(promise: any) {
  return typeof promise.then === 'function';
}
