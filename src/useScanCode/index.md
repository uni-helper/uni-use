# useScanCode

返回一个方法，调用后调起客户端扫码界面。

```typescript
import { useScanCode } from '@uni-helper/uni-use';

const scan = useScanCode({
  /* 传入配置 */
});
scan(); // 调起扫码
```

可以传入一个对象来更新已有配置，这样会使用 [扩展运算符](https://es6.ruanyifeng.com/#docs/object#%E5%AF%B9%E8%B1%A1%E7%9A%84%E6%89%A9%E5%B1%95%E8%BF%90%E7%AE%97%E7%AC%A6) 来确认最终配置。

```typescript
scan({
  /* 新传入配置 */
});
```
