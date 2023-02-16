import { computed, ref } from 'vue';
import { type MaybeComputedRef, resolveUnref } from '@vueuse/core';

export type UseClipboardDataOptions = MaybeComputedRef<{
  initialValue?: string;
  showToast?: boolean;
}>;

/**
 * 剪切板
 *
 * https://uniapp.dcloud.net.cn/api/system/clipboard.html
 */
export function useClipboardData(options: UseClipboardDataOptions = {}) {
  const { initialValue } = resolveUnref(options);

  const tempClipboardData = ref('');
  function getClipboardData() {
    uni.getClipboardData({
      success: ({ data }) => {
        tempClipboardData.value = data;
      },
    });
  }
  function setClipboardData(value: string) {
    uni.setClipboardData({
      data: value,
      // 保证与保存的内容一致
      success: () => getClipboardData(),
    });
  }

  const clipboardData = computed({
    get() {
      return tempClipboardData.value;
    },
    set(value) {
      setClipboardData(value);
    },
  });

  // 如果没有传入初始值，直接获取当前剪切板内容
  // 否则设置初始值并更新剪切板内容
  if (initialValue === undefined) {
    getClipboardData();
  } else {
    setClipboardData(initialValue);
  }

  return clipboardData;
}
