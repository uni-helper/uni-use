export function useAudio() {
  const backgroundAudioManager = uni.getBackgroundAudioManager();

  const useBackgroundAudioManager = () => backgroundAudioManager;

  const createInnerAudioContext = () => uni.createInnerAudioContext();

  return {
    backgroundAudioManager,
    backgroundManager: backgroundAudioManager,
    useBackgroundAudioManager,
    useBackgroundManager: useBackgroundAudioManager,
    createInnerAudioContext,
    createInnerContext: createInnerAudioContext,
  };
}
