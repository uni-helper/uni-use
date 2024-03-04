import { ref, shallowRef } from 'vue';
import { resolveUnref, tryOnMounted, watchWithFilter } from '@vueuse/core';
import type { Ref } from 'vue';
import type { ConfigurableEventFilter, ConfigurableFlush, RemovableRef } from '@vueuse/core';
import { useInterceptor } from '../useInterceptor';
import type { MaybeComputedRef } from '../types';

export interface UniStorageLike {
  getItem: (options: UniNamespace.GetStorageOptions) => void;
  setItem: (options: UniNamespace.SetStorageOptions) => void;
  removeItem: (options: UniNamespace.RemoveStorageOptions) => void;
}

export interface Serializer<T> {
  read: (raw: string) => T;
  write: (value: T) => string;
}

const UniStorage: UniStorageLike = {
  getItem: (options: UniNamespace.GetStorageOptions) => uni.getStorage(options),
  setItem: (options: UniNamespace.SetStorageOptions) => uni.setStorage(options),
  removeItem: (options: UniNamespace.RemoveStorageOptions) => uni.removeStorage(options),
};

export function guessSerializerType<T extends string | number | boolean | object | null>(
  rawInit: T,
) {
  return rawInit == null
    ? 'any'
    : rawInit instanceof Set
      ? 'set'
      : rawInit instanceof Map
        ? 'map'
        : rawInit instanceof Date
          ? 'date'
          : typeof rawInit === 'boolean'
            ? 'boolean'
            : typeof rawInit === 'string'
              ? 'string'
              : typeof rawInit === 'object'
                ? 'object'
                : Number.isNaN(rawInit)
                  ? 'any'
                  : 'number';
}

const StorageSerializers: Record<
  'boolean' | 'object' | 'number' | 'any' | 'string' | 'map' | 'set' | 'date',
  Serializer<any>
> = {
  boolean: {
    read: (v: any) => v === 'true',
    write: String,
  },
  object: {
    read: (v: any) => JSON.parse(v),
    write: (v: any) => JSON.stringify(v),
  },
  number: {
    read: (v: any) => Number.parseFloat(v),
    write: String,
  },
  any: {
    read: (v: any) => v,
    write: String,
  },
  string: {
    read: (v: any) => v,
    write: String,
  },
  map: {
    read: (v: any) => new Map(JSON.parse(v)),
    write: (v: any) => JSON.stringify([...(v as Map<any, any>).entries()]),
  },
  set: {
    read: (v: any) => new Set(JSON.parse(v)),
    write: (v: any) => JSON.stringify([...(v as Set<any>)]),
  },
  date: {
    read: (v: any) => new Date(v),
    write: (v: any) => v.toISOString(),
  },
};

// 存储所有storage变量
const store: Record<string, RemovableRef<any>> = {};

export interface UseStorageOptions<T> extends ConfigurableEventFilter, ConfigurableFlush {
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
  serializer?: Serializer<T>;
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
  /** 异步 storage */
  storage?: UniStorageLike;
}

export function useStorage(
  key: string,
  initialValue: MaybeComputedRef<string>,
  options?: UseStorageOptions<string>,
): RemovableRef<string>;
export function useStorage(
  key: string,
  initialValue: MaybeComputedRef<boolean>,
  options?: UseStorageOptions<boolean>,
): RemovableRef<boolean>;
export function useStorage(
  key: string,
  initialValue: MaybeComputedRef<number>,
  options?: UseStorageOptions<number>,
): RemovableRef<number>;
export function useStorage<T>(
  key: string,
  initialValue: MaybeComputedRef<T>,
  options?: UseStorageOptions<T>,
): RemovableRef<T>;
export function useStorage<T = unknown>(
  key: string,
  initialValue: MaybeComputedRef<null>,
  options?: UseStorageOptions<T>,
): RemovableRef<T>;

/**
 * 响应式的本地缓存（异步）
 *
 * https://uniapp.dcloud.net.cn/api/storage/storage.html
 */
export function useStorage<T extends string | number | boolean | object | null>(
  key: string,
  initialValue: MaybeComputedRef<T>,
  options: UseStorageOptions<T> = {},
): RemovableRef<T> {
  const {
    flush = 'pre',
    deep = true,
    listenToStorageChanges = true,
    mergeDefaults = false,
    shallow = false,
    eventFilter,
    onError = error => console.error(error),
    initOnMounted,
    storage = UniStorage,
  } = options;

  const rawInit: T = resolveUnref(initialValue);
  const type = guessSerializerType<T>(rawInit);

  const serializer = options.serializer ?? StorageSerializers[type];

  // 如果已有 key，则直接返回对象
  if (key in store) {
    return store[key];
  }

  const data = (shallow ? shallowRef : ref)(initialValue) as Ref<T>;
  store[key] = data;

  // 不使用 pausableWatch 使用 updating 变量标识。
  // 因为除了 watch 之外，uniapp 的 interceptor 也会导致连带更新
  let updating = false;

  watchWithFilter(data, () => !updating && writeStorage(data.value), { flush, deep, eventFilter });

  if (!initOnMounted) {
    readStorage();
  }

  if (listenToStorageChanges) {
    tryOnMounted(() => {
      useInterceptor('setStorage', { complete: readStorage });
      useInterceptor('removeStorage', { complete: readStorage });
      useInterceptor('clearStorage', { complete: readStorage });
      if (initOnMounted) {
        readStorage();
      }
    });
  }

  let timer: NodeJS.Timeout;
  function writeStorage(val: any) {
    if (timer) {
      clearTimeout(timer);
    }

    // 如果是同步操作，则直接写 storage
    if (flush === 'sync') {
      writeStorageImmediately(val);
      return;
    }

    // 避免太频繁写入 storage 导致的性能问题
    timer = setTimeout(() => writeStorageImmediately(val), 100);
  }

  function writeStorageImmediately(val: any) {
    try {
      updating = true;

      if (val == null) {
        storage.removeItem({
          key,
          fail: error => onError(error),
        });
        return;
      }
      const serialized = serializer.write(val);
      storage.setItem({
        key,
        data: serialized,
        fail: error => onError(error),
      });
    }
    catch (error) {
      onError(error);
    }
    finally {
      updating = false;
    }
  }

  function readStorage() {
    const parseRaw = (raw: string | null): T => {
      if (raw == null) {
        // 没有对应的值，直接使用默认值
        return rawInit;
      }

      if (mergeDefaults) {
        // 有对应的值，需要合并默认值和本地缓存值
        const value: T = serializer.read(raw);
        // 如果是方法，调用
        if (typeof mergeDefaults === 'function') {
          return mergeDefaults(value, rawInit);
        }
        // 如果是对象，浅合并

        if (type === 'object' && !Array.isArray(value)) {
          return { ...(rawInit as any), ...(value as any) };
        }

        return value;
      }

      // 有对应的值，不需要合并
      return serializer.read(raw);
    };

    const updateData = (raw: string | null) => {
      try {
        const value = parseRaw(raw);

        updating = true;

        data.value = value;
      }
      catch (err: any) {
        onError(err);
      }
      finally {
        updating = false;
      }
    };

    // 读取本地缓存值
    storage.getItem({
      key,
      success: ({ data }) => updateData(data),
      fail: () => updateData(null),
    });
  }

  return data as RemovableRef<T>;
}
