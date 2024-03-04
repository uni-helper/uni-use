import { computed, ref } from 'vue';
import type { AppJson } from '@dcloudio/uni-cli-shared';
import { pathResolve } from '../utils';
import type { RequiredOnly } from '../types';
import { tryOnBackPress } from '../tryOnBackPress';

/** 获取当前页面栈信息 */
const pages = ref<Page.PageInstance[]>([]);
const pageLength = computed(() => pages.value.length); // 使用 computed 可触发依赖项更新

/** 获取当前页信息 */
// at is not supported
const current = computed(() => pages.value?.[pageLength.value - 1]);
/** 获取前一页信息 */
const prev = computed(() =>
  pageLength.value > 1 ? pages.value[pageLength.value - 2] : pages.value?.[pageLength.value - 1],
);

/** 获取当前页路由信息 */
const currentUrl = computed(() => current.value?.route || '/');
/** 获取前一页路由信息 */
const prevUrl = computed(() => prev.value?.route);

let tabBarList: TabBarItem[] = [];

let isInited = false;

function initIfNotInited() {
  if (isInited) {
    return;
  }

  uni.addInterceptor('navigateTo', { complete: refreshCurrentPages });
  uni.addInterceptor('redirectTo', { complete: refreshCurrentPages });
  uni.addInterceptor('reLaunch', { complete: refreshCurrentPages });
  uni.addInterceptor('switchTab', { complete: refreshCurrentPages });
  uni.addInterceptor('navigateBack', { complete: refreshCurrentPages });

  refreshCurrentPages();

  isInited = true;
}

function refreshCurrentPages() {
  pages.value = getCurrentPages();
}

function warpPromiseOptions<T = any>(
  opts: T,
  resolve: (res: any) => any,
  reject: (err: any) => any,
) {
  let { fail, success, complete } = opts as any;

  fail = fail || ((err: any) => err);
  success = success || ((res: any) => res);
  complete = complete || (() => {});

  return {
    ...opts,
    success: (res: any) => resolve(success(res)),
    fail: (err: any) => reject(fail(err)),
    complete,
  };
}

/** 切换 tabbar 页面 */
function switchTab(options: UniNamespace.SwitchTabOptions): Promise<any> {
  return new Promise((resolve, reject) => {
    uni.switchTab(warpPromiseOptions(options, resolve, reject));
  });
}

function navigateTo(options: UniNamespace.NavigateToOptions) {
  return new Promise((resolve, reject) => {
    uni.navigateTo(warpPromiseOptions(options, resolve, reject));
  });
}

function redirectTo(options: UniNamespace.RedirectToOptions) {
  return new Promise((resolve, reject) => {
    uni.redirectTo(warpPromiseOptions(options, resolve, reject));
  });
}

/** 重定向，并清空当前页面栈 */
function reLaunch(options: UniNamespace.ReLaunchOptions): Promise<any> {
  return new Promise((resolve, reject) => {
    uni.reLaunch(warpPromiseOptions(options, resolve, reject));
  });
}

/** 后退 */
function back(options?: UniNamespace.NavigateBackOptions): Promise<any> {
  return new Promise((resolve, reject) => {
    uni.navigateBack(warpPromiseOptions(options || {}, resolve, reject));
  });
}

/** 路由跳转 `tryTabBar = true` 时，自动判断是否 tabbar 页面 */
function trySwitchTab<FN extends typeof navigateTo | typeof redirectTo>(
  tryTabBar: boolean,
  forward: FN,
  options: Parameters<FN>[0],
): Promise<any> {
  // 不尝试 tabbar 页面，直接跳转
  if (!tryTabBar) {
    return forward(options);
  }

  // 未设置 tabBarList，先尝试 switchTab，报错再尝试跳转
  if (tabBarList.length === 0) {
    return switchTab(options).catch(() => navigateTo(options));
  }

  const url = typeof options.url === 'string' ? options.url : options.url.toString();

  // 如果是 tabBar 页面，则直接 switchTab
  if (isTabBarPath(url)) {
    return switchTab(options);
  }

  // 不是 tabBar，直接跳转
  return navigateTo(options);
}

function isTabBarPath(path: string) {
  const target = pathResolve(path);
  const tabbar = tabBarList.find(t => `/${t.pagePath}` === target);
  return !!tabbar;
}

type UniTabBarItem = Exclude<AppJson['tabBar'], undefined>['list'][number];

type TabBarItem = RequiredOnly<UniTabBarItem, 'pagePath'>;

export interface UseRouterOptions {
  /**
   * 是否尝试跳转 tabBar 开启后，使用 navigate / redirect 将会先尝试 tabBar
   *
   * @default true
   */
  tryTabBar?: boolean;
  /** pages.json 里的 tabBar list 配置 tryTabBar 开启时，会判断跳转页面 全局配置，仅需要配置一次 */
  tabBarList?: TabBarItem[];
}

/**
 * 路由操作的封装
 *
 * UNIAPP 官方文档 @see https://uniapp.dcloud.net.cn/api/router.html
 */
export function useRouter(options: UseRouterOptions = {}) {
  initIfNotInited();

  const { tryTabBar = true } = options;

  if (options.tabBarList) {
    tabBarList = options.tabBarList;
  }

  /**
   * 对实体按键 / 顶部导航栏返回按钮进行监听
   *
   * @see https://uniapp.dcloud.net.cn/tutorial/page.html#onbackpress
   */
  tryOnBackPress((e) => {
    if (e.from === 'navigateBack') {
      return;
    }
    refreshCurrentPages();
  });

  /** 路由跳转 */
  function navigate(options: UniNamespace.NavigateToOptions): Promise<any> {
    return trySwitchTab(tryTabBar, navigateTo, options);
  }

  /** 路由重定向 */
  function redirect(options: UniNamespace.RedirectToOptions): Promise<any> {
    return trySwitchTab(tryTabBar, redirectTo, options);
  }

  return {
    /** 获取当前页面栈信息 */
    pages,
    /** 获取当前页信息 */
    current,
    /** @deprecated 弃用，请使用 current */
    page: current,
    /** 获取当前页路由信息 */
    currentUrl,
    /** @deprecated 弃用，请使用 currentUrl */
    route: currentUrl,
    /** 获取前一页信息 */
    prev,
    /** @deprecated 弃用，请使用 prev */
    prevPage: prev,
    /** 获取前一页路由信息 */
    prevUrl,
    /** @deprecated 弃用，请使用 prevUrl */
    prevRoute: prevUrl,
    /** 切换 tabbar 页面。 */
    switchTab,
    /** 路由跳转 */
    navigate,
    /** 路由重定向 */
    redirect,
    /** 重定向，并清空当前页面栈 */
    reLaunch,
    /** 后退 */
    back,
  };
}
