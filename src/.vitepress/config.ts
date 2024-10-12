import fg from 'fast-glob';
import { defineConfig } from 'vitepress';

const files = await fg('*', {
  onlyDirectories: true,
  cwd: './src',
  ignore: [
    'public',
    'api',
  ],
});

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'UniUse',
  description: 'uni-app (vue3) 组合式工具集。',
  lang: 'zh-CN',
  themeConfig: {
    logo: '/logo.png',

    nav: [
      { text: '指南', link: '/' },
      { text: 'API', link: '/api' },
    ],

    sidebar: [
      {
        text: 'Api',
        items: [
          {
            text: '函数列表',
            link: '/api',
          },
          ...files.map(file => ({
            text: file,
            link: `/${file}/index.md`,
          })),
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/uni-helper/uni-use' },
    ],
  },
});
