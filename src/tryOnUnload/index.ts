import { getCurrentInstance, nextTick } from 'vue';
import type { Fn } from '@vueuse/core';
import { onUnload } from '@dcloudio/uni-app';

export type OnUnloadFn = Fn;

/**
 * 如果在组件生命周期内，在 onUnload 中调用方法，否则直接调用方法
 *
 * @param fn 需要调用的方法
 * @param sync 默认为 true，如果设置为 false，在 nextTick 中调用方法
 */
export function tryOnUnload(fn: OnUnloadFn, sync = true) {
  if (getCurrentInstance()) {
    onUnload(fn);
  }
  else if (sync) {
    fn();
  }
  else {
    nextTick(fn);
  }
}
