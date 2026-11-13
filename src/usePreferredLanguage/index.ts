import type { Ref } from 'vue'
import { readonly, ref } from 'vue'
import { tryOnScopeDispose } from '../tryOnScopeDispose'

/**
 * 响应式的语言偏好
 *
 * https://uniapp.dcloud.net.cn/api/ui/locale.html
 *
 * https://uniapp.dcloud.net.cn/tutorial/i18n
 */
export function usePreferredLanguage(): Readonly<Ref<string>> {
  const locale = ref(uni.getLocale())

  const callback = (result: UniApp.OnLocaleChangeCallbackResult): void => {
    locale.value = result.locale ?? locale.value
  }
  uni.onLocaleChange(callback)
  const stop = (): void => {
    // @ts-expect-error no types
    if (uni.offLocaleChange) {
      // @ts-expect-error no types
      uni.offLocaleChange(callback)
    }
  }
  tryOnScopeDispose(stop)

  return readonly(locale)
}
