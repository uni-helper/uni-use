import type { Ref, WatchSource, WatchStopHandle } from 'vue'
import type {
  ConfigurableEventFilter,
  ConfigurableFlush,
  EventFilter,
  Fn,
  MaybeComputedRef,
} from './types'
import { computed, getCurrentInstance, isRef, onMounted, ref, unref, watch } from 'vue'
import { tryOnScopeDispose } from './tryOnScopeDispose'
import { useRouter } from './useRouter'

/**
 * 判断一个值是否为字符串类型
 *
 * @param val 待判断的值
 * @returns 如果值是字符串类型，则返回true；否则返回false
 */
export function isString(val: unknown): val is string {
  return typeof val === 'string'
}

/**
 * 判断一个值是否为函数类型
 *
 * @template T 函数的类型
 * @param val 待判断的值
 * @returns 如果值为函数类型，则返回 true，否则返回 false
 */
export function isFunction<T extends (...args: any[]) => any>(val: any): val is T {
  return typeof val === 'function'
}

/**
 * 一个空函数，不执行任何操作。
 */
export function noop(): void {}

/**
 * 解析路径
 *
 * @param target 目标路径（不含domain）
 * @param current 当前路径（不含domain），默认为当前页面路由
 * @returns 解析后的路径
 * @throws 当当前路径未定义且无法找到时，抛出错误
 */
export function pathResolve(target: string, current?: string): string {
  // 如果目标路径已经是绝对路径，则直接返回
  if (target.startsWith('/')) {
    return target
  }

  // 如果当前路径未定义，则从路由中获取当前路径
  if (!current) {
    const { currentUrl } = useRouter()
    current = currentUrl.value
  }

  // 如果当前路径未定义，则抛出错误
  if (!current) {
    throw new Error('The current path is undefined and cannot be found.')
  }

  // 如果目标路径为空，则直接返回当前路径
  if (!target) {
    return current
  }

  // 如果目标路径以 ./ 开头，则递归调用 pathResolve 函数，将当前路径作为新的当前路径
  if (target.startsWith('./')) {
    return pathResolve(target.slice(2), current)
  }

  // 获取当前路径的页面路径
  let currentPaths: string[] = []
  if (current.endsWith('/')) {
    currentPaths = current.split('/').filter(part => part !== '' && part !== '.')
  }
  else {
    currentPaths = current.split('/')
    currentPaths.pop() // 去除最后的页面路径
    currentPaths = currentPaths.filter(part => part !== '' && part !== '.')
  }

  // 获取目标路径的页面路径和页面
  let targetPaths: string[] = []
  let targetPage = ''
  if (target.endsWith('/')) {
    targetPaths = target.split('/').filter(part => part !== '' && part !== '.')
  }
  else {
    targetPaths = target.split('/')
    targetPage = targetPaths.pop() || '' // 去除最后的页面路径
    targetPaths = targetPaths.filter(part => part !== '' && part !== '.')
  }

  // 合并路径
  const paths = [
    ...currentPaths,
    ...targetPaths,
  ]
  const finalPaths: string[] = []
  for (const p of paths) {
    if (p === '..') {
      finalPaths.pop()
    }
    else {
      finalPaths.push(p)
    }
  }

  // 返回最终路径
  return `/${finalPaths.join('/')}/${targetPage}`
}

/**
 * 延迟执行一段时间
 *
 * @param ms 延迟时间，单位为毫秒，默认为0，即不延迟
 * @returns 返回一个Promise对象
 */
export function sleep(ms = 0): Promise<void> {
  return new Promise<void>(resolve => setTimeout(resolve, ms))
}

/**
 * 判断传入的对象是否是具有 .then 方法的 Thenable 类型
 *
 * @param promise 需要判断的对象
 * @returns 如果传入的对象具有 .then 方法，则返回 true；否则返回 false
 */
export function isThenable(promise: any): boolean {
  return typeof promise.then === 'function'
}

/**
 * 创建一个只执行一次的函数包装器
 * @param fn 需要包装的原始函数
 * @returns 返回一个新的函数，该函数只会执行一次原始函数，后续调用将返回第一次执行的结果
 */
export function once<F extends (...args: any[]) => any>(fn: F, ctx: unknown = null): F {
  let res: any
  let f: typeof fn | undefined = fn

  // 返回包装后的函数，确保原始函数只执行一次
  return ((...args) => {
    if (f) {
      res = f.apply(ctx, args)
      f = undefined // 执行一次就设为 undefined
    }
    return res
  }) as F
}

/**
 * 取出 MaybeRefOrGetter 的值
 *
 * 替代 `@vueuse/core` 的 `resolveUnref`（v14 起已移除）
 *
 * @param value ref、getter 或普通值
 * @returns 当前值
 */
export function unrefValue<T>(value: MaybeComputedRef<T>): T {
  return isFunction(value)
    ? value()
    : unref(value)
}

/**
 * 把 MaybeRefOrGetter 统一成 Ref，getter 会转成 computed
 *
 * 替代 `@vueuse/core` 的 `resolveRef`（v14 起已移除）
 *
 * @param value ref、getter 或普通值
 * @returns 对应的 ref
 */
export function toValueRef<T>(value: MaybeComputedRef<T>): Ref<T> {
  if (isFunction(value)) {
    return computed(value)
  }
  return isRef(value)
    ? value
    : (ref(value) as Ref<T>)
}

/**
 * 在组件里走 onMounted，不在组件里立即执行
 *
 * @param fn 要执行的函数
 */
export function tryOnMounted(fn: Fn): void {
  if (getCurrentInstance()) {
    onMounted(fn)
  }
  else {
    fn()
  }
}

/**
 * 包装回调，按 eventFilter 决定是否执行
 *
 * 回调被包成 Promise，filter 可以据此做防抖、节流或直接丢弃这次触发
 */
function createFilterWrapper<T extends Fn>(filter: EventFilter, fn: T): T {
  return function (this: unknown, ...args: Parameters<T>) {
    return new Promise((resolve, reject) => {
      Promise.resolve(filter(() => fn.apply(this, args)))
        .then(resolve)
        .catch(reject)
    })
  } as T
}

/**
 * 带 eventFilter 的 watch
 *
 * 替代 `@vueuse/core` 的 `watchWithFilter`
 *
 * @param source 监听源
 * @param cb 回调
 * @param options 除 eventFilter 外的选项直接透传给 watch
 * @returns 停止监听的函数
 */
export function watchWithFilter<T>(
  source: WatchSource<T>,
  cb: (value: T, oldValue: T | undefined) => unknown,
  options: ConfigurableEventFilter & ConfigurableFlush & { deep?: boolean, immediate?: boolean } = {},
): WatchStopHandle {
  const { eventFilter, ...watchOptions } = options
  const filtered = createFilterWrapper(eventFilter ?? (invoke => invoke()), cb)
  // watch 的重载要求回调签名精确匹配，这里的包装已经由 createFilterWrapper 保证
  return watch(source, filtered as unknown as (value: T, oldValue: T | undefined) => void, watchOptions)
}

/**
 * 等待监听源的值变成指定值
 *
 * 替代 `@vueuse/core` 的 `until(source).toBe(value)`
 *
 * @param source 监听源
 * @param value 目标值，按 `===` 比较
 * @returns 命中目标值时 resolve
 */
export function waitFor<T>(source: WatchSource<T>, value: T): Promise<T> {
  return new Promise<T>((resolve) => {
    const stop = watch(source, (current) => {
      if (current === value) {
        stop()
        resolve(current)
      }
    }, {
      flush: 'sync',
      immediate: true,
    })
  })
}

/**
 * 带暂停、恢复的 setInterval，组件作用域销毁时自动清理
 *
 * 替代 `@vueuse/core` 的 `useIntervalFn`，只保留本仓库用到的能力
 *
 * @param cb 每次触发的回调
 * @param interval 间隔毫秒数，小于等于 0 时不启动
 * @param options 配置项
 * @param options.immediate 为 false 时不自动启动，默认 true
 */
export function useIntervalFn(
  cb: () => void,
  interval = 1000,
  options: { immediate?: boolean } = {},
): { pause: () => void, resume: () => void } {
  const { immediate = true } = options
  let timer: NodeJS.Timeout | null = null

  function pause(): void {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  function resume(): void {
    if (interval <= 0) {
      return
    }
    pause()
    timer = setInterval(cb, interval)
  }

  if (immediate) {
    resume()
  }

  tryOnScopeDispose(pause)

  return { pause, resume }
}
