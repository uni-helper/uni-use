import type { Ref } from 'vue'

export type MaybeRef<T> = T | Ref<T>

export type MaybeRefOrGetter<T> = MaybeRef<T> | (() => T)

export type MaybeComputedRef<T> = MaybeRefOrGetter<T>

export type RequiredProperty<T, K extends keyof T> = T & { [P in K]-?: T[P] }

export type RequiredOnly<T, K extends keyof T> = RequiredProperty<Partial<T>, K>

export interface TryOptions {
  /**
   * 最大尝试次数
   *
   * @default 3
   */
  retry?: number
  /**
   * 尝试间隔时长，单位 ms
   *
   * @default 500
   */
  interval?: number

  /**
   * 当超时时是否立即执行， 值为false时将在最后无法运行时抛出异常
   *
   * @default true
   */
  runFinally?: boolean
}

/** 任意函数 */
export type Fn = (...args: any[]) => any

/**
 * 事件过滤器：拿到「真正执行回调」的函数，决定执行还是丢弃
 *
 * 和 VueUse 的 eventFilter 约定一致，原来从 `@vueuse/core` 引入的用户可以直接传
 */
export type EventFilter = (invoke: () => any) => any

export interface ConfigurableEventFilter {
  eventFilter?: EventFilter
}

export interface ConfigurableFlush {
  flush?: 'pre' | 'post' | 'sync'
}

export interface ConfigurableFlushSync {
  flush?: 'pre' | 'post' | 'sync'
}

/** 可删除的 Ref，赋值 null 或 undefined 表示删除 */
export type RemovableRef<T> = Omit<Ref<T>, 'value'> & {
  get value(): T
  set value(value: T | null | undefined)
}
