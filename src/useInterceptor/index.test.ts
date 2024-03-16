import { describe, expect, it } from 'vitest';
import { useInterceptor } from '.';

describe('useInterceptor', () => {
  it('export module', () => {
    expect(useInterceptor).toBeDefined();
  });

  it('invoke args', () => {
    const key = 'custom-key';

    const stop = useInterceptor('getStorage', { invoke: (args) => {
      expect(args[0].key).toBe(key);
    } });

    uni.getStorage({ key });

    stop();
  });

  it('return value ASYNC', () => {
    const key = 'custom-key';

    uni.setStorageSync(key, 'a');

    const stop = useInterceptor('getStorage', { invoke: (args) => {
      expect(args[0].key).toBe(key);
    } });

    const returnVal = uni.getStorage({ key });

    expect(returnVal.then).toBeDefined();

    returnVal.then((val: any) => {
      expect(val).toBe('a');
    });

    stop();
  });

  it('return value SYNC', () => {
    const key = 'custom-key';

    uni.setStorageSync(key, 'b');

    const stop = useInterceptor('getStorageSync', { invoke: (args) => {
      expect(args[0]).toBe(key);
    } });

    const returnVal = uni.getStorageSync(key);

    expect(returnVal).toBe('b');

    stop();
  });
});
