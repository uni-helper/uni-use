import type { Ref, ShallowRef } from 'vue'
import type { Fn } from './types'
import { ref, shallowRef } from 'vue'
import { noop, once, waitFor } from './utils'

/** uni-app 任务类 API 的公共回调，请求、下载、上传都带这三个 */
export interface UniTaskConfig {
  success?: Fn
  fail?: Fn
  complete?: Fn
}

/** 能中止的任务，对应 uni.request / downloadFile / uploadFile 的返回值 */
export interface UniTaskLike {
  abort?: (message?: string) => void
}

/** 交给 runner 的回调，由 createUniTask 负责维护状态 */
export interface UniTaskHooks<TRaw> {
  success: (raw: TRaw) => void
  fail: (error: UniApp.GeneralCallbackResult) => void
  /** uni 会把 success 的结果原样再传给 complete，失败时传的是错误对象 */
  complete: (result?: TRaw | UniApp.GeneralCallbackResult) => void
}

/**
 * 可以 `await` 的对象
 *
 * 每次 `await` 都新建一个 Promise，所以重复 `execute()` 不会拿到上一次的结果
 */
export interface UniTaskPromise<R> {
  then: Promise<R>['then']
  catch: Promise<R>['catch']
  finally: Promise<R>['finally']
  readonly [Symbol.toStringTag]: string
}

export interface CreateUniTaskOptions<TRaw, T> {
  /** 是否用 shallowRef 存 data，默认 true */
  shallow?: boolean
  /** 初始数据 */
  initialData?: T
  /** 每次执行前是否把 data 重置为 initialData，默认 false */
  resetOnExecute?: boolean
  /** 从原始响应里取出 data */
  toData: (raw: TRaw) => T
  onSuccess?: (data: T) => void
  onError?: (error: UniApp.GeneralCallbackResult) => void
  onFinish?: (result?: UniApp.GeneralCallbackResult) => void
}

/** createUniTask 的返回值 */
export interface UniTask<TRaw, T> {
  data: Ref<T | undefined>
  response: ShallowRef<TRaw | undefined>
  error: ShallowRef<UniApp.GeneralCallbackResult | undefined>
  isFinished: Ref<boolean>
  isLoading: Ref<boolean>
  isAborted: Ref<boolean>
  /** 中止当前任务 */
  abort: (message?: string) => void
  /** 没有 URL 之类的前置错误，直接把状态标成已完成 */
  fail: (err: UniApp.GeneralCallbackResult) => void
  /** 生成对外返回的 thenable，`await` 的值就是传入的 result */
  createPromise: <R>(result: R) => UniTaskPromise<R>
  /** 发起一次任务，返回底层 task */
  start: <TConfig extends UniTaskConfig, TTask extends UniTaskLike>(
    config: TConfig,
    runner: (config: TConfig, hooks: UniTaskHooks<TRaw>) => TTask,
  ) => TTask
}

/**
 * 请求、下载、上传共用的状态机
 *
 * 三者的差别只有调用的 uni API 和从响应里取数据的方式，其余逻辑完全一样，抽出来避免各改各的
 */
export function createUniTask<TRaw, T>(options: CreateUniTaskOptions<TRaw, T>): UniTask<TRaw, T> {
  const {
    shallow = true,
    initialData,
    resetOnExecute = false,
    toData,
    onSuccess = noop,
    onError = noop,
    onFinish = noop,
  } = options

  const response = shallowRef<TRaw>()
  const data = (shallow ? shallowRef : ref)(initialData) as Ref<T | undefined>
  const isFinished = ref(false)
  const isLoading = ref(false)
  const isAborted = ref(false)
  const error = shallowRef<UniApp.GeneralCallbackResult>()

  let currentTask: UniTaskLike | undefined
  let executeCounter = 0

  function abort(message?: string): void {
    if (isFinished.value || !isLoading.value) {
      return
    }
    currentTask?.abort?.(message)
    isAborted.value = true
    isLoading.value = false
    isFinished.value = false
  }

  function loading(value: boolean): void {
    isLoading.value = value
    isFinished.value = !value
  }

  function waitUntilFinished(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      waitFor(isFinished, true)
        .then(() => (error.value
          ? reject(error.value)
          : resolve()))
    })
  }

  /** 没有 URL 之类的前置错误，直接把状态标成已完成 */
  function fail(err: UniApp.GeneralCallbackResult): void {
    error.value = err
    isFinished.value = true
  }

  /** 生成模块对外返回的 thenable，`await` 的值就是传入的 result */
  function createPromise<R>(result: R): UniTaskPromise<R> {
    return {
      then: (...args) => waitUntilFinished().then(() => result).then(...args),
      catch: (...args) => waitUntilFinished().then(() => result).catch(...args),
      finally: (...args) => waitUntilFinished().then(() => result).finally(...args),
      // 让 Object.prototype.toString.call(promise) 显示 [object Promise]
      [Symbol.toStringTag]: 'Promise',
    }
  }

  function start<TConfig extends UniTaskConfig, TTask extends UniTaskLike>(
    config: TConfig,
    runner: (config: TConfig, hooks: UniTaskHooks<TRaw>) => TTask,
  ): TTask {
    error.value = undefined
    if (resetOnExecute) {
      data.value = initialData
    }
    abort()
    loading(true)

    executeCounter += 1
    const currentExecuteCounter = executeCounter
    isAborted.value = false

    // uni 偶尔不触发 complete，用 success / fail 兜一次
    const complete = once((result?: TRaw | UniApp.GeneralCallbackResult) => {
      config.complete?.(result)
      // SAFETY: uni 的 success 结果都带 errMsg，可以直接当 GeneralCallbackResult 用
      onFinish(result as UniApp.GeneralCallbackResult | undefined)
      if (currentExecuteCounter === executeCounter) {
        loading(false)
      }
    })

    const task = runner(config, {
      success: (raw) => {
        if (isAborted.value) {
          return
        }
        config.success?.(raw)
        response.value = raw
        const result = toData(raw)
        data.value = result
        onSuccess(result)
        complete(raw)
      },
      fail: (err) => {
        config.fail?.(err)
        error.value = err
        onError(err)
        complete(err)
      },
      complete,
    })
    currentTask = task

    return task
  }

  return {
    data,
    response,
    error,
    isFinished,
    isLoading,
    isAborted,
    abort,
    fail,
    createPromise,
    start,
  }
}
