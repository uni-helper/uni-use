import { tryOnScopeDispose, Fn } from '@vueuse/core';

/** Register using addInterceptor on mounted, and removeInterceptor automatically on unmounted. */
export function useInterceptor(event: string, options: UniApp.InterceptorOptions): Fn {
  uni.addInterceptor(event, options);

  const stop = () => {
    uni.removeInterceptor(event);
  };

  tryOnScopeDispose(stop);

  return stop;
}
