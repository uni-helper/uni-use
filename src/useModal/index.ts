import { reactive } from 'vue';
import { MaybeComputedRef, resolveUnref } from '@vueuse/core';

export interface UniShowModalOptions extends UniApp.ShowModalOptions {}
export type ShowModalOptions = MaybeComputedRef<UniShowModalOptions>;

export function useModal(options?: ShowModalOptions) {
  const showModal = (newOptions?: ShowModalOptions) => {
    uni.showModal(
      reactive({
        ...resolveUnref(options),
        ...resolveUnref(newOptions),
      }),
    );
  };
  return showModal;
}
