import { reactive } from 'vue';
import { resolveUnref } from '@vueuse/core';
import type { MaybeComputedRef } from '../types';

export interface UniShowModalOptions extends UniApp.ShowModalOptions {}
export type ShowModalOptions = MaybeComputedRef<UniShowModalOptions>;
export type UseModalOptions = ShowModalOptions;

/**
 * 返回一个方法，调用后显示模态弹窗
 *
 * https://uniapp.dcloud.net.cn/api/ui/prompt?id=showmodal
 */
export function useModal(options?: UseModalOptions) {
  /**
   * 显示模态弹窗
   *
   * https://uniapp.dcloud.net.cn/api/ui/prompt?id=showmodal
   */
  return function showModal(newOptions?: ShowModalOptions) {
    return uni.showModal(
      reactive({
        ...resolveUnref(options),
        ...resolveUnref(newOptions),
      }),
    );
  };
}
