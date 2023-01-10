# @uni-helper/uni-use

[![License](https://img.shields.io/github/license/uni-helper/uni-use)](https://github.com/uni-helper/uni-use/blob/main/LICENSE)

[![npm](https://img.shields.io/npm/v/@uni-helper/uni-use)](https://www.npmjs.com/package/@uni-helper/uni-use)

`uni-app (vue3)` 组合式工具集。要求 `node >= 14.18`。

## 安装

使用 `npm`：

```shell
npm install @uni-helper/uni-use
```

使用 `yarn`：

```shell
yarn install @uni-helper/uni-use
```

`uni-app` 和 `pnpm` 结合使用存在问题，不建议使用 `pnpm` 安装依赖。

目前只考虑小程序和移动应用环境。不考虑支持 `uni_modules`。

## 使用

### tryOnHide

安全的 `onHide`。如果是在组件生命周期内，就调用 `onHide()`；如果不是，就直接调用函数。

```typescript
import { tryOnHide } from '@uni-helper/uni-use'

tryOnHide(() => {
  ...
});
```

### tryOnInit

安全的 `onInit`。如果是在组件生命周期内，就调用 `onInit()`；如果不是，就直接调用函数。

```typescript
import { tryOnInit } from '@uni-helper/uni-use'

tryOnInit(() => {
  ...
});
```

### tryOnLoad

安全的 `onLoad`。如果是在组件生命周期内，就调用 `onLoad()`；如果不是，就直接调用函数。

```typescript
import { tryOnLoad } from '@uni-helper/uni-use'

tryOnLoad(() => {
  ...
});
```

### tryOnReady

安全的 `onReady`。如果是在组件生命周期内，就调用 `onReady()`；如果不是，就直接调用函数。

```typescript
import { tryOnReady } from '@uni-helper/uni-use'

tryOnReady(() => {
  ...
});
```

### tryOnShow

安全的 `onShow`。如果是在组件生命周期内，就调用 `onShow()`；如果不是，就直接调用函数。

```typescript
import { tryOnShow } from '@uni-helper/uni-use'

tryOnShow(() => {
  ...
});
```

### tryOnUnload

安全的 `onUnload`。如果是在组件生命周期内，就调用 `onUnload()`；如果不是，就直接调用函数。

```typescript
import { tryOnUnload } from '@uni-helper/uni-use'

tryOnUnload(() => {
  ...
});
```

### useAccountInfo

获取当前账号信息。

```typescript
import { useAccountInfo } from '@uni-helper/uni-use';

const accountInfo = useAccountInfo();
```

### useActionSheet

设置菜单列表参数，调用返回方法显示菜单列表。

```typescript
import { useActionSheet } from '@uni-helper/uni-use';

const showActionSheet = useActionSheet({
  /* 传入配置 */
});
showActionSheet(); // 实际显示菜单列表
```

可以传入一个对象来更新已有配置，这样会使用 [扩展运算符](https://es6.ruanyifeng.com/#docs/object#%E5%AF%B9%E8%B1%A1%E7%9A%84%E6%89%A9%E5%B1%95%E8%BF%90%E7%AE%97%E7%AC%A6) 来确认最终配置。

```typescript
showActionSheet({
  /* 新传入配置 */
});
```

### useAddress

获取地址相关。

```typescript
import { useAddress } from '@uni-helper/uni-use';

const { chooseAddress, choose } = useAddress();
```

### useApp

获取当前应用实例。如果想要获取 `globalData`，可以直接使用 `useGlobalData`。

```typescript
import { useApp } from '@uni-helper/uni-use';

const app = useApp();
```

### useAppBaseInfo

获取应用基础信息。

```typescript
import { useAppBaseInfo } from '@uni-helper/uni-use';

const appBaseInfo = useAppBaseInfo();
```

### useArrayBufferToBase64

获取 ArrayBuffer 对应的 base64。可以直接传入 `ref`。

```typescript
import { useArrayBufferToBase64 } from '@uni-helper/uni-use';

const base64 = useArrayBufferToBase64(arrayBuffer);
```

### useAudio

获取音频相关。

```typescript
import { useAudio } from '@uni-helper/uni-use';

const {
  backgroundAudioManager,
  backgroundManager,
  useBackgroundAudioManager,
  useBackgroundManager,
  createInnerAudioContext,
  createInnerContext,
} = useAudio();
```

### useAuthorize

获取授权相关。

```typescript
import { useAuthorize } from '@uni-helper/uni-use';

const { authorize, openSetting, getSetting, openAppAuthorizeSetting, getAppAuthorizeSetting } =
  useAuthorize();
```

### useBackground

获取背景设置方法。

```typescript
import { useBackground } from '@uni-helper/uni-use';

const { setBackgroundColor, setColor, setBackgroundTextStyle, setTextStyle } = useBackground();
```

### useBase64ToArrayBuffer

获取 base64 对应的 ArrayBuffer。可以直接传入 `ref`。

```typescript
import { useBase64ToArrayBuffer } from '@uni-helper/uni-use';

const arrayBuffer = useBase64ToArrayBuffer(base64);
```

### useCamera

获取相机相关。

```typescript
import { useCamera } from '@uni-helper/uni-use';

const { createCameraContext, createContext } = useCamera();
```

### useClipboardData

获取和设置剪切板数据。

```typescript
import { useClipboardData } from '@uni-helper/uni-use';

const { clipboardData, setClipboardData } = useClipboardData();

// 查看剪切板数据
console.log('clipboardData', clipboardData);
// 设置剪切板数据，设置成功后 clipboardData 自动更新
setClipboardData({
  ...
});
```

### useDeviceInfo

获取设备信息。

```typescript
import { useDeviceInfo } from '@uni-helper/uni-use';

const deviceInfo = useDeviceInfo();
```

### useDownloadFile

`uni.downloadFile` 的封装。使用方法参见 <https://vueuse.org/integrations/useAxios/>。

**返回值中含有 task，可自行操作。**

### useEnterOptions

获取启动时的参数。

```typescript
import { useEnterOptions } from '@uni-helper/uni-use';

const options = useEnterOptions();
```

### useFile

获取文件相关。

```typescript
import { useFile } from '@uni-helper/uni-use';

const {
  chooseFile,
  choose,
  chooseMessageFile,
  chooseMessage,
  saveFile,
  save,
  getSavedFileList,
  getSavedList,
  getSavedFileInfo,
  getSavedInfo,
  removeSavedFile,
  removeSaved,
  getFileInfo,
  getInfo,
  openDocument,
  open,
  fileSystemManager,
  manager,
  useFileSystemManager,
  useManager,
} = useFile();
```

### useGlobalData

获取和设置当前应用实例的 `globalData`。

```typescript
import { useGlobalData } from '@uni-helper/uni-use';

const { globalData, setGlobalData } = useGlobalData();
```

可以传入一个对象来更新已有配置，这样会使用 [扩展运算符](https://es6.ruanyifeng.com/#docs/object#%E5%AF%B9%E8%B1%A1%E7%9A%84%E6%89%A9%E5%B1%95%E8%BF%90%E7%AE%97%E7%AC%A6) 来确认最终配置。

```typescript
setGlobalData({ a: 'a', b: 'b' });
```

你也可以直接设置某一个键值对。

```typescript
setGlobalData('a', 'a');
```

### useImage

获取图片相关。

```typescript
import { useImage } from '@uni-helper/uni-use';

const {
  chooseImage,
  choose,
  chooseMedia,
  previewImage,
  preview,
  closePreviewImage,
  closePreview,
  getImageInfo,
  getInfo,
  saveImageToPhotosAlbum,
  saveToPhotosAlbum,
  compressImage,
  compress,
} = useImage();
```

### useImmer

<https://cn.vuejs.org/guide/extras/reactivity-in-depth.html#immutable-data> 的实现。另外暴露了 `produce` 方法。

```typescript
import { useImmer } from '@uni-helper/uni-use';
const { state, update, produce } = useImmer(baseState);
```

`update` 是 `produce` 的封装。

```typescript
const update = (updater: (draft: D) => D) => (state.value = produce(state.value, updater));
```

你也可以直接使用 `produce` 来操作数据，见 [immer 文档](https://immerjs.github.io/immer/)。

### useInterceptor

设置拦截器。

```typescript
import { useInterceptor } from '@uni-helper/uni-use';

const event = 'request';

// 设置拦截器
const stop = useInterceptor(event, {
  invoke: (args) => {
    args.url = 'https://www.example.com/' + args.url;
  },
  success: (response) => {
    console.log('interceptor-success', response);
    response.data.code = 1;
  },
  fail: (error) => {
    console.log('interceptor-fail', error);
  },
  complete: (result) => {
    console.log('interceptor-complete', result);
  },
});

// 删除拦截器
stop(event);
```

### useInvoice

获取发票相关。

```typescript
import { useInvoice } from '@uni-helper/uni-use';

const { chooseInvoice, choose, chooseInvoiceTitle, chooseTitle } = useInvoice();
```

### useLaunchOptions

获取启动时的参数。返回值与 `onLaunch` 的回调参数一致。

```typescript
import { useLaunchOptions } from '@uni-helper/uni-use';

const options = useLaunchOptions();
```

### useLoading

设置加载提示框参数，调用返回方法显示或隐藏加载提示框。

```typescript
import { useLoading } from '@uni-helper/uni-use';

const { showLoading, hideLoading } = useLoading({
  /* 传入配置 */
});
showLoading(); // 实际显示加载提示框
hideLoading(); // 隐藏加载提示框
```

可以传入一个对象来更新已有配置，这样会使用 [扩展运算符](https://es6.ruanyifeng.com/#docs/object#%E5%AF%B9%E8%B1%A1%E7%9A%84%E6%89%A9%E5%B1%95%E8%BF%90%E7%AE%97%E7%AC%A6) 来确认最终配置。

```typescript
showLoading({
  /* 新传入配置 */
});
```

### useLocation

获取位置相关。

```typescript
import { useLocation } from '@uni-helper/uni-use';

const {
  getLocation,
  get,
  chooseLocation,
  choose,
  openLocation,
  open,
  onLocationChange,
  onChange,
  onLocationChangeError,
  onChangeError,
  offLocationChange,
  offChange,
  startLocationUpdate,
  startUpdate,
  startLocationBackgroundUpdate,
  startUpdateBackground,
  stopLocationUpdate,
  stopUpdate,
} = useLocation();
```

### useMap

获取地图相关。

```typescript
import { useMap } from '@uni-helper/uni-use';

const { createMapContext, createContext } = useMap();
```

### useMenuButtonBoundingClientRect

获取胶囊按钮布局。

```typescript
import { useMenuButtonBoundingClientRect } from '@uni-helper/uni-use';

const { menuButtonBoundingClientRect, rect } = useMenuButtonBoundingClientRect();
```

### useModal

设置模态框参数，调用返回方法显示模态框。

```typescript
import { useModal } from '@uni-helper/uni-use';

const showModal = useModal({
  /* 传入配置 */
});
showModal(); // 实际显示模态框
```

可以传入一个对象来更新已有配置，这样会使用 [扩展运算符](https://es6.ruanyifeng.com/#docs/object#%E5%AF%B9%E8%B1%A1%E7%9A%84%E6%89%A9%E5%B1%95%E8%BF%90%E7%AE%97%E7%AC%A6) 来确认最终配置。

```typescript
showModal({
  /* 新传入配置 */
});
```

### useNavigationBar

获取导航条相关。

```typescript
import { useNavigationBar } from '@uni-helper/uni-use';

const {
  setNavigationBarTitle,
  setTitle,
  setNavigationBarColor,
  setColor,
  showNavigationBarLoading,
  showLoading,
  hideNavigationBarLoading,
  hideLoading,
} = useNavigationBar();
```

### useNetwork

获取网络信息。

```typescript
import { useNetwork } from '@uni-helper/uni-use';

const { type, isWifi, is2g, is3g, is4g, is5g, isEthernet, isUnknown, isOnline, isOffline } =
  useNetwork();
```

### useOnline

获取网络信息。

```typescript
import { useOnline } from '@uni-helper/uni-use';

const isOnline = useOnline();
```

### usePage

获取当前展示页面信息。

```typescript
import { usePage } from '@uni-helper/uni-use';

const page = usePage();
```

### usePages

获取当前页面栈信息。

```typescript
import { usePages } from '@uni-helper/uni-use';

const pages = usePages();
```

### usePreferredDark

响应式的暗黑主题偏好。

```typescript
import { usePreferredDark } from '@uni-helper/uni-use';

const prefersDark = usePreferredDark();
```

### usePreferredLanguage

响应式的语言偏好。

```typescript
import { usePreferredLanguage } from '@uni-helper/uni-use';

const language = usePreferredLanguage();
```

### usePrevPage

获取当前展示页面的前一页面信息。

```typescript
import { usePrevPage } from '@uni-helper/uni-use';

const prevPage = usePrevPage();
```

### usePrevRoute

获取当前展示页面的前一页面路由路径信息。

```typescript
import { usePrevRoute } from '@uni-helper/uni-use';

const prevRoute = usePrevRoute();
```

### useProvider

设置服务供应商参数，调用返回方法获取服务供应商。

```typescript
import { useProvider } from '@uni-helper/uni-use';

const getProvider = getProvider({
  /* 传入配置 */
});
getProvider(); // 实际请求服务供应商
```

可以传入一个对象来更新已有配置，这样会使用 [扩展运算符](https://es6.ruanyifeng.com/#docs/object#%E5%AF%B9%E8%B1%A1%E7%9A%84%E6%89%A9%E5%B1%95%E8%BF%90%E7%AE%97%E7%AC%A6) 来确认最终配置。

```typescript
getProvider({
  /* 新传入配置 */
});
```

### usePullDownRefresh

获取下拉刷新方法。

```typescript
import { usePullDownRefresh } from '@uni-helper/uni-use';

const { startPullDownRefresh, start, stopPullDownRefresh, stop } = usePullDownRefresh();
```

### useRecorder

获取录音相关。

```typescript
import { useRecorder } from '@uni-helper/uni-use';

const { recorderManager, manager, useRecorderManager, useManager } = useRecorder();
```

### useRequest

`uni.request` 的封装。使用方法参见 <https://vueuse.org/integrations/useAxios/>。

**返回值中含有 task，可自行操作。**

### useRoute

获取当前展示页面的路由路径信息。

```typescript
import { useRoute } from '@uni-helper/uni-use';

const route = useRoute();
```

### useRouter

获取路由相关。

```typescript
import { useRouter } from '@uni-helper/uni-use';

const {
  pages,
  page,
  prevPage,
  route,
  prevRoute,
  reLaunch,
  switchTab,
  redirectTo,
  navigateTo,
  navigateBack,
  navigateToMiniprogram,
  navigateBackMiniprogram,
} = useRouter();
```

### useScanCode

设置扫码参数，调用返回方法调起客户端扫码界面。

```typescript
import { useScanCode } from '@uni-helper/uni-use';

const scan = useScanCode({
  /* 传入配置 */
});
scan(); // 实际调起扫码
```

可以传入一个对象来更新已有配置，这样会使用 [扩展运算符](https://es6.ruanyifeng.com/#docs/object#%E5%AF%B9%E8%B1%A1%E7%9A%84%E6%89%A9%E5%B1%95%E8%BF%90%E7%AE%97%E7%AC%A6) 来确认最终配置。

```typescript
scan({
  /* 新传入配置 */
});
```

### useScreenBrightness

获取和设置屏幕亮度。

```typescript
import { useScreenBrightness } from '@uni-helper/uni-use';

const { screenBrightness, brightness, setScreenBrightness, setBrightness } = useScreenBrightness();

// 查看屏幕亮度
console.log('screenBrightness', screenBrightness);
console.log('brightness', brightness);
// 设置屏幕亮度，设置成功后自动更新
setScreenBrightness({
  ...
});
setBrightness({
  ...
});
```

### useSelectorQuery

获取 `SelectorQuery` 实例。

```typescript
import { useSelectorQuery } from '@uni-helper/uni-use';

const query = useSelectorQuery();
```

### useSocket

`uni-app` 提供的 `socket` 操作的封装。

```typescript
import { useSocket } from '@uni-helper/uni-use';

const { task, sendMessage, close, isConnecting, isConnected, isClosed, error } = useSocket({
  onSocketOpen,
  onSocketError,
  onSocketMessage,
  onSocketClose,
});
```

- `task`: <https://uniapp.dcloud.net.cn/api/request/socket-task.html>
- `sendMessage`: <https://uniapp.dcloud.net.cn/api/request/websocket.html#sendsocketmessage>
- `close`: <https://uniapp.dcloud.net.cn/api/request/websocket.html#closesocket>
- `isConnecting`: `socket` 是否连接中
- `isConnected`: `socket` 是否已经连接
- `isClosed`: `socket` 是否已关闭
- `error`: 使用 `socket` 期间的错误
- `onSocketOpen`: <https://uniapp.dcloud.net.cn/api/request/websocket.html#onsocketopen>
- `onSocketError`: <https://uniapp.dcloud.net.cn/api/request/websocket.html#onsocketerror>
- `onSocketMessage`: <https://uniapp.dcloud.net.cn/api/request/websocket.html#onsocketmessage>
- `onSocketClose`: <https://uniapp.dcloud.net.cn/api/request/websocket.html#onsocketclose>

### useStorage

获取存储方法。

```typescript
import { useStorage } from '@uni-helper/uni-use';

const {
  getStorage,
  getStorageSync,
  get,
  getSync,
  setStorage,
  setStorageSync,
  set,
  setSync,
  removeStorage,
  removeStorageSync,
  remove,
  removeSync,
  clearStorage,
  clearStorageSync,
  clear,
  clearSync,
  getStorageInfo,
  getStorageInfoSync,
  getInfo,
  getInfoSync,
} = useStorage();
```

### useSubscription

获取订阅相关。

```typescript
import { useSubscription } from '@uni-helper/uni-use';

const { requestSubscribeMessage } = useSubscription();
```

### useSupported

获取 API 是否被支持。

```typescript
import { useSupported } from '@uni-helper/uni-use';

const isSupported = useSupported();
```

### useSystemInfo

获取系统信息。

```typescript
import { useSystemInfo } from '@uni-helper/uni-use';

const systemInfo = useSystemInfo();
```

### useSystemSetting

获取系统设置。

```typescript
import { useSystemSetting } from '@uni-helper/uni-use';

const systemSetting = useSystemSetting();
```

### useTabBar

获取标签栏操作。

```typescript
import { useTabBar } from '@uni-helper/uni-use';

const {
  setTabBarItem,
  setItem,
  setTabBarStyle,
  setStyle,
  showTabBar,
  show,
  hideTabBar,
  hide,
  setTabBarBadge,
  setBadge,
  removeTabBarBadge,
  removeBadge,
  showTabBarRedDot,
  showRedDot,
  hideTabBarRedDot,
  hideRedDot,
} = useTabBar();
```

### useToast

设置提示框参数，调用返回方法显示或隐藏提示框。

```typescript
import { useToast } from '@uni-helper/uni-use';

const { showToast, hideToast } = useToast({
  /* 传入配置 */
});
showToast(); // 实际显示提示框
hideToast(); // 隐藏提示框
```

可以传入一个对象来更新已有配置，这样会使用 [扩展运算符](https://es6.ruanyifeng.com/#docs/object#%E5%AF%B9%E8%B1%A1%E7%9A%84%E6%89%A9%E5%B1%95%E8%BF%90%E7%AE%97%E7%AC%A6) 来确认最终配置。

```typescript
showToast({
  /* 新传入配置 */
});
```

### useUniPlatform

获取运行应用时设置的 `UNI_PLATFORM` 值，默认为 `h5`。

```typescript
import { useUniPlatform } from '@uni-helper/uni-use';

const uniPlatform = useUniPlatform();
```

### useUpdate

获取更新相关。

```typescript
import { useUpdate } from '@uni-helper/uni-use';

const { updateManager, manager, useUpdateManager, useManager } = useUpdate();
```

### useUploadFile

`uni.uploadFile` 的封装。使用方法参见 <https://vueuse.org/integrations/useAxios/>。

**返回值中含有 task，可自行操作。**

### useUser

获取用户相关。

```typescript
import { useUser } from '@uni-helper/uni-use';

const {
  login,
  checkSession,
  getUserInfo,
  getInfo,
  getUserProfile,
  getProfile,
  preLogin,
  closeAuthView,
  getCheckBoxState,
  univerifyManager,
  manager,
  useUniverifyManager,
  useManager,
} = useUser();
```

### useVibrate

获取震动方法。

```typescript
import { useVibrate } from '@uni-helper/uni-use';

const { vibrate, vibrateLong, vibrateShort } = useVibrate();
```

### useVideo

获取视频相关。

```typescript
import { useVideo } from '@uni-helper/uni-use';

const {
  createVideoContext,
  createContext,
  chooseVideo,
  choose,
  chooseMedia,
  saveVideoToPhotosAlbum,
  saveToPhotosAlbum,
  getVideoInfo,
  getInfo,
  compressVideo,
  compress,
  openVideoEditor,
  openEditor,
} = useVideo();
```

### useVisible

获取当前页面显隐状态。

```typescript
import { useVisible } from '@uni-helper/uni-use';

const isVisible = useVisible();
```

### useWindowInfo

获取窗口信息。

```typescript
import { useWindowInfo } from '@uni-helper/uni-use';

const windowInfo = useWindowInfo();
```

## 其它

### 限制

在小程序和移动应用环境下有如下无法避开的限制：

- 缺失某些全局变量（如 `window`、`navigator` 等）
- 必须使用 `uni-app` 提供的 API 实现功能（如拦截器、存储等），API 不支持的也就无法支持（比如拦截同步 API）
- 无法使用顶层 `await`

在开发网页时，建议直接使用 `vue`，避免过多的环境判断代码，同时也能享受更好的生态，如 `vueuse` 的完整支持。

### 构建

对于 `vue-cli`，请修改项目根目录 `vue.config.js` 如下所示。

```typescript
module.exports = {
  transpileDependencies: ['@uni-helper/uni-use'],
};
```

对于 `vite`，你无需手动额外调整。

### EventBus

如果你想使用 `EventBus`，请考虑使用 [VueUse - useEventBus](https://vueuse.org/core/useeventbus/#useeventbus)、[mitt](https://github.com/developit/mitt) 或 [tiny-emitter](https://github.com/scottcorgan/tiny-emitter)。这个库不再重复提供类似功能。

### TypeScript

`@uni-helper/uni-use` 本身使用 [TypeScript](https://www.typescriptlang.org/) 开发，拥有类型提示。

## 资源

- [改动日志](https://github.com/uni-helper/uni-use/tree/main/CHANGELOG.md)

## 致谢

- [vueuse](https://vueuse.org/) [#1073](https://github.com/vueuse/vueuse/pull/1073)
- [taro-hooks](https://taro-hooks-innocces.vercel.app/)
- [tob-use](https://tob-use.netlify.app/)
