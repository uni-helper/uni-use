import type { ComputedRef } from 'vue'
import { useNetwork } from '../useNetwork'

/**
 * 获取是否在线
 *
 * https://uniapp.dcloud.net.cn/api/system/network.html
 */
export function useOnline(): ComputedRef<boolean> {
  const { isOnline } = useNetwork()
  return isOnline
}
