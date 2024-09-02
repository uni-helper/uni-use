import type { MaybeRef } from '../types';
import { onPageScroll } from '@dcloudio/uni-app';
import { resolveUnref, watchWithFilter } from '@vueuse/core';
import { computed, ref } from 'vue';

export interface UsePageScrollOptions {
  /**
   * 滚动到指定选择器
   *
   * @see https://uniapp.dcloud.net.cn/api/ui/scroll?id=pagescrollto
   */
  scrollToSelector?: MaybeRef<string>;
  /**
   * 滚动动画时长
   *
   * @default 300
   * @see https://uniapp.dcloud.net.cn/api/ui/scroll?id=pagescrollto
   */
  duration?: number;
}

/**
 * 页面滚动
 *
 * @param options 配置项
 * @see https://uniapp.dcloud.net.cn/tutorial/page.html#onpagescroll
 */
export function usePageScroll(options: UsePageScrollOptions = {}) {
  const { duration = 300, scrollToSelector } = options;

  const _scrollTop = ref(0);
  const scrollTop = computed({
    get() {
      return _scrollTop.value;
    },
    set(val) {
      uni.pageScrollTo({
        scrollTop: val,
        duration,
      });
    },
  });

  onPageScroll((e) => {
    _scrollTop.value = e.scrollTop;
  });

  /**
   * 回到顶部
   */
  function backTop() {
    _scrollTop.value = 0;
  }

  watchWithFilter(
    () => resolveUnref(scrollToSelector),
    (newValue) => {
      uni.pageScrollTo({
        selector: newValue,
        duration,
      });
    },
    {
      eventFilter: e => e !== undefined,
    },
  );

  return {
    scrollTop,
    scrollToSelector,
    backTop,
  };
}
