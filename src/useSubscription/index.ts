import { MaybeComputedRef, resolveUnref } from '@vueuse/core';
import { reactive } from 'vue';

export interface UniRequestSubscribeMessageOptions extends UniApp.RequestSubscribeMessageOption {}
export type RequestSubscribeMessageOptions = MaybeComputedRef<UniRequestSubscribeMessageOptions>;

export function useSubscription() {
  const requestSubscribeMessage = (options?: RequestSubscribeMessageOptions) =>
    uni.requestSubscribeMessage(reactive({ tmplIds: [], ...resolveUnref(options) }));

  return { requestSubscribeMessage };
}
