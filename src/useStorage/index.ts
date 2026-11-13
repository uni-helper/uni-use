import type { Ref, WatchStopHandle } from 'vue'
import type { ConfigurableEventFilter, ConfigurableFlush, MaybeComputedRef, RemovableRef } from '../types'
import { effectScope, ref, shallowRef } from 'vue'
import { tryOnScopeDispose } from '../tryOnScopeDispose'
import { useInterceptor } from '../useInterceptor'
import { tryOnMounted, unrefValue, watchWithFilter } from '../utils'

export type UniStorageLike = Pick<Uni, 'getStorage' | 'setStorage' | 'removeStorage'>

export interface Serializer<T> {
  read: (raw: string) => T
  write: (value: T) => string
}

export type DataType = string | number | boolean | object | null

export function guessSerializerType<T extends DataType>(
  raw: T,
): 'any' | 'boolean' | 'date' | 'map' | 'number' | 'object' | 'set' | 'string' {
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
                  : 'number'
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
    write: (v: any) => JSON.stringify([
      ...(v as Map<any, any>).entries(),
    ]),
  },
  set: {
    read: (v: any) => new Set(JSON.parse(v)),
    write: (v: any) => JSON.stringify([...(v as Set<any>)]),
  },
  date: {
    read: (v: any) => new Date(v),
    write: (v: any) => v.toISOString(),
  },
}

interface Data<T> extends Ref<T> {
  key: string
  type: 'boolean' | 'object' | 'number' | 'any' | 'string' | 'map' | 'set' | 'date'
  isUpdating: boolean
  serializer: Serializer<T>
  default: T
  /** 写入 storage 的 timer */
  timer: NodeJS.Timeout | undefined
  /** 是否监听外部引起的 storage 变化 */
  listen: boolean
  /** 刚由 storage 同步进来的值，watcher 遇到它就跳过回写 */
  syncedValue: T | undefined
  hasSyncedValue: boolean
  /** data 修改监听器 */
  watch: WatchStopHandle
  read: () => T
  write: (val: T) => void
  /** 根据 storage 的值，刷新变量。 */
  refresh: () => Data<T>
  /** 将变量的值写入 storage */
  sync: () => void
  /** 清除写入操作的timer */
  clearTimer: () => void
  /** 使用 raw 值更新 data */
  updateByRaw: (raw: string | null | undefined) => void
}

const store = new Map<string, Data<any>>()

let interceptorsInstalled = false
/** 拦截器要活到进程结束，所以挂在一个不会被 stop 的独立作用域上 */
const detachedScope = effectScope(true)

export interface UseStorageOptions<T> extends ConfigurableEventFilter, ConfigurableFlush {
  /**
   * 是否监听深层变化
   *
   * @default true
   */
  deep?: boolean
  /**
   * 是否监听 setStorage、removeStorage 和 clearStorage 引起的本地缓存变化
   *
   * @default true
   */
  listenToStorageChanges?: boolean
  /**
   * 当本地缓存不存在时，是否把默认值写入缓存
   *
   * @deprecated 变量ref和storage是响应式的，当storage没值，返回带默认值的ref必然会写入storage
   * @default true
   */
  writeDefaults?: boolean
  /**
   * 是否合并默认值和本地缓存值
   *
   * 当设置为 true 时，浅合并对象
   *
   * 你也可以传一个方法来自定义合并
   *
   * @default false
   */
  mergeDefaults?: boolean | ((storageValue: T, defaults: T) => T)
  /** 自定义数据序列化 */
  serializer?: Serializer<T>
  /**
   * 错误回调
   *
   * 默认用 `console.error` 打印错误
   */
  onError?: (error: unknown) => void
  /**
   * 是否使用 shallowRef
   *
   * @default false
   */
  shallow?: boolean
  /**
   * Wait for the component to be mounted before reading the storage.
   *
   * @default false
   */
  initOnMounted?: boolean
  /** 异步 storage */
  storage?: UniStorageLike
}

export function useStorage<T = unknown>(
  key: string,
  initialValue?: MaybeComputedRef<null>,
  options?: UseStorageOptions<T>,
): RemovableRef<T>

export function useStorage<T>(
  key: string,
  initialValue: MaybeComputedRef<T>,
  options?: UseStorageOptions<T>,
): RemovableRef<T>

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
  } = options

  const rawInit = unrefValue(initialValue) as T

  const type = guessSerializerType<T>(rawInit)

  const hasStore = store.has(key)

  const data = hasStore
    ? store.get(key)!
    : (shallow ? shallowRef : ref)(rawInit) as Ref<T> as Data<T>

  const serializer = options.serializer ?? StorageSerializers[type]

  data.key = key
  data.type = type
  data.serializer = serializer
  data.isUpdating = false
  data.default = rawInit
  data.read = readStorage
  data.write = writeStorageImmediately
  data.refresh = () => {
    data.read()
    return data
  }
  data.sync = () => data.write(data.value)
  data.clearTimer = clearTimer
  data.updateByRaw = updateByRaw
  data.listen = listenToStorageChanges
  data.syncedValue = undefined
  data.hasSyncedValue = false

  store.set(key, data)

  if (hasStore) {
    // 不重复读数据
    return data
  }

  if (initOnMounted) {
    tryOnMounted(data.read)
  }
  else {
    data.read()
  }

  data.watch = watchWithFilter(data, () => {
    if (data.isUpdating) {
      return
    }
    // 值刚由 storage 同步进来，不用再写回去
    if (data.hasSyncedValue) {
      const same = Object.is(data.value, data.syncedValue)
      data.hasSyncedValue = false
      if (same) {
        return
      }
    }
    writeStorage(data.value)
  }, { flush, deep, eventFilter })

  if (listenToStorageChanges) {
    installStorageInterceptors()
  }

  // 卸载时把还在防抖里的修改落盘，别丢掉最后一次改动
  tryOnScopeDispose(() => {
    if (data.timer) {
      writeStorageImmediately(data.value)
    }
  })

  function clearTimer(): void {
    if (data.timer) {
      clearTimeout(data.timer)
      data.timer = undefined
    }
  }

  function writeStorage(val: T): void {
    clearTimer()
    // 如果是同步操作，则直接写 storage
    if (flush === 'sync') {
      writeStorageImmediately(val)
      return
    }

    data.timer = setTimeout(writeStorageImmediately, 100, val)
  }

  function writeStorageImmediately(val: T): void {
    clearTimer()

    if (data.isUpdating) {
      return
    }

    try {
      data.isUpdating = true

      if (val == null) {
        storage.removeStorage({
          key,
          fail: error => onError(error),
        })
        clearTimer()
        return
      }
      const serialized = data.serializer.write(val)
      storage.setStorage({
        key,
        data: serialized,
        fail: error => onError(error),
      })
    }
    catch (error) {
      onError(error)
    }
    finally {
      data.isUpdating = false
    }
  }

  function updateByRaw(raw: string | null | undefined): void {
    try {
      if (raw == null) {
        // 没有对应的值，直接使用默认值
        data.value = data.default
        return
      }

      // 解析 value
      const value: T = data.serializer.read(raw)

      let next: T = value

      if (mergeDefaults) {
        // 如果是方法，调用
        if (typeof mergeDefaults === 'function') {
          next = mergeDefaults(value, data.default)
        }
        // 如果是对象，浅合并
        else if (type === 'object' && !Array.isArray(value)) {
          next = {
            ...(data.default as any),
            ...(value as any),
          }
        }
      }

      // 值来自 storage，watcher 不用再写回去
      data.syncedValue = next
      data.hasSyncedValue = true
      data.value = next
    }
    catch (err: any) {
      onError(err)
    }
  }

  function readStorage(): T {
    // 读取本地缓存值
    storage.getStorage({
      key: data.key,
      success: ({ data: raw }) => {
        updateByRaw(raw)
      },
      fail: () => {
        updateByRaw(undefined)
      },
    })

    return data.value
  }

  return data
}

/**
 * 全局只装一次 storage 拦截器，按 key 从 store 里查对应的 Data
 *
 * 以前是每个 key 装 6 个，key 一多每次 storage 调用都要遍历全部拦截器
 */
function installStorageInterceptors(): void {
  if (interceptorsInstalled) {
    return
  }
  interceptorsInstalled = true

  // 用独立的作用域注册，避免跟着第一个调用 useStorage 的组件一起卸载
  detachedScope.run(() => {
    useInterceptor('setStorage', {
      invoke: (args) => {
        const data = store.get(args[0].key)
        if (!data?.listen || data.isUpdating) {
          return
        }
        data.isUpdating = true

        const raw = (typeof args[0].data !== 'string' && args[0].data != null)
          ? JSON.stringify(args[0].data)
          : args[0].data

        data.updateByRaw(raw)

        data.isUpdating = false
      },
    })

    useInterceptor('setStorageSync', {
      invoke: (args) => {
        const data = store.get(args[0])
        if (!data?.listen || data.isUpdating) {
          return
        }
        data.isUpdating = true

        const raw = (typeof args[1] !== 'string' && args[1] != null)
          ? JSON.stringify(args[1])
          : args[1]

        data.updateByRaw(raw)

        data.isUpdating = false
      },
    })

    useInterceptor('removeStorage', {
      invoke: (args) => {
        const data = store.get(args[0].key)
        if (!data?.listen || data.isUpdating) {
          return
        }
        data.isUpdating = true
        data.value = undefined as unknown as never
        data.isUpdating = false
      },
    })

    useInterceptor('removeStorageSync', {
      invoke: (args) => {
        const data = store.get(args[0])
        if (!data?.listen || data.isUpdating) {
          return
        }
        data.isUpdating = true
        data.value = undefined as unknown as never
        data.isUpdating = false
      },
    })

    // 清空全部缓存，没有 key 可以筛，逐个通知
    const clearAll = (): void => {
      for (const data of store.values()) {
        if (!data.listen) {
          continue
        }
        data.isUpdating = true
        data.value = undefined as unknown as never
        data.isUpdating = false
      }
    }

    useInterceptor('clearStorage', { complete: clearAll })
    useInterceptor('clearStorageSync', { complete: clearAll })
  })
}
