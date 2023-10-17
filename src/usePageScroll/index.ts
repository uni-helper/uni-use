import { onPageScroll } from '@dcloudio/uni-app';
import { resolveUnref, watchWithFilter } from '@vueuse/core';
import { ref, computed, MaybeRef } from 'vue';

export interface UsePageScrollOptions {
  /**
   * 是否开启 onPageScroll 监听，默认为 false
   *
   * @default false
   * @see https://github.com/dcloudio/uni-app/issues/3099 让页面被正则捕获从而开启监听
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
