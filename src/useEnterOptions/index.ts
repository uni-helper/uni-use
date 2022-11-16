import { ref } from 'vue';

export function useEnterOptions() {
  const options = ref(uni.getEnterOptionsSync());
  return options;
}
