import { getCurrentInstance } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import type { TryOptions } from '../types';
import { sleep } from '../utils';

type OnLoadParameters = Parameters<typeof onLoad>;

export type TryOnLoadOptions = TryOptions;

/**
 * 尝试获取组件生命周期，并调用 onLoad
 *
 * 超过重试次数，根据 runFinally 直接执行或抛出异常
 */
export async function tryOnLoad(
  hook: OnLoadParameters[0],
  target?: OnLoadParameters[1],
  options: TryOnLoadOptions = {},
) {
  const {
    retry = 3,
    interval = 500,
    runFinally = true,
  } = options;

  function tryBind() {
    const instance = (target || getCurrentInstance()) as OnLoadParameters[1] | undefined;
    if (instance) {
      onLoad(hook, instance);
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
    return onLoad(hook);
  }

  throw new Error('Binding onLoad failed, maximum number of attempts exceeded.');
}
