import { ref, shallowRef, Ref } from 'vue';
import type {
  Awaitable,
  ConfigurableEventFilter,
  ConfigurableFlush,
  RemovableRef,
} from '@vueuse/core';
import { resolveUnref, pausableWatch, tryOnMounted } from '@vueuse/core';
import { guessSerializerType } from './guess';

export type MaybeRef<T> = T | Ref<T>;
export type MaybeRefOrGetter<T> = MaybeRef<T> | (() => T);

const UniStorage = {
  getItem: (key: string) => {
    const res = uni.getStorageSync(key);
    return res === '' ? null : res;
  },
  setItem: (key: string, value: unknown) => uni.setStorageSync(key, value),
  removeItem: (key: string) => uni.removeStorageSync(key),
};

export interface Serializer<T> {
  read(raw: string): T;
  write(value: T): string;
}

export interface SerializerAsync<T> {
  read(raw: string): Awaitable<T>;
  write(value: T): Awaitable<string>;
}

const toString = (v: any) => v + '';

export const StorageSerializers: Record<
  'boolean' | 'object' | 'number' | 'any' | 'string' | 'map' | 'set' | 'date',
  Serializer<any>
> = {
  boolean: {
    read: (v: any) => v === 'true',
    write: (v) => toString(v),
  },
  object: {
    read: (v: any) => JSON.parse(v),
    write: (v: any) => JSON.stringify(v),
  },
  number: {
    read: (v: any) => Number.parseFloat(v),
    write: (v) => toString(v),
  },
  any: {
    read: (v: any) => v,
    write: (v) => toString(v),
  },
  string: {
    read: (v: any) => v,
    write: (v) => toString(v),
  },
  map: {
    read: (v: any) => new Map(JSON.parse(v)),
    write: (v: any) => JSON.stringify([...v.entries()]),
  },
  set: {
    read: (v: any) => new Set(JSON.parse(v)),
    write: (v: any) => JSON.stringify([...v]),
  },
  date: {
    read: (v: any) => new Date(v),
    write: (v: any) => v.toISOString(),
  },
};

export interface UseStorageOptions<T> extends ConfigurableEventFilter, ConfigurableFlush {
  /**
   * Watch for deep changes
   *
   * @default true
   */
  deep?: boolean;

  /**
   * Write the default value to the storage when it does not exist
   *
   * @default true
   */
  writeDefaults?: boolean;

  /**
   * Merge the default value with the value read from the storage.
   *
   * When setting it to true, it will perform a **shallow merge** for objects. You can pass a
   * function to perform custom merge (e.g. deep merge), for example:
   *
   * @default false
   */
  mergeDefaults?: boolean | ((storageValue: T, defaults: T) => T);

  /** Custom data serialization */
  serializer?: Serializer<T>;

  /**
   * On error callback
   *
   * Default log error to `console.error`
   */
  onError?: (error: unknown) => void;

  /**
   * Use shallow ref as reference
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
}

export function useStorage(
  key: string,
  defaults: MaybeRefOrGetter<string>,
  options?: UseStorageOptions<string>,
): RemovableRef<string>;
export function useStorage(
  key: string,
  defaults: MaybeRefOrGetter<boolean>,
  options?: UseStorageOptions<boolean>,
): RemovableRef<boolean>;
export function useStorage(
  key: string,
  defaults: MaybeRefOrGetter<number>,
  options?: UseStorageOptions<number>,
): RemovableRef<number>;
export function useStorage<T>(
  key: string,
  defaults: MaybeRefOrGetter<T>,
  options?: UseStorageOptions<T>,
): RemovableRef<T>;
export function useStorage<T = unknown>(
  key: string,
  defaults: MaybeRefOrGetter<null>,
  options?: UseStorageOptions<T>,
): RemovableRef<T>;

export function useStorage<T extends string | number | boolean | object | null>(
  key: string,
  defaults: MaybeRefOrGetter<T>,
  options: UseStorageOptions<T> = {},
): RemovableRef<T> {
  const {
    flush = 'pre',
    deep = true,
    writeDefaults = true,
    mergeDefaults = false,
    shallow,
    eventFilter,
    onError = (e) => console.error(e),
    initOnMounted,
  } = options;
  const data = (shallow ? shallowRef : ref)(typeof defaults === 'function' ? defaults() : defaults);

  const storage = UniStorage;

  const rawInit = resolveUnref(defaults);
  const type = guessSerializerType(rawInit);
  const serializer = options.serializer ?? StorageSerializers[type];

  const { pause: pauseWatch, resume: resumeWatch } = pausableWatch(data, () => write(data.value), {
    flush,
    deep,
    eventFilter,
  });

  tryOnMounted(() => {
    // this should be fine since we are in a mounted hook
    if (initOnMounted) update();
  });

  if (!initOnMounted) update();

  return data;

  function write(v: unknown) {
    try {
      if (v == null) {
        storage.removeItem(key);
      } else {
        const serialized = serializer.write(v);
        const oldValue = storage.getItem(key);
        if (oldValue !== serialized) {
          storage.setItem(key, serialized);
        }
      }
    } catch (error) {
      onError(error);
    }
  }

  function read() {
    const rawValue = storage.getItem(key);

    if (rawValue == null) {
      if (writeDefaults && rawInit !== null) storage.setItem(key, serializer.write(rawInit));
      return rawInit;
    } else if (mergeDefaults) {
      const value = serializer.read(rawValue);
      if (typeof mergeDefaults === 'function') return mergeDefaults(value, rawInit);
      else if (type === 'object' && !Array.isArray(value)) return { ...(rawInit as any), ...value };
      return value;
    } else if (typeof rawValue === 'string') {
      return serializer.read(rawValue);
    } else {
      return rawValue;
    }
  }

  function update() {
    pauseWatch();
    try {
      const newValue = read();
      if (serializer.write(data.value) !== serializer.write(newValue)) {
        data.value = newValue;
      }
    } catch (error) {
      onError(error);
    } finally {
      resumeWatch();
    }
  }
}
