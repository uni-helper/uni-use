import { useRouter } from '../useRouter';

/**
 * Get previous shown page info
 */
export function usePrevPage() {
  const { prevPage } = useRouter();
  return prevPage;
}
