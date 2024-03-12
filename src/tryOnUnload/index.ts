import type { TryOptions } from '../types';
import { onUnload } from '@dcloudio/uni-app';
import { getCurrentInstance } from 'vue';
import { sleep } from '../utils';

type OnUnloadParameters = Parameters<typeof onUnload>;

export type TryOnUnloadOptions = TryOptions;

/**
 * 尝试获取组件生命周期，并调用 onUnload
 *
 * 超过重试次数，根据 runFinally 直接执行或抛出异常
 */
export async function tryOnUnload(
  hook: OnUnloadParameters[0],
  target?: OnUnloadParameters[1],
  options: TryOnUnloadOptions = {},
) {
  const {
    retry = 3,
    interval = 500,
    runFinally = true,
  } = options;

  function tryBind() {
    const instance = (target || getCurrentInstance()) as OnUnloadParameters[1] | undefined;
    if (instance) {
      onUnload(hook, instance);
      return true;
    }

    return false;
  }
  for (let circle = 1; circle <= retry; circle++) {
    if (tryBind()) {
      return;
    }
    await sleep(interval);
  }

  if (runFinally) {
    return onUnload(hook);
  }

  throw new Error('Binding onUnload failed, maximum number of attempts exceeded.');
}
