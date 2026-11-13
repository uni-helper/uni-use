import type { ComputedRef } from 'vue'
import { useRouter } from '../useRouter'

/**
 * 获取当前页路由信息
 *
 * @deprecated use `useRouter().currentUrl` instead
 */
export function useRoute(): ComputedRef<string> {
  const { route } = useRouter()
  return route
}
