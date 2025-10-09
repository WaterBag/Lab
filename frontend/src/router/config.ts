import type { RouteRecordRaw, RouteLocationRaw } from 'vue-router'
import SubMenuRoute from './SubMenuRoute.vue'
// import { RouterView } from 'vue-router'
import Layout from '@/layout/index.vue'
import { cloneDeep } from 'lodash-es'

declare module 'vue-router' {
  interface RouteMeta {
    /**
     * 当该路由为menu项时，指定菜单项名
     */
    title?: string

    /**
     * 指定跳转到该路由时的html文档title前缀，若无则会尝试使用title字段，皆无则不改变
     */
    docTitle?: string

    /**
     * 当为true时，将不会在对应层级的菜单中渲染为菜单项，默认为undefined，非菜单项页面必须指定undefined
     */
    hideTab?: boolean

    /**
     * 在一个路由对象的根路由时(也就是Layout), 或在一个有children的路由对象时(也就是Sub)
     * 默认情况下会渲染一个可展开的菜单项(submenu), 并把它的children渲染为下级菜单项
     *
     *
     * 因为每个页面内容的路由对象都会被component为Layout的根路由包裹(也就是说根路由必定会有children)
     *
     * 但当在这种情况下, 如果期望直接渲染一个menu-item, 而不是sub-menu下只有一个menu-item时
     * 那就需要以chindren[0]作为实际渲染的menu-item
     *
     *
     * 也就是说, 当Layout路由或Sub路由的children有且仅有一项, 并且meta.penetrate指定为true时
     * 将会依据它的children[0]路由进行菜单项的生成
     *
     */
    penetrate?: boolean

    /**
     * 指定iconify或tdesign的icon名
     *
     * iconify的默认样式
     * 渲染在headmenu或menu时, 为了与t-icon的样式保持一致会有8px的右外边距, 当collapsed时无边距, 在popup出现的时候保持8px的右边距
     * 默认宽高为20px, 在popup出现是默认宽高为1em
     */
    icon?: string

    /**
     * 传给Icon组件的props，可指定style对象、size等属性，详看Icon组件文档
     */
    iconProps?: { [key: string]: any }

    /**
     * 只能用在第一层route对象中（也就是component === 'Layout'）
     * 当layout模式为aside并splitMenu时生效，表示在该路由渲染时隐藏侧边栏，并且该路由所有子菜单项都会在navBar上popup渲染
     */
    hideAside?: boolean

    /**
     * 运行时动态路由对象, 优先级比redirect高, 最终会被MenuItem调用使用
     * 适用于该路由对象需要根据动态的值或某个最新值而解析出path或parmas或query参数
     * 如资产管理模块: 子路由对象在menu上解释to时需要附带当前的business_id不能写死,需要动态计算
     */
    dynamicRoute?: { (): RouteLocationRaw },

    /**
     * 对菜单项生效，指定同级别route的菜单项的排序，数值越大越靠前(靠上、靠左)，默认为0
     */
    order?: number // 指定顺序，数值越大越靠前，默认为0

    /**
     * 该路由的权限值，只要用户拥有的权限值有其中一个，就代表有该路由页面的权限，默认为undefined表示无需权限
     * 子路由不需要再写，因为在路由守卫中的route.meta中是合并所有字段后的meta
     * @example
     * ```js
     * permission: undefined
     * 无需权限即可访问
     *
     * permission: []
     * 指定了权限数组但没有权限值，那么将无法访问
     *
     * permission: ['key1', 'key2']
     * 指定了两个所需权限值，只要用户权限值拥有其中一个，即表示拥有访问权限
     * ```
     */
    permission?: string[]
  }
}

/**
 * @param auth 用户权限值数组
 * @param permission route的所需权限值permission数组
 */
export const hasPermission = (auth: string[], permission: string[]) => {
  // const res = []
  // // 用户权限值与所需权限值有交集，就代表拥有权限
  // auth.forEach(key => permission.includes(key) && res.push(1))
  // return res.length > 0

  let res = false
  for (let i = 0; i < permission.length; i++) {
    if (res) break
    if (auth.includes(permission[i])) res = true
  }
  return res
}

/**
 * @param auth 用户权限值数组
 * @param asyncRoutes 动态路由route数组
 * @returns 经过权限过滤后的动态路由数组
 */
export const handleAsyncRoutes = (auth: string[], asyncRoutes: RouteRecordRaw[]) => {
  const res: RouteRecordRaw[] = []
  asyncRoutes.forEach(item => {
    if (!item.meta!.permission || (Array.isArray(item.meta!.permission) && hasPermission(auth, item.meta!.permission))) res.push(item)
  })

  res.forEach(item => {
    if (item.children && item.children.length) {
      const child = handleAsyncRoutes(auth, item.children)
      if (child.length) {
        item.children = child
      } else {
        delete item.children
      }
    }
  })

  return res
}

// 递归给所有route加上meta默认值，并按照order排序，如果component是'Sub'二级菜单，则不渲染实际组件而是router-view组件
export function formatRoutes (routes: RouteRecordRaw[]) {
  const res = cloneDeep(routes)
  res.forEach(item => {
    if ((item.component as any) === 'Sub') item.component = SubMenuRoute
    else if ((item.component as any) === 'Layout') item.component = Layout
    item.meta = Object.assign({}, defaultMeat, item.meta || {})
    if (item.children && item.children.length) item.children = formatRoutes(item.children)
  })
  res.sort((prev, next) => next.meta!.order! - prev.meta!.order!)
  return res
}

const defaultMeat = {
  title: '',
  order: 0,
  hideTab: false,
  icon: false,
}
