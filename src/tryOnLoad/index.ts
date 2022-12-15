import { nextTick, getCurrentInstance } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

export interface OnLoadHook {
  (query?: Record<string, string | undefined>): void;
}

/**
 * Call onLoad() if it's inside a component lifecycle, if not, just call the function
 *
 * @param fn
 * @param sync If set to false, it will run in the nextTick() of Vue
 */
export function tryOnLoad(fn: OnLoadHook, sync = true) {
  if (getCurrentInstance()) {
    onLoad(fn);
  } else if (sync) {
    fn();
  } else {
    nextTick(fn);
  }
}
