import { tryOnScopeDispose } from '@vueuse/core';
import { ref, readonly, defineComponent, reactive } from 'vue';

/**
 * Reactive current Language
 */
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

export const UsePreferredLanguage = defineComponent({
  name: 'UsePreferredLanguage',
  setup(props, { slots }) {
    const data = reactive({
      language: usePreferredLanguage(),
    });

    return () => {
      if (slots.default) {
        return slots.default(data);
      }
    };
  },
});
