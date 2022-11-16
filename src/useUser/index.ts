import { MaybeComputedRef, resolveUnref } from '@vueuse/core';
import { reactive } from 'vue';

export interface UniLoginOptions extends UniApp.LoginOptions {}
export type LoginOptions = MaybeComputedRef<UniLoginOptions>;

export interface UniCheckSessionOptions extends UniApp.CheckSessionOptions {}
export type CheckSessionOptions = MaybeComputedRef<UniCheckSessionOptions>;

export interface UniGetUserInfoOptions extends UniApp.GetUserInfoOptions {}
export type GetUserInfoOptions = MaybeComputedRef<UniGetUserInfoOptions>;

export interface UniGetUserProfileOptions extends UniApp.GetUserProfileOptions {}
export type GetUserProfileOptions = MaybeComputedRef<UniGetUserProfileOptions>;

export interface UniPreLoginOptions extends UniApp.PreLoginOptions {}
export type PreLoginOptions = MaybeComputedRef<UniPreLoginOptions>;

export interface UniGetCheckBoxStateOptions extends UniApp.GetCheckBoxStateOptions {}
export type GetCheckBoxStateOptions = MaybeComputedRef<UniGetCheckBoxStateOptions>;

export function useUser() {
  const login = (options?: LoginOptions) => uni.login(reactive({ ...resolveUnref(options) }));

  const checkSession = (options?: CheckSessionOptions) =>
    uni.checkSession(reactive({ ...resolveUnref(options) }));

  const getUserInfo = (options?: GetUserInfoOptions) =>
    uni.getUserInfo(reactive({ ...resolveUnref(options) }));

  const getUserProfile = (options?: GetUserProfileOptions) =>
    uni.getUserProfile(reactive({ ...resolveUnref(options) }));

  const preLogin = (options?: PreLoginOptions) =>
    uni.preLogin(reactive({ ...resolveUnref(options) }));

  const closeAuthView = () => uni.closeAuthView();

  const getCheckBoxState = (options?: GetCheckBoxStateOptions) =>
    uni.getCheckBoxState(reactive({ ...resolveUnref(options) }));

  const univerifyManager = uni.getUniverifyManager();

  const useUniverifyManager = () => univerifyManager;

  return {
    login,
    checkSession,
    getUserInfo,
    getInfo: getUserInfo,
    getUserProfile,
    getProfile: getUserProfile,
    preLogin,
    closeAuthView,
    getCheckBoxState,
    univerifyManager,
    manager: univerifyManager,
    useUniverifyManager,
    useManager: useUniverifyManager,
  };
}
