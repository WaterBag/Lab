import { defineStore } from 'pinia'
import { cloneDeep } from 'lodash-es'
import { LayoutCfg } from '@/setting'
import { handleAsyncRoutes } from '@/router/config'
import type { RouteLocationNormalizedGeneric, RouteRecordRaw } from 'vue-router'
import { useUserStore } from './User'

const filterHideTab = (routes: RouteRecordRaw[]) => {
  const res: RouteRecordRaw[] = []
  routes.forEach((item) => { if (!item.meta!.hideTab) res.push(item) })
  res.forEach((item) => {
    if (item.children?.length) {
      const child = filterHideTab(item.children)
      if (child.length) item.children = child
      else delete item.children
    }
  })
  return res
}

/**
 * - layout的菜单动态计算
 * - 其他全局配置
 */
export const useSettingStore = defineStore('setting', () => {
  const asyncRoutes = shallowRef<RouteRecordRaw[]>([])

  const navBarMenu = computed(() => {
    const { layout, splitMenu } = LayoutCfg
    const { auth_keys } = useUserStore()
    if (layout === 'aside') {
      if (!splitMenu) return []
      const res = handleAsyncRoutes(auth_keys, filterHideTab(cloneDeep(asyncRoutes.value)))
      res.forEach((item) => {
        if (item.redirect) {
          delete item.children
          return
        }

        let redirectRouteObj: RouteRecordRaw | null = null
        const firstDeepChild = (route: RouteRecordRaw): any => {
          if (redirectRouteObj) return
          if (!route.children || route.children.length === 0) redirectRouteObj = route
          else firstDeepChild(route.children[0])
        }

        firstDeepChild(item)

        item.redirect = redirectRouteObj!.meta!.dynamicRoute?.() || { name: redirectRouteObj!.name }
        delete item.children
      })
      return res
    }
    if (layout === 'top') return handleAsyncRoutes(auth_keys, filterHideTab(cloneDeep(asyncRoutes.value)))
    return []
  })

  const asideMenu = computed(() => (route: RouteLocationNormalizedGeneric) => {
    const { layout, splitMenu } = LayoutCfg
    /** aside并且splitMenu时，侧边菜单的根路由名（也就是nav上当前的路由） */
    const rootRouteName = route.matched[0]?.name || ''
    const { auth_keys } = useUserStore()
    if (layout !== 'aside' || route.meta!.hideAside) return []
    return handleAsyncRoutes(
      auth_keys,
      filterHideTab(cloneDeep(
        splitMenu
          ? asyncRoutes.value.find(item => item.name === rootRouteName)?.children || []
          : asyncRoutes.value,
      )),
    )
  })

  // *----------------
  const collapsed = ref(!!localStorage.getItem('--jp-collapsed'))
  const toggleCollapse = () => {
    collapsed.value = !collapsed.value
    collapsed.value ? localStorage.setItem('--jp-collapsed', 'true') : localStorage.removeItem('--jp-collapsed')
  }

  return { asyncRoutes, asideMenu, navBarMenu, collapsed, toggleCollapse }
})
