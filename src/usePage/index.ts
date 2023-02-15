import { useRouter } from '../useRouter';

/** 获取当前页信息 */
export function usePage() {
  const { page } = useRouter();
  return page;
}
