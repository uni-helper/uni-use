# @uni-helper/uni-use

<p align="center">
  <img src="https://cdn.jsdelivr.net/gh/uni-helper/uni-use@main/logo.svg" alt="logo" width="256" height="256" />
</p>

<p align="center">
  <a href="https://github.com/uni-helper/uni-use/blob/main/LICENSE"><img src="https://img.shields.io/github/license/uni-helper/uni-use?style=for-the-badge&labelColor=005947&color=eee" alt="License"></a>
  <a href="https://github.com/uni-helper/uni-use/stargazers"><img src="https://img.shields.io/github/stars/uni-helper/uni-use?style=for-the-badge&labelColor=005947&color=eee" alt="GitHub Stars"></a>
  <a href="https://npmx.dev/package/@uni-helper/uni-use"><img src="https://img.shields.io/npm/v/@uni-helper/uni-use?style=for-the-badge&labelColor=005947&color=eee" alt="NPM version"></a>
  <a href="https://npmx.dev/package/@uni-helper/uni-use"><img src="https://img.shields.io/npm/dm/@uni-helper/uni-use?style=for-the-badge&labelColor=005947&color=eee" alt="npm downloads"></a>
</p>
<p align="center">
  <a href="https://github.com/ModyQyW"><img src="https://img.shields.io/badge/Author-ModyQyW-blue?style=for-the-badge" alt="Author"></a>
  <a href="https://github.com/edwinhuish"><img src="https://img.shields.io/badge/Maintainer-edwinhuish-blue?style=for-the-badge" alt="Maintainer"></a>
</p>

`uni-app (vue3)` 组合式工具集。要求 `node >= 18`。

不想看文档？直接问 AI 🤖 <a href="https://deepwiki.com/uni-helper/uni-use"><img src="https://deepwiki.com/badge.svg" alt="Ask DeepWiki"></a>

## 安装

```shell
npm install @uni-helper/uni-use
```

不依赖 `@vueuse/core`，装这一个包就行。

<details>
  <summary>yarn v2 或以上</summary>
  <p>请参考 <a href="https://yarnpkg.com/configuration/yarnrc/#nodeLinker">文档</a> 设置 <code>nodeLinker</code> 为 <code>node_modules</code>。</p>
</details>

<details>
  <summary>pnpm</summary>
  <p>请参考 <a href="https://pnpm.io/settings#publicHoistPattern">文档</a> 设置 <code>publicHoistPattern</code> 为 <code>['*']</code>（pnpm 11 及以前写作 <code>shamefully-hoist=true</code>）。</p>
</details>

## 使用

```ts
import { tryOnLoad } from '@uni-helper/uni-use'

tryOnLoad(() => {
  console.log('onLoad')
})
```

全部函数见[函数列表](https://uni-helper.github.io/uni-use/api/)。

### 和 `unplugin-auto-import` 结合使用

```typescript
// vite.config.ts
import { fileURLToPath } from 'node:url'
import uni from '@dcloudio/vite-plugin-uni'
import { uniuseAutoImports } from '@uni-helper/uni-use'
import autoImport from 'unplugin-auto-import/vite'
import { defineConfig } from 'vitest/config'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    autoImport({
      imports: [
        uniuseAutoImports(),
      ],
    }),
    uni({ /* ... */ }),
  ],
})
```

### TypeScript

`@uni-helper/uni-use` 用 [TypeScript](https://www.typescriptlang.org/) 编写，自带类型提示。

### EventBus

需要 `EventBus` 的话，用 [VueUse - useEventBus](https://vueuse.org/core/useeventbus/#useeventbus)、[mitt](https://github.com/developit/mitt) 或 [nanoevents](https://github.com/ai/nanoevents)，这个库不重复实现。

## 限制

在小程序和移动应用环境下有如下无法避开的限制：

- 缺失某些全局变量（如 `window`、`navigator` 等）
- 必须使用 `uni-app` 提供的 API 实现功能（如拦截器、存储等），API 不支持的也就无法支持，比如拦截同步 API、监听其它地方引起的剪切板变化等
- 无法使用顶层 `await`

在开发网页时，建议直接使用 `vue`，避免过多的环境判断代码，同时也能享受更好的生态，如 `vueuse` 的完整支持。

## 构建

`@uni-helper/uni-use` 用 `tsdown` 构建，`uni` API 之外的部分会转译到 `ES2017`（即 `ES8`）。`uni` API 由 `uni-app` 官方提供的插件在项目构建时处理。

对于 `vite + vue3` 项目，请先设置 `build.target` 为 `ES6`。

```typescript
import uni from '@dcloudio/vite-plugin-uni'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: 'es6',
    cssTarget: 'chrome61', // https://cn.vitejs.dev/config/build-options.html#build-csstarget
  },
  plugins: [
    // ...,
    uni(),
    // ...,
  ],
})
```

然后在 `src/main.ts` 或 `src/main.js` 处自行添加 polyfill。以下是使用 [core-js](https://github.com/zloirock/core-js) 的示例（需要自行安装 `core-js`），你也可以使用 [es-shims](https://github.com/es-shims)。

```typescript
// 你可以根据需要自行添加额外的 polyfills
// import 'core-js/actual/object/values'
import { createSSRApp } from 'vue'
import App from './App.vue'
import 'core-js/actual/array/iterator'
import 'core-js/actual/promise'
import 'core-js/actual/object/assign'
import 'core-js/actual/promise/finally'

export function createApp() {
  const app = createSSRApp(App)
  return {
    app,
  }
}
```

微信小程序的 JavaScript 支持度见 [wechat-miniprogram/miniprogram-compat](https://github.com/wechat-miniprogram/miniprogram-compat)。微信小程序要支持 `vue3`，需设置基础库最低版本为 2.11.2 或以上，2.11.2 对应 `chrome>=53,ios>=10`。

## 资源

- [文档](https://uni-helper.github.io/uni-use/)
- [改动日志](https://github.com/uni-helper/uni-use/blob/main/CHANGELOG.md)

## 贡献者

<a href="https://github.com/uni-helper/uni-use/graphs/contributors">
  <img alt="Contributors" src="https://contrib.rocks/image?repo=uni-helper/uni-use" />
</a>

## 参与贡献

欢迎参与贡献，请阅读[贡献指南](./CONTRIBUTING.md)。

## 许可证

[MIT](https://github.com/uni-helper/uni-use/blob/main/LICENSE)

## 致谢

- [vueuse](https://vueuse.org/) [#1073](https://github.com/vueuse/vueuse/pull/1073)
- [taro-hooks](https://taro-hooks-innocces.vercel.app/)
- [tob-use](https://tob-use.netlify.app/)
