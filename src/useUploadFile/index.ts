import { type Ref, type ShallowRef, ref, shallowRef } from 'vue';
import { until } from '@vueuse/core';
import { isString, noop } from '../utils';

/** 对标 @vueuse/core v10.7.1 useAxios */

export interface UseUploadFileReturn<T> {
  task: ShallowRef<UniApp.UploadTask | undefined>;

  /** uni.uploadFile 响应 */
  response: ShallowRef<UniApp.UploadFileSuccessCallbackResult | undefined>;

  /** uni.uploadFile 响应内的数据 */
  data: Ref<T | undefined>;

  /** 上传是否完成 */
  isFinished: Ref<boolean>;

  /** 上传是否进行中 */
  isLoading: Ref<boolean>;

  /** 上传是否中止 */
  isAborted: Ref<boolean>;

  /** 上传间发生的错误 */
  error: ShallowRef<UniApp.GeneralCallbackResult | undefined>;

  /** 中止当前上传 */
  abort: (message?: string | undefined) => void;

  /** abort 别名 */
  cancel: (message?: string | undefined) => void;

  /** isAborted 别名 */
  isCanceled: Ref<boolean>;
}
export interface StrictUseUploadFileReturn<T> extends UseUploadFileReturn<T> {
  /** 手动开始下载 */
  execute: (
    url?: string | UniApp.UploadFileOption,
    config?: UniApp.UploadFileOption,
  ) => PromiseLike<StrictUseUploadFileReturn<T>>;
}
export interface EasyUseUploadFileReturn<T> extends UseUploadFileReturn<T> {
  /** 手动开始下载 */
  execute: (
    url: string,
    config?: UniApp.UploadFileOption,
  ) => PromiseLike<EasyUseUploadFileReturn<T>>;
}
export type OverallUseUploadFileReturn<T> =
  | StrictUseUploadFileReturn<T>
  | EasyUseUploadFileReturn<T>;

export interface UseUploadFileOptions<T = any> {
  /** 是否自动开始上传 */
  immediate?: boolean;

  /**
   * 是否使用 shallowRef
   *
   * @default true
   */
  shallow?: boolean;

  /** 上传错误时的回调 */
  onError?: (e: UniApp.GeneralCallbackResult) => void;

  /** 上传成功时的回调 */
  onSuccess?: (data: T) => void;

  /** 要使用的初始化数据 */
  initialData?: T;

  /** 是否在执行承诺之前将状态设置为初始状态 */
  resetOnExecute?: boolean;

  /** 上传结束时的回调 */
  onFinish?: (result?: UniApp.GeneralCallbackResult) => void;
}

export function useUploadFile<T = any>(
  url: string,
  config?: UniApp.UploadFileOption,
  options?: UseUploadFileOptions,
): StrictUseUploadFileReturn<T> & PromiseLike<StrictUseUploadFileReturn<T>>;
export function useUploadFile<T = any>(
  config?: UniApp.UploadFileOption,
): EasyUseUploadFileReturn<T> & PromiseLike<EasyUseUploadFileReturn<T>>;

/** uni.uploadFile 的封装 */
export function useUploadFile<T = any>(
  ...args: any[]
): OverallUseUploadFileReturn<T> & PromiseLike<OverallUseUploadFileReturn<T>> {
  const url: string | undefined = typeof args[0] === 'string' ? args[0] : undefined;
  const argsPlaceholder = isString(url) ? 1 : 0;
  const defaultOptions: UseUploadFileOptions<T> = {
    immediate: !!argsPlaceholder,
    shallow: true,
  };
  let defaultConfig: Partial<UniApp.UploadFileOption> = {};
  let options: UseUploadFileOptions<T> = defaultOptions;

  if (args.length > 0 + argsPlaceholder) {
    defaultConfig = args[0 + argsPlaceholder];
  }

  if (args.length === 3) {
    options = args[0 + argsPlaceholder];
  }

  const {
    initialData,
    shallow,
    onSuccess = noop,
    onError = noop,
    onFinish = noop,
    immediate,
    resetOnExecute = false,
  } = options;

  const task = shallowRef<UniApp.UploadTask>();
  const response = shallowRef<UniApp.UploadFileSuccessCallbackResult>();
  const data = shallow ? shallowRef<T>() : ref<T>();
  const isFinished = ref(false);
  const isLoading = ref(false);
  const isAborted = ref(false);
  const error = shallowRef<UniApp.GeneralCallbackResult>();

  const abort = (message?: string) => {
    if (isFinished.value || !isLoading.value) return;
    // @ts-expect-error no types
    task.value?.abort(message);
    isAborted.value = true;
    isLoading.value = false;
    isFinished.value = false;
  };

  const loading = (loading: boolean) => {
    isLoading.value = loading;
    isFinished.value = !loading;
  };

  const resetData = () => {
    if (resetOnExecute) data.value = initialData;
  };

  const waitUntilFinished = () =>
    new Promise<OverallUseUploadFileReturn<T>>((resolve, reject) => {
      until(isFinished)
        .toBe(true)
        .then(() => (error.value ? reject(error.value) : resolve(result)));
    });

  const promise = {
    then: (...args) => waitUntilFinished().then(...args),
    catch: (...args) => waitUntilFinished().catch(...args),
  } as Promise<OverallUseUploadFileReturn<T>>;

  let executeCounter = 0;
  const execute: OverallUseUploadFileReturn<T>['execute'] = (
    executeUrl: string | UniApp.UploadFileOption | undefined = url,
    config: Partial<UniApp.UploadFileOption> = {},
  ) => {
    error.value = undefined;
    const _url = typeof executeUrl === 'string' ? executeUrl : url ?? config.url;

    if (_url === undefined) {
      error.value = {
        errMsg: 'Invalid URL provided for uni.request.',
      };
      isFinished.value = true;
      return promise;
    }
    resetData();
    abort();
    loading(true);

    executeCounter += 1;
    const currentExecuteCounter = executeCounter;
    isAborted.value = false;

    const _config = {
      ...defaultConfig,
      ...(typeof executeUrl === 'object' ? executeUrl : config),
      url: _url,
    };
    task.value = uni.uploadFile({
      ..._config,
      success: (r) => {
        if (isAborted.value) return;
        _config.success?.(r);
        response.value = r;
        const result = r.data as unknown as T;
        data.value = result;
        onSuccess(result);
      },
      fail: (e) => {
        _config.fail?.(e);
        error.value = e;
        onError(e);
      },
      complete: (r) => {
        _config.complete?.(r);
        onFinish(r);
        if (currentExecuteCounter === executeCounter) loading(false);
      },
    });
    return promise;
  };
  if (immediate && url) (execute as StrictUseUploadFileReturn<T>['execute'])();

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
  } as OverallUseUploadFileReturn<T>;

  return {
    ...result,
    ...promise,
  };
}
