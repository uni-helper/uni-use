import { ref } from 'vue';
import { tryOnShow } from '../tryOnShow';
import { tryOnHide } from '../tryOnHide';

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
