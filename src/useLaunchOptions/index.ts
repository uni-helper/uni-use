import { ref } from 'vue';

export function useLaunchOptions() {
  const options = ref(uni.getLaunchOptionsSync());
  return options;
}
