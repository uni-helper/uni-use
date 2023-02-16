import { Ref, ShallowRef, ref, shallowRef } from 'vue';
import { isString, until } from '@vueuse/core';

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

export interface UseUploadFileOptions {
  /** 是否自动开始上传 */
  immediate?: boolean;
  /**
   * 是否使用 shallowRef
   *
   * @default true
   */
  shallow?: boolean;
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
