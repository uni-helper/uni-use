import { type Ref, type ShallowRef, ref, shallowRef } from 'vue';
import { until } from '@vueuse/core';
import { isString, noop } from '../utils';

/** 对标 @vueuse/core v10.7.1 useAxios */

export interface UseRequestReturn<T> {
  task: ShallowRef<UniApp.RequestTask | undefined>;

  /** uni.request 响应 */
  response: ShallowRef<UniApp.RequestSuccessCallbackResult | undefined>;

  /** uni.request 响应内的数据 */
  data: Ref<T | undefined>;

  /** 请求是否完成 */
  isFinished: Ref<boolean>;

  /** 请求是否进行中 */
  isLoading: Ref<boolean>;

  /** 请求是否中止 */
  isAborted: Ref<boolean>;

  /** 请求间发生的错误 */
  error: ShallowRef<UniApp.GeneralCallbackResult | undefined>;

  /** 中止当前请求 */
  abort: (message?: string | undefined) => void;

  /** abort 别名 */
  cancel: (message?: string | undefined) => void;

  /** isAborted 别名 */
  isCanceled: Ref<boolean>;
}
export interface StrictUseRequestReturn<T> extends UseRequestReturn<T> {
  /** 手动开始请求 */
  execute: (
    url?: string | UniApp.RequestOptions,
    config?: UniApp.RequestOptions,
  ) => PromiseLike<StrictUseRequestReturn<T>>;
}
export interface EasyUseRequestReturn<T> extends UseRequestReturn<T> {
  /** 手动开始下载 */
  execute: (url: string, config?: UniApp.RequestOptions) => PromiseLike<EasyUseRequestReturn<T>>;
}
export type OverallUseRequestReturn<T> = StrictUseRequestReturn<T> | EasyUseRequestReturn<T>;

export interface UseRequestOptions<T = any> {
  /** 是否自动开始请求 */
  immediate?: boolean;

  /**
   * 是否使用 shallowRef
   *
   * @default true
   */
  shallow?: boolean;

  /** 请求错误时的回调 */
  onError?: (e: UniApp.GeneralCallbackResult) => void;

  /** 请求成功时的回调 */
  onSuccess?: (data: T) => void;

  /** 要使用的初始化数据 */
  initialData?: T;

  /** 是否在执行承诺之前将状态设置为初始状态 */
  resetOnExecute?: boolean;

  /** 请求结束时的回调 */
  onFinish?: (result?: UniApp.GeneralCallbackResult) => void;
}

export function useRequest<T = any>(
  url: string,
  config?: UniApp.RequestOptions,
  options?: UseRequestOptions,
): StrictUseRequestReturn<T> & PromiseLike<StrictUseRequestReturn<T>>;
export function useRequest<T = any>(
  config?: UniApp.RequestOptions,
): EasyUseRequestReturn<T> & PromiseLike<EasyUseRequestReturn<T>>;

/** uni.request 的封装 */
export function useRequest<T = any>(
  ...args: any[]
): OverallUseRequestReturn<T> & PromiseLike<OverallUseRequestReturn<T>> {
  const url: string | undefined = typeof args[0] === 'string' ? args[0] : undefined;
  const argsPlaceholder = isString(url) ? 1 : 0;
  const defaultOptions: UseRequestOptions<T> = {
    immediate: !!argsPlaceholder,
    shallow: true,
  };
  let defaultConfig: Partial<UniApp.RequestOptions> = {};
  let options: UseRequestOptions<T> = defaultOptions;

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

  const task = shallowRef<UniApp.RequestTask>();
  const response = shallowRef<UniApp.RequestSuccessCallbackResult>();
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
  } as Promise<OverallUseRequestReturn<T>>;

  let executeCounter = 0;
  const execute: OverallUseRequestReturn<T>['execute'] = (
    executeUrl: string | UniApp.RequestOptions | undefined = url,
    config: Partial<UniApp.RequestOptions> = {},
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
    task.value = uni.request({
      ..._config,
      success: (r) => {
        if (isAborted.value) {
          return;
        }
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
        if (currentExecuteCounter === executeCounter) {
          loading(false);
        }
      },
    });
    return promise;
  };
  if (immediate && url) {
    (execute as StrictUseRequestReturn<T>['execute'])();
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
  } as OverallUseRequestReturn<T>;

  function waitUntilFinished() {
    return new Promise<OverallUseRequestReturn<T>>((resolve, reject) => {
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
