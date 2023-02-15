import { Ref, ShallowRef, ref, shallowRef } from 'vue';
import { isString, until } from '@vueuse/core';

export interface UseUploadFileReturn<T> {
  task: ShallowRef<UniApp.UploadTask | undefined>;

  /** Response for uni.uploadFile */
  response: ShallowRef<UniApp.UploadFileSuccessCallbackResult | undefined>;

  /** Response data for uni.uploadFile */
  data: Ref<T | undefined>;

  /** Indicates if the upload has finished */
  isFinished: Ref<boolean>;

  /** Indicates if the upload is currently loading */
  isLoading: Ref<boolean>;

  /** Indicates if the upload was aborted */
  isAborted: Ref<boolean>;

  /** Any errors that may have occurred */
  error: ShallowRef<UniApp.GeneralCallbackResult | undefined>;

  /** Aborts the current upload */
  abort: (message?: string | undefined) => void;

  /** Alias for abort */
  cancel: (message?: string | undefined) => void;

  /** Alias for isAborted */
  isCanceled: Ref<boolean>;
}
export interface StrictUseUploadFileReturn<T> extends UseUploadFileReturn<T> {
  /** Manually call the uni.uploadFile */
  execute: (
    url?: string | UniApp.UploadFileOption,
    config?: UniApp.UploadFileOption,
  ) => PromiseLike<StrictUseUploadFileReturn<T>>;
}
export interface EasyUseUploadFileReturn<T> extends UseUploadFileReturn<T> {
  /** Manually call the uni.uploadFile */
  execute: (
    url: string,
    config?: UniApp.UploadFileOption,
  ) => PromiseLike<EasyUseUploadFileReturn<T>>;
}
export interface UseUploadFileOptions {
  /** Will automatically run uni.uploadFile when `useUploadFile` is used */
  immediate?: boolean;
  /**
   * Use shallowRef.
   *
   * @default true
   */
  shallow?: boolean;
}
type OverallUseUploadFileReturn<T> = StrictUseUploadFileReturn<T> | EasyUseUploadFileReturn<T>;

export function useUploadFile<T = any>(
  url: string,
  config?: UniApp.UploadFileOption,
  options?: UseUploadFileOptions,
): StrictUseUploadFileReturn<T> & PromiseLike<StrictUseUploadFileReturn<T>>;
export function useUploadFile<T = any>(
  config?: UniApp.UploadFileOption,
): EasyUseUploadFileReturn<T> & PromiseLike<EasyUseUploadFileReturn<T>>;

/** Wrapper for uni.uploadFile. */
export function useUploadFile<T = any>(
  ...args: any[]
): OverallUseUploadFileReturn<T> & PromiseLike<OverallUseUploadFileReturn<T>> {
  const url: string | undefined = typeof args[0] === 'string' ? args[0] : undefined;
  const argsPlaceholder = isString(url) ? 1 : 0;
  let defaultConfig: Partial<UniApp.UploadFileOption> = {};
  let options: UseUploadFileOptions = { immediate: !!argsPlaceholder, shallow: true };

  if (args.length > 0 + argsPlaceholder) {
    defaultConfig = args[0 + argsPlaceholder];
  }

  if (args.length === 3) {
    options = args[0 + argsPlaceholder];
  }

  const task = shallowRef<UniApp.UploadTask>();
  const response = shallowRef<UniApp.UploadFileSuccessCallbackResult>();
  const data = options.shallow ? shallowRef<T>() : ref<T>();
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
  const waitUntilFinished = () =>
    new Promise<OverallUseUploadFileReturn<T>>((resolve, reject) => {
      until(isFinished)
        .toBe(true)
        .then(() => resolve(result))
        .catch(reject);
    });
  const then: PromiseLike<OverallUseUploadFileReturn<T>>['then'] = (onFulfilled, onRejected) =>
    waitUntilFinished().then(onFulfilled, onRejected);
  const execute: OverallUseUploadFileReturn<T>['execute'] = (
    executeUrl: string | UniApp.UploadFileOption | undefined = url,
    config: Partial<UniApp.UploadFileOption> = {},
  ) => {
    const _url = typeof executeUrl === 'string' ? executeUrl : url ?? '';
    loading(true);
    const _config = {
      ...defaultConfig,
      ...config,
      url: _url,
    };
    task.value = uni.uploadFile({
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
  if (options.immediate && url) (execute as StrictUseUploadFileReturn<T>['execute'])();

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
    then,
  };
}
