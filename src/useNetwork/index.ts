import { ref, computed, defineComponent, reactive } from 'vue';
import { tryOnScopeDispose } from '@vueuse/core';

export type NetworkType = 'ethernet' | 'none' | 'wifi' | 'unknown' | '2g' | '3g' | '4g' | '5g';

/**
 * Get network info
 */
export function useNetwork(onError = (e: unknown) => console.error(e)) {
  const onlineTypes = ['2g', '3g', '4g', '5g', 'ethernet', 'unknown'];

  const type = ref<NetworkType>('unknown');
  const isWifi = computed(() => type.value === 'wifi');
  const is2g = computed(() => type.value === '2g');
  const is3g = computed(() => type.value === '3g');
  const is4g = computed(() => type.value === '4g');
  const is5g = computed(() => type.value === '5g');
  const isEthernet = computed(() => type.value === 'ethernet');
  const isUnknown = computed(() => type.value === 'unknown');

  const isOnline = computed(() => onlineTypes.includes(type.value));
  const isOffline = computed(() => !isOnline.value);

  const updateNetwork = (
    result: UniApp.GetNetworkTypeSuccess | UniApp.OnNetworkStatusChangeSuccess,
  ) => {
    type.value = (result?.networkType ?? 'unknown') as NetworkType;
  };

  uni.getNetworkType({
    success: (result) => {
      updateNetwork(result);
    },
    fail: (e) => {
      onError?.(e);
    },
  });

  const callback = (result: UniApp.OnNetworkStatusChangeSuccess) => {
    updateNetwork(result);
  };

  uni.onNetworkStatusChange(callback);

  const stop = () => {
    uni.offNetworkStatusChange(callback);
  };

  tryOnScopeDispose(stop);

  return {
    type,
    isWifi,
    is2g,
    is3g,
    is4g,
    is5g,
    isEthernet,
    isUnknown,
    isOnline,
    isOffline,
  };
}

export const UseNetwork = defineComponent({
  name: 'UseNetwork',
  setup(props, { slots }) {
    const data = reactive(useNetwork());

    return () => {
      if (slots.default) {
        return slots.default(data);
      }
    };
  },
});
