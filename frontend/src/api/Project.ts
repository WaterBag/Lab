/* eslint-disable camelcase */
import { request } from '@/common/plugins/request'

/** 获取项目列表 */
export const reqListProjects = (params: any) => request({ url: '/project/', method: 'GET', params })

/** 创建项目 */
export const reqCreateProject = (data: any) => request({ url: '/project/', method: 'POST', data })

// 获取项目信息
export const reqGetProject = (projectId: any) => request({ url: `/project/${projectId}/`, method: 'GET' })

// 变更项目成员
export const reqUpdateProjectUsers = (projectId: any, data: any) => request({ url: `/project/${projectId}/update_users/`, method: 'POST', data })

// 删除项目成员
export const reqRemoveProjectUser = (projectId: any, data: any) => request({ url: `/project/${projectId}/remove_users/`, data, method: 'POST' })

// 启动服务器
export const reqStartProjectServer = (projectId: any) => request({ url: `/project/${projectId}/start_server/`, method: 'POST' })

// 上传文件
export const reqUploadFile = (data: any) => request({ url: '/file/', method: 'POST', data })
