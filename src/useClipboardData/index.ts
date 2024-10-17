import type { ConfigurableEventFilter, ConfigurableFlush } from '@vueuse/core';
import type { Ref } from 'vue';
import type { MaybeComputedRef } from '../types';
import { watchWithFilter } from '@vueuse/core';
import { ref } from 'vue';
import { useInterceptor } from '../useInterceptor';

function getClipboardData(showToast = true) {
  return new Promise<string>((resolve, reject) => {
    uni.getClipboardData({
      showToast,
      success: ({ data }) => resolve(data),
      fail: error => reject(error),
      complete: () => {
        if (!showToast) {
          uni.hideToast();
        }
      },
    });
    if (!showToast) {
      uni.hideToast();
    }
  });
}

function setClipboardData(data: string, showToast = true) {
  return new Promise<string>((resolve, reject) => {
    uni.setClipboardData({
      data,
      showToast,
      success: ({ data }) => resolve(data),
      fail: error => reject(error),
      complete: () => {
        if (!showToast) {
          uni.hideToast();
        }
      },
    });
    if (!showToast) {
      uni.hideToast();
    }
  });
}

export interface UseClipboardDataOptions extends ConfigurableEventFilter, ConfigurableFlush {
  /**
   * 操作剪切板数据后是否显示 toast
   *
   * @default true
   */
  showToast?: boolean;
  /**
   * 是否监听 setClipboardData 引起的剪切板变化
   *
   * @default true
   */
  listenToClipboardDataChanges?: boolean;
  /**
   * 错误回调
   *
   * 默认用 `console.error` 打印错误
   */
  onError?: (error: unknown) => void;
}

/**
 * 剪切板
 *
 * https://uniapp.dcloud.net.cn/api/system/clipboard.html
 */
export function useClipboardData(
  initialValue: MaybeComputedRef<string>,
  options: UseClipboardDataOptions = {},
) {
  const {
    showToast = true,
    listenToClipboardDataChanges = true,
    onError = error => console.error(error),
    flush = 'pre',
    eventFilter,
  } = options;

  const data = ref(initialValue) as Ref<string>;

  async function read() {
    try {
      data.value = await getClipboardData(showToast);
    }
    catch (error) {
      onError(error);
    }
  }

  read();

  if (listenToClipboardDataChanges) {
    useInterceptor('setClipboardData', { complete: () => setTimeout(() => read(), 0) });
  }

  watchWithFilter(
    data,
    async () => {
      try {
        await setClipboardData(data.value);
      }
      catch (error) {
        onError(error);
      }
    },
    { flush, eventFilter },
  );

  return data;
}
