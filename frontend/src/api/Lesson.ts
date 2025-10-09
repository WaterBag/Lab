/* eslint-disable camelcase */
import { request } from '@/common/plugins/request'

/** 获取课程列表 */
export const reqListLesson = () => request({ url: '/lesson/' })

/** 获取课程详情 */
export const reqGetLesson = (lessonId: any) => request({ url: `/lesson/${lessonId}/` })

/** 获取章节详情 */
export const reqGetChapter = (chapterId: any) => request({ url: `/chapter/${chapterId}/` })
