import { defineComponent, reactive } from 'vue';

export function useSystemInfo() {
  const systemInfo = uni.getSystemInfoSync();
  return systemInfo;
}

export const UseSystemInfo = defineComponent({
  name: 'UseSystemInfo',
  setup(props, { slots }) {
    const data = reactive(useSystemInfo());

    return () => {
      if (slots.default) {
        return slots.default(data);
      }
    };
  },
});
