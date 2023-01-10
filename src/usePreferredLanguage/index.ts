import { tryOnScopeDispose } from '@vueuse/core';
import { ref, readonly } from 'vue';

/** Reactive current Language */
export function usePreferredLanguage() {
  const locale = ref(uni.getLocale());

  const updateLocale = (result: UniApp.OnLocaleChangeCallbackResult) => {
    locale.value = result?.locale ?? locale.value;
  };

  const callback = (result: UniApp.OnLocaleChangeCallbackResult) => {
    updateLocale(result);
  };

  uni.onLocaleChange(callback);

  const stop = () => {
    // @ts-expect-error
    uni.offLocaleChange(callback);
  };

  tryOnScopeDispose(stop);

  return readonly(locale);
}
