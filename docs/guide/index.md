# 开始

`uni-app (vue3)` 组合式工具集。要求 `node>=18`。

## 安装

```bash
npm install @uni-helper/uni-use @vueuse/core@9
```

如果你希望使用 `@vueuse/core` v10+，请参考 [uni-app#4604](https://github.com/dcloudio/uni-app/issues/4604)， 自行提供 `polyfill` 或者参考使用 [`vite-plugin-uni-polyfill`](https://github.com/Ares-Chang/vite-plugin-uni-polyfill)。

::: details yarn v2 或以上
请参考 [文档](https://yarnpkg.com/configuration/yarnrc/#nodeLinker) 设置 `nodeLinker` 为 `node_modules`。
:::

::: details pnpm
请参考 [文档](https://pnpm.io/npmrc#shamefully-hoist) 设置 `shamefully-hoist` 为 `true`。
:::

> 目前没有支持 uni_modules 的计划，但欢迎 PR 贡献。

## 使用

```ts
import { tryOnLoad } from '@uni-helper/uni-use';

tryOnLoad(() => {
  console.log('onLoad');
});
```

其它详情请查看所有 [API](/apis.md)。

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

### TypeScript

`@uni-helper/uni-use` 本身使用 [TypeScript](https://www.typescriptlang.org/) 开发，天然具有类型提示。

## 贡献

如果有新想法，热爱开源，欢迎 PR 贡献。

## 感谢

感谢以下项目提供的灵感及帮助。

- [vueuse](https://vueuse.org/) and [#1073](https://github.com/vueuse/vueuse/pull/1073)
- [taro-hooks](https://taro-hooks-innocces.vercel.app/)
- [tob-use](https://tob-use.netlify.app/)
