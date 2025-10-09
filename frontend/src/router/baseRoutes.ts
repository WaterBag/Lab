import type { RouteRecordRaw } from 'vue-router'

export const baseRoutes: RouteRecordRaw[] = [
  // {
  //   path: '/',
  //   component: 'Layout' as any,
  //   meta: { title: '课程', hideAside: true },
  //   children: [
  //     {
  //       path: '/',
  //       name: 'Home',
  //       component: () => import('@/views/Home/index.vue'),
  //       meta: {
  //         title: '工作台',
  //       },
  //     },
  //   ],
  // },
]

export const errorRoutes: RouteRecordRaw[] = [
  {
    path: '/error',
    name: 'ErrorPage', // 这个name不能修改，否则会影响Layout里的计算
    component: 'Layout' as any,
    meta: { hideTab: true, hideAside: true },
    children: [
      {
        name: '_Test',
        path: 'test',
        component: () => import('@/views/Test/index.vue'),
        meta: { hideTab: true, hideAside: true },
      },
      {
        path: ':title/:subTitle?',
        name: 'ErrorPagePreset',
        component: () => import('@/views/Error/index.vue'),
        meta: { docTitle: 'error' },
        props: true,
      },
      {
        path: '403',
        name: '403',
        component: () => import('@/views/Error/index.vue'),
        meta: { docTitle: '403' },
        props: {
          title: '403',
          subTitle: '抱歉，您无权限访问此页面',
        },
      },
      // 404路由,一定要放在最后面
      {
        path: '/:pathMatch(.*)*',
        name: '404',
        component: () => import('@/views/Error/index.vue'),
        meta: { docTitle: '404' },
        props: {
          title: '404',
          subTitle: '抱歉，您访问的页面不存在',
        },
      },
    ],
  },
]
