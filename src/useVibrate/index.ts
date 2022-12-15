import { reactive } from 'vue';
import { MaybeComputedRef, resolveUnref } from '@vueuse/core';

export interface UniVibrateOptions {
  success?: (result: any) => void;
  fail?: (error: any) => void;
  complete?: (result: any) => void;
}
export type VibrateOptions = MaybeComputedRef<UniVibrateOptions>;

/** Get vibrate methods */
export function useVibrate() {
  // @ts-expect-error
  const vibrate = (options?: VibrateOptions) => uni.vibrate(reactive({ ...resolveUnref(options) }));

  const vibrateLong = (options?: VibrateOptions) =>
    uni.vibrateLong(reactive({ ...resolveUnref(options) }));

  const vibrateShort = (options?: VibrateOptions) =>
    uni.vibrateShort(reactive({ ...resolveUnref(options) }));

  return {
    vibrate,
    vibrateLong,
    vibrateShort,
  };
}
