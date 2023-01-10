import { MaybeComputedRef, resolveUnref } from '@vueuse/core';
import { ref, reactive } from 'vue';
import { useInterceptor } from '../useInterceptor';

export interface UniSetClipboardDataOptions extends UniApp.SetClipboardDataOptions {}
export type SetUniClipboardDataOptions = MaybeComputedRef<UniSetClipboardDataOptions>;

/** Get and set clipboard data */
export function useClipboardData(onError = (e: unknown) => console.error(e)) {
  const clipboardData = ref<string>();
  let data = '';

  uni.getClipboardData({
    success: (result) => {
      clipboardData.value = result.data;
      data = result.data;
    },
    fail: (e) => {
      onError?.(e);
    },
  });

  useInterceptor('setClipboardData', {
    invoke: (args: UniApp.SetClipboardDataOptions) => {
      data = args.data;
    },
    success: () => {
      clipboardData.value = data;
    },
  });

  const setClipboardData = (options: SetUniClipboardDataOptions) =>
    uni.setClipboardData(reactive(resolveUnref(options)));

  return {
    clipboardData,
    setClipboardData,
  };
}
