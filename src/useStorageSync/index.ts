import { useStorage } from '../useStorage';
import type { ConfigurableEventFilter, ConfigurableFlushSync, RemovableRef } from '@vueuse/core';
import type { MaybeComputedRef } from '../types';

export interface StorageLikeSync {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export interface SerializerSync<T> {
  read(raw: string): T;
  write(value: T): string;
}

const UniStorageSync: StorageLikeSync = {
  getItem: (key) => uni.getStorageSync(key) as string | null,
  setItem: (key, value) => uni.setStorageSync(key, value),
  removeItem: (key) => uni.removeStorageSync(key),
};

export interface UseStorageSyncOptions<T> extends ConfigurableEventFilter, ConfigurableFlushSync {
  /**
   * 是否监听深层变化
   *
   * @default true
   */
  deep?: boolean;
  /**
   * 是否监听 setStorage、removeStorage 和 clearStorage 引起的本地缓存变化
   *
   * @default true
   */
  listenToStorageChanges?: boolean;
  /**
   * 当本地缓存不存在时，是否把默认值写入缓存
   *
   * @deprecated 变量ref和storage是响应式的，当storage没值，返回带默认值的ref必然会写入storage
   * @default true
   */
  writeDefaults?: boolean;
  /**
   * 是否合并默认值和本地缓存值
   *
   * 当设置为 true 时，浅合并对象
   *
   * 你也可以传一个方法来自定义合并
   *
   * @default false
   */
  mergeDefaults?: boolean | ((storageValue: T, defaults: T) => T);
  /** 自定义数据序列化 */
  serializer?: SerializerSync<T>;
  /**
   * 错误回调
   *
   * 默认用 `console.error` 打印错误
   */
  onError?: (error: unknown) => void;
  /**
   * 是否使用 shallowRef
   *
   * @default false
   */
  shallow?: boolean;
  /**
   * Wait for the component to be mounted before reading the storage.
   *
   * @default false
   */
  initOnMounted?: boolean;
  /** 同步 storage */
  storage?: StorageLikeSync;
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
 * 响应式的本地缓存
 *
 * https://uniapp.dcloud.net.cn/api/storage/storage.html
 */
export function useStorageSync<T extends string | number | boolean | object | null>(
  key: string,
  initialValue: MaybeComputedRef<T>,
  options: UseStorageSyncOptions<T> = {},
): RemovableRef<T> {
  const { flush = 'sync', storage = UniStorageSync, ...others } = options;

  return useStorage(key, initialValue, { flush, storage, ...others });
}
