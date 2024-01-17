# tryOnHide

#### [返回列表](../readme.md)

安全的 `onHide`。如果是在组件生命周期内，就调用 `onHide()`；如果不是，就直接调用函数。

```typescript
import { tryOnHide } from '@uni-helper/uni-use'

tryOnHide(() => {
  ...
});
```

#### [返回列表](../readme.md)
