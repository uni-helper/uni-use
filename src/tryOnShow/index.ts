import { nextTick, getCurrentInstance } from 'vue';
import { Fn } from '@vueuse/core';
import { onShow } from '@dcloudio/uni-app';

/**
 * Call onShow() if it's inside a component lifecycle, if not, just call the function
 *
 * @param fn
 * @param sync If set to false, it will run in the nextTick() of Vue
 */
export function tryOnShow(fn: Fn, sync = true) {
  if (getCurrentInstance()) {
    onShow(fn);
  } else if (sync) {
    fn();
  } else {
    nextTick(fn);
  }
}
