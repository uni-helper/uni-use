import type { MaybeComputedRef, MaybePromise } from '../types';
import type { ConfigurableEventFilter, ConfigurableFlush, RemovableRef } from '@vueuse/core';
import type { Ref } from 'vue';
import { resolveUnref, tryOnMounted, tryOnScopeDispose, watchWithFilter } from '@vueuse/core';
import { ref, shallowRef } from 'vue';
import { useInterceptor } from '../useInterceptor';

export interface UniStorageLike<T = any> {
  getItem: (options: UniNamespace.GetStorageOptions<T>) => MaybePromise<T>;
  setItem: (options: UniNamespace.SetStorageOptions) => void;
  removeItem: (options: UniNamespace.RemoveStorageOptions) => void;
}

export interface Serializer<T> {
  read: (raw: string) => T;
  write: (value: T) => string;
}

const UniStorage: UniStorageLike<any> = {
  getItem: (options: UniNamespace.GetStorageOptions) => uni.getStorage(options),
  setItem: (options: UniNamespace.SetStorageOptions) => uni.setStorage(options),
  removeItem: (options: UniNamespace.RemoveStorageOptions) => uni.removeStorage(options),
};

export type DataType = string | number | boolean | object | null;

export function guessSerializerType<T extends DataType>(
  raw: T,
) {
  return raw == null
    ? 'any'
    : raw instanceof Set
      ? 'set'
      : raw instanceof Map
        ? 'map'
        : raw instanceof Date
          ? 'date'
          : typeof raw === 'boolean'
            ? 'boolean'
            : typeof raw === 'string'
              ? 'string'
              : typeof raw === 'object'
                ? 'object'
                : Number.isNaN(raw)
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

interface Data<T> extends Ref<T> {
  key: string;
  type: 'boolean' | 'object' | 'number' | 'any' | 'string' | 'map' | 'set' | 'date';
  updating: boolean;
  serializer: Serializer<T>;
  default: T;
  read: () => T;
  write: (val: T) => void;
  refresh: () => Data<T>;
}

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

export function useStorage<T = unknown>(
  key: string,
  initialValue?: MaybeComputedRef<null>,
  options?: UseStorageOptions<T>,
): RemovableRef<T>;

export function useStorage<T>(
  key: string,
  initialValue: MaybeComputedRef<T>,
  options?: UseStorageOptions<T>,
): RemovableRef<T>;

/**
 * 响应式的本地缓存（异步）
 *
 * https://uniapp.dcloud.net.cn/api/storage/storage.html
 */
export function useStorage<T extends DataType>(
  key: string,
  initialValue?: MaybeComputedRef<T>,
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

  const rawInit = resolveUnref(initialValue) as T;

  const type = guessSerializerType<T>(rawInit);

  const data = (shallow ? shallowRef : ref)(rawInit) as Ref<T> as Data<T>;

  const serializer = options.serializer ?? StorageSerializers[type];

  data.key = key;
  data.type = type;
  data.serializer = serializer;
  data.updating = false;
  data.default = rawInit;
  data.read = readStorage;
  data.write = writeStorageImmediately;
  data.refresh = () => {
    data.read();
    return data;
  };

  if (initOnMounted) {
    tryOnMounted(data.read);
  }
  else {
    data.read();
  }

  watchWithFilter(data, () => !data.updating && writeStorage(data.value), { flush, deep, eventFilter });

  if (listenToStorageChanges) {
    useInterceptor('setStorage', { complete: data.read });
    useInterceptor('removeStorage', { complete: data.read });
    useInterceptor('clearStorage', { complete: data.read });
  }

  let timer: NodeJS.Timeout;

  tryOnScopeDispose(() => {
    clearTimeout(timer);
  });

  function writeStorage(val: T) {
    if (timer) {
      clearTimeout(timer);
    }
    // 如果是同步操作，则直接写 storage
    if (flush === 'sync') {
      writeStorageImmediately(val);
      return;
    }

    timer = setTimeout(() => writeStorageImmediately(val), 100);
  }

  function writeStorageImmediately(val: T) {
    if (timer) {
      clearTimeout(timer);
    }

    try {
      data.updating = true;

      if (val == null) {
        storage.removeItem({
          key,
          fail: error => onError(error),
        });
        clearTimeout(timer);
        return;
      }
      const serialized = data.serializer.write(val);
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
      data.updating = false;
    }
  }

  function readStorage() {
    const parseRaw = (raw: string | null): T => {
      if (raw == null) {
        // 没有对应的值，直接使用默认值
        return data.default;
      }

      if (mergeDefaults) {
        // 有对应的值，需要合并默认值和本地缓存值
        const value: T = data.serializer.read(raw);
        // 如果是方法，调用
        if (typeof mergeDefaults === 'function') {
          return mergeDefaults(value, data.default);
        }
        // 如果是对象，浅合并

        if (type === 'object' && !Array.isArray(value)) {
          return { ...(data.default as any), ...(value as any) };
        }

        return value;
      }

      // 有对应的值，不需要合并
      return data.serializer.read(raw);
    };

    const updateData = (raw: string | null) => {
      try {
        const value = parseRaw(raw);

        data.updating = true;

        data.value = value;
      }
      catch (err: any) {
        onError(err);
      }
      finally {
        data.updating = false;
      }
    };

    // 读取本地缓存值
    storage.getItem({
      key,
      success: ({ data }) => updateData(data),
      fail: () => updateData(null),
    });

    return data.value;
  }

  return data;
}
