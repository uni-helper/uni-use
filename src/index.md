---
layout: home

hero:
  name: UniUse
  text: uni-app 组合式工具集
  tagline: 为 uni-app 量身打造的组合式工具集
  image:
    src: /logo.png
    alt: UniUse
  actions:
    - theme: brand
      text: 开始
      link: /start
    - theme: alt
      text: API 集合
      link: /api/

features:
  - icon: 🎛
    title: 功能丰富
    details: 提供了丰富的功能，封装了 uni-app 中常用的功能。
  - icon: 💚
    title: 开箱即用
    details: 开箱即用的支持了 uni-app Vue3 的 Composition API。
  - icon: 🦾
    title: 功能丰富
    details: 所有函数都支持 TS 类型推导，无需手动标注类型
---

<style>
:root {
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: -webkit-linear-gradient(
    315deg,
    #42d392 25%,
    #647eff
  );
  --vp-home-hero-image-background-image: linear-gradient(
    -45deg,
    #41b88380 30%,
    #35495e80
  );
  --vp-home-hero-image-filter: blur(30px);
}

@media (min-width: 640px) {
  :root {
    --vp-home-hero-image-filter: blur(56px);
  }
}

@media (min-width: 960px) {
  :root {
    --vp-home-hero-image-filter: blur(72px);
  }
}
</style>
