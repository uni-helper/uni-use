import type { MaybeComputedRef } from '../types';
import { resolveUnref } from '@vueuse/core';

export interface UniShowToastOptions extends UniApp.ShowToastOptions {}
export type ShowToastOptions = MaybeComputedRef<UniShowToastOptions>;
export type UseToastOptions = ShowToastOptions;

/**
 * 返回一个方法，调用后显示消息提示框
 *
 * https://uniapp.dcloud.net.cn/api/ui/prompt.html#showtoast
 */
export function useToast(options?: UseToastOptions) {
  /**
   * 显示消息提示框
   *
   * 返回一个方法，调用后隐藏消息提示框
   *
   * https://uniapp.dcloud.net.cn/api/ui/prompt.html#showtoast
   *
   * https://uniapp.dcloud.net.cn/api/ui/prompt.html#hidetoast
   */
  return function showToast(newOptions?: ShowToastOptions) {
    uni.showToast(
      {
        ...resolveUnref(options),
        ...resolveUnref(newOptions),
      },
    );
    /**
     * 隐藏消息提示框
     *
     * https://uniapp.dcloud.net.cn/api/ui/prompt.html#hidetoast
     */
    return function hideToast() {
      return uni.hideToast();
    };
  };
}
