# useSelectorQuery

#### [返回首页](../../README.md)

`uni.createSelectorQuery` 的封装。

```typescript
import { useSelectorQuery } from '@uni-helper/uni-use';

const { select, getBoundingClientRect, getFields, getScrollOffset, getContext } =
  useSelectorQuery();

// 获取 NodeRef
const node = select('#id');

// 获取单个 rect
const rect = await getBoundingClientRect('#id');

// 获取所有 .selector 的 rect，返回值为 UniApp.NodeInfo[]
const rects = await getBoundingClientRect('.selector', true);

// getFields，getScrollOffset，getContext 使用方式和 getBoundingClientRect 一致
```

#### [返回首页](../../README.md)
