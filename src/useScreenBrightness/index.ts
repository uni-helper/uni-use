import type { Ref } from 'vue'
import type { ConfigurableEventFilter, ConfigurableFlush, MaybeComputedRef } from '../types'
import { ref } from 'vue'
import { useInterceptor } from '../useInterceptor'
import { watchWithFilter } from '../utils'

function getScreenBrightness(): Promise<number> {
  return new Promise<number>((resolve, reject) => {
    uni.getScreenBrightness({
      success: ({ value }) => resolve(value),
      fail: error => reject(error),
    })
  })
}

function setScreenBrightness(value: number): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    uni.setScreenBrightness({
      value,
      success: () => resolve(),
      fail: error => reject(error),
    })
  })
}

export interface UseScreenBrightnessOptions extends ConfigurableEventFilter, ConfigurableFlush {
  /**
   * 是否监听 setScreenBrightness 引起的屏幕亮度变化
   *
   * @default true
   */
  listenToScreenBrightnessChanges?: boolean
  /**
   * 错误回调
   *
   * 默认用 `console.error` 打印错误
   */
  onError?: (error: unknown) => void
}

/**
 * 屏幕亮度
 *
 * https://uniapp.dcloud.net.cn/api/system/brightness.html
 */
export function useScreenBrightness(
  initialValue: MaybeComputedRef<number>,
  options: UseScreenBrightnessOptions = {},
): Ref<number> {
  const {
    listenToScreenBrightnessChanges = true,
    onError = error => console.error(error),
    flush = 'pre',
    eventFilter,
  } = options

  const data = ref(initialValue) as Ref<number>

  /** 最近一次从系统读到的亮度，写回时跳过它 */
  let lastRead: number | undefined

  async function read(): Promise<void> {
    try {
      const value = await getScreenBrightness()
      lastRead = value
      data.value = value
    }
    catch (error) {
      onError(error)
    }
  }

  read()

  if (listenToScreenBrightnessChanges) {
    useInterceptor('setScreenBrightness', {
      complete: () => setTimeout(read, 0),
    })
  }

  watchWithFilter(
    data,
    async () => {
      if (data.value === lastRead) {
        return
      }
      try {
        await setScreenBrightness(data.value)
      }
      catch (error) {
        onError(error)
      }
    },
    { flush, eventFilter },
  )

  return data
}
