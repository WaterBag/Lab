import type { RouteRecordRaw } from 'vue-router'

const route: RouteRecordRaw = {
  path: '/',
  name: 'Console',
  component: 'Layout' as any,
  meta: { title: '工作台', hideAside: true },
  children: [
    {
      name: 'ConsoleMain',
      path: '/',
      component: () => import('@/views/Home/index.vue'),
      meta: { title: '工作台' },
    },
    {
      name: 'ProjectCreation',
      path: '/project/creation',
      component: () => import('@/views/Projects/Creation/index.vue'),
      meta: { title: '创建项目' },
    },
    {
      name: 'ProjectDetail',
      path: '/project/:project_id',
      component: () => import('@/views/Projects/Detail/index.vue'),
      meta: { title: '项目详情' },
    },
  ],
}

export default route
