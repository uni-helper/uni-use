# tryOnLoad

#### [返回列表](../readme.md)

安全的 `onLoad`。如果是在组件生命周期内，就调用 `onLoad()`；如果不是，就直接调用函数。

```typescript
import { tryOnLoad } from '@uni-helper/uni-use'

tryOnLoad(() => {
  ...
});
```

#### [返回列表](../readme.md)
