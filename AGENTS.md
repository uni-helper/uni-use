# uni-use

`@uni-helper/uni-use` 是 uni-app（Vue 3）的组合式工具集，每个函数一个目录，构建成单个 npm 包。根 `package.json` 就是发布包；workspace 里另外挂了 `docs`（文档站）和 `playground`（演示项目）。

## Project

- TypeScript。`tsconfig.json` 继承 `@tsconfig/node26`，覆写 `target`、`lib`、`module`、`moduleResolution: Bundler`、`strict`、`resolveJsonModule`，并通过 `types: ["node", "@dcloudio/types"]` 拿到全局的 `uni`、`plus`。仓库里没有 `types/` 目录：测试要用的模块声明在 `test/env.d.ts`，文档站的在 `docs/.vitepress/env.d.ts`，`docs/tsconfig.json` 自己管 `.vitepress`。
- 构建用 tsdown（`tsdown.config.ts`）：入口 `src/index.ts`，输出 ESM + CJS + 类型声明到 `dist/`，目标 `es2017`，`fixedExtension: true` 固定 `index.mjs`、`index.cjs`、`index.d.mts`、`index.d.cts`，和 `exports` 一一对应。`@dcloudio/uni-cli-shared`、`@vue/runtime-core` 在 `deps.neverBundle` 里。ESM 会多一个 `rolldown-runtime-*.mjs`，是运行时帮助代码，跟着 `dist` 一起发布。
- **`vue` 必须留在 `peerDependencies`。** 只放在 `devDependencies` 时 tsdown 会把整个 Vue 打进产物（`dist/index.mjs` 从 57 kB 涨到 1.1 MB），consumer 还会拿到第二份 Vue。
- Node：开发用 `26`（`.node-version` 与 `devEngines.runtime` 一致，`onFail: warn` 只警告），发布包 `engines.node` 是 `>=18`。CI 读 `.node-version`。
- pnpm `12.18.0`（`packageManager` + `devEngines.packageManager`）。`pnpm-workspace.yaml` 里放着 `packages`（docs、playground）、`catalog`、`allowBuilds`、`trustPolicyExclude`。
- **所有依赖版本都写在 `catalog`**，三个 `package.json` 里只写 `"catalog:"`。改 `@dcloudio/*` 时要把整组快照一起改，`vue`、`vite` 跟着快照走。
- 不依赖 `@vueuse/core`：用到的 6 个工具函数和 5 个类型都在 `src/utils.ts`、`src/types.ts` 里自己实现。这也让 `publicHoistPattern` 失去了存在理由——原先 playground 构建失败，是因为 `@vueuse/core` 在 `@uni-helper/uni-use` 下找不到兄弟包 `@vueuse/shared`。
- `useRequest`、`useDownloadFile`、`useUploadFile` 共用 `src/uni-task.ts` 的状态机，只各自提供 `uni.*` 调用和取数方式。`await` 用的是按次新建的 thenable，不是共享 Promise，所以重复 `execute()` 能等到新结果。
- peer 只有 `vue ^3.2.47` 和 `typescript ^5.0.0 || ^6.0.0`（后者 optional）。
- 没有 Git hooks、commitlint、lint-staged、prettier、publint、taze；质量闸门是 build + lint + typecheck。
- 测试用 vitest 3 + jsdom，只在本地跑。CI（`.github/workflows/ci.yml`）跑 `build`、`lint`、`typecheck` 三个命令。

## Commands

```bash
pnpm dev              # tsdown --watch
pnpm build            # 构建到 dist/（ESM + CJS + dts，es2017）
pnpm test             # vitest，默认监听
pnpm exec vitest run  # vitest 只跑一次
pnpm typecheck        # tsc --noEmit
pnpm lint             # eslint .，只报不改
pnpm lint:fix         # 同上并自动修复
pnpm docs:dev         # 转给 docs 包：vitepress dev .
pnpm docs:build       # 转给 docs 包，产物在 docs/.vitepress/dist
pnpm release          # 维护者：install + lint + bumpp
pnpm -C playground dev:h5   # 跑 playground，其它平台脚本见 playground/package.json
```

只跑一个测试文件：`pnpm exec vitest run test/useRequest.test.ts`。

## Architecture

| 路径 | 职责 |
| --- | --- |
| `src/<函数名>/index.ts` | 一个函数一个目录，实现写在 `index.ts` |
| `src/exports.ts` | 桶文件，按字母序 `export * from` 每个函数 |
| `src/index.ts` | 再导出 `exports.ts`，另加 `uniuseAutoImports`、`UniUseAutoImports`（已废弃）和相关类型 |
| `docs/api/<函数名>.md` | 该函数的文档页，文件名就是站内路由 `/api/<函数名>` |
| `docs/api/index.md` | 文档站的函数列表页，路由 `/api/` |
| `src/utils.ts` | 内部工具，含替代 VueUse 的 `unrefValue`、`toValueRef`、`tryOnMounted`、`watchWithFilter`、`waitFor`、`useIntervalFn`；不对外导出 |
| `src/uni-task.ts` | 请求 / 下载 / 上传共用的状态机（`createUniTask`），对外暴露 `data`、`response`、`error`、三个状态 ref、`abort` 和按需新建的 thenable；不对外导出 |
| `src/types.ts` | 公共类型，含 `ConfigurableEventFilter`、`ConfigurableFlush`、`RemovableRef` 等原先来自 VueUse 的类型 |
| `test/<函数名>.test.ts` | 测试，和源码分开放，只有部分函数有 |
| `test/setup.ts` | 从 `@dcloudio/uni-h5` 取 `uni` 挂到全局，固定 `UNI_PLATFORM=h5`，每个用例前清空 DOM |
| `test/mount.ts`、`test/index.ts` | `mount` / `useSetup` / `useInjectedSetup`，挂载组件的测试辅助 |
| `test/env.d.ts` | `@dcloudio/uni-h5`、`@dcloudio/uni-h5-vue` 的模块声明（两个包只发 JS） |
| `vitest.config.ts` | 测试配置：alias、内联规则、jsdom、`singleFork` |
| `docs/package.json` | 文档站是独立 workspace 包，`vitepress` 的 root 就是 `docs` |
| `docs/.vitepress/config.ts` | 站点配置：`cleanUrls` 去掉 `.html` 后缀，侧边栏用 tinyglobby 扫 `docs/api/*.md` 生成 |
| `docs/.vitepress/theme`、`docs/.vitepress/components` | 主题与团队组件 |
| `docs/index.md`、`docs/guide/` | 首页与指南页面 |
| `docs/public/` | 站点静态资源（`logo.svg`），构建时原样复制到产物根目录 |
| `playground/` | uni-app 演示项目，通过 workspace 依赖引用当前源码 |
| `tsdown.config.ts` | 构建配置 |

新增一个函数要四处同步，少一处文档或发布产物就会对不上：

1. `src/<函数名>/index.ts` 实现；
2. `docs/api/<函数名>.md` 写文档；
3. `src/exports.ts` 按字母序加 `export * from './<函数名>';`；
4. `docs/api/index.md` 的函数列表按字母序补一行。

测试放在 `test/<函数名>.test.ts`，新增用例时跟着这个约定走。

`uniuseAutoImports()` 返回的键来自 `Object.keys(UniUse)`，也就是 `exports.ts` 导出的内容。漏了 `export *` 的函数不在自动导入里，包里也导不出来。

文档站的根目录就是 `docs`，路由按文件位置走：`docs/api/index.md` → `/api/`，`docs/api/<函数名>.md` → `/api/<函数名>`。开了 `cleanUrls`，链接不带 `.html`；`base` 是 `/uni-use/`，部署在 GitHub Pages 的项目站点下。`CHANGELOG.md` 留在仓库根，不在站点里，导航直接指向 GitHub 上的文件。

测试环境必须把 `vue` alias 到 `@dcloudio/uni-h5-vue`：uni-app 运行时要用它那套 Vue 的 `injectHook` 等导出。`@dcloudio/uni-app` 也要内联，否则它拿到另一个 Vue 实例，跨实例的响应式不互通，`useStorage` 的 `watch` 不触发，用例会静默失败。

`useSocket` 的 `taskRef` 必须是 `shallowRef`：`ref` 会把平台句柄包成响应式代理，回调里的 `taskRef.value !== task` 身份判断就永远成立，旧连接的回调会照常改状态。

## Conventions

- ESLint 用 `@uni-helper/eslint-config`（套在 `@antfu/eslint-config` 上的一层）。它的默认风格不带分号，仓库已经按它整体格式化过；`eslint.config.js` 里只做了三处调整：关掉 `ts/explicit-function-return-type`（库的返回值靠 TS 推导）、开放 playground 的 `no-console`、关掉 `pnpm-workspace.yaml` 的 `pnpm/yaml-enforce-settings`。`.vscode/settings.json` 关掉了保存时格式化，只跑 ESLint 修复。
- `pnpm lint` 只报不改，`pnpm lint:fix` 才会写文件，提交前跑 `lint` 确认干净。
- `docs/.vitepress/config.ts` 用 tinyglobby 的 `glob` 扫 `src` 下的 markdown，不再引入 fast-glob。
- 注释、JSDoc、提交信息、文档统一用中文；函数文件头部 JSDoc 写一句话说明和官方文档链接。
- 提交遵循 Conventional Commits，没有钩子检查格式。`release.yml` 按 `feat`、`fix`、`docs`、`perf` 前缀提取发布说明，写错前缀的提交不会出现在 Release 里。
- `UniUseAutoImports` 已标记 `@deprecated`，新代码用 `uniuseAutoImports()`。
- `CHANGELOG.md` 由维护者手动补，发布流程不会写它；`release.yml` 每次发布时临时生成提交摘录作为 Release 正文。改版本号时顺手补一节。
