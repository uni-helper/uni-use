import { Ref, ShallowRef, ref, shallowRef } from 'vue';
import { isString, until } from '@vueuse/core';

export interface UseRequestReturn<T> {
  task: ShallowRef<UniApp.RequestTask | undefined>;

  /** Response for uni.request */
  response: ShallowRef<UniApp.RequestSuccessCallbackResult | undefined>;

  /** Response data for Uni.request */
  data: Ref<T | undefined>;

  /** Indicates if the request has finished */
  isFinished: Ref<boolean>;

  /** Indicates if the request is currently loading */
  isLoading: Ref<boolean>;

  /** Indicates if the request was aborted */
  isAborted: Ref<boolean>;

  /** Any errors that may have occurred */
  error: ShallowRef<UniApp.GeneralCallbackResult | undefined>;

  /** Aborts the current request */
  abort: (message?: string | undefined) => void;

  /** Alias for abort */
  cancel: (message?: string | undefined) => void;

  /** Alias for isAborted */
  isCanceled: Ref<boolean>;
}
export interface StrictUseRequestReturn<T> extends UseRequestReturn<T> {
  /** Manually call the uni.request */
  execute: (
    url?: string | UniApp.RequestOptions,
    config?: UniApp.RequestOptions,
  ) => PromiseLike<StrictUseRequestReturn<T>>;
}
export interface EasyUseRequestReturn<T> extends UseRequestReturn<T> {
  /** Manually call the uni.request */
  execute: (url: string, config?: UniApp.RequestOptions) => PromiseLike<EasyUseRequestReturn<T>>;
}
export interface UseRequestOptions {
  /** Will automatically run uni.request when `useRequest` is used */
  immediate?: boolean;
  /**
   * Use shallowRef.
   *
   * @default true
   */
  shallow?: boolean;
}
type OverallUseRequestReturn<T> = StrictUseRequestReturn<T> | EasyUseRequestReturn<T>;

export function useRequest<T = any>(
  url: string,
  config?: UniApp.RequestOptions,
  options?: UseRequestOptions,
): StrictUseRequestReturn<T> & PromiseLike<StrictUseRequestReturn<T>>;
export function useRequest<T = any>(
  config?: UniApp.RequestOptions,
): EasyUseRequestReturn<T> & PromiseLike<EasyUseRequestReturn<T>>;

/** Wrapper for uni.request. */
export function useRequest<T = any>(
  ...args: any[]
): OverallUseRequestReturn<T> & PromiseLike<OverallUseRequestReturn<T>> {
  const url: string | undefined = typeof args[0] === 'string' ? args[0] : undefined;
  const argsPlaceholder = isString(url) ? 1 : 0;
  let defaultConfig: Partial<UniApp.RequestOptions> = {};
  let options: UseRequestOptions = { immediate: !!argsPlaceholder, shallow: true };

  if (args.length > 0 + argsPlaceholder) {
    defaultConfig = args[0 + argsPlaceholder];
  }

  if (args.length === 3) {
    options = args[0 + argsPlaceholder];
  }

  const task = shallowRef<UniApp.RequestTask>();
  const response = shallowRef<UniApp.RequestSuccessCallbackResult>();
  const data = options.shallow ? shallowRef<T>() : ref<T>();
  const isFinished = ref(false);
  const isLoading = ref(false);
  const isAborted = ref(false);
  const error = shallowRef<UniApp.GeneralCallbackResult>();

  const abort = (message?: string) => {
    if (isFinished.value || !isLoading.value) return;

    // @ts-expect-error
    task?.abort(message);
    isAborted.value = true;
    isLoading.value = false;
    isFinished.value = false;
  };
  const loading = (loading: boolean) => {
    isLoading.value = loading;
    isFinished.value = !loading;
  };
  const waitUntilFinished = () =>
    new Promise<OverallUseRequestReturn<T>>((resolve, reject) => {
      until(isFinished)
        .toBe(true)
        .then(() => resolve(result))
        .catch(reject);
    });
  const then: PromiseLike<OverallUseRequestReturn<T>>['then'] = (onFulfilled, onRejected) =>
    waitUntilFinished().then(onFulfilled, onRejected);
  const execute: OverallUseRequestReturn<T>['execute'] = (
    executeUrl: string | UniApp.RequestOptions | undefined = url,
    config: Partial<UniApp.RequestOptions> = {},
  ) => {
    const _url = typeof executeUrl === 'string' ? executeUrl : url ?? '';
    loading(true);
    const _config = {
      ...defaultConfig,
      ...config,
      url: _url,
    };
    task.value = uni.request({
      ..._config,
      success: (r) => {
        response.value = r;
        data.value = r.data as unknown as T;
        _config?.success?.(r);
      },
      fail: (e) => {
        error.value = e;
        _config?.fail?.(e);
      },
      complete: (r) => {
        loading(false);
        _config?.complete?.(r);
      },
    });
    return { then };
  };
  if (options.immediate && url) (execute as StrictUseRequestReturn<T>['execute'])();

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

  return {
    ...result,
    then,
  };
}
