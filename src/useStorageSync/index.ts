import type { MaybeComputedRef } from '../types';
import type { UniStorageLike, UseStorageOptions } from '../useStorage';
import type { ConfigurableFlushSync, RemovableRef } from '@vueuse/core';
import { useStorage } from '../useStorage';

export type UniStorageSyncLike = Pick<Uni, 'getStorageSync' | 'setStorageSync' | 'removeStorageSync'>;

// uni is not defined
let UniStorage: UniStorageLike;
function initUniStorageIfNotInited() {
  if (UniStorage) {
    return;
  }

  UniStorage = parseUniStorageLike({
    getStorageSync: uni.getStorageSync,
    setStorageSync: uni.setStorageSync,
    removeStorageSync: uni.removeStorageSync,
  });
}

function parseUniStorageLike(storageSync: UniStorageSyncLike) {
  const storage: UniStorageLike = {
    getStorage: ({ key, success, fail, complete }: UniNamespace.GetStorageOptions) => {
      try {
        const data = storageSync.getStorageSync(key);
        success && success({ data });
      }
      catch (error) {
        fail && fail(error);
      }
      finally {
        complete && complete(void 0);
      }
    },
    setStorage: ({ key, data, success, fail, complete }: UniNamespace.SetStorageOptions) => {
      try {
        const raw = storageSync.setStorageSync(key, data);
        success && success({ data: raw });
      }
      catch (error) {
        fail && fail(error);
      }
      finally {
        complete && complete(void 0);
      }
    },
    removeStorage: ({ key, success, fail, complete }: UniNamespace.RemoveStorageOptions) => {
      try {
        storageSync.removeStorageSync(key);
        success && success({ data: void 0 });
      }
      catch (error) {
        fail && fail(error);
      }
      finally {
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
