import { describe, expect, it } from 'vitest';
import { getParams, setParams } from './utils';

describe('useStorage', () => {
  it('getParams', async () => {
    expect(getParams('test?foo=1&bar=2')).toEqual({ foo: '1', bar: '2' });
    expect(getParams('test?foo')).toEqual({ });
    expect(getParams('test?foo&bar')).toEqual({ });
    expect(getParams('test?')).toEqual({ });
    expect(getParams()).toEqual({ });
  });

  it('setParams', async () => {
    expect(setParams('test', { foo: '1', bar: '2' })).toEqual('test?foo=1&bar=2');
    expect(setParams('test', { foo: undefined, bar: undefined })).toEqual('test');
    expect(setParams('test', { foo: undefined, bar: null })).toEqual('test');
    expect(setParams('test', { foo: undefined, bar: 0 })).toEqual('test?bar=0');
    expect(setParams('test', { foo: undefined, bar: false })).toEqual('test?bar=false');
  });
});
