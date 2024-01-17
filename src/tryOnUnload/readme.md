# tryOnUnload

#### [返回列表](../readme.md)

安全的 `onUnload`。如果是在组件生命周期内，就调用 `onUnload()`；如果不是，就直接调用函数。

```typescript
import { tryOnUnload } from '@uni-helper/uni-use'

tryOnUnload(() => {
  ...
});
```

#### [返回列表](../readme.md)
