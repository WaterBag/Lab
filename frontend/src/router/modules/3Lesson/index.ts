import type { RouteRecordRaw } from 'vue-router'

const route: RouteRecordRaw = {
  path: '/lesson',
  name: 'Lesson',
  component: 'Layout' as any,
  meta: { title: '课程' },
  children: [
    {
      name: 'LessonList',
      path: 'list',
      component: () => import('@/views/Lesson/Market/index.vue'),
      meta: { title: '全部课程' },
    },
    {
      name: 'MyLesson',
      path: 'my',
      component: () => import('@/views/Lesson/My/index.vue'),
      meta: { title: '我的课程' },
    },
    {
      name: 'LessonDetail',
      path: 'detail/:lesson_id',
      component: () => import('@/views/Lesson/Detail/index.vue'),
      meta: { title: '课程详情', hideAside: true, hideTab: true },
    },
    {
      name: 'ChapterDetail',
      path: 'chapter/:chapter_id',
      component: () => import('@/views/Lesson/Chapter/index.vue'),
      meta: { title: '章节详情', hideAside: true, hideTab: true },
    },
  ],
}

export default route
