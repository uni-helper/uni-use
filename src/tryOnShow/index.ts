import { getCurrentInstance } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import type { TryOptions } from '../types';
import { sleep } from '../utils';

type OnShowParameters = Parameters<typeof onShow>;

export type TryOnShowOptions = TryOptions;

/**
 * 尝试获取组件生命周期，并调用 onShow
 *
 * 超过重试次数，根据 runFinally 直接执行或抛出异常
 */
export async function tryOnShow(
  hook: OnShowParameters[0],
  target?: OnShowParameters[1],
  options: TryOnShowOptions = {},
) {
  const {
    retry = 3,
    interval = 500,
    runFinally = true,
  } = options;

  function tryBind() {
    const instance = (target || getCurrentInstance()) as OnShowParameters[1] | undefined;
    if (instance) {
      onShow(hook, instance);
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
    return onShow(hook);
  }

  throw new Error('Binding onShow failed, maximum number of attempts exceeded.');
}
