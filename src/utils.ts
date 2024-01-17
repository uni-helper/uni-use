export const isString = (val: unknown): val is string => typeof val === 'string';

export const isFunction = <T extends (...args: any[]) => any>(val: any): val is T =>
  typeof val === 'function';

export const noop = () => {};

export function pathResolve(target: string, current?: string) {
  if (!current) {
    const pages = getCurrentPages();
    current = pages[pages.length - 1].route;
  }

  if (!current) {
    throw new Error('The current path is undefined and cannot be found.');
  }
  return new URL(target, new URL(current, 'http://no-exists.com')).pathname;
}
