import { reactive } from 'vue';
import { MaybeComputedRef, resolveUnref } from '@vueuse/core';

export interface UniVibrateOptions extends UniApp.VibrateOptions {}
export type VibrateOptions = MaybeComputedRef<UniVibrateOptions>;

export interface UniVibrateLongOptions extends UniApp.VibrateLongOptions {}
export type VibrateLongOptions = MaybeComputedRef<UniVibrateLongOptions>;

export interface UniVibrateShortOptions extends UniApp.VibrateShortOptions {}
export type VibrateShortOptions = MaybeComputedRef<UniVibrateShortOptions>;

/** Get vibrate methods */
export function useVibrate() {
  const vibrate = (options?: VibrateOptions) => uni.vibrate(reactive({ ...resolveUnref(options) }));

  const vibrateLong = (options?: VibrateLongOptions) =>
    uni.vibrateLong(reactive({ ...resolveUnref(options) }));

  const vibrateShort = (options?: VibrateShortOptions) =>
    uni.vibrateShort(reactive({ ...resolveUnref(options) }));

  return {
    vibrate,
    vibrateLong,
    vibrateShort,
  };
}
