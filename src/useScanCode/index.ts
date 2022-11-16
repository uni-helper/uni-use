import { reactive } from 'vue';
import { MaybeComputedRef, resolveUnref } from '@vueuse/core';

export interface UniScanCodeOptions extends UniApp.ScanCodeOptions {}
export type ScanCodeOptions = MaybeComputedRef<UniScanCodeOptions>;

export function useScanCode(options?: ScanCodeOptions) {
  const scan = (newOptions?: ScanCodeOptions) => {
    uni.scanCode(
      reactive({
        ...resolveUnref(options),
        ...resolveUnref(newOptions),
      }),
    );
  };

  return scan;
}
