import type { MaybeComputedRef } from '../types'
import { reactive } from 'vue'
import { unrefValue } from '../utils'

export interface UniShowLoadingOptions extends UniApp.ShowLoadingOptions {}
export type ShowLoadingOptions = MaybeComputedRef<UniShowLoadingOptions>
export type UseLoadingOptions = ShowLoadingOptions

/** `useLoading` 的返回值 */
export interface UseLoadingReturn {
  /** 显示加载提示框，返回隐藏它的方法 */
  showLoading: (newOptions?: ShowLoadingOptions) => () => void
  /** 隐藏加载提示框 */
  hideLoading: () => void
}

function hideLoading(): void {
  return uni.hideLoading()
}

/**
 * 返回一个对象，包含两个方法
 *
 * 其中`showLoading` 调用后显示加载提示框，`hideLoading` 调用后隐藏加载提示框
 *
 * https://uniapp.dcloud.net.cn/api/ui/prompt.html#showloading
 */
export function useLoading(options?: UseLoadingOptions): UseLoadingReturn {
  function showLoading(newOptions?: ShowLoadingOptions): () => void {
    uni.showLoading(
      reactive({
        ...unrefValue(options),
        ...unrefValue(newOptions),
      }),
    )
    return hideLoading
  }

  return {
    /**
     * 显示加载提示框
     *
     * https://uniapp.dcloud.net.cn/api/ui/prompt.html#showloading
     */
    showLoading,

    /**
     * 隐藏加载提示框
     *
     * https://uniapp.dcloud.net.cn/api/ui/prompt.html#hideloading
     */
    hideLoading,
  }
}
