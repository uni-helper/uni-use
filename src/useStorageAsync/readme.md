# useStorageAsync (废弃，请使用 useStorage)

#### [返回首页](../../README.md)

`uni-app` 关于 `异步 storage 操作` 的封装。

UNIAPP官网文档: <https://uniapp.dcloud.net.cn/api/storage/storage.html>

具体实现借鉴了 `@vueuse/core` v10.7.1。<https://vueuse.org/core/useStorageAsync/>。

**注意:**

- 这是异步操作，赋值后，ref 的值会生效，但并不会马上写入storage
- 和 uni 的原生 getStorageSync 混用的情况下，有可能会导致 getStorageSync 读取不到值。
- 如需和 uni 的原生 storage 操作混用，或需要同步操作，请使用[`useStorageSync`](../useStorageSync/readme.md)

```typescript
import { useStorageAsync } from '@uni-helper/uni-use';

const token = useStorageAsync('authorization', '');

// 赋值
token.value = 'authorization-token';

// 读取
console.log(token.value); // authorization-token

```

#### [返回首页](../../README.md)
