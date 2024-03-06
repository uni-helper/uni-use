import { getCurrentInstance } from 'vue';
import { onHide } from '@dcloudio/uni-app';
import { sleep } from '../utils';
import type { TryOptions } from '../types';

type OnHideParameters = Parameters<typeof onHide>;

export type TryOnHideOptions = TryOptions;

/**
 * 尝试获取组件生命周期，并调用 onHide
 *
 * 超过重试次数，根据 runFinally 直接执行或抛出异常
 */
export async function tryOnHide(
  hook: OnHideParameters[0],
  target?: OnHideParameters[1],
  options: TryOnHideOptions = {},
) {
  const {
    retry = 3,
    interval = 500,
    runFinally = true,
  } = options;

  function tryBind() {
    const instance = (target || getCurrentInstance()) as OnHideParameters[1] | undefined;
    if (instance) {
      onHide(hook, instance);
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
    return onHide(hook);
  }

  throw new Error('Binding onHide failed, maximum number of attempts exceeded.');
}
