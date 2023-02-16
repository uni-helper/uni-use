import { reactive } from 'vue';
import { type MaybeComputedRef, resolveUnref } from '@vueuse/core';

export interface UniShowActionSheetOptions extends Omit<UniApp.ShowActionSheetOptions, 'itemList'> {
  /** 文字数组 */
  itemList: string[];
}
export type ShowActionSheetOptions = MaybeComputedRef<UniShowActionSheetOptions>;
export type UseActionSheetOptions = ShowActionSheetOptions;

/**
 * 返回一个方法，调用后从底部向上弹出操作菜单
 *
 * https://uniapp.dcloud.net.cn/api/ui/prompt.html#showactionsheet
 */
export function useActionSheet(options?: UseActionSheetOptions) {
  /**
   * 从底部向上弹出操作菜单
   *
   * https://uniapp.dcloud.net.cn/api/ui/prompt.html#showactionsheet
   */
  return function showActionSheet(newOptions?: ShowActionSheetOptions) {
    return uni.showActionSheet(
      reactive({
        itemList: [],
        ...resolveUnref(options),
        ...resolveUnref(newOptions),
      }),
    );
  };
}
