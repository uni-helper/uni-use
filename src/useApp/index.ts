import { ref } from 'vue';
// this line resolves dts build error
import '@dcloudio/types/uni-app/app';

/** Get the current application instance, use useGlobalData for globalData */
export function useApp() {
  const app = ref(getApp());

  return app;
}
