# useStorageSync (废弃，请使用 useStorage)

#### [返回首页](../../README.md)

`uni-app` 关于 `同步 storage 操作` 的封装。

UNIAPP官网文档: <https://uniapp.dcloud.net.cn/api/storage/storage.html>

**注意：**

- 这是同步操作，赋值后会立即写入storage，直到写入结束前会一直阻塞线程
- 如果需要非阻塞，请使用[`useStorage`](../useStorage/readme.md)
- 如无须使用 uni 原生的 storage 操作，建议使用异步 [`useStorage`](../useStorage/readme.md)

```typescript
import { useStorageSync } from '@uni-helper/uni-use';

const token = useStorageSync('authorization', '');

// 赋值
token.value = 'authorization-token';

// 读取
console.log(token.value); // authorization-token

```

#### [返回首页](../../README.md)
