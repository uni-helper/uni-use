import type { Ref } from 'vue'
import { useRouter } from '../useRouter'

/** 获取当前页面栈信息 */
export function usePages(): Ref<Page.PageInstance[]> {
  const { pages } = useRouter()
  return pages
}
