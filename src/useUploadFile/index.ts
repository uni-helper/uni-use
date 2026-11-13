import type { Ref, ShallowRef } from 'vue'
import { shallowRef } from 'vue'
import { createUniTask } from '../uni-task'
import { isString, noop } from '../utils'

/** 对标 @vueuse/core v10.7.1 useAxios */

export interface UseUploadFileReturn<T> {
  task: ShallowRef<UniApp.UploadTask | undefined>

  /** uni.uploadFile 响应 */
  response: ShallowRef<UniApp.UploadFileSuccessCallbackResult | undefined>

  /** uni.uploadFile 响应内的数据 */
  data: Ref<T | undefined>

  /** 上传是否完成 */
  isFinished: Ref<boolean>

  /** 上传是否进行中 */
  isLoading: Ref<boolean>

  /** 上传是否中止 */
  isAborted: Ref<boolean>

  /** 上传间发生的错误 */
  error: ShallowRef<UniApp.GeneralCallbackResult | undefined>

  /** 中止当前上传 */
  abort: (message?: string | undefined) => void

  /** abort 别名 */
  cancel: (message?: string | undefined) => void

  /** isAborted 别名 */
  isCanceled: Ref<boolean>
}
export interface StrictUseUploadFileReturn<T> extends UseUploadFileReturn<T> {
  /** 手动开始下载 */
  execute: (
    url?: string | UniApp.UploadFileOption,
    config?: UniApp.UploadFileOption,
  ) => PromiseLike<StrictUseUploadFileReturn<T>>
}
export interface EasyUseUploadFileReturn<T> extends UseUploadFileReturn<T> {
  /** 手动开始下载 */
  execute: (
    url: string,
    config?: UniApp.UploadFileOption,
  ) => PromiseLike<EasyUseUploadFileReturn<T>>
}
export type OverallUseUploadFileReturn<T>
  = | StrictUseUploadFileReturn<T>
    | EasyUseUploadFileReturn<T>

export interface UseUploadFileOptions<T = any> {
  /** 是否自动开始上传 */
  immediate?: boolean

  /**
   * 是否使用 shallowRef
   *
   * @default true
   */
  shallow?: boolean

  /** 上传错误时的回调 */
  onError?: (e: UniApp.GeneralCallbackResult) => void

  /** 上传成功时的回调 */
  onSuccess?: (data: T) => void

  /** 要使用的初始化数据 */
  initialData?: T

  /** 是否在执行承诺之前将状态设置为初始状态 */
  resetOnExecute?: boolean

  /** 上传结束时的回调 */
  onFinish?: (result?: UniApp.GeneralCallbackResult) => void
}

export function useUploadFile<T = any>(
  url: string,
  config?: UniApp.UploadFileOption,
  options?: UseUploadFileOptions,
): StrictUseUploadFileReturn<T> & PromiseLike<StrictUseUploadFileReturn<T>>
export function useUploadFile<T = any>(
  config?: UniApp.UploadFileOption,
): EasyUseUploadFileReturn<T> & PromiseLike<EasyUseUploadFileReturn<T>>

/** uni.uploadFile 的封装 */
export function useUploadFile<T = any>(
  ...args: any[]
): OverallUseUploadFileReturn<T> & PromiseLike<OverallUseUploadFileReturn<T>> {
  const url: string | undefined = typeof args[0] === 'string'
    ? args[0]
    : undefined
  const argsPlaceholder = isString(url)
    ? 1
    : 0
  const defaultOptions: UseUploadFileOptions<T> = {
    immediate: !!argsPlaceholder,
    shallow: true,
  }
  let defaultConfig: Partial<UniApp.UploadFileOption> = {}
  let options: UseUploadFileOptions<T> = defaultOptions

  if (args.length > 0 + argsPlaceholder) {
    defaultConfig = args[0 + argsPlaceholder]
  }

  if (args.length === 3) {
    options = args[0 + argsPlaceholder]
  }

  const {
    initialData,
    shallow,
    onSuccess = noop,
    onError = noop,
    onFinish = noop,
    immediate,
    resetOnExecute = false,
  } = options

  const task = shallowRef<UniApp.UploadTask>()

  const uniTask = createUniTask<UniApp.UploadFileSuccessCallbackResult, T>({
    shallow,
    initialData,
    resetOnExecute,
    toData: raw => raw.data as unknown as T,
    onSuccess,
    onError,
    onFinish,
  })

  const { data, response, error, isFinished, isLoading, isAborted, abort } = uniTask

  // 在 result 建好之后赋值；execute 里引用它只是为了返回同一个 thenable
  let promise: Promise<OverallUseUploadFileReturn<T>>

  const execute: OverallUseUploadFileReturn<T>['execute'] = (
    executeUrl: string | UniApp.UploadFileOption | undefined = url,
    config: Partial<UniApp.UploadFileOption> = {},
  ) => {
    const _url = typeof executeUrl === 'string'
      ? executeUrl
      : url ?? config.url

    if (_url === undefined) {
      uniTask.fail({
        errMsg: 'Invalid URL provided for uni.uploadFile.',
      })
      return promise
    }

    const _config = {
      ...defaultConfig,
      ...(typeof executeUrl === 'object'
        ? executeUrl
        : config),
      url: _url,
    }

    task.value = uniTask.start(_config, (merged, hooks) =>
      uni.uploadFile({
        ...merged,
        ...hooks,
      }))

    return promise
  }

  const result = {
    task,
    response,
    data,
    error,
    isFinished,
    isLoading,
    cancel: abort,
    isAborted,
    isCanceled: isAborted,
    abort,
    execute,
  } as OverallUseUploadFileReturn<T>

  promise = uniTask.createPromise(result)

  if (immediate && url) {
    (execute as StrictUseUploadFileReturn<T>['execute'])()
  }

  return {
    ...result,
    ...promise,
  } as OverallUseUploadFileReturn<T> & Promise<OverallUseUploadFileReturn<T>>
}
