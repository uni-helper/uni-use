import { Ref, ShallowRef, ref, shallowRef } from 'vue';
import { until } from '@vueuse/core';
import { isString } from '../utils';

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

export interface UseDownloadFileOptions {
  /** 是否自动开始下载 */
  immediate?: boolean;
  /**
   * 是否使用 shallowRef
   *
   * @default true
   */
  shallow?: boolean;
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
          // @ts-expect-error no types
          r?.data ??
          ({
            tempFilePath: r?.tempFilePath,
          } as unknown as T);
        _config.success?.(r);
      },
      fail: (e) => {
        error.value = e;
        _config.fail?.(e);
      },
      complete: (r) => {
        loading(false);
        _config.complete?.(r);
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
