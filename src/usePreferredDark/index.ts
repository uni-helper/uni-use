import { readonly, ref } from 'vue';
import { tryOnScopeDispose } from '@vueuse/core';

/**
 * 响应式的暗黑主题偏好
 *
 * https://zh.uniapp.dcloud.io/api/system/theme.html
 *
 * https://uniapp.dcloud.net.cn/tutorial/darkmode.html
 */
export function usePreferredDark() {
  const prefersDark = ref(uni.getSystemInfoSync().osTheme === 'dark');

  const callback = ({ theme }: UniApp.OnThemeChangeCallbackResult) => {
    prefersDark.value = theme === 'dark';
  };
  uni.onThemeChange(callback);
  const stop = () => uni.offThemeChange(callback);
  tryOnScopeDispose(stop);

  return readonly(prefersDark);
}
