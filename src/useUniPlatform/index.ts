import { ref, defineComponent, reactive } from 'vue';

/**
 * Get UNI_PLATFORM
 */
export function useUniPlatform() {
  const uniPlatform = ref<string>(
    // @ts-expect-error
    process.env.UNI_PLATFORM ?? import.meta.env.UNI_PLATFORM ?? 'h5',
  );
  return uniPlatform;
}

export const UseUniPlatform = defineComponent({
  name: 'UseUniPlatform',
  setup(props, { slots }) {
    const data = reactive({
      uniPlatform: useUniPlatform(),
    });

    return () => {
      if (slots.default) {
        return slots.default(data);
      }
    };
  },
});
