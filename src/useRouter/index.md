# useRouter

路由相关的操作和变量

## 使用方式

```ts
import { tabBar } from '@/pages.json';
import { useRouter } from '@uni-helper/uni-use';

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

// 路由重定向，参数和 uniapp 的一致
// 当 tryTabBar = true 时，会自动判断 tabBar 页面进行重定向
router.redirect({ url: '/pages/auth/login' });

// 路由重定向，并清空当前页面栈
router.reLaunch({ url: '/pages/auth/login' });

// 后退
router.back();

// 支持携带 query 参数（navigate、redirect、reLaunch）
// 参数值最终都会被序列化为 string 类型，并且中文字符会被 URL 编码，请注意处理！
// 仅简单参数推荐使用该方式，复杂参数请使用 https://uniapp.dcloud.net.cn/api/router.html#event-channel 或者其他方式。
router.navigate({ url: '/pages/topics/index', query: { a: 1, b: 2 } }); // => /pages/topics/index?a=1&b=2
router.navigate({ url: '/pages/topics/index?c=1', query: { a: 1, b: 2 } }); // => /pages/topics/index?c=1&a=1&b=2
```
