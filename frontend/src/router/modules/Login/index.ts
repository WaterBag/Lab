import { useUserStore } from '@/stores/User'
import type { RouteRecordRaw } from 'vue-router'

export const LoginBaseRouteName = 'LoginBaseRoute'

const route: RouteRecordRaw = {
  path: '/login',
  name: LoginBaseRouteName,
  component: () => import('@/views/Login/Layout.vue'),
  meta: { hideTab: true },
  beforeEnter () { if (useUserStore().isLogin) return '/' },
  children: [
    {
      name: 'Login',
      path: '/login',
      component: () => import('@/views/Login/Login.vue'),
      meta: { title: '登录' },
    },
    {
      name: 'SignUp',
      path: '/signup',
      component: () => import('@/views/Login/SignUp.vue'),
      meta: { title: '注册' },
    },
    {
      name: 'ForgetVerify',
      path: '/verify',
      component: () => import('@/views/Login/ForgetVerify.vue'),
      meta: { title: 'Verify' },
    },
    {
      name: 'SignUpAll',
      path: '/signup-all',
      component: () => import('@/views/Login/SignUpAll.vue'),
      meta: { title: '注册' },
    },
    {
      name: 'ResetPwd',
      path: '/resetpwd',
      component: () => import('@/views/Login/SignUpAll.vue'),
      meta: { title: '重置密码' },
    },
    {
      name: 'EmailConfirmation',
      path: '/email-confirmation',
      component: () => import('@/views/Login/EmailConfirmation.vue'),
      meta: { title: '邮件验证' },
      beforeEnter (to) {
        if (!to.query.email) return { name: 'LoginError' }
      },
    },
    {
      name: 'EmailVerification',
      path: '/email-verification',
      component: () => import('@/views/Login/EmailVerification.vue'),
      meta: { title: '邮件确认' },
      beforeEnter (to) {
        if (!to.query.key) return { name: 'LoginError' }
      },
    },
    {
      name: 'CreateAccount',
      path: '/create-account',
      component: () => import('@/views/Login/CreateAccount.vue'),
      meta: { title: 'Create an account' },
      beforeEnter (to) {
        if (!to.query.token) return { name: 'LoginError' }
      },
    },
    {
      name: 'LoginError',
      path: 'error',
      component: () => import('@/views/Login/Error.vue'),
      meta: { title: 'Error' },
    },
  ],
}

export default route
