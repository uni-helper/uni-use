# tryOnBackPress

尝试执行 onBackPress。如果是在组件生命周期内，就直接调用 `onBackPress`；如果不是，就根据设定间隔重新尝试。

前两个参数和 `onBackPress` 完全一致。

```typescript
import { tryOnBackPress } from '@uni-helper/uni-use'

tryOnBackPress((e) => {

  if(e.from === 'navigateBack') {
    // do somthing
  }

  if(e.from === 'backbutton'){
    // do something
  }
},
null,
{
  retry: 5, // optional
  interval: 100, // optional
});
```
