# useQuery

获取页面传递的参数，支持自动解析 JSON 字符串。

## 特性

- 🚀 **简单易用** - 一行代码获取页面参数
- 🎯 **智能解析** - 自动识别并解析 JSON 字符串
- 🔧 **灵活配置** - 可选择开启或关闭 JSON 解析
- 📱 **响应式** - 支持响应式参数键
- 🛡️ **类型安全** - 完整的 TypeScript 类型支持
- 🌐 **编码兼容** - 支持 URL 编码的 JSON 数据

## 使用方法

### 基础用法

```vue
<script setup>
import { useQuery } from '@uni-helper/uni-use';

// 获取所有页面参数
const { query } = useQuery();

// 页面跳转: uni.navigateTo({ url: '/pages/detail?id=123&name=test' })
// query.value = { id: '123', name: 'test' }
</script>
```

### 获取特定参数

```vue
<script setup>
import { useQuery } from '@uni-helper/uni-use';

// 获取特定参数的值
const { value: userId } = useQuery('id');
const { value: userName } = useQuery('name');

// 页面跳转: uni.navigateTo({ url: '/pages/detail?id=123&name=test' })
// userId.value = '123'
// userName.value = 'test'
</script>
```

### 自动解析 JSON 数据

```vue
<script setup>
import { useQuery } from '@uni-helper/uni-use';

// 自动解析 JSON 字符串（默认开启）
const { value: resData } = useQuery('resData');

// 页面跳转示例:
// uni.navigateTo({
//   url: '/pages/detail?resData=' + encodeURIComponent(JSON.stringify({
//     id: 123,
//     type: 'coal',
//     details: { amount: 50 }
//   }))
// })
//
// 结果: resData.value = { id: 123, type: 'coal', details: { amount: 50 } }
</script>
```

### 禁用 JSON 解析

```vue
<script setup>
import { useQuery } from '@uni-helper/uni-use';

// 禁用 JSON 自动解析，所有参数保持为原始字符串
const { query } = useQuery(undefined, { parseJson: false });

// 或者针对特定参数禁用解析
const { value: rawData } = useQuery('data', { parseJson: false });
</script>
```

### 响应式参数键

```vue
<script setup>
import { useQuery } from '@uni-helper/uni-use';
import { ref } from 'vue';

const paramKey = ref('id');
const { value } = useQuery(paramKey);

// 动态改变要获取的参数
paramKey.value = 'name'; // value 会自动更新为对应参数的值
</script>
```

## 支持的 JSON 格式

### encodeURIComponent + JSON.stringify（推荐）

```javascript
// 页面跳转
const data = { id: 123, name: 'test', details: { amount: 50 } };
uni.navigateTo({
  url: `/pages/detail?resData=${encodeURIComponent(JSON.stringify(data))}`
});

// 目标页面自动解析
const { value: resData } = useQuery('resData');
// resData.value = { id: 123, name: 'test', details: { amount: 50 } }
```

### 直接 JSON.stringify

```javascript
// 页面跳转
const params = { order: 'A001', type: 'recruitment' };
uni.navigateTo({
  url: `/pages/order?data=${JSON.stringify(params)}`
});

// 目标页面自动解析
const { value: orderData } = useQuery('data');
// orderData.value = { order: 'A001', type: 'recruitment' }
```

## API 参考

### useQuery()

```typescript
function useQuery(): {
  query: Ref<Record<string, any>>;
};
```

获取所有页面参数。

### useQuery(key, options?)

```typescript
function useQuery(
  key: MaybeRefOrGetter<string>,
  options?: UseQueryOptions
): {
  value: Ref<any>;
};
```

#### 参数

- **key**: `MaybeRefOrGetter<string>` - 要获取的参数键名，支持响应式
- **options**: `UseQueryOptions` - 配置选项

#### UseQueryOptions

```typescript
interface UseQueryOptions {
  /**
   * 是否自动解析 JSON 字符串
   * @default true
   */
  parseJson?: boolean;
}
```

#### 返回值

- **query**: `Ref<Record<string, any>>` - 所有页面参数（仅在不传 key 时返回）
- **value**: `Ref<any>` - 指定参数的值（仅在传入 key 时返回）

## 辅助函数

### tryParseJson

```typescript
function tryParseJson(value: string): any;
```

尝试解析 JSON 字符串，支持自动处理 URL 编码。

**特性：**
- 智能检测 JSON 格式
- 自动处理 URL 编码（encodeURIComponent）
- 解析失败时返回原始字符串
- 处理各种边界情况

**示例：**

```javascript
import { tryParseJson } from '@uni-helper/uni-use';

// 普通 JSON
tryParseJson('{"id":123}'); // { id: 123 }

// URL 编码的 JSON
tryParseJson('%7B%22id%22%3A123%7D'); // { id: 123 }

// 非 JSON 字符串
tryParseJson('hello'); // 'hello'

// 无效 JSON
tryParseJson('{"invalid":}'); // '{"invalid":}'
```

## API

## 实际使用场景

### 场景一：商品详情页

```javascript
// 商品列表页跳转
const product = { id: 'P001', name: '商品A', price: 99.99 };
uni.navigateTo({
  url: `/pages/product/detail?product=${encodeURIComponent(JSON.stringify(product))}`
});

// 商品详情页接收
const { value: productInfo } = useQuery('product');
// productInfo.value = { id: 'P001', name: '商品A', price: 99.99 }
```

### 场景二：订单页面

```javascript
// 订单创建页跳转
const orderData = {
  items: [{ id: 1, qty: 2 }],
  total: 198,
  userId: 'U001'
};
uni.navigateTo({
  url: `/pages/order/create?data=${JSON.stringify(orderData)}`
});

// 订单创建页接收
const { value: order } = useQuery('data');
// order.value = { items: [{ id: 1, qty: 2 }], total: 198, userId: 'U001' }
```

### 场景三：混合参数

```javascript
// 复杂页面跳转
const complexData = { config: { theme: 'dark' }, user: { role: 'admin' } };
uni.navigateTo({
  url: `/pages/dashboard?id=123&source=menu&config=${encodeURIComponent(JSON.stringify(complexData))}`
});

// 目标页面接收
const { query } = useQuery();
// query.value = {
//   id: '123',
//   source: 'menu',
//   config: { config: { theme: 'dark' }, user: { role: 'admin' } }
// }
```

## 注意事项

1. **JSON 解析优先级**：先尝试直接解析，失败后尝试 URL 解码再解析
2. **类型安全**：建议配合 TypeScript 使用以获得更好的类型提示
3. **性能考虑**：JSON 解析在 `onLoad` 生命周期中执行，不会影响页面性能
4. **错误处理**：解析失败时会保持原始字符串值，不会抛出错误
5. **响应式更新**：参数值在页面生命周期内保持响应式
6. **编码建议**：推荐使用 `encodeURIComponent` 来确保特殊字符的正确传输
