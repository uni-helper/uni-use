import { reactive } from 'vue';
import { MaybeComputedRef, resolveUnref } from '@vueuse/core';

export interface UniShowLoadingOptions extends UniApp.ShowLoadingOptions {}
export type ShowLoadingOptions = MaybeComputedRef<UniShowLoadingOptions>;

export function useLoading(options?: ShowLoadingOptions) {
  const showLoading = (newOptions?: ShowLoadingOptions) => {
    uni.showLoading(
      reactive({
        ...resolveUnref(options),
        ...resolveUnref(newOptions),
      }),
    );
  };

  const hideLoading = () => uni.hideLoading();

  return { showLoading, hideLoading };
}
