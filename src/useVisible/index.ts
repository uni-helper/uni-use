import { ref } from 'vue';
import { tryOnHide } from '../tryOnHide';
import { tryOnShow } from '../tryOnShow';

/** 获取当前页面是否可见 */
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
