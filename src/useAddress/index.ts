import { reactive } from 'vue';
import { MaybeComputedRef, resolveUnref } from '@vueuse/core';

export interface UniChooseAddressOptions extends UniApp.ChooseAddressOptions {}
export type ChooseAddressOptions = MaybeComputedRef<UniChooseAddressOptions>;

export function useAddress() {
  const chooseAddress = (options?: ChooseAddressOptions) =>
    uni.chooseAddress(reactive({ ...resolveUnref(options) }));

  return {
    chooseAddress,
    choose: chooseAddress,
  };
}
