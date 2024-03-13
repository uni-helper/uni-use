import type { MaybeComputedRef, MaybePromise } from '../types';
import type { ConfigurableEventFilter, ConfigurableFlush, RemovableRef } from '@vueuse/core';
import type { Ref } from 'vue';
import { resolveUnref, tryOnMounted, tryOnScopeDispose, watchWithFilter } from '@vueuse/core';
import { ref, shallowRef } from 'vue';
import { useInterceptor } from '../useInterceptor';

export type UniStorageLike = Pick<Uni, 'getStorage' | 'setStorage' | 'removeStorage'>;

export interface Serializer<T> {
  read: (raw: string) => T;
  write: (value: T) => string;
}

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
  /** 根据 storage 的值，刷新变量。 */
  refresh: () => Data<T>;
  /** 将变量的值写入 storage */
  sync: () => void;
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
    storage = uni as UniStorageLike,
  } = options;

  const rawInit = resolveUnref(initialValue) as T;

  const type = guessSerializerType<T>(rawInit);

  const data = (shallow ? shallowRef : ref)(rawInit) as Ref<T> as Data<T>;

  const serializer = options.serializer ?? StorageSerializers[type];

  let timer: NodeJS.Timeout;

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
  data.sync = () => data.write(data.value);

  if (initOnMounted) {
    tryOnMounted(data.read);
  }
  else {
    data.read();
  }

  watchWithFilter(data, () => !data.updating && writeStorage(data.value), { flush, deep, eventFilter });

  if (listenToStorageChanges) {
    useInterceptor('setStorage', { complete: () => !data.updating && data.read() });
    useInterceptor('removeStorage', { complete: () => !data.updating && data.read() });
    useInterceptor('clearStorage', { complete: () => !data.updating && data.read() });

    useInterceptor('setStorageSync', { complete: () => !data.updating && data.read() });
    useInterceptor('removeStorageSync', { complete: () => !data.updating && data.read() });
    useInterceptor('clearStorageSync', { complete: () => !data.updating && data.read() });
  }

  tryOnScopeDispose(clearTimer);

  function clearTimer() {
    timer && clearTimeout(timer);
  }

  function writeStorage(val: T) {
    clearTimer();
    // 如果是同步操作，则直接写 storage
    if (flush === 'sync') {
      writeStorageImmediately(val);
      return;
    }

    timer = setTimeout(() => writeStorageImmediately(val), 100);
  }

  function writeStorageImmediately(val: T) {
    clearTimer();

    if (data.updating) {
      return;
    }

    try {
      data.updating = true;

      if (val == null) {
        storage.removeStorage({
          key,
          fail: error => onError(error),
        });
        clearTimer();
        return;
      }
      const serialized = data.serializer.write(val);
      storage.setStorage({
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
    const updateData = (raw: string | null | undefined) => {
      try {
        if (raw == null) {
          // 没有对应的值，直接使用默认值
          data.value = data.default;
          return;
        }

        // 解析 value
        const value: T = data.serializer.read(raw);

        if (mergeDefaults) {
          // 如果是方法，调用
          if (typeof mergeDefaults === 'function') {
            data.value = mergeDefaults(value, data.default);
            return;
          }

          // 如果是对象，浅合并
          if (type === 'object' && !Array.isArray(value)) {
            data.value = { ...(data.default as any), ...(value as any) };
            return;
          }
        }
        // 有对应的值，不需要合并
        data.value = value;
      }
      catch (err: any) {
        onError(err);
      }
    };

    // 读取本地缓存值
    storage.getStorage({
      key,
      success: ({ data }) => updateData(data),
      fail: () => updateData(undefined),
    });

    return data.value;
  }

  return data;
}
