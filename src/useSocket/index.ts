import { Ref, ShallowRef, ref, shallowRef, computed } from 'vue';
import { Parameter } from '../types';

export interface UseSocketReturn {
  task: ShallowRef<UniApp.SocketTask | undefined>;

  sendMessage: UniApp.Uni['sendSocketMessage'];

  close: UniApp.Uni['closeSocket'];

  isConnecting: Ref<boolean>;

  isConnected: Ref<boolean>;

  isClosed: Ref<boolean>;

  error: ShallowRef<UniApp.GeneralCallbackResult | undefined>;
}

export interface UseSocketConfig extends UniApp.ConnectSocketOption {
  onSocketOpen: Parameter<UniApp.Uni['onSocketOpen']>;
  onSocketError: Parameter<UniApp.Uni['onSocketError']>;
  onSocketMessage: Parameter<UniApp.Uni['onSocketMessage']>;
  onSocketClose: Parameter<UniApp.Uni['onSocketClose']>;
}

export function useSocket(config: UseSocketConfig): UseSocketReturn {
  const task = shallowRef<UniApp.SocketTask>();
  const isConnecting = ref(false);
  const isConnected = ref(false);
  const isClosed = computed(() => !isConnecting.value && !isConnected.value);
  const error = shallowRef<UniApp.GeneralCallbackResult>();

  isConnecting.value = true;
  task.value = uni.connectSocket({
    ...config,
    success: (result) => {
      config?.success?.(result);
    },
    fail: (error) => {
      config?.fail?.(error);
    },
    complete: (result) => {
      config?.complete?.(result);
    },
  });

  if (config.onSocketOpen) {
    isConnecting.value = false;
    isConnected.value = true;
    error.value = undefined;
    uni.onSocketOpen(config.onSocketOpen);
  }

  uni.onSocketError((e) => {
    isConnecting.value = false;
    isConnected.value = false;
    error.value = e;
    config?.onSocketError?.(e);
  });

  if (config.onSocketMessage) {
    uni.onSocketMessage(config.onSocketMessage);
  }

  if (config.onSocketClose) {
    isConnecting.value = false;
    isConnected.value = false;
    uni.onSocketClose(config.onSocketClose);
  }

  const sendMessage = (options: UniApp.SendSocketMessageOptions) => {
    uni.sendSocketMessage(options);
  };

  const close = (options: UniApp.CloseSocketOptions) => {
    uni.closeSocket(options);
  };

  return {
    task,
    sendMessage,
    close,
    isConnecting,
    isConnected,
    isClosed,
    error,
  };
}
