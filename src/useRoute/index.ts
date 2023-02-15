import { useRouter } from '../useRouter';

/** 获取当前页路由信息 */
export function useRoute() {
  const { route } = useRouter();
  return route;
}
