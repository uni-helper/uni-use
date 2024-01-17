# useGlobalData

#### [返回列表](../readme.md)

获取和设置当前应用实例的 `globalData`。你需要将默认值作为第一个参数传入。

```typescript
import { useGlobalData } from '@uni-helper/uni-use';

const globalData = useGlobalData({});
```

如果你需要使用 `shallowRef`，需要在第二个参数中指明。如果你需要设置一个很大的数据，`shallowRef` 会很有用。

```typescript
useGlobalData({}, { shallow: true });
```

我们建议直接使用 [pinia](https://pinia.vuejs.org/zh/) 作为状态管理工具。

#### [返回列表](../readme.md)
