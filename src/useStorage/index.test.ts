import type { UniStorageLike } from '.';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useSetup } from '../../test';
import { sleep } from '../utils';
import { useStorage } from '.';

describe('useStorage', () => {
  const storage: UniStorageLike = {
    getItem: (options: UniNamespace.GetStorageOptions) => uni.getStorage(options),
    setItem: (options: UniNamespace.SetStorageOptions) => uni.setStorage(options),
    removeItem: (options: UniNamespace.RemoveStorageOptions) => uni.removeStorage(options),
  };

  const getItemSpy = vi.spyOn(storage, 'getItem');
  const setItemSpy = vi.spyOn(storage, 'setItem');

  afterEach(() => {
    uni.clearStorage(); // uni 的 interceptor 仅支持异步接口
  });

  it('export module', () => {
    expect(useStorage).toBeDefined();
  });

  it('string', async () => {
    const key = 'string';

    const vm = useSetup(() => {
      const ref = useStorage(key, 'a', { storage });
      return { ref };
    });
    expect(vm.ref).toBe('a');
    expect(getItemSpy).toHaveBeenLastCalledWith({ key });

    vm.ref = 'b';
    await sleep(200);
    expect(vm.ref).toBe('b');
    expect(setItemSpy).toHaveBeenLastCalledWith({ key, data: 'b' });
  });

  it('number', async () => {
    const key = 'number';

    await sleep(200);
    uni.setStorageSync(key, '0'); // 模拟先有值

    await sleep(200);
    const store = useStorage(key, 1, { storage }); // 再初始化
    expect(store.value).toBe(0);

    store.value = 2;
    await sleep(200);
    expect(setItemSpy).toHaveBeenLastCalledWith({ key, data: '2' });

    store.value = -1;
    await sleep(200);
    expect(setItemSpy).toHaveBeenLastCalledWith({ key, data: '-1' });
  });

  it('boolean', async () => {
    const key = 'boolean';
    const store = useStorage(key, true, { storage });
    await sleep(200);
    expect(store.value).toBe(true);
  });

  it('null string', async () => {
    const key = 'null_string';

    storage.setItem({ key, data: 'null' });

    const store = useStorage(key, null, { storage });
    await sleep(200);
    const { data: storedValue } = await storage.getItem({ key });

    expect(store.value).toBe('null');
    expect(storedValue).toBe('null');
  });

  it('null value', async () => {
    const key = 'null_value';
    storage.removeItem({ key });

    const store = useStorage(key, null);
    await sleep(200);
    const { data: storedValue } = storage.getItem({ key });

    expect(store.value).toBe(null);
    expect(storedValue).toBeFalsy();
  });

  it('undefined value', async () => {
    const key = 'undefined_value';
    storage.removeItem({ key });

    const store = useStorage(key, undefined, { storage });
    await sleep(200);
    const { data: storedValue } = storage.getItem({ key });

    expect(store.value).toBe(undefined);
    expect(storedValue).toBeFalsy();
  });

  it('remove value', async () => {
    const key = 'remove_value';
    storage.setItem({ key, data: 'random' });

    const store = useStorage(key, null, { storage });

    store.value = null;

    await sleep(200);

    expect(store.value).toBe(null);

    expect(storage.getItem({ key })).rejects.toThrowError();
  });
});
