import { getCurrentInstance } from 'vue';
import { onBackPress } from '@dcloudio/uni-app';

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
   * @default 100
   */
  interval?: number;
  /**
   * 当前循环
   *
   * @default 1
   */
  circle?: number;
  /**
   * 错误回调
   *
   * 默认用 `console.error` 打印错误
   *
   * @default error => console.error(error)
   */
  onError?: (error: unknown) => void;
}

type OnBackPressParameters = Parameters<typeof onBackPress>;

/** 尝试绑定 onBackPress 超出尝试次数将调用 onError */
export function tryOnBackPress(
  hook: OnBackPressParameters[0],
  target?: OnBackPressParameters[1],
  options: TryOnBackPressOptions = {},
): void {
  const {
    retry = 3,
    circle = 1,
    interval = 100,
    onError = error => console.error(error),
  } = options;

  const instance = (target || getCurrentInstance()) as OnBackPressParameters[1] | undefined;
  if (instance) {
    onBackPress(hook, instance);
    return;
  }

  if (circle >= retry) {
    onError(new Error('Binding onBackPress failed, maximum number of attempts exceeded.'));
    return;
  }

  setTimeout(() => {
    tryOnBackPress(hook, target, { retry, circle: circle + 1, interval, onError });
  }, interval);
}
