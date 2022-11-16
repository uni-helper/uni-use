import { useRouter } from '../useRouter';

/**
 * Get previous shown page route
 */
export function usePrevRoute() {
  const { prevRoute } = useRouter();
  return prevRoute;
}
