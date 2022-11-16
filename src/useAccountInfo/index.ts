import { defineComponent, reactive } from 'vue';

export function useAccountInfo() {
  const accountInfo = uni.getAccountInfoSync();
  return accountInfo;
}

export const UseAccountInfo = defineComponent({
  name: 'UseAccountInfo',
  setup(props, { slots }) {
    const data = reactive(useAccountInfo());

    return () => {
      if (slots.default) {
        return slots.default(data);
      }
    };
  },
});
