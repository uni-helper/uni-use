import { until } from '@vueuse/core';
import { type Ref, ref, type ShallowRef, shallowRef } from 'vue';
import { isString, noop } from '../utils';

/** 对标 @vueuse/core v10.7.1 useAxios */

export interface UseDownloadFileReturn<T> {
  task: ShallowRef<UniApp.DownloadTask | undefined>;

  /** uni.downloadFile 响应 */
  response: ShallowRef<UniApp.DownloadSuccessData | undefined>;

  /** uni.downloadFile 响应内的数据 */
  data: Ref<T | undefined>;

  /** 下载是否完成 */
  isFinished: Ref<boolean>;

  /** 下载是否进行中 */
  isLoading: Ref<boolean>;

  /** 下载是否中止 */
  isAborted: Ref<boolean>;

  /** 下载间发生的错误 */
  error: ShallowRef<UniApp.GeneralCallbackResult | undefined>;

  /** 中止当前下载 */
  abort: (message?: string | undefined) => void;

  /** abort 别名 */
  cancel: (message?: string | undefined) => void;

  /** isAborted 别名 */
  isCanceled: Ref<boolean>;
}
export interface StrictUseDownloadFileReturn<T> extends UseDownloadFileReturn<T> {
  /** 手动开始下载 */
  execute: (
    url?: string | UniApp.DownloadFileOption,
    config?: UniApp.DownloadFileOption,
  ) => PromiseLike<StrictUseDownloadFileReturn<T>>;
}
export interface EasyUseDownloadFileReturn<T> extends UseDownloadFileReturn<T> {
  /** 手动开始下载 */
  execute: (
    url: string,
    config?: UniApp.DownloadFileOption,
  ) => PromiseLike<EasyUseDownloadFileReturn<T>>;
}
export type OverallUseDownloadFileReturn<T> =
  | StrictUseDownloadFileReturn<T>
  | EasyUseDownloadFileReturn<T>;

export interface UseDownloadFileOptions<T = any> {
  /** 是否自动开始下载 */
  immediate?: boolean;

  /**
   * 是否使用 shallowRef
   *
   * @default true
   */
  shallow?: boolean;

  /** 下载错误时的回调 */
  onError?: (e: UniApp.GeneralCallbackResult) => void;

  /** 下载成功时的回调 */
  onSuccess?: (data: T) => void;

  /** 要使用的初始化数据 */
  initialData?: T;

  /** 是否在执行承诺之前将状态设置为初始状态 */
  resetOnExecute?: boolean;

  /** 下载结束时的回调 */
  onFinish?: (result?: UniApp.GeneralCallbackResult) => void;
}

export function useDownloadFile<T = any>(
  url: string,
  config?: UniApp.DownloadFileOption,
  options?: UseDownloadFileOptions,
): StrictUseDownloadFileReturn<T> & PromiseLike<StrictUseDownloadFileReturn<T>>;
export function useDownloadFile<T = any>(
  config?: UniApp.DownloadFileOption,
): EasyUseDownloadFileReturn<T> & PromiseLike<EasyUseDownloadFileReturn<T>>;

/** uni.downloadFile 的封装 */
export function useDownloadFile<T = any>(
  ...args: any[]
): OverallUseDownloadFileReturn<T> & PromiseLike<OverallUseDownloadFileReturn<T>> {
  const url: string | undefined = typeof args[0] === 'string' ? args[0] : undefined;
  const argsPlaceholder = isString(url) ? 1 : 0;
  const defaultOptions: UseDownloadFileOptions<T> = {
    immediate: !!argsPlaceholder,
    shallow: true,
  };
  let defaultConfig: Partial<UniApp.DownloadFileOption> = {};
  let options: UseDownloadFileOptions<T> = defaultOptions;

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

  const task = shallowRef<UniApp.DownloadTask>();
  const response = shallowRef<UniApp.DownloadSuccessData>();
  const data = shallow ? shallowRef<T>() : ref<T>();
  const isFinished = ref(false);
  const isLoading = ref(false);
  const isAborted = ref(false);
  const error = shallowRef<UniApp.GeneralCallbackResult>();

  const abort = (message?: string) => {
    if (isFinished.value || !isLoading.value) {
      return;
    }
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
    if (resetOnExecute) {
      data.value = initialData;
    }
  };

  const promise = {
    then: (...args) => waitUntilFinished().then(...args),
    catch: (...args) => waitUntilFinished().catch(...args),
  } as Promise<OverallUseDownloadFileReturn<T>>;

  let executeCounter = 0;
  const execute: OverallUseDownloadFileReturn<T>['execute'] = (
    executeUrl: string | UniApp.DownloadFileOption | undefined = url,
    config: Partial<UniApp.DownloadFileOption> = {},
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
    task.value = uni.downloadFile({
      ..._config,
      success: (r) => {
        if (isAborted.value) {
          return;
        }
        _config.success?.(r);
        response.value = r;
        const result
          // @ts-expect-error no types
          = r?.data
          ?? ({
            tempFilePath: r?.tempFilePath,
          } as unknown as T);
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
        if (currentExecuteCounter === executeCounter) {
          loading(false);
        }
      },
    });
    return promise;
  };
  if (immediate && url) {
    (execute as StrictUseDownloadFileReturn<T>['execute'])();
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
  } as OverallUseDownloadFileReturn<T>;

  function waitUntilFinished() {
    return new Promise<OverallUseDownloadFileReturn<T>>((resolve, reject) => {
      until(isFinished)
        .toBe(true)
        .then(() => (error.value ? reject(error.value) : resolve(result)));
    });
  }

  return {
    ...result,
    ...promise,
  };
}
