import { computed } from 'vue';
import { MaybeComputedRef, resolveUnref } from '@vueuse/core';

/**
 * Get api is supported
 */
export function useSupported(api: MaybeComputedRef<string>) {
  const isSupported = computed(() => uni.canIUse(resolveUnref(api)));

  return isSupported;
}
