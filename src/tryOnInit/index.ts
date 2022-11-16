import { nextTick, getCurrentInstance } from 'vue';
import { Fn } from '@vueuse/core';
import { onInit } from '@dcloudio/uni-app';

/**
 * Call onInit() if it's inside a component lifecycle, if not, just call the function
 *
 * @param fn
 * @param sync if set to false, it will run in the nextTick() of Vue
 */
export function tryOnInit(fn: Fn, sync = true) {
  if (getCurrentInstance()) {
    onInit(fn);
  } else if (sync) {
    fn();
  } else {
    nextTick(fn);
  }
}
