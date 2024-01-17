# useLoading

#### [返回列表](../readme.md)

返回一个对象，包含两个方法。其中`showLoading` 调用后显示加载提示框，`hideLoading` 调用后隐藏加载提示框。

```typescript
import { useLoading } from '@uni-helper/uni-use';

const { showLoading, hideLoading } = useLoading({
  /* 传入配置 */
});
showLoading(); // 显示加载提示框

hideLoading(); // 隐藏加载提示框
```

你也可以通过调用 `showLoading` 来获取 `hideLoading`。

```typescript
import { useLoading } from '@uni-helper/uni-use';

const { showLoading, hideLoading } = useLoading({
  /* 传入配置 */
});
const hideLoading = showLoading();
```

可以传入一个对象来更新已有配置，这样会使用 [扩展运算符](https://es6.ruanyifeng.com/#docs/object#%E5%AF%B9%E8%B1%A1%E7%9A%84%E6%89%A9%E5%B1%95%E8%BF%90%E7%AE%97%E7%AC%A6) 来确认最终配置。

```typescript
showLoading({
  /* 新传入配置 */
});
```

#### [返回列表](../readme.md)
