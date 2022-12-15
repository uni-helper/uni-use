import { reactive } from 'vue';
import { MaybeComputedRef, resolveUnref } from '@vueuse/core';

export interface UniGetStorageOptions extends UniApp.GetStorageOptions {}
export type GetStorageOptions = MaybeComputedRef<UniGetStorageOptions>;

export interface UniSetStorageOptions extends UniApp.SetStorageOptions {}
export type SetStorageOptions = MaybeComputedRef<UniSetStorageOptions>;

export interface UniRemoveStorageOptions extends UniApp.RemoveStorageOptions {}
export type RemoveStorageOptions = MaybeComputedRef<UniRemoveStorageOptions>;

export interface UniGetStorageInfoOptions extends UniApp.GetStorageInfoOptions {}
export type GetStorageInfoOptions = MaybeComputedRef<UniGetStorageInfoOptions>;

/** Get storage info */
export function useStorage() {
  const getStorage = (options?: GetStorageOptions) =>
    uni.getStorage(reactive({ key: '', ...resolveUnref(options) }));
  const getStorageSync = (key: string) => uni.getStorageSync(key);

  const setStorage = (options?: SetStorageOptions) =>
    uni.setStorage(reactive({ key: '', data: undefined, ...resolveUnref(options) }));
  const setStorageSync = (key: string, value: any) => uni.setStorageSync(key, value);

  const removeStorage = (options?: RemoveStorageOptions) =>
    uni.removeStorage(reactive({ key: '', ...resolveUnref(options) }));
  const removeStorageSync = (key: string) => uni.removeStorageSync(key);

  const clearStorage = () => uni.clearStorage();
  const clearStorageSync = () => uni.clearStorageSync();

  const getStorageInfo = (options?: GetStorageInfoOptions) =>
    uni.getStorageInfo(reactive({ ...options }));
  const getStorageInfoSync = () => uni.getStorageInfoSync();

  return {
    getStorage,
    getStorageSync,
    get: getStorage,
    getSync: getStorageSync,
    setStorage,
    setStorageSync,
    set: setStorage,
    setSync: setStorageSync,
    removeStorage,
    removeStorageSync,
    remove: removeStorage,
    removeSync: removeStorageSync,
    clearStorage,
    clearStorageSync,
    clear: clearStorage,
    clearSync: clearStorageSync,
    getStorageInfo,
    getStorageInfoSync,
    getInfo: getStorageInfo,
    getInfoSync: getStorageInfoSync,
  };
}
