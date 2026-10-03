import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'zh-CN',
  title: '设计模式指南',
  description: '系统梳理创建型、结构型、行为型、并发等设计模式，涵盖 C++、Java、Go 多语言实现',

  // GitHub Pages 项目页部署在仓库子路径下，缺 base 会导致全部静态资源 404
  base: '/hello-design-patterns/',
  cleanUrls: true,

  head: [
    // 品牌资产空位：favicon.svg 到位后启用
    // ['link', { rel: 'icon', type: 'image/svg+xml', href: '/hello-design-patterns/favicon.svg' }]
  ],

  themeConfig: {
    // 品牌资产空位：logo.svg 到位后启用
    // logo: '/hello-design-patterns/logo.svg',
    siteTitle: '设计模式指南',

    nav: [
      { text: '首页', link: '/' },
      { text: 'GitHub', link: 'https://github.com/cuihairu/hello-design-patterns' }
    ],

    sidebar: [
      {
        text: '简介',
        items: [
          { text: '设计模式概览', link: '/introduction' }
        ]
      },
      {
        text: '创建型模式',
        items: [
          { text: '创建型模式导读', link: '/creational/overview' },
          { text: '单例模式', link: '/creational/singleton' },
          { text: '工厂方法模式', link: '/creational/factory-method' },
          { text: '抽象工厂模式', link: '/creational/abstract-factory' },
          { text: '建造者模式', link: '/creational/builder' },
          { text: '原型模式', link: '/creational/prototype' },
          { text: '多例模式', link: '/creational/multiton' },
          { text: '对象池模式', link: '/creational/object-pool' },
          { text: '服务定位器模式', link: '/creational/service-locator' }
        ]
      },
      {
        text: '结构型模式',
        items: [
          { text: '结构型模式导读', link: '/structural/overview' },
          { text: '适配器模式', link: '/structural/adapter' },
          { text: '装饰模式', link: '/structural/decorator' },
          { text: '代理模式', link: '/structural/proxy' },
          { text: '动态代理模式', link: '/structural/dynamic-proxy' },
          { text: '保护代理模式', link: '/structural/protection-proxy' },
          { text: '远程代理模式', link: '/structural/remote-proxy' },
          { text: '智能指针模式', link: '/structural/smart-pointer' },
          { text: '虚拟代理模式', link: '/structural/virtual-proxy' },
          { text: '外观模式', link: '/structural/facade' },
          { text: '桥接模式', link: '/structural/bridge' },
          { text: '双向桥接模式', link: '/structural/bidirectional-bridge' },
          { text: '组合模式', link: '/structural/composite' },
          { text: '享元模式', link: '/structural/flyweight' },
          { text: '依赖注入模式', link: '/structural/dependency-injection' }
        ]
      },
      {
        text: '行为型模式',
        items: [
          { text: '行为型模式导读', link: '/behavioral/overview' },
          { text: '策略模式', link: '/behavioral/strategy' },
          { text: '观察者模式', link: '/behavioral/observer' },
          { text: '命令模式', link: '/behavioral/command' },
          { text: '责任链模式', link: '/behavioral/chain-of-responsibility' },
          { text: '中介者模式', link: '/behavioral/mediator' },
          { text: '迭代器模式', link: '/behavioral/iterator' },
          { text: '模板方法模式', link: '/behavioral/template-method' },
          { text: '状态模式', link: '/behavioral/state' },
          { text: '备忘录模式', link: '/behavioral/memento' },
          { text: '解释器模式', link: '/behavioral/interpreter' },
          { text: '访问者模式', link: '/behavioral/visitor' },
          { text: '回调模式', link: '/behavioral/callback' },
          { text: '领域特定语言模式', link: '/behavioral/dsl' }
        ]
      },
      {
        text: '并发模式',
        items: [
          { text: '并发模式导读', link: '/concurrency/overview' },
          { text: '生产者消费者模式', link: '/concurrency/producer-consumer' },
          { text: '反应堆模式', link: '/concurrency/reactor' },
          { text: '主动器模式', link: '/concurrency/proactor' },
          { text: 'Future 模式', link: '/concurrency/future' },
          { text: '信号量模式', link: '/concurrency/semaphore' },
          { text: '事件循环模式', link: '/concurrency/event-loop' },
          { text: '双重检查锁定模式', link: '/concurrency/double-checked-locking' },
          { text: '主动对象模式', link: '/concurrency/active-object' }
        ]
      },
      {
        text: '其他模式',
        items: [
          { text: '其他模式导读', link: '/other/overview' },
          { text: 'ORM 模式', link: '/other/orm' },
          { text: 'MVC 模式', link: '/other/mvc' },
          { text: 'MVVM 模式', link: '/other/mvvm' },
          { text: '事件溯源模式', link: '/other/event-sourcing' }
        ]
      },
      {
        text: '参考',
        items: [
          { text: '参考资料', link: '/reference' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/cuihairu/hello-design-patterns' }
    ],

    footer: {
      message: '基于 VitePress 构建',
      copyright: 'Copyright © 2024-present cuihairu'
    },

    editLink: {
      pattern: 'https://github.com/cuihairu/hello-design-patterns/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页'
    },

    lastUpdated: true,
    lastUpdatedText: '最后更新',

    docFooter: {
      prev: '上一页',
      next: '下一页'
    },

    outline: {
      label: '页面大纲',
      level: [2, 3]
    },

    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '外观',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式'
  },

  markdown: {
    theme: 'github-dark',
    lineNumbers: true
  },

  vite: {
    server: {
      port: 5173
    }
  }
})