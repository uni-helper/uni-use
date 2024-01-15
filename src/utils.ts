export const isString = (val: unknown): val is string => typeof val === 'string';

export const isFunction = <T extends (...args: any[]) => any>(val: any): val is T =>
  typeof val === 'function';

export const noop = () => {};
