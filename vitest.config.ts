import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: [
      {
        find: '@uni-helper/uni-use',
        replacement: resolve(__dirname, 'src/index.ts'),
      },
      // uni-h5 的 ESM 产物从 vue 里取 injectHook 这类钩子，那是 @dcloudio 的 vue 分支
      // 才有的导出，所以测试里把 vue 整体指到 uni-app 用的那份运行时
      { find: /^vue$/, replacement: '@dcloudio/uni-h5-vue' },
      // uni-app 的 CJS 产物走 Node 的 require，绕不过别名；指到 ESM 产物才会经过 Vite
      { find: /^@dcloudio\/uni-app$/, replacement: '@dcloudio/uni-app/dist/uni-app.es.js' },
    ],
    dedupe: [
      '@dcloudio/uni-app',
      'vue',
    ],
  },
  test: {
    environment: 'jsdom',
    setupFiles: [
      resolve(__dirname, 'test/setup.ts'),
    ],
    reporters: 'dot',
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
    server: {
      deps: {
        // uni-app 的产物内部 import 'vue'，必须内联，否则它拿到的是另一个 Vue 实例，
        // 跨实例的响应式不互通，watch 不会触发
        inline: [
          '@dcloudio/uni-app',
        ],
      },
    },
  },
  ssr: {
    noExternal: [
      /@uni-helper\/uni-use/,
    ],
  },
})
