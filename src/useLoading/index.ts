import { reactive } from 'vue';
import { type MaybeComputedRef, resolveUnref } from '@vueuse/core';

export interface UniShowLoadingOptions extends UniApp.ShowLoadingOptions {}
export type ShowLoadingOptions = MaybeComputedRef<UniShowLoadingOptions>;
export type UseLoadingOptions = ShowLoadingOptions;

/**
 * 返回一个方法，调用后显示 loading 提示框
 *
 * https://uniapp.dcloud.net.cn/api/ui/prompt.html#showloading
 */
export function useLoading(options?: UseLoadingOptions) {
  /**
   * 显示 loading 提示框
   *
   * 返回一个方法，调用后隐藏 loading 提示框
   *
   * https://uniapp.dcloud.net.cn/api/ui/prompt.html#showloading
   *
   * https://uniapp.dcloud.net.cn/api/ui/prompt.html#hideloading
   */
  return function showLoading(newOptions?: ShowLoadingOptions) {
    uni.showLoading(
      reactive({
        ...resolveUnref(options),
        ...resolveUnref(newOptions),
      }),
    );
    /**
     * 隐藏 loading 提示框
     *
     * https://uniapp.dcloud.net.cn/api/ui/prompt.html#hideloading
     */
    return function hideLoading() {
      return uni.hideLoading();
    };
  };
}
