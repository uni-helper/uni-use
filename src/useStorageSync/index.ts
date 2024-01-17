import type { ConfigurableFlushSync, RemovableRef } from '@vueuse/core';
import { useStorage } from '../useStorage';
import type { UniStorageLike, UseStorageOptions } from '../useStorage';
import type { MaybeComputedRef } from '../types';

export interface UniStorageSyncLike {
  getItem: typeof uni.getStorageSync;
  setItem: typeof uni.setStorageSync;
  removeItem: typeof uni.removeStorageSync;
}

// uni is not defined
let UniStorage: UniStorageLike;
function initUniStorageIfNotInited() {
  if (UniStorage) {
    return;
  }

  UniStorage = parseUniStorageLike({
    getItem: uni.getStorageSync,
    setItem: uni.setStorageSync,
    removeItem: uni.removeStorageSync,
  });
}

function parseUniStorageLike(storageSync: UniStorageSyncLike) {
  const storage: UniStorageLike = {
    getItem: ({ key, success, fail, complete }) => {
      try {
        const data = storageSync.getItem(key);
        success && success({ data });
      } catch (error) {
        fail && fail(error);
      } finally {
        complete && complete(void 0);
      }
    },
    setItem: ({ key, data, success, fail, complete }) => {
      try {
        const raw = storageSync.setItem(key, data);
        success && success({ data: raw });
      } catch (error) {
        fail && fail(error);
      } finally {
        complete && complete(void 0);
      }
    },
    removeItem: ({ key, success, fail, complete }) => {
      try {
        storageSync.removeItem(key);
        success && success({ data: void 0 });
      } catch (error) {
        fail && fail(error);
      } finally {
        complete && complete(void 0);
      }
    },
  };

  return storage;
}

export interface UseStorageSyncOptions<T>
  extends Omit<UseStorageOptions<T>, 'flush' | 'storage'>,
    ConfigurableFlushSync {
  /** 同步 storage */
  storage?: UniStorageSyncLike;
}

export function useStorageSync(
  key: string,
  initialValue: MaybeComputedRef<string>,
  options?: UseStorageSyncOptions<string>,
): RemovableRef<string>;
export function useStorageSync(
  key: string,
  initialValue: MaybeComputedRef<boolean>,
  options?: UseStorageSyncOptions<boolean>,
): RemovableRef<boolean>;
export function useStorageSync(
  key: string,
  initialValue: MaybeComputedRef<number>,
  options?: UseStorageSyncOptions<number>,
): RemovableRef<number>;
export function useStorageSync<T>(
  key: string,
  initialValue: MaybeComputedRef<T>,
  options?: UseStorageSyncOptions<T>,
): RemovableRef<T>;
export function useStorageSync<T = unknown>(
  key: string,
  initialValue: MaybeComputedRef<null>,
  options?: UseStorageSyncOptions<T>,
): RemovableRef<T>;

/**
 * 响应式的本地缓存 （同步）
 *
 * https://uniapp.dcloud.net.cn/api/storage/storage.html
 */
export function useStorageSync<T extends string | number | boolean | object | null>(
  key: string,
  initialValue: MaybeComputedRef<T>,
  options: UseStorageSyncOptions<T> = {},
): RemovableRef<T> {
  // fix uni is not defined
  initUniStorageIfNotInited();

  const { flush = 'sync', storage, ...others } = options;

  const storageAsync = storage ? parseUniStorageLike(storage) : UniStorage;

  return useStorage(key, initialValue, { flush, storage: storageAsync, ...others });
}
