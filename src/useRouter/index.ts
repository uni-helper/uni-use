import { MaybeComputedRef, resolveUnref } from '@vueuse/core';
import { reactive, ref, computed } from 'vue';

export interface UniReLaunchOptions extends UniApp.ReLaunchOptions {}
export type ReLaunchOptions = MaybeComputedRef<UniReLaunchOptions>;

export interface UniSwitchTabOptions extends UniApp.SwitchTabOptions {}
export type SwitchTabOptions = MaybeComputedRef<UniSwitchTabOptions>;

export interface UniRedirectToOptions extends UniApp.RedirectToOptions {}
export type RedirectToOptions = MaybeComputedRef<UniRedirectToOptions>;

export interface UniNavigateToOptions extends UniApp.NavigateToOptions {}
export type NavigateToOptions = MaybeComputedRef<UniNavigateToOptions>;

export interface UniNavigateBackOptions extends UniApp.NavigateBackOptions {}
export type NavigateBackOptions = MaybeComputedRef<UniNavigateBackOptions>;

export interface UniNavigateToMiniProgramOptions extends UniApp.NavigateToMiniProgramOptions {}
export type NavigateToMiniProgramOptions = MaybeComputedRef<UniNavigateToMiniProgramOptions>;

export interface UniNavigateBackMiniProgramOptions extends UniApp.NavigateBackMiniProgramOptions {}
export type NavigateBackMiniProgramOptions = MaybeComputedRef<UniNavigateBackMiniProgramOptions>;

/**
 * Get router info
 */
export function useRouter() {
  const pages = ref(getCurrentPages());
  const pagesLength = computed(() => pages.value.length);

  // at is not supported
  const page = computed(() => pages.value[pagesLength.value - 1]);
  const prevPage = computed(() =>
    pagesLength.value > 1 ? pages.value[pagesLength.value - 2] : undefined,
  );

  const route = computed(() => page.value?.route);
  const prevRoute = computed(() => prevPage.value?.route);

  const reLaunch = (options?: ReLaunchOptions) =>
    uni.reLaunch(reactive({ url: '', ...resolveUnref(options) }));

  const switchTab = (options?: SwitchTabOptions) =>
    uni.switchTab(reactive({ url: '', ...resolveUnref(options) }));

  const redirectTo = (options?: RedirectToOptions) =>
    uni.redirectTo(reactive({ url: '', ...resolveUnref(options) }));

  const navigateTo = (options?: NavigateToOptions) =>
    uni.navigateTo(reactive({ url: '', ...resolveUnref(options) }));

  const navigateBack = (options?: NavigateBackOptions) =>
    uni.navigateBack(reactive({ ...resolveUnref(options) }));

  const navigateToMiniProgram = (options?: NavigateToMiniProgramOptions) =>
    uni.navigateToMiniProgram(reactive({ appId: '', ...resolveUnref(options) }));

  const navigateBackMiniProgram = (options?: NavigateBackMiniProgramOptions) =>
    uni.navigateBackMiniProgram(reactive({ ...resolveUnref(options) }));

  return {
    pages,
    page,
    prevPage,
    route,
    prevRoute,
    reLaunch,
    switchTab,
    redirectTo,
    navigateTo,
    navigateBack,
    navigateToMiniProgram,
    navigateBackMiniProgram,
  };
}
