import { isPlainObject } from '@dcloudio/uni-app';
import { tryOnScopeDispose } from '../tryOnScopeDispose';
import { isThenable } from '../utils';

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
    return uni[method];
  }

  const origin = uni[method];

  originMethods[method] = origin;

  type FN = typeof origin;

  uni[method] = ((...args: Parameters<FN>) => {
    const interceptors = globalInterceptors[method] || {};

    const effectInterceptors: InterceptorOptions<UniMethod>[] = [];

    for (const [_key, interceptor] of Object.entries(interceptors)) {
      if (interceptor.invoke && interceptor.invoke(args) === false) {
        continue;
      }

      effectInterceptors.push(interceptor);
    }

    /**
     * 判断函数是否符合异步函数的参数
     * 含有 success / fail / complete 的async函数将不会返回promise
     * @see https://uniapp.dcloud.net.cn/api/#api-promise-%E5%8C%96
     */
    const hasAsyncOption = args.length === 1 && ((args[0] as any).success || (args[0] as any).fail || (args[0] as any).complete);

    if (hasAsyncOption) {
      const opt = args[0];

      const oldSuccess = opt.success;
      opt.success = (result: any) => {
        for (const interceptor of effectInterceptors) {
          interceptor.success && interceptor.success(result);
        }
        oldSuccess && oldSuccess(result);
      };

      const oldFail = opt.fail;
      opt.fail = (err: any) => {
        for (const interceptor of effectInterceptors) {
          interceptor.fail && interceptor.fail(err);
        }
        oldFail && oldFail(err);
      };

      const oldComplete = opt.complete;
      opt.complete = () => {
        for (const interceptor of effectInterceptors) {
          interceptor.complete && interceptor.complete();
        }
        oldComplete && oldComplete();
      };

      return (origin as any)(opt);
    }
    else {
      try {
        const result = (origin as any)(...args);

        // is promise
        if (isThenable(result)) {
          return result.then((res: any) => {
            for (const interceptor of effectInterceptors) {
              interceptor.success && interceptor.success(res);
            }
            return res;
          }).catch((err: any) => {
            for (const interceptor of effectInterceptors) {
              interceptor.fail && interceptor.fail(err);
            }
            return err;
          });
        }

        for (const interceptor of effectInterceptors) {
          interceptor.success && interceptor.success(result);
        }

        return result;
      }
      catch (err: any) { // only catch for not thenable
        for (const interceptor of effectInterceptors) {
          interceptor.fail && interceptor.fail(err);
        }
      }
      finally { // finally for ALL (thenable and normal)
        for (const interceptor of effectInterceptors) {
          interceptor.complete && interceptor.complete();
        }
      }
    }
  }) as any;

  return uni[method];
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
