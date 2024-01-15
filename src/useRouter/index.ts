import { ref, computed } from 'vue';

/** 获取当前页面栈信息 */
const pages = ref(getCurrentPages());

/** 获取当前页信息 */
// at is not supported
const currentPage = computed(() => pages.value?.[pages.value.length - 1]);
/** 获取前一页信息 */
const prevPage = computed(() =>
  pages.value.length > 1 ? pages.value[pages.value.length - 2] : pages.value?.[pages.value.length - 1],
);

/** 获取当前页路由信息 */
const currentRoute = computed(() => currentPage.value?.route || '/');
/** 获取前一页路由信息 */
const prevRoute = computed(() => prevPage.value?.route);

let isInited = false;

function initIfNotInited() {
  if (isInited) {
    return;
  }

  function refreshCurrentPages() {
    pages.value = getCurrentPages();
  }

  uni.addInterceptor('navigateTo', { complete: refreshCurrentPages });
  uni.addInterceptor('redirectTo', { complete: refreshCurrentPages });
  uni.addInterceptor('reLaunch', { complete: refreshCurrentPages });
  uni.addInterceptor('switchTab', { complete: refreshCurrentPages });
  uni.addInterceptor('navigateBack', { complete: refreshCurrentPages });

  refreshCurrentPages();

  isInited = true;
}

function warpPromiseOptions<T = any>(opts: T, resolve: Function, reject: Function) {
  let { fail, success, complete } = opts as any;

  fail = fail || ((err: any) => err);
  success = success || ((res: any) => res);
  complete = complete || (() => { });

  return {
    ...opts,
    success: (res: any) => resolve(success(res)),
    fail: (err: any) => reject(fail(err)),
    complete,
  };
}

/** 获取路由信息 */
export function useRouter() {
  initIfNotInited();

  function navigate(options: UniNamespace.NavigateToOptions): Promise<any> {
    return new Promise((resolve, reject) => {
      // 先尝试能否切换 tabbar
      uni.switchTab(
        warpPromiseOptions(options, resolve, reject),
      );
    }).catch(() => {
      // 失败再尝试跳转 navigateTo
      return new Promise((resolve, reject) => {
        uni.navigateTo(
          warpPromiseOptions(options, resolve, reject),
        );
      });
    });
  }

  function redirect(options: UniNamespace.RedirectToOptions): Promise<any> {
    return new Promise((resolve, reject) => {
      // 先尝试能否切换 tabbar
      uni.switchTab(
        warpPromiseOptions(options, resolve, reject),
      );
    }).catch(() => {
      // 失败再尝试跳转 redirectTo
      return new Promise((resolve, reject) => {
        uni.redirectTo(
          warpPromiseOptions(options, resolve, reject),
        );
      });
    });
  }

  function reLaunch(options: UniNamespace.ReLaunchOptions): Promise<any> {
    return new Promise((resolve, reject) => {
      uni.reLaunch(
        warpPromiseOptions(options, resolve, reject),
      );
    });
  }

  function back(options: UniNamespace.NavigateBackOptions = { delta: 1 }): Promise<any> {
    return new Promise((resolve, reject) => {
      uni.navigateBack(
        warpPromiseOptions(options, resolve, reject),
      );
    });
  }

  return {
    /** 获取当前页面栈信息 */
    pages,
    /** 获取当前页信息 */
    currentPage,
    /** @deprecated 弃用，请使用 currentPage */
    page: currentPage,
    /** 获取当前页路由信息 */
    currentRoute,
    /** @deprecated 弃用，请使用 currentRoute */
    route: currentRoute,
    /** 获取前一页信息 */
    prevPage,
    /** 获取前一页路由信息 */
    prevRoute,
    /** 路由跳转，如果是 tabbar 页面则执行 switchTab */
    navigate,
    /** 路由重定向，会替换当前页面，如果是 tabbar 页面则执行 switchTab */
    redirect,
    /** 重定向，并清空当前页面栈 */
    reLaunch,
    /** 后退 */
    back,
  };
}
