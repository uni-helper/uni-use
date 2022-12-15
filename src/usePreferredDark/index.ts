import { ref, readonly, defineComponent, reactive } from 'vue';
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
    // TODO: remove in @dcloudio/types v3.2
    // @ts-expect-error
    uni.offThemeChange(callback);
  };

  tryOnScopeDispose(stop);

  return readonly(prefersDark);
}

export const UsePreferredDark = defineComponent({
  name: 'UsePreferredDark',
  setup(props, { slots }) {
    const data = reactive({
      prefersDark: usePreferredDark(),
    });

    return () => {
      if (slots.default) {
        return slots.default(data);
      }
    };
  },
});
