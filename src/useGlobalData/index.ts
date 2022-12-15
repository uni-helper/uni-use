import { computed, reactive, defineComponent } from 'vue';
import { MaybeComputedRef, resolveUnref } from '@vueuse/core';
import { useApp } from '../useApp';

/** Get and set the globalData of the current application instance */
export function useGlobalData() {
  const app = useApp();

  const globalData = computed(() => app.value.globalData);

  function setGlobalData(nextGlobalData: MaybeComputedRef<Record<string, any> | undefined>): void;
  function setGlobalData(key: string, value: any): void;
  function setGlobalData(...args: any[]) {
    if (typeof args[0] === 'string') {
      const key = args[0];
      const value = args[1];
      app.value.globalData = reactive({ ...globalData.value, [key]: value });
      return;
    }
    const nextGlobalData = args[0];
    app.value.globalData = reactive({
      ...globalData.value,
      ...resolveUnref(nextGlobalData),
    });
  }

  return {
    globalData,
    setGlobalData,
  };
}

export const UseGlobalData = defineComponent({
  name: 'UseGlobalData',
  setup(props, { slots }) {
    const data = reactive(useGlobalData());

    return () => {
      if (slots.default) {
        return slots.default(data);
      }
    };
  },
});
