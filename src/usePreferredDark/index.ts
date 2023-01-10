import { ref, readonly } from 'vue';
import { tryOnScopeDispose } from '@vueuse/core';

/** Reactive dark theme preference. */
export function usePreferredDark() {
  const prefersDark = ref(uni.getSystemInfoSync().osTheme === 'dark');

  const updatePrefersDark = (result: UniApp.OnThemeChangeCallbackResult) => {
    prefersDark.value = result.theme === 'dark';
  };

  const callback = (result: UniApp.OnThemeChangeCallbackResult) => {
    updatePrefersDark(result);
  };

  uni.onThemeChange(callback);

  const stop = () => {
    uni.offThemeChange(callback);
  };

  tryOnScopeDispose(stop);

  return readonly(prefersDark);
}
