import { reactive } from 'vue';
import { MaybeComputedRef, resolveUnref } from '@vueuse/core';

export interface UniSetBackgroundColorOptions extends UniApp.SetBackgroundColorOptions {}
export type SetBackgroundColorOptions = MaybeComputedRef<UniSetBackgroundColorOptions>;

export interface UniSetBackgroundTextStyleOptions extends UniApp.SetBackgroundTextStyleOptions {}
export type SetBackgroundTextStyleOptions = MaybeComputedRef<UniSetBackgroundTextStyleOptions>;

export function useBackground() {
  const setBackgroundColor = (options?: SetBackgroundColorOptions) =>
    uni.setBackgroundColor(reactive({ ...resolveUnref(options) }));

  const setBackgroundTextStyle = (options?: SetBackgroundTextStyleOptions) =>
    uni.setBackgroundTextStyle(reactive({ textStyle: 'dark', ...resolveUnref(options) }));

  return {
    setBackgroundColor,
    setColor: setBackgroundColor,
    setBackgroundTextStyle,
    setTextStyle: setBackgroundTextStyle,
  };
}
