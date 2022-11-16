import { tryOnMounted } from '@vueuse/core';

export function useSelectorQuery() {
  let query: UniApp.SelectorQuery | undefined;
  tryOnMounted(() => {
    query = uni.createSelectorQuery();
  });
  return query;
}
