import { getCurrentInstance } from 'vue';
import { onReady } from '@dcloudio/uni-app';
import type { TryOptions } from '../types';
import { sleep } from '../utils';

type OnReadyParameters = Parameters<typeof onReady>;

export type TryOnReadyOptions = TryOptions;

/**
 * 尝试获取组件生命周期，并调用 onReady
 *
 * 超过重试次数，根据 runFinally 直接执行或抛出异常
 */
export async function tryOnReady(
  hook: OnReadyParameters[0],
  target?: OnReadyParameters[1],
  options: TryOnReadyOptions = {},
) {
  const {
    retry = 3,
    interval = 500,
    runFinally = true,
  } = options;

  function tryBind() {
    const instance = (target || getCurrentInstance()) as OnReadyParameters[1] | undefined;
    if (instance) {
      onReady(hook, instance);
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
    return onReady(hook);
  }

  throw new Error('Binding onReady failed, maximum number of attempts exceeded.');
}
