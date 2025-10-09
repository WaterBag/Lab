import type { RouteRecordRaw } from 'vue-router'

const route: RouteRecordRaw = {
  path: '/datasource',
  name: 'Datasource',
  component: 'Layout' as any,
  meta: { title: '数据集', hideAside: false },
  children: [
    {
      name: 'DataMarket',
      path: 'market',
      component: () => import('@/views/Datasource/Market/index.vue'),
      meta: { title: '数据市场' },
    },
    {
      name: 'DataFavorite',
      path: 'favorite',
      component: () => import('@/views/Datasource/Market/index.vue'),
      meta: { title: '我的收藏' },
    },
    {
      name: 'MyDatasource',
      path: 'my',
      component: () => import('@/views/Datasource/MyData/index.vue'),
      meta: { title: '我的数据' },
    },
    {
      name: 'DataCreation',
      path: 'create',
      component: () => import('@/views/Datasource/Creation/index.vue'),
      meta: { title: '创建数据', hideTab: true, hideAside: true },
    },
    {
      name: 'DataDetail',
      path: 'detail/:data_id',
      component: () => import('@/views/Datasource/Detail/index.vue'),
      meta: { title: '数据集详情', hideAside: true, hideTab: true },
    },
  ],
}

export default route
