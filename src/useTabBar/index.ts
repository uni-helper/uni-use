import { reactive } from 'vue';
import { MaybeComputedRef, resolveUnref } from '@vueuse/core';

export interface UniSetTabBarItemOptions extends UniApp.SetTabBarItemOptions {}
export type SetTabBarItemOptions = MaybeComputedRef<UniSetTabBarItemOptions>;

export interface UniSetTabBarStyleOptions extends UniApp.SetTabBarStyleOptions {}
export type SetTabBarStyleOptions = MaybeComputedRef<UniSetTabBarStyleOptions>;

export interface UniShowTabBarOptions extends UniApp.ShowTabBarOptions {}
export type ShowTabBarOptions = MaybeComputedRef<UniShowTabBarOptions>;

export interface UniHideTabBarOptions extends UniApp.HideTabBarOptions {}
export type HideTabBarOptions = MaybeComputedRef<UniHideTabBarOptions>;

export interface UniSetTabBarBadgeOptions extends UniApp.SetTabBarBadgeOptions {}
export type SetTabBarBadgeOptions = MaybeComputedRef<UniSetTabBarBadgeOptions>;

export interface UniRemoveTabBarBadgeOptions extends UniApp.RemoveTabBarBadgeOptions {}
export type RemoveTabBarBadgeOptions = MaybeComputedRef<UniRemoveTabBarBadgeOptions>;

export interface UniShowTabBarRedDotOptions extends UniApp.ShowTabBarRedDotOptions {}
export type ShowTabBarRedDotOptions = MaybeComputedRef<UniShowTabBarRedDotOptions>;

export interface UniHideTabBarRedDotOptions extends UniApp.HideTabBarRedDotOptions {}
export type HideTabBarRedDotOptions = MaybeComputedRef<UniHideTabBarRedDotOptions>;

export function useTabBar() {
  const setTabBarItem = (options?: SetTabBarItemOptions) =>
    uni.setTabBarItem(reactive({ index: 0, ...resolveUnref(options) }));

  const setTabBarStyle = (options?: SetTabBarStyleOptions) =>
    uni.setTabBarStyle(reactive({ ...resolveUnref(options) }));

  const showTabBar = (options?: ShowTabBarOptions) =>
    uni.showTabBar(reactive({ ...resolveUnref(options) }));

  const hideTabBar = (options?: HideTabBarOptions) =>
    uni.hideTabBar(reactive({ ...resolveUnref(options) }));

  const setTabBarBadge = (options?: SetTabBarBadgeOptions) =>
    uni.setTabBarBadge(reactive({ index: 0, text: '', ...resolveUnref(options) }));

  const removeTabBarBadge = (options?: RemoveTabBarBadgeOptions) =>
    uni.removeTabBarBadge(reactive({ index: 0, ...resolveUnref(options) }));

  const showTabBarRedDot = (options?: ShowTabBarRedDotOptions) =>
    uni.showTabBarRedDot(reactive({ index: 0, ...resolveUnref(options) }));

  const hideTabBarRedDot = (options?: HideTabBarRedDotOptions) =>
    uni.hideTabBarRedDot(reactive({ index: 0, ...resolveUnref(options) }));

  return {
    setTabBarItem,
    setItem: setTabBarItem,
    setTabBarStyle,
    setStyle: setTabBarStyle,
    showTabBar,
    show: showTabBar,
    hideTabBar,
    hide: hideTabBar,
    setTabBarBadge,
    setBadge: setTabBarBadge,
    removeTabBarBadge,
    removeBadge: removeTabBarBadge,
    showTabBarRedDot,
    showRedDot: showTabBarRedDot,
    hideTabBarRedDot,
    hideRedDot: hideTabBarRedDot,
  };
}
