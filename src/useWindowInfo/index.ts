export function useWindowInfo() {
  const windowInfo = uni.getWindowInfo();
  return windowInfo;
}
