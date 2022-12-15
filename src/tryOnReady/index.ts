import { nextTick, getCurrentInstance } from 'vue';
import { Fn } from '@vueuse/core';
import { onReady } from '@dcloudio/uni-app';

/**
 * Call onReady() if it's inside a component lifecycle, if not, just call the function
 *
 * @param fn
 * @param sync If set to false, it will run in the nextTick() of Vue
 */
export function tryOnReady(fn: Fn, sync = true) {
  if (getCurrentInstance()) {
    onReady(fn);
  } else if (sync) {
    fn();
  } else {
    nextTick(fn);
  }
}
