import { defineComponent, reactive } from 'vue';

export function useWindowInfo() {
  const windowInfo = uni.getWindowInfo();
  return windowInfo;
}

export const UseWindowInfo = defineComponent({
  name: 'UseWindowInfo',
  setup(props, { slots }) {
    const data = reactive(useWindowInfo());

    return () => {
      if (slots.default) {
        return slots.default(data);
      }
    };
  },
});
