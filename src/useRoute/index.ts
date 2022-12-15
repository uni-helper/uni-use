import { useRouter } from '../useRouter';

/** Get current shown page route */
export function useRoute() {
  const { route } = useRouter();
  return route;
}
