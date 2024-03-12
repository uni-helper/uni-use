import type { MaybeComputedRef } from '../types';
import { resolveUnref } from '@vueuse/core';
import { reactive } from 'vue';

export interface UniScanCodeOptions extends UniApp.ScanCodeOptions {}
export type ScanCodeOptions = MaybeComputedRef<UniScanCodeOptions>;
export type UseScanCodeOptions = ScanCodeOptions;

/**
 * 返回一个方法，调用后调起客户端扫码界面
 *
 * https://uniapp.dcloud.net.cn/api/system/barcode?id=scancode
 */
export function useScanCode(options?: UseScanCodeOptions) {
  /**
   * 调起客户端扫码界面
   *
   * https://uniapp.dcloud.net.cn/api/system/barcode?id=scancode
   */
  return function scanCode(newOptions?: ScanCodeOptions) {
    return uni.scanCode(
      reactive({
        ...resolveUnref(options),
        ...resolveUnref(newOptions),
      }),
    );
  };
}
