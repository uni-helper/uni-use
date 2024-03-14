import { isPlainObject } from '@dcloudio/uni-app';
import { tryOnScopeDispose } from '../tryOnScopeDispose';

type FunctionKeys<T> = {
  [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];

type UniMethod = FunctionKeys<Uni>;

export interface InterceptorOptions<F extends UniMethod = UniMethod> {
  /** 返回 false 则终止执行 */
  invoke?: (args: Parameters<Uni[F]>) => void | boolean;

  success?: Parameters<Uni[F]>[0]['success'] | ReturnType<Uni[F]>;

  fail?: Parameters<Uni[F]>[0]['fail'] | ((err: any) => void);

  complete?: Parameters<Uni[F]>[0]['complete'] | (() => void);
}

const globalInterceptors: Record<string, Record<string, InterceptorOptions>> = {};
const originMethods = {} as Record<UniMethod, any>;
function wrappMethod(method: UniMethod) {
  if (method in originMethods) {
    return originMethods[method];
  }

  const origin = uni[method];

  originMethods[method] = origin;

  type FN = typeof origin;

  uni[method] = ((...args: Parameters<FN>) => {
    const interceptors = globalInterceptors[method] || {};

    // 判断是否单一函数，且为object
    const isObjOption = args.length === 1 && isPlainObject(args[0]);

    if (isObjOption) {
      const opt = args[0];

      for (const [_key, interceptor] of Object.entries(interceptors)) {
        if (interceptor.invoke && interceptor.invoke(args) === false) {
          continue;
        }

        const oldSuccess = opt.success;
        opt.success = (result: any) => {
          interceptor.success && interceptor.success(result);
          oldSuccess && oldSuccess(result);
        };

        const oldFail = opt.fail;
        opt.fail = (err: any) => {
          interceptor.fail && interceptor.fail(err);
          oldFail && oldFail(err);
        };

        const oldComplete = opt.complete;
        opt.complete = () => {
          interceptor.complete && interceptor.complete();
          oldComplete && oldComplete();
        };
      }

      return new Promise((resolve, reject) => {
        (origin as any)({
          ...opt,
          success: (result: any) => {
            opt.success && opt.success(result);
            resolve(result);
          },
          fail: (err: any) => {
            opt.fail && opt.fail(err);
            reject(err);
          },
        });
      });
    }
    else {
      const effectInterceptors: InterceptorOptions<UniMethod>[] = [];

      for (const [_key, interceptor] of Object.entries(interceptors)) {
        if (interceptor.invoke && interceptor.invoke(args) === false) {
          continue;
        }

        effectInterceptors.push(interceptor);
      }

      try {
        const result = (origin as any)(...args);

        for (const interceptor of effectInterceptors) {
          interceptor.success && interceptor.success(result);
        }

        return result;
      }
      catch (err: any) {
        for (const interceptor of effectInterceptors) {
          interceptor.fail && interceptor.fail(err);
        }
      }
      finally {
        for (const interceptor of effectInterceptors) {
          interceptor.complete && interceptor.complete();
        }
      }
    }
  }) as any;

  return origin;
}

/**
 * 注册拦截器，在活跃的 effect 作用域停止时自动移除
 *
 * https://cn.vuejs.org/api/reactivity-advanced.htmlSeffectscope
 */
export function useInterceptor<F extends UniMethod>(method: F, interceptor: InterceptorOptions<F>) {
  wrappMethod(method);

  globalInterceptors[method] = globalInterceptors[method] || {};
  const key = Math.random().toString(36).slice(-8);
  globalInterceptors[method][key] = interceptor;

  const stop = () => {
    delete globalInterceptors[method][key];
  };

  tryOnScopeDispose(stop);

  return stop;
}
