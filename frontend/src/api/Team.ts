/* eslint-disable camelcase */
import { request } from '@/common/plugins/request'

/** 获取团队列表 */
export const reqListTeams = (params: any) => request({ url: '/team/', params, method: 'GET' })

/** 创建团队 */
export const reqCreateTeam = (data: any) => request({ url: '/team/', data, method: 'POST' })

// 获取团队信息
export const reqGetTeam = (teamId: any) => request({ url: `/team/${teamId}/`, method: 'GET' })

// 添加团队成员
export const reqAddTeamUser = (teamId: any, data: any) => request({ url: `/team/${teamId}/add_users/`, method: 'POST', data })

// 移除团队成员
export const reqRemoveTeamUser = (teamId: any, data: any) => request({ url: `/team/${teamId}/remove_users/`, method: 'POST', data })
