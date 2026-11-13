import type { ComputedRef } from 'vue'
import { useRouter } from '../useRouter'

/** 获取当前页信息 */
export function usePage(): ComputedRef<Page.PageInstance | undefined> {
  const { page } = useRouter()
  return page
}
