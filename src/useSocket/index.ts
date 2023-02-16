import { computed, ComputedRef, ref, watch, type Ref } from 'vue';
import {
  resolveRef,
  tryOnScopeDispose,
  useIntervalFn,
  type Fn,
  type MaybeComputedRef,
} from '@vueuse/core';
import { tryOnUnload } from '../tryOnUnload';

export type SocketTask = UniApp.SocketTask;

export type SocketStatus = 'OPEN' | 'CONNECTING' | 'CLOSED';

const DEFAULT_PING_MESSAGE = 'ping';

export interface UseSocketOptions {
  onConnected?: (task: SocketTask, result: UniApp.OnSocketOpenCallbackResult) => void;
  onClosed?: (task: SocketTask, result: any) => void;
  onError?: (task: SocketTask, error: UniApp.GeneralCallbackResult) => void;
  onMessage?: (task: SocketTask, result: UniApp.OnSocketMessageCallbackResult) => void;
  /**
   * 是否每过 x 毫秒发送一次心跳信号
   *
   * @default false
   */
  heartbeat?:
    | boolean
    | {
        /**
         * 心跳信号信息
         *
         * @default 'ping'
         */
        message?: string | ArrayBuffer;
        /**
         * 毫秒级时间间隔
         *
         * @default 1000
         */
        interval?: number;
        /**
         * 毫秒级心跳信号响应超时时间
         *
         * @default 1000
         */
        pongTimeout?: number;
      };
  /**
   * 是否允许自动重连
   *
   * @default false
   */
  autoReconnect?:
    | boolean
    | {
        /**
         * 最大重连次数
         *
         * 你也可以传一个方法，返回 true 表示需要重连
         *
         * @default -1
         */
        retries?: number | (() => boolean);
        /**
         * 毫秒级重连延迟
         *
         * @default 1000
         */
        delay?: number;
        /** 到达最大重连次数时触发 */
        onFailed?: Fn;
      };
  /**
   * 是否自动打开连接
   *
   * @default true
   */
  immediate?: boolean;
  /**
   * 是否自动关闭连接
   *
   * @default true
   */
  autoClose?: boolean;
  /**
   * 是否多实例
   *
   * @default false
   */
  multiple?: boolean;
  /** 头部 */
  headers?: Record<string, any>;
  /**
   * 请求方法
   *
   * @default 'GET'
   */
  method?: 'OPTIONS' | 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT';
  /**
   * 一个或多个子协议字符串的列表
   *
   * @default [ ]
   */
  protocols?: string[];
}

export interface UseSocketReturn<T> {
  /** websocket 收到的最新数据的引用，可以观察到对传入信息的响应 */
  data: Ref<T | null>;

  /** 当前 websocket 状态，只能是 OPEN、CONNECTING 和 CLOSED 之一 */
  status: Ref<SocketStatus>;

  /** 当前 websocket 是否处于 OPEN 状态 */
  isOpen: ComputedRef<boolean>;

  /** 当前 websocket 是否处于 CONNECTING 状态 */
  isConnecting: ComputedRef<boolean>;

  /** 当前 websocket 是否处于 CLOSED 状态 */
  isClosed: ComputedRef<boolean>;

  /** 关闭 websocket 连接 */
  close: SocketTask['close'];

  /**
   * 打开 websocket 连接
   *
   * 如果存在已打开的 websocket 连接，会先关闭它再打开一个新的连接
   */
  open: Fn;

  /**
   * 发送数据
   *
   * @param data
   * @param useBuffer 当 websocket 连接尚未打开时，是否把数据存储在 buffer 中并在连接打开时发送它们。默认为 true。
   */
  send: (data: string | ArrayBuffer, useBuffer?: boolean) => boolean;

  /** SocketTask 实例引用 */
  task: Ref<SocketTask | undefined>;
}

function resolveNestedOptions<T>(options: T | true): T {
  if (options === true) return {} as T;
  return options;
}

/**
 * 响应式的 Socket 客户端
 *
 * https://uniapp.dcloud.net.cn/api/request/websocket.html
 */
// eslint-disable-next-line sonarjs/cognitive-complexity
export function useSocket<Data = any>(
  url: MaybeComputedRef<string | undefined>,
  options: UseSocketOptions = {},
): UseSocketReturn<Data> {
  const {
    onConnected,
    onClosed,
    onError,
    onMessage,
    heartbeat = false,
    autoReconnect = false,
    immediate = true,
    autoClose = true,
    multiple = false,
    headers,
    method = 'GET',
    protocols = [],
  } = options;

  const data: Ref<Data | null> = ref(null);
  const status = ref<SocketStatus>('CLOSED');
  const isOpen = computed(() => status.value === 'OPEN');
  const isConnecting = computed(() => status.value === 'CONNECTING');
  const isClosed = computed(() => status.value === 'CLOSED');
  const taskRef = ref<SocketTask | undefined>();
  const urlRef = resolveRef(url);

  let heartbeatPause: Fn | undefined;
  let heartbeatResume: Fn | undefined;

  let explicitlyClosed = false;
  let retried = 0;

  let bufferedData: (string | ArrayBuffer)[] = [];

  let pongTimeoutWait: ReturnType<typeof setTimeout> | undefined;

  // 1000 表示正常关闭
  // https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent/code
  // https://uniapp.dcloud.net.cn/api/request/socket-task.html#sockettask-close
  const close: SocketTask['close'] = ({ code = 1000, reason } = {}) => {
    if (!taskRef.value) return;
    explicitlyClosed = true;
    heartbeatPause?.();
    taskRef.value.close({ code, reason });
  };

  const _sendBuffer = () => {
    if (bufferedData.length > 0 && taskRef.value && status.value === 'OPEN') {
      for (const buffer of bufferedData) taskRef.value.send({ data: buffer });
      bufferedData = [];
    }
  };

  const resetHeartbeat = () => {
    clearTimeout(pongTimeoutWait);
    pongTimeoutWait = undefined;
  };

  const send = (data: string | ArrayBuffer, useBuffer = true) => {
    if (!taskRef.value || status.value !== 'OPEN') {
      if (useBuffer) bufferedData.push(data);
      return false;
    }
    _sendBuffer();
    taskRef.value.send({ data });
    return true;
  };

  const _init = () => {
    if (explicitlyClosed || urlRef.value === undefined) return;

    const task = uni.connectSocket({
      url: urlRef.value,
      multiple,
      header: headers,
      method,
      protocols,
    });
    taskRef.value = task;
    status.value = 'CONNECTING';

    task.onOpen((result) => {
      status.value = 'OPEN';
      onConnected?.(task, result);
      heartbeatResume?.();
      _sendBuffer();
    });

    task.onClose((result) => {
      status.value = 'CLOSED';
      taskRef.value = undefined;
      onClosed?.(task, result);
      if (!explicitlyClosed && autoReconnect) {
        const { retries = -1, delay = 1000, onFailed } = resolveNestedOptions(autoReconnect);
        retried += 1;
        if (typeof retries === 'number' && (retries < 0 || retried < retries))
          setTimeout(_init, delay);
        else if (typeof retries === 'function' && retries()) setTimeout(_init, delay);
        else onFailed?.();
      }
    });

    task.onError((error) => {
      onError?.(task, error);
    });

    task.onMessage((result) => {
      if (heartbeat) {
        resetHeartbeat();
        const { message = DEFAULT_PING_MESSAGE } = resolveNestedOptions(heartbeat);
        if (result.data === message) return;
      }
      data.value = result.data;
      onMessage?.(task, result);
    });
  };

  if (heartbeat) {
    const {
      message = DEFAULT_PING_MESSAGE,
      interval = 1000,
      pongTimeout = 1000,
    } = resolveNestedOptions(heartbeat);

    const { pause, resume } = useIntervalFn(
      () => {
        send(message, false);
        if (pongTimeoutWait != null) return;
        pongTimeoutWait = setTimeout(() => {
          // 明确关闭连接以避免重试
          close({});
        }, pongTimeout);
      },
      interval,
      { immediate: false },
    );

    heartbeatPause = pause;
    heartbeatResume = resume;
  }

  if (autoClose) {
    tryOnUnload(() => close({}));
    tryOnScopeDispose(() => close({}));
  }

  const open = () => {
    close({});
    explicitlyClosed = false;
    retried = 0;
    _init();
  };

  if (immediate) watch(urlRef, open, { immediate: true });

  return {
    data,
    status,
    isOpen,
    isConnecting,
    isClosed,
    close,
    send,
    open,
    task: taskRef,
  };
}
