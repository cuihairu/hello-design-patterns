import { defineConfig } from 'vitepress'

// Shared GitHub Pages base
const base = '/hello-design-patterns/'

// English sidebar (root locale)
const enSidebar = [
  {
    text: 'Introduction',
    items: [
      { text: 'Design Pattern Overview', link: '/introduction' }
    ]
  },
  {
    text: 'Creational Patterns',
    items: [
      { text: 'Overview', link: '/creational/overview' },
      { text: 'Singleton', link: '/creational/singleton' },
      { text: 'Factory Method', link: '/creational/factory-method' },
      { text: 'Abstract Factory', link: '/creational/abstract-factory' },
      { text: 'Builder', link: '/creational/builder' },
      { text: 'Prototype', link: '/creational/prototype' },
      { text: 'Multiton', link: '/creational/multiton' },
      { text: 'Object Pool', link: '/creational/object-pool' },
      { text: 'Service Locator', link: '/creational/service-locator' }
    ]
  },
  {
    text: 'Structural Patterns',
    items: [
      { text: 'Overview', link: '/structural/overview' },
      { text: 'Adapter', link: '/structural/adapter' },
      { text: 'Decorator', link: '/structural/decorator' },
      { text: 'Proxy', link: '/structural/proxy' },
      { text: 'Dynamic Proxy', link: '/structural/dynamic-proxy' },
      { text: 'Protection Proxy', link: '/structural/protection-proxy' },
      { text: 'Remote Proxy', link: '/structural/remote-proxy' },
      { text: 'Smart Pointer', link: '/structural/smart-pointer' },
      { text: 'Virtual Proxy', link: '/structural/virtual-proxy' },
      { text: 'Facade', link: '/structural/facade' },
      { text: 'Remote Facade and DTO', link: '/structural/remote-facade' },
      { text: 'Bridge', link: '/structural/bridge' },
      { text: 'Bidirectional Bridge', link: '/structural/bidirectional-bridge' },
      { text: 'Composite', link: '/structural/composite' },
      { text: 'Flyweight', link: '/structural/flyweight' },
      { text: 'Dependency Injection', link: '/structural/dependency-injection' }
    ]
  },
  {
    text: 'Behavioral Patterns',
    items: [
      { text: 'Overview', link: '/behavioral/overview' },
      { text: 'Strategy', link: '/behavioral/strategy' },
      { text: 'Observer', link: '/behavioral/observer' },
      { text: 'Command', link: '/behavioral/command' },
      { text: 'Chain of Responsibility', link: '/behavioral/chain-of-responsibility' },
      { text: 'Mediator', link: '/behavioral/mediator' },
      { text: 'Iterator', link: '/behavioral/iterator' },
      { text: 'Template Method', link: '/behavioral/template-method' },
      { text: 'State', link: '/behavioral/state' },
      { text: 'Memento', link: '/behavioral/memento' },
      { text: 'Interpreter', link: '/behavioral/interpreter' },
      { text: 'Visitor', link: '/behavioral/visitor' },
      { text: 'Callback', link: '/behavioral/callback' },
      { text: 'DSL', link: '/behavioral/dsl' }
    ]
  },
  {
    text: 'Concurrency Patterns',
    items: [
      { text: 'Overview', link: '/concurrency/overview' },
      { text: 'Producer-Consumer', link: '/concurrency/producer-consumer' },
      { text: 'Reactor', link: '/concurrency/reactor' },
      { text: 'Proactor', link: '/concurrency/proactor' },
      { text: 'Future', link: '/concurrency/future' },
      { text: 'Semaphore', link: '/concurrency/semaphore' },
      { text: 'Event Loop', link: '/concurrency/event-loop' },
      { text: 'Double-Checked Locking', link: '/concurrency/double-checked-locking' },
      { text: 'Active Object', link: '/concurrency/active-object' },
      { text: 'Thread Pool', link: '/concurrency/thread-pool' },
      { text: 'Read-Write Lock', link: '/concurrency/read-write-lock' },
      { text: 'Work Stealing', link: '/concurrency/work-stealing' }
    ]
  },
  {
    text: 'Other Patterns',
    items: [
      { text: 'Overview', link: '/other/overview' },
      { text: 'ORM', link: '/other/orm' },
      { text: 'MVC', link: '/other/mvc' },
      { text: 'MVVM', link: '/other/mvvm' },
      { text: 'Event Sourcing', link: '/other/event-sourcing' },
      { text: 'Transaction Script', link: '/other/transaction-script' },
      { text: 'Repository and Unit of Work', link: '/other/repository' }
    ]
  },
  {
    text: 'Integration Patterns',
    items: [
      { text: 'Overview', link: '/integration/overview' },
      { text: 'Message Channel', link: '/integration/message-channel' },
      { text: 'Message Router', link: '/integration/message-router' },
      { text: 'Message Translator', link: '/integration/message-translator' },
      { text: 'Publish-Subscribe', link: '/integration/publish-subscribe' }
    ]
  },
  {
    text: 'Anti-Patterns',
    items: [
      { text: 'Overview', link: '/anti-patterns/overview' },
      { text: 'God Object', link: '/anti-patterns/god-object' },
      { text: 'Big Ball of Mud', link: '/anti-patterns/big-ball-of-mud' },
      { text: 'Golden Hammer', link: '/anti-patterns/golden-hammer' },
      { text: 'Spaghetti Code', link: '/anti-patterns/spaghetti-code' },
      { text: 'Anemic Domain Model', link: '/anti-patterns/anemic-domain-model' }
    ]
  },
  {
    text: 'Modern Evolution',
    items: [
      { text: 'Overview', link: '/evolution/overview' },
      { text: 'Composition over Inheritance', link: '/evolution/composition-over-inheritance' },
      { text: 'SOLID and Dependency Rules', link: '/evolution/solid' },
      { text: 'Circuit Breaker', link: '/evolution/circuit-breaker' },
      { text: 'Bulkhead', link: '/evolution/bulkhead' },
      { text: 'Timeout', link: '/evolution/timeout' },
      { text: 'Retry', link: '/evolution/retry' }
    ]
  },
  {
    text: 'Knowledge Points',
    link: '/knowledge'
  },
  {
    text: 'Glossary',
    link: '/glossary'
  },
  {
    text: 'Research',
    items: [
      { text: 'Research Overview', link: '/research/overview' },
      { text: 'Books and Standards', link: '/research/books' },
      { text: 'Official and Community Docs', link: '/research/official-docs' },
      { text: 'Applications and Language', link: '/research/applications' },
      { text: 'Coverage and Differences', link: '/research/coverage' }
    ]
  },
  {
    text: 'Reference',
    items: [
      { text: 'References', link: '/reference' }
    ]
  }
]

// Chinese sidebar (zh locale) — same structure, /zh/ prefix on links
const zhSidebar = [
  {
    text: '简介',
    items: [
      { text: '设计模式概览', link: '/zh/introduction' }
    ]
  },
  {
    text: '创建型模式',
    items: [
      { text: '创建型模式概览', link: '/zh/creational/overview' },
      { text: '单例模式', link: '/zh/creational/singleton' },
      { text: '工厂方法模式', link: '/zh/creational/factory-method' },
      { text: '抽象工厂模式', link: '/zh/creational/abstract-factory' },
      { text: '建造者模式', link: '/zh/creational/builder' },
      { text: '原型模式', link: '/zh/creational/prototype' },
      { text: '多例模式', link: '/zh/creational/multiton' },
      { text: '对象池模式', link: '/zh/creational/object-pool' },
      { text: '服务定位器模式', link: '/zh/creational/service-locator' }
    ]
  },
  {
    text: '结构型模式',
    items: [
      { text: '结构型模式概览', link: '/zh/structural/overview' },
      { text: '适配器模式', link: '/zh/structural/adapter' },
      { text: '装饰模式', link: '/zh/structural/decorator' },
      { text: '代理模式', link: '/zh/structural/proxy' },
      { text: '动态代理模式', link: '/zh/structural/dynamic-proxy' },
      { text: '保护代理模式', link: '/zh/structural/protection-proxy' },
      { text: '远程代理模式', link: '/zh/structural/remote-proxy' },
      { text: '智能指针模式', link: '/zh/structural/smart-pointer' },
      { text: '虚拟代理模式', link: '/zh/structural/virtual-proxy' },
      { text: '外观模式', link: '/zh/structural/facade' },
      { text: '远程外观与数据传输对象', link: '/zh/structural/remote-facade' },
      { text: '桥接模式', link: '/zh/structural/bridge' },
      { text: '双向桥接模式', link: '/zh/structural/bidirectional-bridge' },
      { text: '组合模式', link: '/zh/structural/composite' },
      { text: '享元模式', link: '/zh/structural/flyweight' },
      { text: '依赖注入模式', link: '/zh/structural/dependency-injection' }
    ]
  },
  {
    text: '行为型模式',
    items: [
      { text: '行为型模式概览', link: '/zh/behavioral/overview' },
      { text: '策略模式', link: '/zh/behavioral/strategy' },
      { text: '观察者模式', link: '/zh/behavioral/observer' },
      { text: '命令模式', link: '/zh/behavioral/command' },
      { text: '责任链模式', link: '/zh/behavioral/chain-of-responsibility' },
      { text: '中介者模式', link: '/zh/behavioral/mediator' },
      { text: '迭代器模式', link: '/zh/behavioral/iterator' },
      { text: '模板方法模式', link: '/zh/behavioral/template-method' },
      { text: '状态模式', link: '/zh/behavioral/state' },
      { text: '备忘录模式', link: '/zh/behavioral/memento' },
      { text: '解释器模式', link: '/zh/behavioral/interpreter' },
      { text: '访问者模式', link: '/zh/behavioral/visitor' },
      { text: '回调模式', link: '/zh/behavioral/callback' },
      { text: '领域特定语言模式', link: '/zh/behavioral/dsl' }
    ]
  },
  {
    text: '并发模式',
    items: [
      { text: '并发模式概览', link: '/zh/concurrency/overview' },
      { text: '生产者消费者模式', link: '/zh/concurrency/producer-consumer' },
      { text: '反应堆模式', link: '/zh/concurrency/reactor' },
      { text: '主动器模式', link: '/zh/concurrency/proactor' },
      { text: 'Future 模式', link: '/zh/concurrency/future' },
      { text: '信号量模式', link: '/zh/concurrency/semaphore' },
      { text: '事件循环模式', link: '/zh/concurrency/event-loop' },
      { text: '双重检查锁定模式', link: '/zh/concurrency/double-checked-locking' },
      { text: '主动对象模式', link: '/zh/concurrency/active-object' },
      { text: '线程池模式', link: '/zh/concurrency/thread-pool' },
      { text: '读写锁模式', link: '/zh/concurrency/read-write-lock' },
      { text: '工作窃取模式', link: '/zh/concurrency/work-stealing' }
    ]
  },
  {
    text: '其他模式',
    items: [
      { text: '其他模式概览', link: '/zh/other/overview' },
      { text: 'ORM 模式', link: '/zh/other/orm' },
      { text: 'MVC 模式', link: '/zh/other/mvc' },
      { text: 'MVVM 模式', link: '/zh/other/mvvm' },
      { text: '事件溯源模式', link: '/zh/other/event-sourcing' },
      { text: '事务脚本模式', link: '/zh/other/transaction-script' },
      { text: '仓储与单元工作', link: '/zh/other/repository' }
    ]
  },
  {
    text: '集成模式',
    items: [
      { text: '集成模式概览', link: '/zh/integration/overview' },
      { text: '消息通道模式', link: '/zh/integration/message-channel' },
      { text: '消息路由模式', link: '/zh/integration/message-router' },
      { text: '消息转换模式', link: '/zh/integration/message-translator' },
      { text: '发布订阅模式', link: '/zh/integration/publish-subscribe' }
    ]
  },
  {
    text: '反模式',
    items: [
      { text: '反模式概览', link: '/zh/anti-patterns/overview' },
      { text: '神对象', link: '/zh/anti-patterns/god-object' },
      { text: '大泥球', link: '/zh/anti-patterns/big-ball-of-mud' },
      { text: '金锤子', link: '/zh/anti-patterns/golden-hammer' },
      { text: '意面代码', link: '/zh/anti-patterns/spaghetti-code' },
      { text: '贫血模型', link: '/zh/anti-patterns/anemic-domain-model' }
    ]
  },
  {
    text: '现代演进',
    items: [
      { text: '现代演进概览', link: '/zh/evolution/overview' },
      { text: '组合式设计', link: '/zh/evolution/composition-over-inheritance' },
      { text: 'SOLID 与依赖规则', link: '/zh/evolution/solid' },
      { text: '熔断器模式', link: '/zh/evolution/circuit-breaker' },
      { text: '隔舱模式', link: '/zh/evolution/bulkhead' },
      { text: '超时模式', link: '/zh/evolution/timeout' },
      { text: '重试模式', link: '/zh/evolution/retry' }
    ]
  },
  {
    text: '知识点整理',
    link: '/zh/knowledge'
  },
  {
    text: '术语表',
    link: '/zh/glossary'
  },
  {
    text: '调研',
    items: [
      { text: '调研总览', link: '/zh/research/overview' },
      { text: '权威书籍与标准目录', link: '/zh/research/books' },
      { text: '官方与社区文档', link: '/zh/research/official-docs' },
      { text: '应用场景与语言落地', link: '/zh/research/applications' },
      { text: '覆盖核对与差异表', link: '/zh/research/coverage' }
    ]
  },
  {
    text: '参考',
    items: [
      { text: '参考资料', link: '/zh/reference' }
    ]
  }
]

export default defineConfig({
  lang: 'en-US',
  title: 'Design Patterns Notes',
  description:
    "A game developer's personal notes on creational, structural, behavioral, concurrency and other design patterns, with C++, Java, and Go examples",

  // GitHub Pages project page deploys under a sub-path; missing base causes all static assets to 404
  base,
  cleanUrls: true,
  // Transitional: root locale pages are being translated incrementally; dead links are expected until all pages exist
  ignoreDeadLinks: true,

  // Icons in <head> are bare HTML and don't go through withBase; must carry base prefix
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: base + 'favicon.svg' }]
  ],

  locales: {
    root: {
      label: 'English',
      lang: 'en-US',
      title: 'Design Patterns Notes',
      description:
        "A game developer's personal notes on creational, structural, behavioral, concurrency and other design patterns, with C++, Java, and Go examples",
      themeConfig: {
        siteTitle: 'Design Patterns Notes',
        nav: [
          { text: 'Home', link: '/' },
          { text: 'GitHub', link: 'https://github.com/cuihairu/hello-design-patterns' }
        ],
        sidebar: enSidebar,
        editLink: {
          pattern: 'https://github.com/cuihairu/hello-design-patterns/edit/main/docs/:path',
          text: 'Edit this page on GitHub'
        },
        lastUpdatedText: 'Last updated',
        docFooter: { prev: 'Previous', next: 'Next' },
        outline: { label: 'On this page', level: [2, 3] },
        returnToTopLabel: 'Back to top',
        sidebarMenuLabel: 'Menu',
        darkModeSwitchLabel: 'Theme',
        lightModeSwitchTitle: 'Switch to light mode',
        darkModeSwitchTitle: 'Switch to dark mode',
        footer: {
          message: 'Built with VitePress',
          copyright: 'Copyright © 2024-present cuihairu'
        }
      }
    },
    zh: {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/zh/',
      title: '设计模式笔记',
      description: '一位游戏开发者关于创建型、结构型、行为型、并发等设计模式的个人记录，含 C++、Java、Go 示例',
      themeConfig: {
        siteTitle: '设计模式笔记',
        nav: [
          { text: '首页', link: '/zh/' },
          { text: 'GitHub', link: 'https://github.com/cuihairu/hello-design-patterns' }
        ],
        sidebar: zhSidebar,
        editLink: {
          pattern: 'https://github.com/cuihairu/hello-design-patterns/edit/main/docs/:path',
          text: '在 GitHub 上编辑此页'
        },
        lastUpdatedText: '最后更新',
        docFooter: { prev: '上一页', next: '下一页' },
        outline: { label: '页面大纲', level: [2, 3] },
        returnToTopLabel: '回到顶部',
        sidebarMenuLabel: '菜单',
        darkModeSwitchLabel: '外观',
        lightModeSwitchTitle: '切换到浅色模式',
        darkModeSwitchTitle: '切换到深色模式',
        footer: {
          message: '基于 VitePress 构建',
          copyright: 'Copyright © 2024-present cuihairu'
        }
      }
    }
  },

  themeConfig: {
    // Theme components add base prefix automatically; write root paths here
    logo: '/logo.svg',
    socialLinks: [
      { icon: 'github', link: 'https://github.com/cuihairu/hello-design-patterns' }
    ],
    lastUpdated: true
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
