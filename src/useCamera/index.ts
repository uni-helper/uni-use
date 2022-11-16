export function useCamera() {
  const createCameraContext = () => uni.createCameraContext();

  return {
    createCameraContext,
    createContext: createCameraContext,
  };
}
