import type { ComputedRef } from 'vue'
import { useRouter } from '../useRouter'

/** 获取前一页信息 */
export function usePrevPage(): ComputedRef<Page.PageInstance | undefined> {
  const { prevPage } = useRouter()
  return prevPage
}
