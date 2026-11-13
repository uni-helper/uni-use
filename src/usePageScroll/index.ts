import type { Ref, WritableComputedRef } from 'vue'
import type { MaybeRef } from '../types'
import { onPageScroll } from '@dcloudio/uni-app'
import { computed, isRef, ref, watch } from 'vue'

/** `usePageScroll` 的返回值 */
export interface UsePageScrollReturn {
  /** 页面滚动距离，可写，写入后调用 `uni.pageScrollTo` */
  scrollTop: WritableComputedRef<number>
  /** 滚动目标选择器 */
  scrollToSelector: Ref<string>
}

export interface UsePageScrollOptions {
  /**
   * 此选项不可缺！
   * uniapp 必须在页面内检测到 onPageScroll 关键词才会注册事件。
   * @see https://github.com/dcloudio/uni-app/issues/3099 让页面被正则捕获从而开启监听
   */
  onPageScroll: any
  /**
   * 滚动到指定选择器
   *
   * @see https://uniapp.dcloud.net.cn/api/ui/scroll?id=pagescrollto
   */
  scrollToSelector?: MaybeRef<string>
  /**
   * 滚动动画时长
   *
   * @default 300
   * @see https://uniapp.dcloud.net.cn/api/ui/scroll?id=pagescrollto
   */
  duration?: number
}

/**
 * 页面滚动
 *
 * @param options 配置项
 * @see https://uniapp.dcloud.net.cn/tutorial/page.html#onpagescroll
 */
export function usePageScroll(options: UsePageScrollOptions): UsePageScrollReturn {
  const { duration = 300 } = options

  const _scrollTop = ref(0)
  const scrollTop = computed({
    get() {
      return _scrollTop.value
    },
    set(val) {
      uni.pageScrollTo({
        scrollTop: val,
        duration,
      })
    },
  })

  onPageScroll((e) => {
    _scrollTop.value = e.scrollTop
  })

  const scrollToSelector = isRef(options?.scrollToSelector)
    ? options.scrollToSelector
    : ref(options?.scrollToSelector || '')

  watch(
    () => scrollToSelector.value,
    (newValue) => {
      // 空选择器会让 uni.pageScrollTo 报错，跳过
      if (!newValue) {
        return
      }
      uni.pageScrollTo({
        selector: newValue,
        duration,
      })
    },
  )

  return {
    scrollTop,
    scrollToSelector,
  }
}
