# 改动日志

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
