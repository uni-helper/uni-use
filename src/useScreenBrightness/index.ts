import { MaybeComputedRef, resolveUnref } from '@vueuse/core';
import { ref, reactive, defineComponent } from 'vue';
import { useInterceptor } from '../useInterceptor';

export interface UniSetScreenBrightnessOptions extends UniApp.SetScreenBrightnessOptions {}
export type SetScreenBrightnessOptions = MaybeComputedRef<UniSetScreenBrightnessOptions>;

/**
 * Get and set screen brightness
 */
export function useScreenBrightness(onError = (e: unknown) => console.error(e)) {
  const screenBrightness = ref<number>();
  let value = screenBrightness.value;

  uni.getScreenBrightness({
    success: (result) => {
      screenBrightness.value = result.value;
      value = result.value;
    },
    fail: (e) => {
      onError?.(e);
    },
  });

  useInterceptor('setScreenBrightness', {
    invoke: (args: UniApp.SetScreenBrightnessOptions) => {
      value = args.value;
    },
    success: () => {
      screenBrightness.value = value;
    },
  });

  const setScreenBrightness = (options?: SetScreenBrightnessOptions) =>
    uni.setScreenBrightness(reactive({ value: value ?? 50, ...resolveUnref(options) }));

  return {
    screenBrightness,
    brightness: screenBrightness,
    setScreenBrightness,
    setBrightness: setScreenBrightness,
  };
}

export const UseScreenBrightness = defineComponent({
  name: 'UseScreenBrightness',
  setup(props, { slots }) {
    const data = reactive(useScreenBrightness());

    return () => {
      if (slots.default) {
        return slots.default(data);
      }
    };
  },
});
