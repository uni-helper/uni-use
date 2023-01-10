export function useDeviceInfo() {
  const deviceInfo = uni.getDeviceInfo();
  return deviceInfo;
}
