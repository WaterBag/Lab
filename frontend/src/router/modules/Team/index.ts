import type { RouteRecordRaw } from 'vue-router'

const route: RouteRecordRaw = {
  path: '/team',
  name: 'Team',
  component: 'Layout' as any,
  meta: { title: ' 团队', hideAside: true, hideTab: true },
  children: [
    {
      name: 'TeamApply',
      path: 'apply',
      component: () => import('@/views/Team/Apply/index.vue'),
      meta: { title: '申请团队' },
    },
    {
      name: 'TeamCreation',
      path: 'creation',
      component: () => import('@/views/Team/Creation/index.vue'),
      meta: { title: '创建团队' },
    },
    {
      name: 'TeamDetail',
      path: 'detail/:team_id',
      component: () => import('@/views/Team/Detail/index.vue'),
      meta: { title: '团队详情' },
    },
  ],
}

export default route
