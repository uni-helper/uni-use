import { reactive } from 'vue';
import { MaybeComputedRef, resolveUnref } from '@vueuse/core';

export interface UniShowToastOptions extends UniApp.ShowToastOptions {}
export type ShowToastOptions = MaybeComputedRef<UniShowToastOptions>;

export function useToast(options?: ShowToastOptions) {
  const showToast = (newOptions?: ShowToastOptions) => {
    uni.showToast(
      reactive({
        ...resolveUnref(options),
        ...resolveUnref(newOptions),
      }),
    );
  };
  const hideToast = () => uni.hideToast();
  return { showToast, hideToast };
}
