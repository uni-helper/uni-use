import { ref } from 'vue';
import { tryOnShow } from '../tryOnShow';
import { tryOnHide } from '../tryOnHide';

/** Get if the page is shown or hidden */
export function useVisible() {
  const isVisible = ref(true);

  tryOnShow(() => {
    isVisible.value = true;
  });

  tryOnHide(() => {
    isVisible.value = false;
  });

  return isVisible;
}
