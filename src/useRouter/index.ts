import type { AppJson } from '@dcloudio/uni-cli-shared';
import type { RequiredOnly } from '../types';
import qs from 'fast-querystring';
import { computed, ref } from 'vue';
import { tryOnBackPress } from '../tryOnBackPress';
import { pathResolve } from '../utils';

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

let tabBarUrls: string[] = [];

let isAddInterceptors = false;
let isBindBackPress = false;

function initIfNotInited() {
  // 默认路由的拦截
  if (!isAddInterceptors) {
    isAddInterceptors = true;

    uni.addInterceptor('navigateTo', { complete: refreshCurrentPages });
    uni.addInterceptor('redirectTo', { complete: refreshCurrentPages });
    uni.addInterceptor('reLaunch', { complete: refreshCurrentPages });
    uni.addInterceptor('switchTab', { complete: refreshCurrentPages });
    uni.addInterceptor('navigateBack', { complete: refreshCurrentPages });
  }

  //  对实体按键 / 顶部导航栏返回按钮进行监听
  if (!isBindBackPress) {
    isBindBackPress = true;

    tryOnBackPress((e) => {
      if (e.from === 'navigateBack') {
        return;
      }
      refreshCurrentPages();
    }).catch(() => {
      isBindBackPress = false;
    });
  }

  // 每次 init 都更新一次
  refreshCurrentPages();
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

type LocationUrl = string | HBuilderX.PageURIString;
type LocationQueryRaw = Record<string, unknown>;

interface QueryOptions {
  url: LocationUrl;
  query?: LocationQueryRaw;
}

type SwitchTabOptions = UniNamespace.SwitchTabOptions;
type NavigateToOptions = UniNamespace.NavigateToOptions & QueryOptions;
type RedirectToOptions = UniNamespace.RedirectToOptions & QueryOptions;
type ReLaunchOptions = UniNamespace.ReLaunchOptions & QueryOptions;
type NavigateBackOptions = UniNamespace.NavigateBackOptions;

function buildUrl(url: LocationUrl, query?: LocationQueryRaw) {
  if (!query) {
    return url;
  }

  const serializedQuery = qs.stringify(query);

  if (!serializedQuery) {
    return url;
  }

  return url.includes('?') ? `${url}&${serializedQuery}` : `${url}?${serializedQuery}`;
}

function buildOptions<T extends QueryOptions>(options: T) {
  const { url, query, ...opts } = options;

  return {
    ...opts,
    url: buildUrl(url, query),
  };
}

/** 切换 tabbar 页面 */
function switchTab(options: SwitchTabOptions): Promise<any> {
  return new Promise((resolve, reject) => {
    uni.switchTab(warpPromiseOptions(options, resolve, reject));
  });
}

function navigateTo(options: NavigateToOptions) {
  return new Promise((resolve, reject) => {
    uni.navigateTo(warpPromiseOptions(buildOptions(options), resolve, reject));
  });
}

function redirectTo(options: RedirectToOptions) {
  return new Promise((resolve, reject) => {
    uni.redirectTo(warpPromiseOptions(buildOptions(options), resolve, reject));
  });
}

/** 重定向，并清空当前页面栈 */
function reLaunch(options: ReLaunchOptions): Promise<any> {
  return new Promise((resolve, reject) => {
    uni.reLaunch(warpPromiseOptions(buildOptions(options), resolve, reject));
  });
}

/** 后退 */
function back(options?: NavigateBackOptions): Promise<any> {
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
  if (tabBarUrls.length === 0) {
    return switchTab(options).catch(() => forward(options));
  }

  const url = typeof options.url === 'string' ? options.url : options.url.toString();

  // 如果是 tabBar 页面，则直接 switchTab
  if (isTabBarPath(url)) {
    return switchTab(options);
  }

  // 不是 tabBar，直接跳转
  return forward(options);
}

function isTabBarPath(path: string) {
  const target = pathResolve(path);
  const tabbar = tabBarUrls.find(url => url === target || `${url}/` === target);
  return tabbar !== undefined;
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
  /**
   * 全局配置，仅需要配置一次
   * 配置 tryTabBar 开启时，会判断跳转页面
   *
   * 可填入 pages.json 里的 tabBar list 或仅 tabbar 的 url 数组
   */
  tabBarList?: Array<TabBarItem | string>;
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
    const urls: string[] = [];
    for (const item of options.tabBarList) {
      if (typeof item === 'string') {
        urls.push(item);
      }
      else {
        urls.push(item.pagePath);
      }
    }
    tabBarUrls = urls.filter(url => !!url);
  }

  /** 路由跳转 */
  function navigate(options: NavigateToOptions): Promise<any> {
    return trySwitchTab(tryTabBar, navigateTo, options);
  }

  /** 路由重定向 */
  function redirect(options: RedirectToOptions): Promise<any> {
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
