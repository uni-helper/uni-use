export function useSystemInfo() {
  const systemInfo = uni.getSystemInfoSync();
  return systemInfo;
}
