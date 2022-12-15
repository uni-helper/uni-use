import { useRouter } from '../useRouter';

/** Get current pages stack info */
export function usePages() {
  const { pages } = useRouter();
  return pages;
}
