import { ref } from 'vue';
import type { Ref } from 'vue';
import { watchWithFilter } from '@vueuse/core';
import type { MaybeComputedRef, ConfigurableEventFilter, ConfigurableFlush } from '@vueuse/core';
import { useInterceptor } from 'src/useInterceptor';

export function getScreenBrightness() {
  return new Promise<number>((resolve, reject) => {
    uni.getScreenBrightness({
      success: ({ value }) => resolve(value),
      fail: (error) => reject(error),
    });
  });
}

export function setScreenBrightness(value: number) {
  return new Promise<void>((resolve, reject) => {
    uni.setScreenBrightness({
      value,
      success: () => resolve(),
      fail: (error) => reject(error),
    });
  });
}

export interface UseScreenBrightnessOptions extends ConfigurableEventFilter, ConfigurableFlush {
  /**
   * 是否监听 setScreenBrightness 引起的屏幕亮度变化
   *
   * @default true
   */
  listenToScreenBrightnessChanges?: boolean;
  /**
   * 错误回调
   *
   * 默认用 `console.error` 打印错误
   */
  onError?: (error: unknown) => void;
}

/**
 * 屏幕亮度
 *
 * https://uniapp.dcloud.net.cn/api/system/brightness.html
 */
export function useScreenBrightness(
  initialValue: MaybeComputedRef<number>,
  options: UseScreenBrightnessOptions = {},
) {
  const {
    listenToScreenBrightnessChanges = true,
    onError = (error) => console.error(error),
    flush = 'pre',
    eventFilter,
  } = options;

  const data = ref(initialValue) as Ref<number>;

  async function read() {
    try {
      data.value = await getScreenBrightness();
    } catch (error) {
      onError(error);
    }
  }

  read();

  if (listenToScreenBrightnessChanges) {
    useInterceptor('setScreenBrightness', { complete: () => setTimeout(() => read(), 0) });
  }

  watchWithFilter(
    data,
    async () => {
      try {
        await setScreenBrightness(data.value);
      } catch (error) {
        onError(error);
      }
    },
    { flush, eventFilter },
  );

  return data;
}
