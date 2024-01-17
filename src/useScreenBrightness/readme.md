# useScreenBrightness

#### [返回列表](../readme.md)

获取和设置屏幕亮度。你需要将默认值作为第一个参数传入。

```typescript
import { useScreenBrightness } from '@uni-helper/uni-use';

const screenBrightness = useScreenBrightness(1);

// 查看屏幕亮度
console.log('screenBrightness', screenBrightness.value);
// 设置屏幕亮度
screenBrightness.value = 0;
```

默认使用 `console.error` 输出错误信息，你也可以自定义错误处理。

```typescript
import { useScreenBrightness } from '@uni-helper/uni-use';

const screenBrightness = useScreenBrightness('', { onError: (error) => { ... } });
```

#### [返回列表](../readme.md)
