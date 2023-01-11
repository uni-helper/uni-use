import { builtinModules } from 'node:module';
import { defineConfig } from 'rollup';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import esbuild from 'rollup-plugin-esbuild';
import commonjs from '@rollup/plugin-commonjs';
import dts from 'rollup-plugin-dts';
import terser from '@rollup/plugin-terser';
// @ts-ignore
import bundleSize from 'rollup-plugin-bundle-size';
import clean from 'rollup-plugin-delete';
import { getPackageJson } from '@modyqyw/utils';

const isDevelopment = !!process.env.ROLLUP_WATCH;

const {
  main = './dist/index.cjs',
  module = './dist/index.mjs',
  types = './dist/index.d.ts',
  dependencies = {},
  peerDependencies = {},
} = getPackageJson();

const external = [
  ...Object.keys(dependencies),
  ...Object.keys(peerDependencies),
  ...builtinModules,
  ...builtinModules.map((m) => `node:${m}`),
];

export default defineConfig([
  {
    input: './src/index.ts',
    output: [
      {
        file: main,
        format: 'cjs',
        exports: 'named',
        footer: 'module.exports = Object.assign(exports.default || {}, exports)',
      },
      {
        file: module,
        format: 'esm',
      },
    ],
    plugins: [
      json({ preferConst: true }),
      nodeResolve({ preferBuiltins: true }),
      esbuild({ target: 'es2020' }),
      commonjs(),
      isDevelopment ? null : terser({ format: { ascii_only: true } }),
      isDevelopment ? null : bundleSize(),
      clean({
        targets: [main, module],
        runOnce: isDevelopment,
      }),
    ],
    external,
  },
  {
    input: './src/index.ts',
    output: {
      file: types,
      format: 'esm',
    },
    plugins: [
      dts({
        // https://github.com/Swatinem/rollup-plugin-dts/issues/143
        compilerOptions: { preserveSymlinks: false },
        respectExternal: true,
      }),
      isDevelopment ? null : bundleSize(),
      clean({
        targets: [types],
        runOnce: isDevelopment,
      }),
    ],
    external,
  },
]);
