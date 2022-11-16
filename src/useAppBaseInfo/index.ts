import { defineComponent, reactive } from 'vue';

export function useAppBaseInfo() {
  const appBaseInfo = uni.getAppBaseInfo();
  return appBaseInfo;
}

export const UseAppBaseInfo = defineComponent({
  name: 'UseAppBaseInfo',
  setup(props, { slots }) {
    const data = reactive(useAppBaseInfo());

    return () => {
      if (slots.default) {
        return slots.default(data);
      }
    };
  },
});
