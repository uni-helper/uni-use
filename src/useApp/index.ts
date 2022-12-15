import { ref } from 'vue';

// FIXME
// src/useApp/index.ts(4,17): error TS2742: The inferred type of 'useApp' cannot be named without a reference to '.pnpm/@dcloudio+types@3.2.3/node_modules/@dcloudio/types/uni-app/uni/base/UnhandledRejectiond'. This is likely not portable. A type annotation is necessary.
// src/useApp/index.ts(4,17): error TS2742: The inferred type of 'useApp' cannot be named without a reference to '.pnpm/@dcloudio+types@3.2.3/node_modules/@dcloudio/types/uni-app/uni/base/ThemeChange'. This is likely not portable. A type annotation is necessary.

/** Get the current application instance, use useGlobalData for globalData */
export function useApp() {
  const app = ref<ReturnType<typeof getApp>>(getApp());

  return app;
}
