export function useMap() {
  const createMapContext = (...params: Parameters<UniApp.Uni['createMapContext']>) =>
    uni.createMapContext(...params);

  return {
    createMapContext,
    createContext: createMapContext,
  };
}
