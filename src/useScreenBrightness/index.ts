import { computed, ref } from 'vue';
import { MaybeComputedRef, resolveUnref } from '@vueuse/core';

export type UseScreenBrightnessOptions = MaybeComputedRef<{ initialValue?: number }>;

/**
 * 屏幕亮度
 *
 * https://uniapp.dcloud.net.cn/api/system/brightness.html
 */
export function useScreenBrightness(options: UseScreenBrightnessOptions = {}) {
  const { initialValue } = resolveUnref(options);

  const tempScreenBrightness = ref(50);
  function getScreenBrightness() {
    uni.getScreenBrightness({
      success: ({ value }) => {
        tempScreenBrightness.value = value;
      },
    });
  }
  function setScreenBrightness(value: number) {
    // 设置可以传入一个非法值，设置后重新获取可以确保值合法
    uni.setScreenBrightness({
      value,
      success: () => getScreenBrightness(),
    });
  }

  const screenBrightness = computed({
    get() {
      return tempScreenBrightness.value;
    },
    set(value) {
      setScreenBrightness(value);
    },
  });

  // 如果没有传入初始值，直接获取当前屏幕亮度
  // 否则设置初始值并更新屏幕亮度
  if (initialValue === undefined) {
    getScreenBrightness();
  } else {
    setScreenBrightness(initialValue);
  }

  return screenBrightness;
}
