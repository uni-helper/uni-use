# tryOnInit

#### [返回列表](../readme.md)

安全的 `onInit`。如果是在组件生命周期内，就调用 `onInit()`；如果不是，就直接调用函数。

```typescript
import { tryOnInit } from '@uni-helper/uni-use'

tryOnInit(() => {
  ...
});
```

#### [返回列表](../readme.md)
