import { defineConfig } from 'rollup';
import { rollupIndexConfig, rollupIndexTypesConfig } from '@modyqyw/utils';

export default defineConfig([
  rollupIndexConfig(undefined, {
    esbuild: {
      target: 'es2020',
      define: {
        'process.env.NODE_ENV': 'process.env.NODE_ENV',
      },
    },
  }),
  rollupIndexTypesConfig(),
]);
