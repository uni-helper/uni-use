import { ref } from 'vue';

/** Get UNI_PLATFORM */
export function useUniPlatform() {
  const uniPlatform = ref<string>(
    // @ts-expect-error
    process.env.UNI_PLATFORM || import.meta.env.UNI_PLATFORM || 'h5',
  );
  return uniPlatform;
}
