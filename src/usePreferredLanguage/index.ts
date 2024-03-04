import { tryOnScopeDispose } from '@vueuse/core';
import { readonly, ref } from 'vue';

/**
 * 响应式的语言偏好
 *
 * https://uniapp.dcloud.net.cn/api/ui/locale.html
 *
 * https://uniapp.dcloud.net.cn/tutorial/i18n
 */
export function usePreferredLanguage() {
  const locale = ref(uni.getLocale());

  const callback = (result: UniApp.OnLocaleChangeCallbackResult) => {
    locale.value = result.locale ?? locale.value;
  };
  uni.onLocaleChange(callback);
  const stop = () => {
    // @ts-expect-error no types
    if (uni.offLocaleChange) {
      // @ts-expect-error no types
      uni.offLocaleChange(callback);
    }
  };
  tryOnScopeDispose(stop);

  return readonly(locale);
}
