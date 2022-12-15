import { Ref, ShallowRef, ref, shallowRef } from 'vue';
import { isString, until } from '@vueuse/core';

export interface UseDownloadFileReturn<T> {
  task: ShallowRef<UniApp.DownloadTask | undefined>;

  /** Response for uni.downloadFile */
  response: ShallowRef<UniApp.DownloadSuccessData | undefined>;

  /** Response data for uni.downloadFile */
  data: Ref<T | undefined>;

  /** Indicates if the download has finished */
  isFinished: Ref<boolean>;

  /** Indicates if the download is currently loading */
  isLoading: Ref<boolean>;

  /** Indicates if the download was aborted */
  isAborted: Ref<boolean>;

  /** Any errors that may have occurred */
  error: ShallowRef<UniApp.GeneralCallbackResult | undefined>;

  /** Aborts the current download */
  abort: (message?: string | undefined) => void;

  /** Alias for abort */
  cancel: (message?: string | undefined) => void;

  /** Alias for isAborted */
  isCanceled: Ref<boolean>;
}
export interface StrictUseDownloadFileReturn<T> extends UseDownloadFileReturn<T> {
  /** Manually call the uni.downloadFile */
  execute: (
    url?: string | UniApp.DownloadFileOption,
    config?: UniApp.DownloadFileOption,
  ) => PromiseLike<StrictUseDownloadFileReturn<T>>;
}
export interface EasyUseDownloadFileReturn<T> extends UseDownloadFileReturn<T> {
  /** Manually call the uni.downloadFile */
  execute: (
    url: string,
    config?: UniApp.DownloadFileOption,
  ) => PromiseLike<EasyUseDownloadFileReturn<T>>;
}
export interface UseDownloadFileOptions {
  /** Will automatically run uni.downloadFile when `useDownloadFile` is used */
  immediate?: boolean;
  /**
   * Use shallowRef.
   *
   * @default true
   */
  shallow?: boolean;
}
type OverallUseDownloadFileReturn<T> =
  | StrictUseDownloadFileReturn<T>
  | EasyUseDownloadFileReturn<T>;

export function useDownloadFile<T = any>(
  url: string,
  config?: UniApp.DownloadFileOption,
  options?: UseDownloadFileOptions,
): StrictUseDownloadFileReturn<T> & PromiseLike<StrictUseDownloadFileReturn<T>>;
export function useDownloadFile<T = any>(
  config?: UniApp.DownloadFileOption,
): EasyUseDownloadFileReturn<T> & PromiseLike<EasyUseDownloadFileReturn<T>>;

/** Wrapper for uni.downloadFile. */
export function useDownloadFile<T = any>(
  ...args: any[]
): OverallUseDownloadFileReturn<T> & PromiseLike<OverallUseDownloadFileReturn<T>> {
  const url: string | undefined = typeof args[0] === 'string' ? args[0] : undefined;
  const argsPlaceholder = isString(url) ? 1 : 0;
  let defaultConfig: Partial<UniApp.DownloadFileOption> = {};
  let options: UseDownloadFileOptions = { immediate: !!argsPlaceholder, shallow: true };

  if (args.length > 0 + argsPlaceholder) {
    defaultConfig = args[0 + argsPlaceholder];
  }

  if (args.length === 3) {
    options = args[0 + argsPlaceholder];
  }

  const task = shallowRef<UniApp.DownloadTask>();
  const response = shallowRef<UniApp.DownloadSuccessData>();
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
    new Promise<OverallUseDownloadFileReturn<T>>((resolve, reject) => {
      until(isFinished)
        .toBe(true)
        .then(() => resolve(result))
        .catch(reject);
    });
  const then: PromiseLike<OverallUseDownloadFileReturn<T>>['then'] = (onFulfilled, onRejected) =>
    waitUntilFinished().then(onFulfilled, onRejected);
  const execute: OverallUseDownloadFileReturn<T>['execute'] = (
    executeUrl: string | UniApp.DownloadFileOption | undefined = url,
    config: Partial<UniApp.DownloadFileOption> = {},
  ) => {
    const _url = typeof executeUrl === 'string' ? executeUrl : url ?? '';
    loading(true);
    const _config = {
      ...defaultConfig,
      ...config,
      url: _url,
    };
    task.value = uni.downloadFile({
      ..._config,
      success: (r) => {
        response.value = r;
        data.value =
          // @ts-expect-error
          r?.data ??
          ({
            tempFilePath: r?.tempFilePath,
          } as unknown as T);
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
  if (options.immediate && url) (execute as StrictUseDownloadFileReturn<T>['execute'])();

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

  return {
    ...result,
    then,
  };
}
