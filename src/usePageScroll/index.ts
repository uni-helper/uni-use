import type { MaybeRef } from '../types';
import { onPageScroll } from '@dcloudio/uni-app';
import { pausableWatch } from '@vueuse/core';
import { computed, isRef, ref } from 'vue';

export interface UsePageScrollOptions {
  /**
   * 此选项不可缺！
   * uniapp 必须在页面内检测到 onPageScroll 关键词才会注册事件。
   * @see https://github.com/dcloudio/uni-app/issues/3099 让页面被正则捕获从而开启监听
   */
  onPageScroll: any;
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
export function usePageScroll(options: UsePageScrollOptions) {
  const { duration = 300 } = options;

  const _top = ref(0);
  const top = computed({
    get: () => _top.value,
    set: val => toTop(val),
  });

  onPageScroll((e) => {
    _top.value = e.scrollTop;
  });

  const selector = isRef(options?.scrollToSelector)
    ? options.scrollToSelector
    : ref(options?.scrollToSelector || '');

  const watcher = pausableWatch(selector, newValue => toSelector(newValue));

  async function toTop(px: number = 0) {
    _top.value = px;

    return await uni.pageScrollTo({
      scrollTop: px,
      duration,
    });
  }

  async function toSelector(Selector: string) {
    try {
      watcher.pause();

      selector.value = Selector;

      return await uni.pageScrollTo({
        selector: Selector,
        duration,
      });
    }
    finally {
      watcher.resume();
    }
  }

  return {
    /** @deprecated 有歧义，弃用，请使用 top */
    scrollTop: top,
    /** @deprecated 有歧义，弃用，请使用 selector */
    scrollToSelector: selector,

    /** 滚动条当前 top */
    top,
    /** 最后一次跳转的元素选择器 */
    selector,
    /** 滚动至指定 top */
    toTop,
    /** 滚动到指定 selector */
    toSelector,
  };
}
