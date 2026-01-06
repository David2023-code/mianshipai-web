import { defineConfig } from 'vitepress'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  vite: {
    plugins: [
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'logo/apple-touch-icon.png', 'logo/favicon-32x32.png'],
        manifest: {
          name: '前端面试派',
          short_name: '面试派',
          description: '系统专业的前端面试导航',
          theme_color: '#ffffff',
          icons: [
            {
              src: '/logo/android-chrome-192x192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: '/logo/android-chrome-512x512.png',
              sizes: '512x512',
              type: 'image/png',
            },
          ],
        },
      }),
    ],
  },
  lang: 'zh-CN',
  title: '前端面试派',
  description: '系统专业的前端面试导航，大厂面试规范，开源免费',
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    [
      'meta',
      {
        name: 'keywords',
        content:
          '前端, 面试, 前端面试, 面试题, 刷题, 面试流程, 前端面试流程, 面试准备, 简历, 前端简历, 开源, 免费, Javascript, Typescript, React, Vue, webpack, vite, HTTP',
      },
    ],
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      // { text: '首页', link: '/' },
      // { text: '正确写简历', link: '/docs/before-interview/write-resume.md' },
      {
        text: '成为贡献者',
        link: 'https://github.com/David2023-code/mianshipai-web#',
      },
    ],

    search: {
      provider: 'local',
    },

    outline: {
      level: [2, 3],
      label: '目录',
    },

    sidebar: [
      {
        text: '面试准备',
        items: [
          { text: '分析 JD 招聘要求', link: '/docs/before-interview/jd.md' },
          {
            text: '正确写简历',
            link: '/docs/before-interview/write-resume.md',
          },
        ],
      },
      {
        text: '笔试',
        items: [
          { text: 'JS 手写代码', link: '/docs/written-exam/JS-writing' },
          { text: 'JS 读代码', link: '/docs/written-exam/JS-reading' },
        ],
      },
      {
        text: '一面',
        items: [
          { text: '计算机基础', link: '/docs/first-exam/ComputerBase.md' },
          { text: 'HTML 和 CSS', link: '/docs/first-exam/HTML-CSS.md' },
          { text: 'JS 基础知识', link: '/docs/first-exam/JS' },
          { text: 'TS 类型', link: '/docs/first-exam/TS' },
          { text: 'HTTP 网络请求', link: '/docs/first-exam/HTTP.md' },
        ],
      },
      {
        text: '二面',
        items: [
          { text: 'Vue 使用', link: '/docs/second-exam/vue-usage.md' },
          { text: 'Vue 原理', link: '/docs/second-exam/vue-inner.md' },
          { text: 'React 使用', link: '/docs/second-exam/react-usage.md' },
          { text: 'React 原理', link: '/docs/second-exam/react-inner.md' },
          { text: '前端工程化', link: '/docs/second-exam/engineering.md' },
          { text: 'Nodejs', link: '/docs/second-exam/nodejs.md' },
        ],
      },
      {
        text: '三面',
        items: [
          { text: '交叉面试', link: '/docs/third-exam/cross-test.md' },
          { text: '项目难点/成绩', link: '/docs/third-exam/project.md' },
          // { text: '系统设计', link: '/docs/third-exam/system-design.md' },
          { text: '前端 Leader 面试', link: '/docs/third-exam/leader-test.md' },
          { text: '反问面试官', link: '/docs/third-exam/ask-in-reply.md' },
        ],
      },
      {
        text: 'HR 面',
        items: [
          { text: '行为面试', link: '/docs/hr-exam/behavioural-test.md' },
          { text: '谈薪技巧', link: '/docs/hr-exam/salary.md' },
        ],
      },
      // {
      //   text: 'Examples',
      //   items: [
      //     { text: 'Markdown Examples', link: '/docs/markdown-examples' },
      //     { text: 'Runtime API Examples', link: '/docs/api-examples' },
      //   ],
      // },
    ],

    socialLinks: [{ icon: 'github', link: 'https://github.com/David2023-code/mianshipai-web#' }],

    footer: {
      message: '<a href="https://github.com/David2023-code/mianshipai-web/issues" target="_blank">提交问题和建议</a>',
      copyright: 'Copyright © 2025-present Mianshipai 面试派',
    },
  },
  ignoreDeadLinks: ['./vue-inner/index'],
})
