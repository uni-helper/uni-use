import { ref, computed } from 'vue';

/** 获取路由信息 */
export function useRouter() {
  /** 获取当前页面栈信息 */
  const pages = ref(getCurrentPages());
  const pagesLength = computed(() => pages.value.length);

  /** 获取当前页信息 */
  // at is not supported
  const page = computed(() => pages.value[pagesLength.value - 1]);
  /** 获取前一页信息 */
  const prevPage = computed(() =>
    pagesLength.value > 1 ? pages.value[pagesLength.value - 2] : undefined,
  );

  /** 获取当前页路由信息 */
  const route = computed(() => page.value?.route);
  /** 获取前一页路由信息 */
  const prevRoute = computed(() => prevPage.value?.route);

  return {
    /** 获取当前页面栈信息 */
    pages,
    /** 获取当前页信息 */
    page,
    /** 获取前一页信息 */
    prevPage,
    /** 获取当前页路由信息 */
    route,
    /** 获取前一页路由信息 */
    prevRoute,
  };
}
