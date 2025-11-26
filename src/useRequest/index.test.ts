import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick, ref } from 'vue';
import { useRequest } from './index';

describe('useRequest', () => {
  // Mock request task
  const mockRequestTask = {
    abort: vi.fn(),
    onHeadersReceived: vi.fn(),
    offHeadersReceived: vi.fn(),
  };

  // Setup spy on uni.request before each test
  let requestSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    requestSpy = vi.spyOn(uni, 'request');
    requestSpy.mockImplementation(({ success }: any) => {
      // 默认模拟成功的响应
      setTimeout(() => {
        success?.({
          data: { message: 'success' },
          statusCode: 200,
          header: {},
          cookies: [],
        });
      }, 10);
      return mockRequestTask as any;
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should export the useRequest function', () => {
    expect(typeof useRequest).toBe('function');
  });

  it('should return correct properties', () => {
    const {
      task,
      response,
      data,
      isFinished,
      isLoading,
      isAborted,
      error,
      abort,
      cancel,
      isCanceled,
      execute,
    } = useRequest('/api/test');

    expect(task).toBeDefined();
    expect(response).toBeDefined();
    expect(data).toBeDefined();
    expect(isFinished).toBeDefined();
    expect(isLoading).toBeDefined();
    expect(isAborted).toBeDefined();
    expect(error).toBeDefined();
    expect(typeof abort).toBe('function');
    expect(typeof cancel).toBe('function');
    expect(typeof isCanceled).toBe('object');
    expect(typeof execute).toBe('function');
  });

  it('should automatically send request when url is provided and immediate is true', async () => {
    const req = useRequest('/api/test');

    expect(requestSpy).toHaveBeenCalledOnce();
    expect(req.isLoading.value).toBe(true);

    // 等待请求完成
    await req;

    expect(req.isFinished.value).toBe(true);
    expect(req.isLoading.value).toBe(false);
    expect(req.data.value).toEqual({ message: 'success' });
  });

  it('should not automatically send request when immediate is false', () => {
    const req = useRequest('/api/test', {}, { immediate: false });

    expect(requestSpy).not.toHaveBeenCalled();
    expect(req.isLoading.value).toBe(false);
  });

  it('should execute request manually when execute is called', async () => {
    const req = useRequest('/api/test', {}, { immediate: false });

    expect(requestSpy).not.toHaveBeenCalled();

    req.execute();

    expect(requestSpy).toHaveBeenCalledOnce();
    expect(req.isLoading.value).toBe(true);

    // 等待请求完成
    await req;

    expect(req.isFinished.value).toBe(true);
    expect(req.isLoading.value).toBe(false);
    expect(req.data.value).toEqual({ message: 'success' });
  });

  it('should handle request errors correctly', async () => {
    // 模拟失败的请求
    requestSpy.mockImplementation(({ fail }: any) => {
      setTimeout(() => {
        fail?.({
          errMsg: 'Network Error',
        });
      }, 10);
      return mockRequestTask as any;
    });

    const req = useRequest('/api/test');

    expect(requestSpy).toHaveBeenCalledOnce();
    expect(req.isLoading.value).toBe(true);

    // 等待请求完成
    await req.catch(() => {
      // 忽略错误
    });

    expect(req.isFinished.value).toBe(true);
    expect(req.isLoading.value).toBe(false);
    expect(req.error.value).toEqual({ errMsg: 'Network Error' });
  });

  it('should abort request correctly', async () => {
    const req = useRequest('/api/test');

    expect(req.isLoading.value).toBe(true);

    req.abort();

    expect(mockRequestTask.abort).toHaveBeenCalled();
    expect(req.isAborted.value).toBe(true);
    expect(req.isLoading.value).toBe(false);
  });

  it('should work with reactive url', async () => {
    const url = ref('/api/test1');
    const req = useRequest(url, {}, { immediate: false });

    await req.execute();

    expect(requestSpy).toHaveBeenCalledWith(expect.objectContaining({
      url: '/api/test1',
    }));

    url.value = '/api/test2';
    await nextTick();

    await req.execute();

    expect(requestSpy).toHaveBeenCalledWith(expect.objectContaining({
      url: '/api/test2',
    }));
  });

  it('should reset data when resetOnExecute is true', async () => {
    const initialData = { message: 'initial' };
    const req = useRequest('/api/test', {}, {
      immediate: false,
      initialData,
      resetOnExecute: true,
    });

    req.data.value = { message: 'modified' };
    expect(req.data.value).toEqual({ message: 'modified' });

    // 模拟失败的请求
    requestSpy.mockImplementation(({ fail }: any) => {
      setTimeout(() => {
        fail?.({
          errMsg: 'Network Error',
        });
      }, 10);
      return mockRequestTask as any;
    });

    await req.execute().catch(() => {});

    // 数据应该被重置为初始值
    expect(req.data.value).toEqual(initialData);
  });

  it('should call onSuccess callback on successful request', async () => {
    const onSuccess = vi.fn();

    // 等待请求完成
    await useRequest('/api/test', {}, { onSuccess });

    expect(onSuccess).toHaveBeenCalledWith({ message: 'success' });
  });

  it('should call onError callback on failed request', async () => {
    // 模拟失败的请求
    requestSpy.mockImplementation(({ fail }: any) => {
      setTimeout(() => {
        fail?.({
          errMsg: 'Network Error',
        });
      }, 10);
      return mockRequestTask as any;
    });

    const onError = vi.fn();
    await useRequest('/api/test', {}, { onError }).catch(() => {});

    expect(onError).toHaveBeenCalledWith({ errMsg: 'Network Error' });
  });

  it('should call onFinish callback when request finishes', async () => {
    const onFinish = vi.fn();

    // 等待请求完成
    await useRequest('/api/test', {}, { onFinish });

    expect(onFinish).toHaveBeenCalled();
  });
});
