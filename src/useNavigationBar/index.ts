import { reactive } from 'vue';
import { MaybeComputedRef, resolveUnref } from '@vueuse/core';

export interface UniSetNavigationBarTitleOptions extends UniApp.SetNavigationBarTitleOptions {}
export type SetNavigationBarTitleOptions = MaybeComputedRef<UniSetNavigationBarTitleOptions>;

export interface UniSetNavigationBarColorOptions extends UniApp.SetNavigationbarColorOptions {}
export type SetNavigationBarColorOptions = MaybeComputedRef<UniSetNavigationBarColorOptions>;

export function useNavigationBar() {
  const setNavigationBarTitle = (options?: SetNavigationBarTitleOptions) =>
    uni.setNavigationBarTitle(reactive({ title: '', ...resolveUnref(options) }));

  const setNavigationBarColor = (options?: SetNavigationBarColorOptions) =>
    uni.setNavigationBarColor(reactive({ ...resolveUnref(options) }));

  const showNavigationBarLoading = () => uni.showNavigationBarLoading();

  const hideNavigationBarLoading = () => uni.hideNavigationBarLoading();

  return {
    setNavigationBarTitle,
    setTitle: setNavigationBarTitle,
    setNavigationBarColor,
    setColor: setNavigationBarColor,
    showNavigationBarLoading,
    showLoading: showNavigationBarLoading,
    hideNavigationBarLoading,
    hideLoading: hideNavigationBarLoading,
  };
}
