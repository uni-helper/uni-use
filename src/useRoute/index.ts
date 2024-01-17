import { useRouter } from '../useRouter';

/**
 * 获取当前页路由信息
 *
 * @deprecated use `useRouter().currentUrl` instead
 */
export function useRoute() {
  const { route } = useRouter();
  return route;
}
