import type { MaybeComputedRef } from '../types';
import type { ConfigurableEventFilter, ConfigurableFlush, RemovableRef } from '@vueuse/core';
import { resolveUnref, watchWithFilter } from '@vueuse/core';
import { ref, shallowRef } from 'vue';
import { isFunction } from '../utils';

export interface UseGlobalDataOptions<T extends object | undefined>
  extends ConfigurableEventFilter,
  ConfigurableFlush {
  /**
   * 当 globalData 还没有已有值时，是否写入 globalData
   *
   * @default true
   */
  writeDefaults?: boolean;
  /**
   * 是否合并默认值和已有值
   *
   * 当设置为 true 时，浅合并对象
   *
   * 你也可以传一个方法来自定义合并
   *
   * @default false
   */
  mergeDefaults?: boolean | ((nextValue: T, prevValue: T) => T);
  /**
   * 是否使用 shallowRef
   *
   * @default false
   */
  shallow?: boolean;
  /**
   * 是否监听深层变化
   *
   * @default true
   */
  deep?: boolean;
}

/**
 * globalData
 *
 * https://uniapp.dcloud.net.cn/collocation/App.html#globaldata
 */

export function useGlobalData<T extends object | undefined>(
  initialValue: MaybeComputedRef<T>,
  options: UseGlobalDataOptions<T> = {},
) {
  const {
    writeDefaults = true,
    mergeDefaults = false,
    shallow = false,
    deep = true,
    flush = 'pre',
    eventFilter,
  } = options;

  const app = ref(getApp());

  const rawInit: T = resolveUnref(initialValue);

  const data = (shallow ? shallowRef : ref)(initialValue) as RemovableRef<T>;

  watchWithFilter(data, () => (app.value.globalData = data.value ?? undefined), {
    flush,
    deep,
    eventFilter,
  });

  function read() {
    // 读取已有值
    const rawValue = app.value.globalData;
    if (rawValue == null) {
      if (writeDefaults && rawInit !== null) {
        app.value.globalData = rawInit;
      }
      return rawInit;
    }
    else if (mergeDefaults) {
      const value = rawValue as T;
      return isFunction(mergeDefaults)
        ? mergeDefaults(value, rawInit)
        : { ...(rawInit as any), ...value };
    }
    else {
      return rawValue;
    }
  }

  data.value = read();

  return data;
}
