import { ref } from 'vue';

/**
 * Get the current application instance, use useGlobalData for globalData
 */
export function useApp() {
  const app = ref(getApp());

  return app;
}
