import { describe, expect, it } from 'vitest';
import { pathResolve } from './utils';

describe('utils', () => {
  it('pathResolve', () => {
    // target 为 / 开头的，直接返回
    expect(pathResolve('/a/b', '/c/d')).toBe('/a/b');
    // target 为非 / 开头的，拼接当前路径
    expect(pathResolve('a/b', '/c/d/page.html')).toBe('/c/d/a/b');
    // target 为空，返回当前路径
    expect(pathResolve('', '/c/d/page.html')).toBe('/c/d/page.html');
    // target 含有 .. ，返回解析后的绝对路径
    expect(pathResolve('../a/b', '/c/d/page.html')).toBe('/c/a/b');
  });
});
