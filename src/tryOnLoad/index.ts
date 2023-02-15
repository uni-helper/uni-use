import { nextTick, getCurrentInstance } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

export type OnLoadFn = (query?: Record<string, string | undefined>) => void;

/**
 * 如果在组件生命周期内，在 onLoad 中调用方法，否则直接调用方法
 *
 * @param fn 需要调用的方法
 * @param sync 默认为 true，如果设置为 false，在 nextTick 中调用方法（可能会丢失参数）
 */
export function tryOnLoad(fn: OnLoadFn, sync = true) {
  if (getCurrentInstance()) {
    onLoad(fn);
  } else if (sync) {
    fn();
  } else {
    nextTick(fn);
  }
}
