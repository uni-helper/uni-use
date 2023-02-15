import { useRouter } from '../useRouter';

/** 获取前一页路由信息 */
export function usePrevRoute() {
  const { prevRoute } = useRouter();
  return prevRoute;
}
