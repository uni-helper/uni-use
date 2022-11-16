import { computed } from 'vue';
import { MaybeComputedRef, resolveUnref } from '@vueuse/core';

/**
 * Get ArrayBuffer corresponding base64
 */
export function useArrayBufferToBase64(arrayBuffer: MaybeComputedRef<ArrayBuffer>) {
  const base64 = computed(() => uni.arrayBufferToBase64(resolveUnref(arrayBuffer)));

  return base64;
}
