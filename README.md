# @uni-helper/uni-use

[![License](https://img.shields.io/github/license/uni-helper/uni-use)](https://github.com/uni-helper/uni-use/blob/main/LICENSE)

[![npm](https://img.shields.io/npm/v/@uni-helper/uni-use)](https://www.npmjs.com/package/@uni-helper/uni-use)

`uni-app (vue3)` 组合式工具集。要求 `node >= 14.18`。

## 安装依赖

```shell
npm install @uni-helper/uni-use @vueuse/core@9
```

<details>
  <summary>yarn v2/v3</summary>
  <p>请参考 <a href="https://yarnpkg.com/configuration/yarnrc/#nodeLinker">文档</a> 设置 <code>nodeLinker</code> 为 <code>node_modules</code>。</p>
</details>

<details>
  <summary>pnpm</summary>
  <p>请参考 <a href="https://pnpm.io/npmrc#shamefully-hoist">文档</a> 设置 <code>shamefully-hoist</code> 为 <code>true</code>。</p>
</details>

不考虑支持 `uni_modules`。

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

### useActionSheet

返回一个方法，调用后从底部向上弹出操作菜单。

```typescript
import { useActionSheet } from '@uni-helper/uni-use';

const showActionSheet = useActionSheet({
  /* 传入配置 */
});
showActionSheet(); // 从底部向上弹出操作菜单
```

调用方法时，可以传入一个对象来更新已有配置，这样会使用 [扩展运算符](https://es6.ruanyifeng.com/#docs/object#%E5%AF%B9%E8%B1%A1%E7%9A%84%E6%89%A9%E5%B1%95%E8%BF%90%E7%AE%97%E7%AC%A6) 来确认最终配置。

```typescript
showActionSheet({
  /* 新传入配置 */
});
```

### useClipboardData

获取和设置剪切板数据。你需要将默认值作为第一个参数传入。

```typescript
import { useClipboardData } from '@uni-helper/uni-use';

const clipboardData = useClipboardData('');

// 查看剪切板数据
console.log('clipboardData', clipboardData.value);
// 设置剪切板数据
clipboardData.value = 'abc';
```

为了在操作数据后不显示消息提示框，你可以传递第二个参数。

```typescript
import { useClipboardData } from '@uni-helper/uni-use';

const clipboardData = useClipboardData('', { showToast: false });
```

默认使用 `console.error` 输出错误信息，你也可以自定义错误处理。

```typescript
import { useClipboardData } from '@uni-helper/uni-use';

const clipboardData = useClipboardData('', { onError: (error) => { ... } });
```

### useDownloadFile

`uni.downloadFile` 的封装。使用方法参见 <https://vueuse.org/integrations/useAxios/>。

**返回值中含有 task，可自行操作。**

### useGlobalData

获取和设置当前应用实例的 `globalData`。你需要将默认值作为第一个参数传入。

```typescript
import { useGlobalData } from '@uni-helper/uni-use';

const globalData = useGlobalData({});
```

如果你需要使用 `shallowRef`，需要在第二个参数中指明。如果你需要设置一个很大的数据，`shallowRef` 会很有用。

```typescript
useGlobalData({}, { shallow: true });
```

我们建议直接使用 [pinia](https://pinia.vuejs.org/zh/) 作为状态管理工具。

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

### useLoading

返回一个方法，调用后显示加载提示框。

```typescript
import { useLoading } from '@uni-helper/uni-use';

const showLoading = useLoading({
  /* 传入配置 */
});
const hideLoading = showLoading(); // 显示加载提示框
hideLoading(); // 隐藏加载提示框
```

可以传入一个对象来更新已有配置，这样会使用 [扩展运算符](https://es6.ruanyifeng.com/#docs/object#%E5%AF%B9%E8%B1%A1%E7%9A%84%E6%89%A9%E5%B1%95%E8%BF%90%E7%AE%97%E7%AC%A6) 来确认最终配置。

```typescript
showLoading({
  /* 新传入配置 */
});
```

### useModal

返回一个方法，调用后显示模态弹窗。

```typescript
import { useModal } from '@uni-helper/uni-use';

const showModal = useModal({
  /* 传入配置 */
});
showModal(); // 显示模态弹窗
```

可以传入一个对象来更新已有配置，这样会使用 [扩展运算符](https://es6.ruanyifeng.com/#docs/object#%E5%AF%B9%E8%B1%A1%E7%9A%84%E6%89%A9%E5%B1%95%E8%BF%90%E7%AE%97%E7%AC%A6) 来确认最终配置。

```typescript
showModal({
  /* 新传入配置 */
});
```

### useNetwork

获取网络信息。

```typescript
import { useNetwork } from '@uni-helper/uni-use';

const { type, isWifi, is2g, is3g, is4g, is5g, isEthernet, isUnknown, isOnline, isOffline } =
  useNetwork();
```

### useOnline

获取是否在线。基于 `useNetwork`。

```typescript
import { useOnline } from '@uni-helper/uni-use';

const isOnline = useOnline();
```

### usePage

获取当前页信息。

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

获取前一页信息。

```typescript
import { usePrevPage } from '@uni-helper/uni-use';

const prevPage = usePrevPage();
```

### usePrevRoute

获取前一页面路由信息。

```typescript
import { usePrevRoute } from '@uni-helper/uni-use';

const prevRoute = usePrevRoute();
```

### useProvider

设置服务供应商参数，调用返回方法获取服务供应商。

```typescript
import { useProvider } from '@uni-helper/uni-use';

const getProvider = useProvider({
  /* 传入配置 */
});
getProvider(); // 获取服务供应商
```

可以传入一个对象来更新已有配置，这样会使用 [扩展运算符](https://es6.ruanyifeng.com/#docs/object#%E5%AF%B9%E8%B1%A1%E7%9A%84%E6%89%A9%E5%B1%95%E8%BF%90%E7%AE%97%E7%AC%A6) 来确认最终配置。

```typescript
getProvider({
  /* 新传入配置 */
});
```

### useRequest

`uni.request` 的封装。使用方法参见 <https://vueuse.org/integrations/useAxios/>。

**返回值中含有 task，可自行操作。**

### useRoute

获取当前页路由信息。

```typescript
import { useRoute } from '@uni-helper/uni-use';

const route = useRoute();
```

### useRouter

获取路由相关。

```typescript
import { useRouter } from '@uni-helper/uni-use';

const { pages, page, prevPage, route, prevRoute } = useRouter();
```

### useScanCode

返回一个方法，调用后调起客户端扫码界面。

```typescript
import { useScanCode } from '@uni-helper/uni-use';

const scan = useScanCode({
  /* 传入配置 */
});
scan(); // 调起扫码
```

可以传入一个对象来更新已有配置，这样会使用 [扩展运算符](https://es6.ruanyifeng.com/#docs/object#%E5%AF%B9%E8%B1%A1%E7%9A%84%E6%89%A9%E5%B1%95%E8%BF%90%E7%AE%97%E7%AC%A6) 来确认最终配置。

```typescript
scan({
  /* 新传入配置 */
});
```

### useScreenBrightness

获取和设置屏幕亮度。你需要将默认值作为第一个参数传入。

```typescript
import { useScreenBrightness } from '@uni-helper/uni-use';

const screenBrightness = useScreenBrightness(1);

// 查看屏幕亮度
console.log('screenBrightness', screenBrightness.value);
// 设置屏幕亮度
screenBrightness.value = 0;
```

默认使用 `console.error` 输出错误信息，你也可以自定义错误处理。

```typescript
import { useScreenBrightness } from '@uni-helper/uni-use';

const screenBrightness = useScreenBrightness('', { onError: (error) => { ... } });
```

### useSocket

`uni-app` 关于 `socket` 的封装。使用方法参见 <https://vueuse.org/core/useWebSocket/>。

**返回值中含有 task，可自行操作。**

### useStorageAsync

`uni-app` 关于 `storage` 的封装，使用方法参见 <https://vueuse.org/core/useStorageAsync/>。

### useToast

返回一个方法，调用后显示消息提示框。

```typescript
import { useToast } from '@uni-helper/uni-use';

const showToast = useToast({
  /* 传入配置 */
});
const hideToast = showToast(); // 显示消息提示框
hideToast(); // 隐藏消息提示框
```

可以传入一个对象来更新已有配置，这样会使用 [扩展运算符](https://es6.ruanyifeng.com/#docs/object#%E5%AF%B9%E8%B1%A1%E7%9A%84%E6%89%A9%E5%B1%95%E8%BF%90%E7%AE%97%E7%AC%A6) 来确认最终配置。

```typescript
showToast({
  /* 新传入配置 */
});
```

### useUploadFile

`uni.uploadFile` 的封装。使用方法参见 <https://vueuse.org/integrations/useAxios/>。

**返回值中含有 task，可自行操作。**

### useVisible

获取当前页面显隐状态。

```typescript
import { useVisible } from '@uni-helper/uni-use';

const isVisible = useVisible();
```

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
