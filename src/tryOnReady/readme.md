# tryOnReady

#### [返回首页](../../README.md)

安全的 `onReady`。如果是在组件生命周期内，就调用 `onReady()`；如果不是，就直接调用函数。

```typescript
import { tryOnReady } from '@uni-helper/uni-use'

tryOnReady(() => {
  ...
});
```

#### [返回首页](../../README.md)
