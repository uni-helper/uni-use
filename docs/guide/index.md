# 开始

`uni-app (vue3)` 组合式工具集。要求 `node >= 18`。

## 安装

```bash
npm install @uni-helper/uni-use
```

不依赖 `@vueuse/core`，装这一个包就行。

::: details yarn v2 或以上
请参考 [文档](https://yarnpkg.com/configuration/yarnrc/#nodeLinker) 设置 `nodeLinker` 为 `node_modules`。
:::

::: details pnpm
请参考 [文档](https://pnpm.io/settings#publicHoistPattern) 设置 `publicHoistPattern` 为 `['*']`（pnpm 11 及以前写作 `shamefully-hoist=true`）。
:::

## 使用

```ts
import { tryOnLoad } from '@uni-helper/uni-use'

tryOnLoad(() => {
  console.log('onLoad')
})
```

全部函数见 [API 列表](/api/)。

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

`@uni-helper/uni-use` 本身使用 [TypeScript](https://www.typescriptlang.org/) 开发，自带类型提示。

## 贡献

欢迎 PR 贡献，细节见[贡献指南](https://github.com/uni-helper/uni-use/blob/main/CONTRIBUTING.md)。改动较大时先开 issue 对一下方案。

## 感谢

感谢以下项目提供的灵感及帮助。

- [vueuse](https://vueuse.org/) [#1073](https://github.com/vueuse/vueuse/pull/1073)
- [taro-hooks](https://taro-hooks-innocces.vercel.app/)
- [tob-use](https://tob-use.netlify.app/)
