import { onPageScroll } from '@dcloudio/uni-app';
import { resolveUnref, watchWithFilter } from '@vueuse/core';
import { ref, computed, MaybeRef } from 'vue';

export interface UsePageScrollOptions {
  /**
   * 开启onPageScroll监听
   *
   * @default false
   * @see 因为 https://github.com/dcloudio/uni-app/issues/3099 所以默认值需要false，让页面被uniapp的正则捕获从而开启监听
   */
  onPageScroll?: boolean;

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
   */
  duration?: number;
}

/**
 * 页面滚动
 *
 * @param options 配置项
 * @see https://uniapp.dcloud.net.cn/tutorial/page.html#onpagescroll
 */
export default function usePageScroll(options: UsePageScrollOptions = {}) {
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

  options.onPageScroll &&
    onPageScroll((e) => {
      _scrollTop.value = e.scrollTop;
    });

  watchWithFilter(
    () => resolveUnref(scrollToSelector),
    (newValue) => {
      uni.pageScrollTo({
        selector: newValue,
        duration,
      });
    },
    {
      eventFilter: (e) => e !== undefined,
    },
  );

  return {
    scrollTop,
    scrollToSelector,
  };
}
