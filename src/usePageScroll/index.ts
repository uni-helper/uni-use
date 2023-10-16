import { onPageScroll } from '@dcloudio/uni-app';
import { ref, computed } from 'vue';

export interface UsePageScrollOptions {
  /**
   * 开启onPageScroll监听
   *
   * @default false
   * @see 因为 https://github.com/dcloudio/uni-app/issues/3099 所以默认值需要false，让页面被uniapp的正则捕获从而开启监听
   */
  onPageScroll?: boolean;
}

/**
 * 页面滚动
 *
 * @param options 配置项
 * @see https://uniapp.dcloud.net.cn/tutorial/page.html#onpagescroll
 */
export default function usePageScroll(options: UsePageScrollOptions = {}) {
  const _scrollTop = ref(0);
  const scrollTop = computed({
    get() {
      return _scrollTop.value;
    },
    set(val) {
      uni.pageScrollTo({ scrollTop: val });
    },
  });

  options.onPageScroll &&
    onPageScroll((e) => {
      _scrollTop.value = e.scrollTop;
    });

  return {
    scrollTop,
  };
}
