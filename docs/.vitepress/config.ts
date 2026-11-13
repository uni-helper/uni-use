import type { UserConfig } from 'vitepress'
import { basename, join } from 'node:path'
import { glob } from 'tinyglobby'
import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default async (): Promise<UserConfig> => {
  const files = await glob('*.md', {
    cwd: join(__dirname, '../api'),
  })

  const names = files
    .map(file => basename(file, '.md'))
    .filter(name => name !== 'index')
    .sort()

  return defineConfig({
    title: 'UniUse',
    description: 'uni-app (vue3) 组合式工具集。',
    lang: 'zh-CN',
    cleanUrls: true,

    themeConfig: {
      logo: '/logo.svg',

      nav: [
        { text: '指南', link: '/guide/' },
        { text: 'API', link: '/api/' },
        { text: '改动日志', link: 'https://github.com/uni-helper/uni-use/blob/main/CHANGELOG.md' },
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
                link: '/guide/notice',
              },
              {
                text: '日志',
                link: 'https://github.com/uni-helper/uni-use/blob/main/CHANGELOG.md',
              },
              {
                text: '所有函数',
                link: '/api/',
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
                link: '/api/',
              },
            ],
          },
          {
            text: 'API',
            items: names.map(name => ({
              text: name,
              link: `/api/${name}`,
            })),
          },
        ],
      },

      editLink: {
        pattern: 'https://github.com/uni-helper/uni-use/tree/main/docs/:path',
        text: '为这个页面提供建议',
      },

      footer: {
        message: 'Released under the MIT License.',
        copyright: 'Copyright © 2022-PRESENT uni-helper and uni-helper contributors',
      },

      docFooter: {
        prev: '上一页',
        next: '下一页',
      },

      outline: {
        label: '页面导航',
      },

      search: {
        provider: 'local',
        options: {
          locales: {
            'zh-CN': {
              translations: {
                button: {
                  buttonText: '搜索文档',
                  buttonAriaLabel: '搜索文档',
                },
                modal: {
                  noResultsText: '无法找到相关结果',
                  resetButtonTitle: '清除查询条件',
                  footer: {
                    selectText: '选择',
                    navigateText: '切换',
                    closeText: '关闭',
                  },
                },
              },
            },
          },
        },
      },

      lastUpdated: {
        text: '最后更新于',
        formatOptions: {
          dateStyle: 'short',
          timeStyle: 'medium',
        },
      },

      langMenuLabel: '多语言',
      returnToTopLabel: '回到顶部',
      sidebarMenuLabel: '菜单',
      darkModeSwitchLabel: '主题',
      lightModeSwitchTitle: '切换到浅色模式',
      darkModeSwitchTitle: '切换到深色模式',

      socialLinks: [
        { icon: 'github', link: 'https://github.com/uni-helper/uni-use' },
      ],
    },

  })
}
