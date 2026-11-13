import type { ComputedRef, Ref } from 'vue'
import { computed, ref } from 'vue'
import { tryOnScopeDispose } from '../tryOnScopeDispose'

export type NetworkType = 'ethernet' | 'none' | 'wifi' | 'unknown' | '2g' | '3g' | '4g' | '5g'

/** `useNetwork` 的返回值 */
export interface UseNetworkReturn {
  type: Ref<NetworkType>
  isWifi: ComputedRef<boolean>
  is2g: ComputedRef<boolean>
  is3g: ComputedRef<boolean>
  is4g: ComputedRef<boolean>
  is5g: ComputedRef<boolean>
  isEthernet: ComputedRef<boolean>
  isUnknown: ComputedRef<boolean>
  isOnline: ComputedRef<boolean>
  isOffline: ComputedRef<boolean>
}

/**
 * 获取网络信息
 *
 * https://uniapp.dcloud.net.cn/api/system/network.html
 */
export function useNetwork(): UseNetworkReturn {
  const type = ref<NetworkType>('none')
  const isWifi = computed(() => type.value === 'wifi')
  const is2g = computed(() => type.value === '2g')
  const is3g = computed(() => type.value === '3g')
  const is4g = computed(() => type.value === '4g')
  const is5g = computed(() => type.value === '5g')
  const isEthernet = computed(() => type.value === 'ethernet')
  const isUnknown = computed(() => type.value === 'unknown')

  const isOffline = computed(() => type.value === 'none')
  const isOnline = computed(() => !isOffline.value)

  const updateNetwork = (
    result: UniApp.GetNetworkTypeSuccess | UniApp.OnNetworkStatusChangeSuccess,
  ): void => {
    type.value = (result?.networkType ?? 'unknown') as NetworkType
  }

  uni.getNetworkType({
    success: result => updateNetwork(result),
  })

  const callback = (result: UniApp.OnNetworkStatusChangeSuccess): void => updateNetwork(result)
  uni.onNetworkStatusChange(callback)
  const stop = (): void => uni.offNetworkStatusChange(callback)
  tryOnScopeDispose(stop)

  return {
    type,
    isWifi,
    is2g,
    is3g,
    is4g,
    is5g,
    isEthernet,
    isUnknown,
    isOnline,
    isOffline,
  }
}
