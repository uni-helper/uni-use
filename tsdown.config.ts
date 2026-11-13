import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./src/index.ts'],
  dts: true,
  format: ['esm', 'cjs'],
  target: 'es2017',
  fixedExtension: true,
  clean: true,
  deps: {
    neverBundle: ['@dcloudio/uni-cli-shared', '@vue/runtime-core'],
  },
})
