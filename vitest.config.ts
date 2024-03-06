import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@uni-helper/uni-use': resolve(__dirname, 'src/index.ts'),
    },
    dedupe: [
      '@dcloudio/uni-app',
    ],
  },
  test: {
    environment: 'jsdom',
    setupFiles: [resolve(__dirname, 'test/setup.ts')],
    reporters: 'dot',
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
    server: {
      deps: {
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
});
