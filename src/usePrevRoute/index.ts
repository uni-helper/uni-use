import type { ComputedRef } from 'vue'
import { useRouter } from '../useRouter'

/** 获取前一页路由信息 */
export function usePrevRoute(): ComputedRef<string | undefined> {
  const { prevRoute } = useRouter()
  return prevRoute
}
