import { useRouter } from '../useRouter';

/** 获取当前页面栈信息 */
export function usePages() {
  const { pages } = useRouter();
  return pages;
}
