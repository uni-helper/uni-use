import { onBackPress } from '@dcloudio/uni-app';
import { getCurrentInstance } from 'vue';
import { sleep } from '../utils';

export interface TryOnBackPressOptions {
  /**
   * 最大尝试次数
   *
   * @default 3
   */
  retry?: number;
  /**
   * 尝试间隔时长，单位 ms
   *
   * @default 500
   */
  interval?: number;
}

type OnBackPressParameters = Parameters<typeof onBackPress>;

/** 尝试绑定 onBackPress 超出尝试次数将调用 onError */
export async function tryOnBackPress(
  hook: OnBackPressParameters[0],
  target?: OnBackPressParameters[1],
  options: TryOnBackPressOptions = {},
) {
  const {
    retry = 3,
    interval = 500,
  } = options;

  function tryBind() {
    const instance = (target || getCurrentInstance()) as OnBackPressParameters[1] | undefined;
    if (instance) {
      onBackPress(hook, instance);
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

  throw new Error('Binding onBackPress failed, maximum number of attempts exceeded.');
}
