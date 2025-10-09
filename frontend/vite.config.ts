import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv, type CommonServerOptions } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import autoImport from 'unplugin-auto-import/vite'
import components from 'unplugin-vue-components/vite'
import { TDesignResolver } from 'unplugin-vue-components/resolvers'
// import { visualizer } from 'rollup-plugin-visualizer'
import { compression } from 'vite-plugin-compression2'

const resolve = (p: string) => fileURLToPath(new URL(p, import.meta.url))
const envDir = resolve('./env')

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, envDir)

  // 开发服务器，基本上只有连测试环境和生产环境的api，基本不会连本地局域网的后端开发机
  const server: CommonServerOptions = {
    port: 9099,

    cors: true,
    host: '0.0.0.0',
    proxy: {
      [env.VITE_API_BASE_URL]: {
        target: env.VITE_PROXY_API_HOST,
        changeOrigin: true,
        headers: { Referer: env.VITE_PROXY_API_HOST },
      },
    },
  }

  return {
    envDir,
    plugins: [
      // visualizer({ gzipSize: true }),
      compression(),
      vue(),
      vueJsx(),
      vueDevTools(),
      autoImport({
        imports: ['vue', 'vue-router'],
        dts: resolve('./src/types/auto-imports.d.ts'),
      }),
      components({
        resolvers: [
          TDesignResolver({
            library: 'vue-next',
            // importStyle: true,
            resolveIcons: true,
          }),
        ],
        extensions: ['vue', 'tsx'], // 默认为自动引入src/component下都是vue组件，新增一个tsx也可以引入
        dts: resolve('./src/types/components.d.ts'),
      }),
    ],
    resolve: { alias: { '@': resolve('./src') } },
    server,
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
          additionalData: '@use "@/common/styles/var.scss" as *;',
        },
      },
    },
  }
})
