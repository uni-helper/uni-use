import { defineComponent, reactive } from 'vue';

export function useDeviceInfo() {
  const deviceInfo = uni.getDeviceInfo();
  return deviceInfo;
}

export const UseDeviceInfo = defineComponent({
  name: 'UseDeviceInfo',
  setup(props, { slots }) {
    const data = reactive(useDeviceInfo());

    return () => {
      if (slots.default) {
        return slots.default(data);
      }
    };
  },
});
