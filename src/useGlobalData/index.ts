import { computed, ref } from 'vue';
import { type MaybeComputedRef, resolveUnref } from '@vueuse/core';
import type { AnyRecord } from '../types';

export type UseGlobalDataOptions<T extends AnyRecord> = MaybeComputedRef<{
  initialValue?: T;
}>;

/**
 * globalData
 *
 * https://uniapp.dcloud.net.cn/collocation/App.html#globaldata
 */
export function useGlobalData<T extends AnyRecord>(options: UseGlobalDataOptions<T> = {}) {
  const { initialValue = {} } = resolveUnref(options);

  const app = ref(getApp());
  const globalData = computed({
    get() {
      return app.value.globalData ?? {};
    },
    set(newValue) {
      app.value.globalData = newValue;
    },
  });

  globalData.value = initialValue;

  return globalData;
}
