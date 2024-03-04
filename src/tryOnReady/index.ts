import { getCurrentInstance, nextTick } from 'vue';
import type { Fn } from '@vueuse/core';
import { onReady } from '@dcloudio/uni-app';

export type OnReadyFn = Fn;

/**
 * 如果在组件生命周期内，在 onReady 中调用方法，否则直接调用方法
 *
 * @param fn 需要调用的方法
 * @param sync 默认为 true，如果设置为 false，在 nextTick 中调用方法
 */
export function tryOnReady(fn: OnReadyFn, sync = true) {
  if (getCurrentInstance()) {
    onReady(fn);
  }
  else if (sync) {
    fn();
  }
  else {
    nextTick(fn);
  }
}
