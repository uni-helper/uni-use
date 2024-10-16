# @uni-helper/uni-use

[![License](https://img.shields.io/github/license/uni-helper/uni-use)](https://github.com/uni-helper/uni-use/blob/main/LICENSE)
[![npm](https://img.shields.io/npm/v/@uni-helper/uni-use)](https://www.npmjs.com/package/@uni-helper/uni-use)

`uni-app (vue3)` 组合式工具集。要求 `node>=18`。

- [@uni-helper/uni-use](#uni-helperuni-use)
  - [安装依赖](#安装依赖)
  - [使用](#使用)
  - [其它](#其它)
    - [限制](#限制)
    - [构建](#构建)
    - [和 `unplugin-auto-import` 结合使用](#和-unplugin-auto-import-结合使用)
    - [EventBus](#eventbus)
    - [TypeScript](#typescript)
  - [资源](#资源)
  - [致谢](#致谢)

## 安装依赖

```shell
npm install @uni-helper/uni-use @vueuse/core@9
```

如果你希望使用 `@vueuse/core` v10，请参考 [uni-app#4604](https://github.com/dcloudio/uni-app/issues/4604)。

<details>
  <summary>yarn v2 或以上</summary>
  <p>请参考 <a href="https://yarnpkg.com/configuration/yarnrc/#nodeLinker">文档</a> 设置 <code>nodeLinker</code> 为 <code>node_modules</code>。</p>
</details>

<details>
  <summary>pnpm</summary>
  <p>请参考 <a href="https://pnpm.io/npmrc#shamefully-hoist">文档</a> 设置 <code>shamefully-hoist</code> 为 <code>true</code>。</p>
</details>

目前没有支持 `uni_modules` 的计划，但欢迎 PR 贡献。

## 使用

详情请看 [`uni-use`函数列表](./src/apis/index.md)

## 其它

### 限制

在小程序和移动应用环境下有如下无法避开的限制：

- 缺失某些全局变量（如 `window`、`navigator` 等）
- 必须使用 `uni-app` 提供的 API 实现功能（如拦截器、存储等），API 不支持的也就无法支持，比如拦截同步 API、监听其它地方引起的剪切板变化等
- 无法使用顶层 `await`

在开发网页时，建议直接使用 `vue`，避免过多的环境判断代码，同时也能享受更好的生态，如 `vueuse` 的完整支持。

### 构建

目前 `@uni-helper/uni-use` 会使用 `unbuild` 将 `uni` API 之外的部分转译到 `ES2017`（即 `ES8`）。`uni` API 需要在项目构建时由 `uni-app` 官方提供的插件处理。

对于 `vite + vue3` 项目，请先设置 `build.target` 为 `ES6`。

```typescript
import { defineConfig } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: 'es6',
    cssTarget: 'chrome61', // https://cn.vitejs.dev/config/build-options.html#build-csstarget
  },
  optimizeDeps: {
    exclude: ['vue-demi'],
  },
  plugins: [
    ...,
    uni(),
    ...,
  ],
});
```

然后在 `src/main.ts` 或 `src/main.js` 处自行添加 polyfill。以下是使用 [core-js](https://github.com/zloirock/core-js) 的示例（需要自行安装 `core-js`），你也可以使用 [es-shims](https://github.com/es-shims)。

```typescript
import 'core-js/actual/array/iterator';
import 'core-js/actual/promise';
import 'core-js/actual/object/assign';
import 'core-js/actual/promise/finally';
// 你可以根据需要自行添加额外的 polyfills
// import 'core-js/actual/object/values'
import { createSSRApp } from 'vue';
import App from './App.vue';

export function createApp() {
  const app = createSSRApp(App);
  return {
    app,
  };
}
```

微信小程序的 JavaScript 支持度见 [wechat-miniprogram/miniprogram-compat](https://github.com/wechat-miniprogram/miniprogram-compat)。微信小程序要支持 `vue3`，需设置基础库最低版本为 2.11.2 或以上，2.11.2 对应 `chrome>=53,ios>=10`。

### 和 `unplugin-auto-import` 结合使用

```typescript
// vite.config.ts
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import autoImport from 'unplugin-auto-import/vite';
import { uniuseAutoImports } from '@uni-helper/uni-use';
import uni from '@dcloudio/vite-plugin-uni';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    autoImport({
      imports: [
        uniuseAutoImports(),
      ],
    }),
    uni({ ... }),
  ],
});

```

### EventBus

如果你想使用 `EventBus`，请考虑使用 [VueUse - useEventBus](https://vueuse.org/core/useeventbus/#useeventbus)、[mitt](https://github.com/developit/mitt) 或 [nanoevents](https://github.com/ai/nanoevents)。这个库不再重复提供类似功能。

### TypeScript

`@uni-helper/uni-use` 本身使用 [TypeScript](https://www.typescriptlang.org/) 开发，拥有类型提示。

## 资源

- [改动日志](https://github.com/uni-helper/uni-use/tree/main/CHANGELOG.md)

## 致谢

- [vueuse](https://vueuse.org/) [#1073](https://github.com/vueuse/vueuse/pull/1073)
- [taro-hooks](https://taro-hooks-innocces.vercel.app/)
- [tob-use](https://tob-use.netlify.app/)
