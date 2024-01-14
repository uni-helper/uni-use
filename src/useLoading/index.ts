import { reactive } from 'vue';
import { type MaybeComputedRef, resolveUnref } from '@vueuse/core';

export interface UniShowLoadingOptions extends UniApp.ShowLoadingOptions {}
export type ShowLoadingOptions = MaybeComputedRef<UniShowLoadingOptions>;
export type UseLoadingOptions = ShowLoadingOptions;

/**
 * 隐藏加载提示框
 *
 * https://uniapp.dcloud.net.cn/api/ui/prompt.html#hideloading
 */
function hideLoading() {
  return uni.hideLoading();
}

/**
 * 返回一个对象，包含两个方法
 *
 * 其中`showLoading` 调用后显示加载提示框，`hideLoading` 调用后隐藏加载提示框
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
    return hideLoading;
  }

  return {
    showLoading,
    hideLoading,
  };
}
