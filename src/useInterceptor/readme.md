# useInterceptor

#### [返回列表](../readme.md)

设置拦截器。 支持拦截 sync 函数，并且 `invoke` 返回 false 将终止拦截器继续执行

```typescript
import { useInterceptor } from '@uni-helper/uni-use';

const event = 'request';

// 设置拦截器
const stop = useInterceptor(event, {
  invoke: (args) => {
    args.url = 'https://www.example.com/' + args.url;
  },
  success: (response) => {
    console.log('interceptor-success', response);
    response.data.code = 1;
  },
  fail: (error) => {
    console.log('interceptor-fail', error);
  },
  complete: (result) => {
    console.log('interceptor-complete', result);
  },
});

// 删除拦截器
stop(event);
```

#### [返回列表](../readme.md)
