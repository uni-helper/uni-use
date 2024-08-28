# useRouter

#### [返回列表](../readme.md)

路由相关的操作和变量

## 使用方式

```ts
import { useRouter } from '@uni-helper/uni-use';
import { computed, ref, watchEffect } from 'vue';
import { tabBar } from '@/pages.json';

const router = useRouter({
  /**
   * 是否尝试跳转 tabBar
   * 开启后，使用 navigate / redirect 将会先尝试 tabBar
   * @default true
   */
  tryTabBar: true,
  /**
   * pages.json 里的 tabBar list 配置
   * tryTabBar 开启时，会判断跳转页面
   * 全局配置，仅需要配置一次
   */
  tabBarList: tabBar.list,
});

// 如果上面的 tryTabBar 设定为 false，或非常确定是 tabbar 页面，可以直接使用 switchTab
router.switchTab({ url: '/pages/tabbar/tabbar1' });

// 路由跳转，参数和 uniapp 的一致
// 当 tryTabBar = true 时，会自动判断 tabBar 页面进行跳转
router.navigate({ url: '/pages/topics/index' });
// 携带参数
router.navigate({ url: '/pages/topics/index', query: { foo: 1 } });

// 路由重定向，参数和 uniapp 的一致
// 当 tryTabBar = true 时，会自动判断 tabBar 页面进行重定向
router.redirect({ url: '/pages/auth/login' });
// 携带参数
router.navigate({ url: '/pages/auth/login', query: { bar: 'bar' } });

// 路由重定向，并清空当前页面栈
router.reLaunch({ url: '/pages/auth/login' });

// 后退
router.back();

// 当前当前页路由参数
const id = computed(() => router.currentQuery.value.id);

// 使用当前当前页路由参数获取数据
const data = ref();

watchEffect(async () => {
  const response = await fetch(
    `https://example.com/${id}`
  );
  data.value = await response.json();
});
```

#### [返回列表](../readme.md)
