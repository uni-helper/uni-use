import { MaybeComputedRef, resolveUnref } from '@vueuse/core';
import { reactive } from 'vue';

export interface UniGetProviderOptions extends UniApp.GetProviderOptions {}
export type GetProviderOptions = MaybeComputedRef<UniGetProviderOptions>;

export function useProvider(options?: GetProviderOptions) {
  const getProvider = (newOptions?: GetProviderOptions) => {
    uni.getProvider(
      reactive({
        service: 'oauth',
        ...resolveUnref(options),
        ...resolveUnref(newOptions),
      }),
    );
  };
  return getProvider;
}
