# 改动日志

## 0.20.0 (2026-11-13)

本版本包含破坏性更新。升级前，先读「破坏性更新」一节。

### 破坏性更新

- build!: 移除 `@vueuse/core` 依赖。项目用到 `@vueuse/core` 时，必须自行安装。
- build!: TypeScript 的 peer 范围改为 `^5.0.0 || ^6.0.0`。不再支持 TypeScript 4.5。
- feat!: `useRequest`、`useDownloadFile`、`useUploadFile` 的 `data` 改用 `initialData` 初始化。升级前，首次请求完成前 `data` 是 `undefined`。
- feat!: `useSocket` 的 `task` 在 `close()` 后变为 `undefined`。升级前，`task` 保留已关闭的连接。
- feat!: `useSocket` 断线时最多缓存 100 条待发消息。超出上限时，丢弃最早的消息。

### 新功能

- feat: `useRequest`、`useDownloadFile`、`useUploadFile` 的返回值支持 `finally`。
- feat: `useQuery` 的 `key` 支持 `ref`。`key` 变化后，`value` 跟着变化。
- feat: `useRouter` 的 `tabBarList` 支持 `pages.json` 的 `pagePath` 格式。路径没有前导斜杠时也能命中。
- feat: `useStorage` 在组件卸载时写入待写入的修改。100ms 防抖内的最后一次修改不再丢失。
- feat: `useSocket` 连接成功后重置重试计数。长连接的偶发断线不再耗尽重试次数。

### 修复

- fix: 修复重复调用 `execute()` 时 `await` 返回上一次结果的问题。涉及 `useRequest`、`useDownloadFile`、`useUploadFile`。
- fix: 修复 `useClipboardData` 读取剪切板后立即写回的问题。页面加载时会出现多余的 toast。
- fix: 修复 `useScreenBrightness` 读取亮度后立即写回的问题。页面加载时会多一次系统写入。
- fix: 修复 `useStorage` 在外部修改 storage 后重复写入的问题。
- fix: 修复 `useSocket` 更换 `url` 后旧连接的回调仍修改状态的问题。修复前状态变为 `CLOSED`，并额外创建一条连接。
- fix: 修复 `useStorage` 为每个 key 注册 6 个拦截器的问题。key 增多后，每次 storage 调用都遍历全部拦截器。
- fix: 修复 `tryOnBackPress` 注释提到不存在的 `onError` 选项的问题。

### 构建

- build: 构建工具从 `unbuild` 改为 `tsdown`。
- build: 移除 `commitlint`、`commitizen`、`lint-staged`、`simple-git-hooks`、`is-ci`、`tsx`、`ts-node`、`publint`、`taze`、`prettier`。
- build: 依赖版本统一由 pnpm catalog 管理。
- build: 开发环境改用 Node 26、pnpm 12、TypeScript 6、ESLint 10、Vite 5、Vitest 3。
- build: `types` 字段指向 `dist/index.d.mts`。

### 文档与测试

- docs: 文档站移入 `docs/`。API 页面改为 `/api/<函数名>`。
- docs: 文档站的链接去掉 `.html` 后缀。
- test: 测试移入 `test/`。测试文件从 5 个增加到 11 个。

## 0.19.17 (2025-11-26)

- fix: `useRequest` 的 `url` 支持 `ref`，补充对应测试用例（#52）

## 0.19.16 (2025-11-26)

- fix: 补上 `vue-demi`，修复依赖缺失导致的报错（#60）
- fix: 补充 `toValue` 的兼容实现，修复其未定义的问题

## 0.19.15 (2025-09-16)

- feat: 新增 `useQuery`
- feat: `useRouter` 的 `tabBarList` 选项支持字符串数组
- fix: `useRequest` 传参长度为 3 时 `options` 失效，`url` 默认值改为 `undefined`（#52）
- fix: 切换页面后侧边栏链接不更新
- docs: 文档站迁移到 VitePress，部署到 GitHub Pages

## 0.19.14 (2024-09-04)

- fix: `pathResolve` 对相对路径的解析
- fix: 移除无用导入

## 0.19.13 (2024-09-03)

- fix: `useSelectorQuery` 的 `scrollToSelector` 可能为 `undefined`
- fix: `usePageScroll` 的 `onPageScroll` 参数类型与必填处理
- perf: `useToast` 去掉不必要的响应式声明
- fix: 修正 `useInterceptor` 的测试用例

## 0.19.12 (2024-06-26)

- fix: 路由堆栈超出上限时的跳转回退（#41）

## 0.19.11 (2024-06-14)

- fix: 补上 `usePageScroll` 的导出
- fix: `useInterceptor` 适配 uni-app 的 Promise 化行为，仅在返回 `undefined` 时转成 Promise
- fix: 优化对 storage 变更的监听

## 0.19.10 (2024-03-14)

- fix: 避免重复调用拦截器，支持注册多个拦截器
- fix: 补全 `useInterceptor` 的类型

## 0.19.9 (2024-03-13)

- feat: `useInterceptor` 支持同步方法
- feat: 新增 `tryOnScopeDispose`
- fix: 监听同步 storage 方法的变化，修正 `UniStorageLike` 类型
- fix: 全局注册 `uni`
- fix: `useStorage` 在生命周期内无法正常响应

## 0.19.8 (2024-03-06)

- fix: 修正 `try` 的语义与实现
- fix: 避免重复绑定返回按钮

## 0.19.7 (2024-03-04)

- fix: `key` 不存在时 `useStorage` 初始化报错
- feat: 补充测试用例

## 0.19.6 (2024-01-17)

- feat: 自动导入函数改名为 `uniuseAutoImports`，`UniUseAutoImports` 标记为废弃

## 0.19.5 (2024-01-17)

- fix: 降低 `@vueuse/core` 版本，避开 uni-app 的 vue-demi 问题

## 0.19.4 (2024-01-17)

- fix: 修正错误的 import

## 0.19.3 (2024-01-17)

- fix: 修复 `uni is not defined`

## 0.19.2 (2024-01-17)

- fix: 修复 `getCurrentPages is not defined`

## 0.19.1 (2024-01-17)

- 仅版本号变更，无代码改动

## 0.19.0 (2024-01-17)

- fix: 重构 `useStorage` / `useStorageSync`，使其更贴合 `uniapp` 的使用习惯
- feat: 强化 `useRouter`，增加功能。
- feat: 增加 `uniuseAutoImports` 函数。
- feat: 增加 `tryOnBackPress` 函数

## 0.18.0 (2023-01-15)

- feat!: 调整 `useLoading`，现在返回是一个对象，其中包含 `showLoading` 和 `hideLoading` 两个方法
- fix: 调整类型实现，支持 `vue` v3.2.47 和 `@vueuse/core` v10，但仍需要用户侧做部分调整，参考 [uni-app#4604](https://github.com/dcloudio/uni-app/issues/4604)
- feat: `useDownloadFile`、`useRequest`、`useSocket`、`useStorageAsync`、`useUploadFile` 对标 `@vueuse/core` v10.7.1

## 0.17.1 (2023-11-14)

- fix: 修复 `useStorage`，关闭 [#28](https://github.com/uni-helper/uni-use/issues/28)

## 0.17.0 (2023-11-13)

- fix: 修复 `useStorage`，关闭 [#28](https://github.com/uni-helper/uni-use/issues/28)
- feat!: 要求 `node>=18`

## 0.16.0 (2023-10-17)

- feat: 增加 `usePageScroll`，感谢 [okxiaoliang4](https://github.com/okxiaoliang4) 在 [#27](https://github.com/uni-helper/uni-use/pull/27) 的贡献！

## 0.15.1 (2023-09-22)

- fix: 修复导出

## 0.15.0 (2023-08-31)

- feat: 增加 `UniUseAutoImports`，方便和 `unplugin-auto-import` 结合使用

## 0.14.1 (2023-08-15)

- fix: 修复 `useStorageAsync` 逻辑判断，关闭 [#25](https://github.com/uni-helper/uni-use/issues/25)

## 0.14.0 (2023-07-28)

- feat: 新增 `useSelectorQuery`，感谢 [edwinhuish](https://github.com/edwinhuish) 在 [#23](https://github.com/uni-helper/uni-use/pull/23) 的贡献！

## 0.13.1 (2023-05-28)

- docs: 更新 README

## 0.13.0 (2023-05-05)

- feat!: 移除 `useImmer`
- fix: 修复 `useSocket` 类型

## 0.12.0 (2023-02-16)

- build: 设置目标为 `es2017`
- fix: 修复 `useDownloadFile` 没有正确中止的问题
- fix: 修复 `useRequest` 没有正确中止的问题
- fix: 修复 `useUploadFile` 没有正确中止的问题
- fix: 修复 `useSocket` 内部实现
- feat: 新增 `useStorageAsync`，和 `vue-use` 的 `useStorageAsync` 类似
- feat!: 移除遗留的组件版本
- feat!: 移除大量无状态逻辑方法，避免过度封装
- feat!: 调整 `useClipboardData` 实现，现在会返回一个 `Ref`
- feat!: 调整 `useGlobalData` 实现，现在会返回一个 `Ref`
- feat!: 调整 `useLoading` 实现，现在会返回可调用的方法，和 `useActionSheet` 类似
- feat!: 调整 `useNetwork` 初始默认值为 `none` 并移除传参
- feat!: 调整 `useRouter` 实现，移除了所有方法
- feat!: 调整 `useScreenBrightness` 实现，现在会返回一个 `Ref`
- feat!: 调整 `useSocket` 实现，现在和 `vue-use` 的 `useWebSocket` 类似
- feat!: 移除 `useStorage`
- feat!: 调整 `useToast` 实现，现在会返回可调用的方法，和 `useActionSheet` 类似

请先阅读 [组合式函数](https://cn.vuejs.org/guide/reusability/composables.html) 和 [组合式 API 常见问答](https://cn.vuejs.org/guide/extras/composition-api-faq.html)，以了解为什么这个版本移除了大量无状态逻辑方法。核心内容摘录如下。

> 在 Vue 应用的概念中，“组合式函数”(Composables) 是一个利用 Vue 的组合式 API 来封装和复用有状态逻辑的函数。
>
> 当构建前端应用时，我们常常需要复用公共任务的逻辑。例如为了在不同地方格式化时间，我们可能会抽取一个可复用的日期格式化函数。这个函数封装了无状态的逻辑：它在接收一些输入后立刻返回所期望的输出。复用无状态逻辑的库有很多，比如你可能已经用过的 lodash 或是 date-fns。
>
> 相比之下，有状态逻辑负责管理会随时间而变化的状态。一个简单的例子是跟踪当前鼠标在页面中的位置。在实际应用中，也可能是像触摸手势或与数据库的连接状态这样的更复杂的逻辑。

## 0.11.0 (2023-01-10)

- feat!: 因难以保证稳定性移除所有组件版本

## 0.10.4 (2023-01-04)

- fix: 修复情况判断
- build: 切换到 `rollup`

## 0.10.3 (2022-12-28)

- fix: 修复导出

## 0.10.2 (2022-12-26)

- fix: 修复类型

## 0.10.1 (2022-12-23)

- fix: 修复构建

## 0.10.0 (2022-12-15)

- feat!: 要求 `node >= 14.18`，这是为了对标 `rollup` 和 `vite`
- feat: 默认为 esm 包，但仍支持 cjs

## 0.9.1 (2022-11-16)

- fix: 修复构建

## 0.9.0 (2022-11-16)

- feat!: 迁移到 `@uni-helper/uni-use`

## 0.8.0 (2022-10-24)

- feat: 新增 `UseAccountInfo`
- feat: 新增 `useAddress`
- feat: 新增 `useAppBaseInfo` 和 `UseAppBaseInfo`
- feat: 新增 `useAudio`
- feat: 新增 `useAuthorize`
- feat: 新增 `useBackground` 导出
- feat: 新增 `useCamera`
- feat: 新增 `useDeviceInfo` 和 `UseDeviceInfo`
- feat: 新增 `useFile`
- feat: 新增 `useImage` 导出
- feat: 新增 `useImmer`
- feat: 新增 `useInvoice`
- feat: 新增 `useLocation` 导出
- feat: 新增 `useMap`
- feat: 新增 `useMenuButtonBoundingClientRect`
- feat: 新增 `useRecorder`
- feat: 新增 `useSubscription`
- feat: 新增 `useSystemSetting`
- feat: 新增 `useUpdate`
- feat: 新增 `useUser`
- feat: 新增 `useVideo`
- feat: 增加 `useWindowInfo` 和 `UseWindowInfo`
- fix: 修复组件没有正确导出的问题

## 0.7.2 (2022-10-12)

- perf: 优化 `useRequest`、`useDownloadFile` 和 `useUploadFile` 类型
- fix: 修复构建

## 0.7.1 (2022-09-30)

- fix: 修复了构建不正常的问题

## 0.7.0 (2022-09-29)

- feat!: 现在要求使用 `node >= 14.16`
- feat!: 现在构建目标是 `esnext`
- fix: 修复了构建不正常的问题
- feat: 新增 `useAccountInfo`
- feat: 新增 `useLaunchOptions`
- feat: 新增 `useEnterOptions`

## 0.6.1

- fix: 修复 `useSelectorQuery` 类型

## 0.6.0

- feat!: 放弃 `vue@2` 支持
- perf!: 调整 `useApp` 导出
- perf: 优化 `useActionSheet` 类型
- feat: `useArrayBufferToBase64` 支持传入 `ref`
- feat: `useBase64ToArrayBuffer` 支持传入 `ref`
- perf: 优化 `useBackground` 类型
- perf: 优化 `useClipboardData` 类型
- fix: 修复 `useGlobalData` 错误赋值
- perf: 优化 `useGlobalData` 类型
- fix: 修复 `useGlobalData` 导出
- perf: 优化 `useImage` 类型
- perf: 优化 `useLoading` 类型
- perf: 优化 `useLocation` 类型
- perf: 优化 `useModal` 类型
- perf: 优化 `useNavigationBar` 类型
- fix: 替换 `useRouter` 中的 `at`
- perf: 优化 `useRouter` 类型
- perf: 优化 `useScanCode` 类型
- perf: 优化 `useScreenBrightness` 类型
- perf: 优化 `useStorage` 类型
- perf: 优化 `useSupported` 类型
- perf: 优化 `useTabBar` 类型
- perf: 优化 `useToast` 类型
- perf: 优化 `useVibrate` 类型

## 0.5.0

- feat: 新增 `useActionSheet`
- perf!: 调整 `useArrayBufferToBase64` 实现
- feat: 新增 `useBackground`
- perf!: 调整 `useBase64ToArrayBuffer` 实现
- fix: 修复 `useClipboardData` 监听
- perf: 调整 `useClipboardData` 实现
- feat!: 移除 `useColorMode`
- feat!: 移除 `useDark`
- perf!: 调整 `useGlobalData` 实现
- feat: 新增 `useImage`
- fix: 修复 `useInterceptor` 监听
- feat: 新增 `useLoading`
- feat: 新增 `useLocation`
- feat: 新增 `useModal`
- feat: 新增 `useNavigationBar`
- perf: 调整 `useNetwork` 实现
- perf: 调整 `UsePreferredDark` 实现
- perf: 调整 `UsePreferredLanguage` 实现
- feat: 新增 `usePullDownRefresh` 实现
- feat: 新增 `useScanCode`
- feat: 新增 `useScreenBrightness` 和 `UseScreenBrightness`
- feat: 新增 `useSelectorQuery`
- feat: 新增 `useStorage`
- feat!: 移除 `useStorageAsync`
- feat: 新增 `useSystemInfo` 和 `UseSystemInfo`
- feat: 新增 `useTabBar`
- feat: 新增 `useToast`
- perf: 调整 `useVibrate` 实现

## 0.4.2

- fix: 修复链接

## 0.4.1

- fix: 修复 `setClipboardData` 未正确更新的问题
- fix: 修复 `UseGlobalData` 导出错误
- fix: 修复 `UseUniPlatform` 导出错误
- perf: 调整 `useRouter` 导出

## 0.4.0

- feat: 新增 `usePrevPage`
- feat: 新增 `usePrevRoute`
- feat: 新增 `useRoute`
- feat: 新增 `useVibrate`
- fix: 调整 `useArrayBufferToBase64` 类型
- fix: 调整 `useBase64ToArrayBuffer` 类型
- fix: 调整 `useClipboardData` 参数和内部实现

## 0.3.0

- feat: 新增 `tryOnHide`
- feat: 新增 `tryOnInit`
- feat: 新增 `tryOnLoad`
- feat: 新增 `tryOnReady`
- feat: 新增 `tryOnShow`
- feat: 新增 `tryOnUnload`
- feat: 新增 `useApp`
- feat: 新增 `useArrayBufferToBase64`
- feat: 新增 `useBase64ToArrayBuffer`
- feat: 新增 `useClipboardData` 和 `UseClipboardData`
- feat: 新增 `useGlobalData` 和 `useGlobalData`
- feat: 新增 `usePage`
- feat: 新增 `usePages`
- feat: 新增 `useRouter`
- feat: 新增 `useUniPlatform` 和 `UseUniPlatform`
- feat: 新增 `useSocket`
- feat: 新增 `useSupported`
- feat: 新增 `useVisible`
- fix: 修复 `useStorageAsync` 判断

## 0.2.0

- feat: 新增 `useColorMode` 和 `UseColorMode`
- feat: 新增 `useDark` 和 `UseDark`
- fix: 修复 `UseNetwork` 导入
- fix: 修复 `UseOnline` 导入
- feat: 新增 `usePreferredDark` 和 `UsePreferredDark`
- feat: 新增 `usePreferredLanguage` 和 `UsePreferredLanguage`

## 0.1.0

- feat: 新增 `useDownloadFile`
- feat: 新增 `useInterceptor`
- feat: 新增 `useNetwork` 和 `UseNetwork`
- feat: 新增 `useOnline` 和 `UseOnline`
- feat: 新增 `useRequest`
- feat: 新增 `useStorageAsync`
- feat: 新增 `useUploadFile`
