// import NProgress from 'nprogress'
import { useUserStore } from '@/stores/User'
import { hasPermission } from '../config'
import { SUFFIX_TITLE } from '@/setting'
import type { Router, RouteLocationNormalized } from 'vue-router'
import { LoginBaseRouteName } from '@/router/modules/Login'

function setDocumentTitle ({ meta: { title, docTitle } }: RouteLocationNormalized) {
  const asyncTitle = docTitle || title || undefined
  if (!asyncTitle) return
  document.title = asyncTitle + ' - ' + SUFFIX_TITLE
}

function checkPermission ({ meta: { permission } }: RouteLocationNormalized) {
  if (!permission) return true
  if (!permission.length) return false
  return hasPermission(useUserStore().auth_keys, permission)
}

export const setupGuard = (router: Router) => {
  const UserStore = useUserStore()
  router.beforeEach((to, from) => {
    if (to.matched[0]?.name !== LoginBaseRouteName && !UserStore.isLogin) return { name: 'Login' }
    /**
     * 当name相同，表示当前页面跳转自身，无需再鉴权和显示进度条
     * 如 router.replace({ query: {}, params: {} }) 这样的操作修改当前页面的query或params，但不跳转页面
     */
    if (to.name === from.name) return true
    // NProgress.inc()
    if (!checkPermission(to)) return { name: '403' }
    else return true
  })

  router.afterEach((to) => {
    setDocumentTitle(to)
    // NProgress.done()
  })
}
