import { ref, shallowRef } from 'vue';
import type { Ref } from 'vue';
import { isFunction, resolveUnref, watchWithFilter } from '@vueuse/core';
import type {
  Awaitable,
  ConfigurableEventFilter,
  ConfigurableFlush,
  MaybeComputedRef,
  RemovableRef,
} from '@vueuse/core';
import { useInterceptor } from '../useInterceptor';

export interface StorageLikeAsync {
  getItem(key: string): Awaitable<string | null>;
  setItem(key: string, value: string): Awaitable<void>;
  removeItem(key: string): Awaitable<void>;
}

export interface Serializer<T> {
  read(raw: string): T;
  write(value: T): string;
}

export interface SerializerAsync<T> {
  read(raw: string): Awaitable<T>;
  write(value: T): Awaitable<string>;
}

const UniStorage: StorageLikeAsync = {
  getItem: (key) =>
    new Promise((resolve) =>
      uni.getStorage({
        key,
        success: ({ data }) => resolve(data),
        fail: () => resolve(null), // 在这里 resolve null 匹配后续逻辑判断
      }),
    ),
  setItem: (key, value) =>
    new Promise((resolve, reject) =>
      uni.setStorage({
        key,
        data: value,
        success: () => resolve(),
        fail: (error) => reject(error),
      }),
    ),
  removeItem: (key) =>
    new Promise((resolve, reject) =>
      uni.removeStorage({
        key,
        success: () => resolve(),
        fail: (error) => reject(error),
      }),
    ),
};

function guessSerializerType<T extends string | number | boolean | object | null>(rawInit: T) {
  if (rawInit == null) return 'any';
  if (rawInit instanceof Set) return 'set';
  if (rawInit instanceof Map) return 'map';
  if (rawInit instanceof Date) return 'date';
  if (typeof rawInit === 'boolean') return 'boolean';
  if (typeof rawInit === 'string') return 'string';
  if (typeof rawInit === 'object') return 'object';
  if (Number.isNaN(rawInit)) return 'any';
  return 'number';
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

export interface UseStorageAsyncOptions<T> extends ConfigurableEventFilter, ConfigurableFlush {
  /**
   * 是否监听 setStorage、removeStorage 和 clearStorage 引起的本地缓存变化
   *
   * @default true
   */
  listenToStorageChanges?: boolean;
  /**
   * 当本地缓存不存在时，是否把默认值写入缓存
   *
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
  serializer?: SerializerAsync<T>;
  /**
   * 是否使用 shallowRef
   *
   * @default false
   */
  shallow?: boolean;
  /**
   * 错误回调
   *
   * 默认用 `console.error` 打印错误
   */
  onError?: (error: unknown) => void;
  /**
   * 是否监听深层变化
   *
   * @default true
   */
  deep?: boolean;
}

export function useStorageAsync(
  key: string,
  initialValue: MaybeComputedRef<string>,
  storage?: StorageLikeAsync,
  options?: UseStorageAsyncOptions<string>,
): RemovableRef<string>;
export function useStorageAsync(
  key: string,
  initialValue: MaybeComputedRef<boolean>,
  storage?: StorageLikeAsync,
  options?: UseStorageAsyncOptions<boolean>,
): RemovableRef<boolean>;
export function useStorageAsync(
  key: string,
  initialValue: MaybeComputedRef<number>,
  storage?: StorageLikeAsync,
  options?: UseStorageAsyncOptions<number>,
): RemovableRef<number>;
export function useStorageAsync<T>(
  key: string,
  initialValue: MaybeComputedRef<T>,
  storage?: StorageLikeAsync,
  options?: UseStorageAsyncOptions<T>,
): RemovableRef<T>;
export function useStorageAsync<T = unknown>(
  key: string,
  initialValue: MaybeComputedRef<null>,
  storage?: StorageLikeAsync,
  options?: UseStorageAsyncOptions<T>,
): RemovableRef<T>;

/**
 * 响应式的本地缓存
 *
 * https://uniapp.dcloud.net.cn/api/storage/storage.html
 */
export function useStorageAsync<T extends string | number | boolean | object | null>(
  key: string,
  initialValue: MaybeComputedRef<T>,
  storage: StorageLikeAsync | undefined,
  options: UseStorageAsyncOptions<T> = {},
): RemovableRef<T> {
  const {
    listenToStorageChanges = true,
    writeDefaults = true,
    mergeDefaults = false,
    shallow = false,
    onError = (error) => console.error(error),
    deep = true,
    flush = 'pre',
    eventFilter,
  } = options;

  const rawInit: T = resolveUnref(initialValue);
  const type = guessSerializerType<T>(rawInit);

  const data = (shallow ? shallowRef : ref)(initialValue) as Ref<T>;
  const serializer = options.serializer ?? StorageSerializers[type];

  if (!storage) storage = UniStorage;

  async function read() {
    if (!storage) return;
    try {
      // 读取本地缓存值
      const rawValue = await storage.getItem(key);
      if (rawValue == null) {
        // 没有对应的值，直接使用默认值
        data.value = rawInit;
        if (writeDefaults && rawInit !== null) {
          // 需要时将默认值写入缓存
          await storage.setItem(key, await serializer.write(rawInit));
        }
      } else if (mergeDefaults) {
        // 有对应的值，需要合并默认值和本地缓存值
        const value = await serializer.read(rawValue);
        // 如果是方法，调用
        if (isFunction(mergeDefaults)) data.value = mergeDefaults(value, rawInit);
        // 如果是对象，浅合并
        else if (type === 'object' && !Array.isArray(value))
          data.value = { ...(rawInit as any), ...value };
        // 其它情况，直接替换
        else data.value = value;
      } else {
        // 有对应的值，不需要合并
        data.value = await serializer.read(rawValue);
      }
    } catch (error) {
      onError(error);
    }
  }

  read();

  if (listenToStorageChanges) {
    useInterceptor('setStorage', { complete: () => setTimeout(() => read(), 0) });
    useInterceptor('removeStorage', { complete: () => setTimeout(() => read(), 0) });
    useInterceptor('clearStorage', { complete: () => setTimeout(() => read(), 0) });
  }

  if (storage) {
    watchWithFilter(
      data,
      async () => {
        try {
          await (data.value == null
            ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              storage!.removeItem(key)
            : // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              storage!.setItem(key, await serializer.write(data.value)));
        } catch (error) {
          onError(error);
        }
      },
      {
        flush,
        deep,
        eventFilter,
      },
    );
  }

  return data as RemovableRef<T>;
}
