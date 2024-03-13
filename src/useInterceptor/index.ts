import { tryOnScopeDispose } from '../tryOnScopeDispose';

type FunctionKeys<T> = {
  [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];

type UniFunctions = FunctionKeys<Uni>;

export interface InterceptorOptions<F extends UniFunctions> extends UniApp.InterceptorOptions {
  /** 返回 false 则终止执行 */
  invoke?: (args: Parameters<Uni[F]>) => void | boolean;
}

/**
 * 注册拦截器，在活跃的 effect 作用域停止时自动移除
 *
 * https://cn.vuejs.org/api/reactivity-advanced.htmlSeffectscope
 */
export function useInterceptor<F extends UniFunctions>(method: F, options: InterceptorOptions<F>) {
  const origin = uni[method];

  type FN = typeof origin;

  uni[method] = ((...args: Parameters<FN>) => {
    let skip = false;

    try {
      /**
       * 拦截前触发
       */
      if (options.invoke && options.invoke(args) === false) {
        skip = true;
        // 如果返回false，则终止执行
        return;
      }

      /**
       * 调用原始方法
       */
      const result = (origin as any)(...args);
      /**
       * 方法调用后触发，处理返回值
       */
      options.returnValue && options.returnValue(result);
      /**
       * 成功回调拦截
       */
      options.success && options.success(result);

      return result;
    }
    catch (err: any) {
      /**
       * 失败回调拦截
       */
      options.fail && options.fail(err);

      throw err;
    }
    finally {
      /**
       * 完成回调拦截
       */
      !skip && options.complete && options.complete(void 0);
    }
  }) as FN;

  const stop = () => {
    uni[method] = origin;
  };

  tryOnScopeDispose(stop);

  return stop;
}
