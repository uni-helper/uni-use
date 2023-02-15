import { nextTick, getCurrentInstance } from 'vue';
import { Fn } from '@vueuse/core';
import { onInit } from '@dcloudio/uni-app';

export type OnInitFn = Fn;

/**
 * 如果在组件生命周期内，在 onInit 中调用方法，否则直接调用方法
 *
 * @param fn 需要调用的方法
 * @param sync 默认为 true，如果设置为 false，在 nextTick 中调用方法
 */
export function tryOnInit(fn: OnInitFn, sync = true) {
  if (getCurrentInstance()) {
    onInit(fn);
  } else if (sync) {
    fn();
  } else {
    nextTick(fn);
  }
}
