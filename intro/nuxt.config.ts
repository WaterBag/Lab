import type { NuxtPage } from 'nuxt/schema'
import { readFileSync } from 'node:fs'
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  experimental: { viewTransition: true },
  nitro: {
    compressPublicAssets: { brotli: false, gzip: true },
    experimental: {
      // https://github.com/unjs/nitro/pull/2043 非构建时而是运行时注入runtimeConfig的扩展语法
      envExpansion: true,
    },
  },
  srcDir: 'src/',
  devtools: { enabled: true },
  typescript: { shim: false },
  hooks: {
    // pages:extend 在页面路由解析完成后调用
    'pages:extend': pages => removeAutoPageRoute(pages),
  },
  build: {
    // transpile: ['tdesign-vue-next/es', '@cepdevops/ui'],
    transpile: ['tdesign-vue-next/es'].concat(process.env.NODE_ENV === 'production' ? ['@cepdevops/ui'] : []),
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
          additionalData: '@use "@/assets/styles/var.scss" as *;',
        },
      },
    },
  },
  vue: {
    compilerOptions: { isCustomElement: tag => tag === 'model-viewer' },
  },
  router: {
    options: {
      strict: true, // 严格模式，禁止url匹配尾部斜杠，不然在有可选子路径时会自动加上斜杠
      sensitive: true,
      scrollBehaviorType: 'auto',
      // scrollBehaviorType: 'smooth', // 不是路由滚动行为，是控制当前路由内hash变换的滚动是否为smooth，包括带hash初次渲染、前进、后退
    },
  },
  modules: [
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@nuxt/content',
    '@tdesign-vue-next/nuxt',
    ['@nuxt/icon', { mode: 'svg', serverBundle: 'local' }],
  ],
  css: [
    '@/assets/styles/index.scss',
    '@unocss/reset/tailwind-compat.css',
    'github-markdown-css/github-markdown-light.css',
  ],

  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/logos/logo.png' },
        // { rel: 'preconnect', href:'https://fonts.googleapis.com' },
        // { rel: 'preconnect', href:'https://fonts.gstatic.com', crossorigin: '' },
        // { rel: 'stylesheet', href:'https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,100..900&family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap' },
      ],
    },
  },
  runtimeConfig: {
    // 注意，在服务端读取public，这些值都是初始值，不会是客户端更改后的值
    public: {
      HOST_ENV: '{{HOST_ENV}}' as HostEnvType,
    },
  },

  content: {
    build: {
      markdown: {
        toc: {
          depth: 3, searchDepth: 3,
        },
        highlight: {
          langs: ['python'],
        },
      },
    },
  },
  compatibilityDate: '2024-10-29',
})

/**
 * pages目录下，不想自动生成为路由页面的文件，文件中添加__disable-nuxt-auto-route__注释即可
 * 不用nuxt配置的ignorePrefix是因为它在prerender时表现不一致，并且修改ignorePrefix的文件没有hmr
 */
const removeAutoPageRoute = (pages: NuxtPage[] = []) => {
  const pagesToRemove: NuxtPage[] = []
  pages.forEach(item => readFileSync(item.file!, 'utf-8').includes('__disable-nuxt-auto-route__')
    ? pagesToRemove.push(item)
    : removeAutoPageRoute(item.children),
  )
  pagesToRemove.forEach(item => pages.splice(pages.indexOf(item), 1))
}
