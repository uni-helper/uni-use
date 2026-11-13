# 参与贡献

感谢你对 `@uni-helper/uni-use` 的关注！这份指南说明环境要求、仓库结构、本地怎么跑，以及提 PR 前要做的事。

改动较大或者要加新函数时，先到 [Issues](https://github.com/uni-helper/uni-use/issues) 说说思路，对一下方向再动手。

## 前置条件

| 依赖 | 版本 |
| --- | --- |
| Node.js | 开发用 `26`（[.node-version](https://github.com/uni-helper/uni-use/blob/main/.node-version)，`devEngines` 里也写死了 `26`）。发布出去的包只要求 `>=18`（`package.json#engines`） |
| 包管理器 | `pnpm@12.18.0`（`packageManager` 和 `devEngines` 都固定了，用 Corepack 启用，不要混用 npm 或 yarn） |
| Git | 行尾统一 LF（见 [.editorconfig](https://github.com/uni-helper/uni-use/blob/main/.editorconfig)） |

版本对不上时 `devEngines` 只打印警告，不会拦住安装，所以别指望它帮你发现用错了 Node 版本。

## 仓库结构

```text
.
├── .github/workflows/
│   ├── ci.yml            # push / PR 到 main 时跑构建、lint 和类型检查
│   ├── deploy-docs.yml   # push 到 main 时构建文档站并发到 GitHub Pages
│   └── release.yml       # push 到 main 时按 package.json 的版本号打 tag、发 npm、建 Release
├── docs/                 # 文档站（独立 workspace 包）
│   ├── .vitepress/       # 站点配置与主题
│   ├── guide/            # 指南页面
│   ├── api/              # API 文档，一个函数一个文件
│   │   ├── index.md      # 函数列表页
│   │   └── <函数名>.md   # 每个函数的文档页
│   ├── public/           # 站点静态资源（logo.svg）
│   └── index.md          # 首页
├── playground/           # uni-app 演示项目，通过 workspace 依赖引用当前源码
├── src/
│   ├── exports.ts        # 桶文件，按字母序导出全部函数
│   ├── index.ts          # 再导出 exports.ts，另加 uniuseAutoImports 和相关类型
│   ├── types.ts          # 公共类型
│   ├── utils.ts          # 内部工具函数，也对外导出
│   └── <函数名>/
│       └── index.ts      # 实现
├── test/
│   ├── <函数名>.test.ts  # 测试，只有部分函数有
│   ├── setup.ts          # 把 uni-h5 的 uni 对象挂到全局
│   ├── mount.ts          # 挂载组件的测试辅助函数
│   └── env.d.ts          # 只给测试用的模块声明
├── pnpm-workspace.yaml   # workspace 成员与 catalog（依赖版本都写在这里）
├── tsdown.config.ts      # 构建配置
├── vitest.config.ts      # 测试配置
└── package.json
```

## 本地开发

```shell
git clone https://github.com/uni-helper/uni-use.git
cd uni-use
corepack enable
pnpm install
```

仓库没有 Git hooks，改完代码自己跑一遍下面的检查命令。

| 命令 | 说明 |
| --- | --- |
| `pnpm dev` | 用 tsdown 监听源码，改动即重新构建 |
| `pnpm build` | 完整构建到 `dist/`（ESM + CJS + 类型声明），转译到 `ES2017` |
| `pnpm test` | 跑 vitest，默认进入监听模式 |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm lint` | `eslint .`，只报不改 |
| `pnpm lint:fix` | 同上，能自动修的改掉 |
| `pnpm docs:dev` | 本地起文档站（转给 `docs` 包） |
| `pnpm docs:build` | 构建文档站到 `docs/.vitepress/dist` |
| `pnpm release` | 维护者用：装依赖、跑 `lint`、再用 bumpp 交互式改版本号 |

演示项目在 `playground/`，跑法是在子目录里执行自己的脚本：

```shell
pnpm -C playground dev:h5         # H5
pnpm -C playground dev:mp-weixin  # 微信小程序，其它平台见 playground/package.json
```

## 依赖管理

所有依赖版本写在 `pnpm-workspace.yaml` 的 `catalog` 里，根目录、`docs`、`playground` 三个 `package.json` 只写 `"catalog:"`。升级时改 catalog，再跑一次 `pnpm install`。`@dcloudio/*` 是一组快照，`vue`、`vite` 也跟着它走，别单独升级其中一个。

## 测试与检查

提交前至少跑这三条，和 CI 一致：

```shell
pnpm build
pnpm lint
pnpm typecheck
```

### 测试说明

- 环境是 jsdom，`test/setup.ts` 从 `@dcloudio/uni-h5` 取 `uni` 挂到全局，并把 `UNI_PLATFORM` 固定为 `h5`。测试里直接调 `uni.*` 就行，不用 mock。
- 每个用例开始前会清空 `document.body` 和 `document.head`。
- `@uni-helper/uni-use` 被 alias 到 `src/index.ts`，测试跑的是源码，不需要先构建。
- `vitest.config.ts` 把 `vue` 指到 `@dcloudio/uni-h5-vue`：uni-app 的运行时从 vue 里取 `injectHook` 这类只有它那套 Vue 才有的导出。`@dcloudio/uni-app` 也要内联，否则它拿到另一个 Vue 实例，`watch` 不会触发，`useStorage` 这类用例会静默失败。
- 只跑单个文件：`pnpm exec vitest run test/useRequest.test.ts`。加 `--watch` 进监听模式。
- **CI 目前不跑测试**，只有 `build`、`lint` 和 `typecheck`。测试得在本地跑过再提 PR。

## 代码风格

格式化与 lint 交给 `@uni-helper/eslint-config`，默认风格不带分号。改完代码跑一次 `pnpm lint:fix`，它会直接改文件；不用手动调缩进或分号。

## 提交规范

1. Fork 仓库，基于 `main` 开分支：`feat/xxx`、`fix/xxx`、`docs/xxx`。
2. 提交信息遵循 [Conventional Commits](https://www.conventionalcommits.org/zh-hans/)。仓库没有 commitlint 钩子，格式靠自觉，但发布说明是从 `feat`、`fix`、`docs`、`perf` 这几类提交里提取的，写错了不会出现在 Release 里。
3. 推分支、开 PR。

常用 type：`feat`（新函数）、`fix`、`docs`、`refactor`、`perf`、`build`、`ci`、`chore`。示例：

```text
feat: 新增 useVisible
fix: 修复 useRequest 的 url 不支持 ref
docs: 补充 useStorage 的示例
```

## Pull Request 指南

- 一个 PR 只做一件事，方便 review。顺带的重构请单独开一个。
- 新增函数要同步改这些地方，缺一处文档和产物就会对不上：
  1. `src/<函数名>/index.ts` 写实现；
  2. `docs/api/<函数名>.md` 写文档，格式参照其它函数；
  3. `src/exports.ts` 按字母序加 `export * from './<函数名>';`；
  4. `docs/api/index.md` 的函数列表按字母序补一行。
- 测试放在 `test/<函数名>.test.ts`。行为有变化的修复，最好带上能复现问题的测试。
- 等 CI（`.github/workflows/ci.yml` 的 `lint` 和 `typecheck` 两个 job）通过后再等 review。

## 发布说明

以下流程面向维护者，贡献者不用管。

- 执行 `pnpm release`，它会装依赖、跑 `lint`，然后用 bumpp 交互式改 `package.json` 的版本号。
- 把改动推到 `main` 之后，[release.yml](https://github.com/uni-helper/uni-use/blob/main/.github/workflows/release.yml) 会读 `package.json` 的版本号。这个版本还没有 tag 的话，workflow 会打 tag 并推送，接着发布到 npm、生成 GitHub Release。
- 版本号没变就推 `main`，workflow 检测到 tag 已存在，不会再发布一次。
- `CHANGELOG.md` 不会自动生成，改版本号时顺手补一节。

## 行为准则

参与本项目即表示同意遵守 [uni-helper 行为准则](https://github.com/uni-helper/.github/blob/main/CODE_OF_CONDUCT.md)。

对指南本身有疑问，或者不确定某个改法行不行，直接开 [Issue](https://github.com/uni-helper/uni-use/issues) 问。
