import { defineComponent, reactive } from 'vue';
import { useNetwork } from '../useNetwork';

export function useOnline() {
  const { isOnline } = useNetwork();
  return isOnline;
}

export const UseOnline = defineComponent({
  name: 'UseOnline',
  setup(props, { slots }) {
    const data = reactive({
      isOnline: useOnline(),
    });

    return () => {
      if (slots.default) {
        return slots.default(data);
      }
    };
  },
});
