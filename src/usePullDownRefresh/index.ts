export function usePullDownRefresh() {
  const startPullDownRefresh = (options: UniApp.StartPullDownRefreshOptions) =>
    uni.startPullDownRefresh(options);

  const stopPullDownRefresh = () => uni.stopPullDownRefresh();

  return {
    startPullDownRefresh,
    start: startPullDownRefresh,
    stopPullDownRefresh,
    stop: stopPullDownRefresh,
  };
}
