import { reactive } from 'vue';
import { type MaybeComputedRef, resolveUnref } from '@vueuse/core';

export interface UniShowLoadingOptions extends UniApp.ShowLoadingOptions {}
export type ShowLoadingOptions = MaybeComputedRef<UniShowLoadingOptions>;
export type UseLoadingOptions = ShowLoadingOptions;

/**
 * 返回两个个方法，`showLoading`调用后显示加载提示框，`hideLoading`调用后隐藏加载提示框
 *
 * https://uniapp.dcloud.net.cn/api/ui/prompt.html#showloading
 */
export function useLoading(options?: UseLoadingOptions) {
  /**
   * 显示加载提示框
   *
   * https://uniapp.dcloud.net.cn/api/ui/prompt.html#showloading
   */
  function showLoading(newOptions?: ShowLoadingOptions) {
    uni.showLoading(
      reactive({
        ...resolveUnref(options),
        ...resolveUnref(newOptions),
      }),
    );
  };

  /**
   * 隐藏加载提示框
   *
   * https://uniapp.dcloud.net.cn/api/ui/prompt.html#hideloading
   */
  function hideLoading() {
    return uni.hideLoading();
  };

  return {
    showLoading,
    hideLoading,
  }
}
