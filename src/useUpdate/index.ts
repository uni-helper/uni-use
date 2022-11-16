export function useUpdate() {
  const updateManager = uni.getUpdateManager();

  const useUpdateManager = () => updateManager;

  return {
    updateManager,
    manager: updateManager,
    useUpdateManager,
    useManager: useUpdateManager,
  };
}
