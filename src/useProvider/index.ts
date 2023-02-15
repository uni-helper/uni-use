import { MaybeComputedRef, resolveUnref } from '@vueuse/core';
import { reactive } from 'vue';

export interface UniGetProviderOptions extends UniApp.GetProviderOptions {}
export type GetProviderOptions = MaybeComputedRef<UniGetProviderOptions>;
export type UseProviderOptions = GetProviderOptions;

/**
 * 返回一个方法，调用后获取服务供应商
 *
 * https://uniapp.dcloud.net.cn/api/plugins/provider?id=getprovider
 */
export function useProvider(options?: UseProviderOptions) {
  return function getProvider(newOptions?: GetProviderOptions) {
    return uni.getProvider(
      reactive({
        service: 'oauth',
        ...resolveUnref(options),
        ...resolveUnref(newOptions),
      }),
    );
  };
}
