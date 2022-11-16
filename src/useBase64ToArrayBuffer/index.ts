import { computed } from 'vue';
import { MaybeComputedRef, resolveUnref } from '@vueuse/core';

/**
 * Get base64 corresponding ArrayBuffer
 */
export function useBase64ToArrayBuffer(base64: MaybeComputedRef<string>) {
  const arrayBuffer = computed(() => uni.base64ToArrayBuffer(resolveUnref(base64)));

  return arrayBuffer;
}
