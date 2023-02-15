import { tryOnScopeDispose } from '@vueuse/core';

/**
 * 注册拦截器，在活跃的 effect 作用域停止时自动移除
 *
 * https://cn.vuejs.org/api/reactivity-advanced.html#effectscope
 */
export function useInterceptor(event: string, options: UniApp.InterceptorOptions) {
  uni.addInterceptor(event, options);

  const stop = () => uni.removeInterceptor(event);
  tryOnScopeDispose(stop);

  return stop;
}
