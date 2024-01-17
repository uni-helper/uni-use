import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  entries: ['./src/index'],
  clean: true,
  declaration: true,
  externals:[
    '@dcloudio/uni-cli-shared',
  ],
  rollup: {
    emitCJS: true,
    esbuild: {
      target: 'es2017',
    },
  },
});
