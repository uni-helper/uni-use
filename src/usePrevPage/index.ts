import { useRouter } from '../useRouter';

/** 获取前一页信息 */
export function usePrevPage() {
  const { prevPage } = useRouter();
  return prevPage;
}
