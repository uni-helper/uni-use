import { reactive } from 'vue';
import { MaybeComputedRef, resolveUnref } from '@vueuse/core';
import { Parameter } from '../types';

export interface UniGetLocationOptions extends UniApp.GetLocationOptions {}
export type GetLocationOptions = MaybeComputedRef<UniGetLocationOptions>;

export interface UniChooseLocationOptions extends UniApp.ChooseLocationOptions {}
export type ChooseLocationOptions = MaybeComputedRef<UniChooseLocationOptions>;

export interface UniOpenLocationOptions extends UniApp.OpenLocationOptions {}
export type OpenLocationOptions = MaybeComputedRef<UniOpenLocationOptions>;

export interface UniStartLocationUpdateOptions extends UniApp.StartLocationUpdateOption {}
export type StartLocationUpdateOptions = MaybeComputedRef<UniStartLocationUpdateOptions>;

export interface UniStartLocationUpdateBackgroundOptions
  extends UniApp.StartLocationUpdateBackgroundOption {}
export type StartLocationUpdateBackgroundOptions =
  MaybeComputedRef<UniStartLocationUpdateBackgroundOptions>;

export interface UniStopLocationUpdateOptions extends UniApp.StartLocationUpdateOption {}
export type StopLocationUpdateOptions = MaybeComputedRef<UniStopLocationUpdateOptions>;

export function useLocation() {
  const getLocation = (options?: GetLocationOptions) =>
    uni.getLocation(reactive({ ...resolveUnref(options) }));

  const chooseLocation = (options?: ChooseLocationOptions) =>
    uni.chooseLocation(reactive({ ...resolveUnref(options) }));

  const openLocation = (options?: OpenLocationOptions) =>
    uni.openLocation(reactive({ latitude: 0, longitude: 0, ...resolveUnref(options) }));

  const onLocationChange = (callback: Parameter<UniApp.Uni['onLocationChange']>) =>
    uni.onLocationChange(callback);

  const onLocationChangeError = (callback: Parameter<UniApp.Uni['onLocationChangeError']>) =>
    uni.onLocationChangeError(callback);

  const offLocationChange = (callback: Parameter<UniApp.Uni['offLocationChange']>) =>
    uni.offLocationChange(callback);

  const startLocationUpdate = (options?: StartLocationUpdateOptions) =>
    uni.startLocationUpdate(reactive({ ...resolveUnref(options) }));

  const startLocationBackgroundUpdate = (options?: StartLocationUpdateBackgroundOptions) =>
    uni.startLocationUpdateBackground(reactive({ ...resolveUnref(options) }));

  const stopLocationUpdate = (options?: StopLocationUpdateOptions) =>
    uni.stopLocationUpdate(reactive({ ...resolveUnref(options) }));

  return {
    getLocation,
    get: getLocation,
    chooseLocation,
    choose: chooseLocation,
    openLocation,
    open: openLocation,
    onLocationChange,
    onChange: onLocationChange,
    onLocationChangeError,
    onChangeError: onLocationChangeError,
    offLocationChange,
    offChange: offLocationChange,
    startLocationUpdate,
    startUpdate: startLocationUpdate,
    startLocationBackgroundUpdate,
    startUpdateBackground: startLocationBackgroundUpdate,
    stopLocationUpdate,
    stopUpdate: stopLocationUpdate,
  };
}
