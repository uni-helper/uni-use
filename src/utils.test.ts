import { describe, expect, it } from 'vitest';
import { setParams } from './utils';

describe('useStorage', () => {
  it('setParams', async () => {
    expect(setParams('test', { foo: '1', bar: '2' })).toEqual('test?foo=1&bar=2');
    expect(setParams('test', { foo: undefined, bar: undefined })).toEqual('test');
    expect(setParams('test', { foo: undefined, bar: null })).toEqual('test');
    expect(setParams('test', { foo: undefined, bar: 0 })).toEqual('test?bar=0');
    expect(setParams('test', { foo: undefined, bar: false })).toEqual('test?bar=false');
  });
});
