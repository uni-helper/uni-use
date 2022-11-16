export function useSystemSetting() {
  const systemSetting = uni.getSystemSetting();
  return systemSetting;
}
