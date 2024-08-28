import { describe, expect, it } from 'vitest';
import { setQuery } from './utils';

describe('useStorage', () => {
  it('setParams', async () => {
    expect(setQuery('test', { foo: '1', bar: '2' })).toEqual('test?foo=1&bar=2');
    expect(setQuery('test', { foo: undefined, bar: undefined })).toEqual('test');
    expect(setQuery('test', { foo: undefined, bar: null })).toEqual('test');
    expect(setQuery('test', { foo: undefined, bar: 0 })).toEqual('test?bar=0');
    expect(setQuery('test', { foo: undefined, bar: false })).toEqual('test?bar=false');
  });
});
