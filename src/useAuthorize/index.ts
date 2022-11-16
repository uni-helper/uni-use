import { MaybeComputedRef, resolveUnref } from '@vueuse/core';
import { reactive } from 'vue';

export interface UniAuthorizeOptions extends UniApp.AuthorizeOptions {}
export type AuthorizeOptions = MaybeComputedRef<UniAuthorizeOptions>;

export interface UniOpenSettingOptions extends UniApp.OpenSettingOptions {}
export type OpenSettingOptions = MaybeComputedRef<UniOpenSettingOptions>;

export interface UniGetSettingOptions extends UniApp.GetSettingOptions {}
export type GetSettingOptions = MaybeComputedRef<UniGetSettingOptions>;

export interface UniOpenAppAuthorizeSettingOptions extends UniApp.CallBackOptions {}
export type OpenAppAuthorizeSettingOptions = MaybeComputedRef<UniOpenAppAuthorizeSettingOptions>;

export function useAuthorize() {
  const authorize = (options?: AuthorizeOptions) =>
    uni.authorize(reactive({ scope: '', ...resolveUnref(options) }));

  const openSetting = (options?: OpenSettingOptions) =>
    uni.openSetting(reactive({ ...resolveUnref(options) }));

  const getSetting = (options?: GetSettingOptions) =>
    uni.getSetting(reactive({ ...resolveUnref(options) }));

  const openAppAuthorizeSetting = (options?: OpenAppAuthorizeSettingOptions) =>
    uni.openAppAuthorizeSetting(reactive({ ...resolveUnref(options) }));

  const getAppAuthorizeSetting = () => uni.getAppAuthorizeSetting();

  return {
    authorize,
    openSetting,
    getSetting,
    openAppAuthorizeSetting,
    getAppAuthorizeSetting,
  };
}
