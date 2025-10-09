import { createRouter, createWebHistory } from 'vue-router'
import { formatRoutes } from './config'
import { baseRoutes, errorRoutes } from './baseRoutes'
import { setupGuard } from './guard'
import { useSettingStore } from '@/stores/Setting'

import type { RouteRecordRaw } from 'vue-router'
import type { App } from 'vue'

// 只自动引入modules下的所有index.ts文件,所以一个route模块需要单独文件夹
// 此举出于面对某个route复杂需要进一步解耦出更多js文件的情况下也只会引入index.js
// const req = require.context('./modules', true, /index.ts$/)
const modules = import.meta.glob('./modules/**/index.ts', { eager: true })
// 先获取所有的动态路由信息
let asyncRoutes: RouteRecordRaw[] = Object.values(modules).map((item: any) => item.default)

asyncRoutes = formatRoutes(asyncRoutes)

// 静态路由
export const syncRoutes = [...formatRoutes(baseRoutes), ...formatRoutes(errorRoutes)]

// concat时保证路由的顺序
const routes = asyncRoutes.concat(syncRoutes)

export const router = createRouter({
  history: createWebHistory(),
  routes,
  strict: true,
  sensitive: true,
})

export const setupRouter = (app: App) => {
  const SettingStore = useSettingStore()

  SettingStore.asyncRoutes = asyncRoutes

  setupGuard(router)

  app.use(router)
}
