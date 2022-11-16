export function useRecorder() {
  const recorderManager = uni.getRecorderManager();

  const useRecorderManager = () => recorderManager;

  return {
    recorderManager,
    manager: recorderManager,
    useRecorderManager,
    useManager: useRecorderManager,
  };
}
