import fg from 'fast-glob';
import { defineConfig } from 'vitepress';

const files = await fg('*', {
  onlyDirectories: true,
  cwd: './src',
  ignore: [
    'public',
    'apis',
    'guide',
  ],
});

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'UniUse',
  description: 'uni-app (vue3) 组合式工具集。',
  lang: 'zh-CN',
  themeConfig: {
    logo: '/logo.png',
    editLink: {
      pattern: 'https://github.com/uni-helper/uni-use/tree/main/src/:path',
      text: '为这个页面提供建议',
    },
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2022-PRESENT uni-helper and uni-helper contributors',
    },

    nav: [
      { text: '指南', link: '/guide/' },
      { text: 'API', link: '/apis/' },
      { text: 'ChangeLog', link: 'https://github.com/uni-helper/uni-use/blob/main/CHANGELOG.md' },
    ],

    sidebar: {
      '/guide/': [
        {
          text: '指南',
          items: [
            {
              text: '开始',
              link: '/guide/',
            },
            {
              text: '注意事项',
              link: '/guide/notice/',
            },
            {
              text: '更新日志',
              link: 'https://github.com/uni-helper/uni-use/blob/main/CHANGELOG.md',
            },
            {
              text: '所有函数',
              link: '/apis/',
            },
          ],
        },
      ],
      '/': [
        {
          text: 'All Functions',
          items: [
            {
              text: '函数列表',
              link: '/apis/',
            },
          ],
        },
        {
          text: 'API',
          items: files.map(file => ({
            text: file,
            link: `/${file}/`,
          })),
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/uni-helper/uni-use' },
    ],
  },
});
