export function useAppBaseInfo() {
  const appBaseInfo = uni.getAppBaseInfo();
  return appBaseInfo;
}
