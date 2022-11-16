import { useRouter } from '../useRouter';

/**
 * Get current shown page info
 */
export function usePage() {
  const { page } = useRouter();
  return page;
}
