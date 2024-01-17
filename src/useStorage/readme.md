# useStorage

#### [返回列表](../readme.md)

`uni-app` 关于 `异步 storage 操作` 的封装。

UNIAPP官网文档: <https://uniapp.dcloud.net.cn/api/storage/storage.html>

具体实现借鉴了 `@vueuse/core` v10.7.1。<https://vueuse.org/core/useStorageAsync/>。

**注意，这是异步操作，赋值后并不会马上写入storage**

**如果需要同步操作，请使用[`useStorageSync`](../useStorageSync/readme.md)**

```typescript
import { useStorage } from '@uni-helper/uni-use';

const token = useStorage('authorization', '');

// 赋值
token.value = 'authorization-token';

// 读取
console.log(token.value); // authorization-token

```

#### [返回列表](../readme.md)
