import { afterEach, describe, expect, it, vi } from 'vitest';
import { useSetup } from '../../test';
import { sleep } from '../utils';
import { useStorage } from '.';

describe('useStorage', () => {
  const getItemSpy = vi.spyOn(uni, 'getStorage');
  const setItemSpy = vi.spyOn(uni, 'setStorage');

  afterEach(() => {
    uni.clearStorage(); // uni 的 interceptor 仅支持异步接口
  });

  it('export module', () => {
    expect(useStorage).toBeDefined();
  });

  it('string', async () => {
    const key = 'string';

    const vm = useSetup(() => {
      const ref = useStorage(key, 'a');
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
    const store = useStorage(key, 1); // 再初始化
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
    const store = useStorage(key, true);
    await sleep(200);
    expect(store.value).toBe(true);
  });

  it('null string', async () => {
    const key = 'null_string';

    uni.setStorage({ key, data: 'null' });

    const store = useStorage(key, null);
    await sleep(200);
    const { data: storedValue } = await uni.getStorage({ key });

    expect(store.value).toBe('null');
    expect(storedValue).toBe('null');
  });

  it('null value', async () => {
    const key = 'null_value';
    uni.removeStorage({ key });

    const store = useStorage(key, null);

    expect(store.value).toBe(null);

    await sleep(200);
    expect(uni.getStorage({ key })).rejects.toThrowError(); // 将storage设为null将自动删除uni storage
  });

  it('undefined value', async () => {
    const key = 'undefined_value';
    uni.removeStorage({ key });

    const store = useStorage(key, undefined);

    expect(store.value).toBe(undefined);

    await sleep(200);
    expect(uni.getStorage({ key })).rejects.toThrowError(); // 将storage设为undefined将自动删除uni storage
  });

  it('remove value', async () => {
    const key = 'remove_value';
    uni.getStorage({ key, data: 'random' });

    const store = useStorage(key, null);

    store.value = null;

    await sleep(200);

    expect(store.value).toBe(null);

    expect(uni.getStorage({ key })).rejects.toThrowError();
  });
});
