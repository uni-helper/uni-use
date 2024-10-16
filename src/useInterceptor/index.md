# useInterceptor

设置拦截器。 支持拦截 sync 函数，并且 `invoke` 返回 false 将终止拦截器继续执行

```typescript
import { useInterceptor } from '@uni-helper/uni-use';

const event = 'request';

// 设置拦截器
const stop = useInterceptor(event, {
  invoke: (args) => {
    args[0].url = 'https://www.example.com/' + args[0].url;
  },
  success: (response) => {
    console.log('interceptor-success', response);
    response.data.code = 1;
  },
  fail: (error) => {
    console.log('interceptor-fail', error);
  },
  complete: () => {
    console.log('interceptor-complete');
  },
});

// 删除拦截器
stop();
```
