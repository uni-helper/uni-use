# useClipboardData

获取和设置剪切板数据。你需要将默认值作为第一个参数传入。

```typescript
import { useClipboardData } from '@uni-helper/uni-use';

const clipboardData = useClipboardData('');

// 查看剪切板数据
console.log('clipboardData', clipboardData.value);
// 设置剪切板数据
clipboardData.value = 'abc';
```

为了在操作数据后不显示消息提示框，你可以传递第二个参数。

```typescript
import { useClipboardData } from '@uni-helper/uni-use';

const clipboardData = useClipboardData('', { showToast: false });
```

默认使用 `console.error` 输出错误信息，你也可以自定义错误处理。

```typescript
import { useClipboardData } from '@uni-helper/uni-use';

const clipboardData = useClipboardData('', {
  onError: (error) => {
    console.log(error);
  }
});
```
