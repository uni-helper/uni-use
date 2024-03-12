import type { TryOptions } from '../types';
import { onInit } from '@dcloudio/uni-app';
import { getCurrentInstance } from 'vue';
import { sleep } from '../utils';

type OnInitParameters = Parameters<typeof onInit>;

export type TryOnInitOptions = TryOptions;

/**
 * 尝试获取组件生命周期，并调用 onInit
 *
 * 超过重试次数，根据 runFinally 直接执行或抛出异常
 */
export async function tryOnInit(
  hook: OnInitParameters[0],
  target?: OnInitParameters[1],
  options: TryOnInitOptions = {},
) {
  const {
    retry = 3,
    interval = 500,
    runFinally = true,
  } = options;

  function tryBind() {
    const instance = (target || getCurrentInstance()) as OnInitParameters[1] | undefined;
    if (instance) {
      onInit(hook, instance);
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
    return onInit(hook);
  }

  throw new Error('Binding onInit failed, maximum number of attempts exceeded.');
}
