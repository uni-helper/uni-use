# tryOnUnload

尝试获取组件生命周期，并调用 `onUnload`

超过重试次数，根据 `runFinally` 直接执行或抛出异常

```typescript
import { tryOnUnload } from '@uni-helper/uni-use';

tryOnUnload(() => {
  // ...
});
```
