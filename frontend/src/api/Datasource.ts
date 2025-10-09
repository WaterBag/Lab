/* eslint-disable camelcase */
import { request } from '@/common/plugins/request'

/** 用户信息 */
export const reqListDatasource = (params: any) =>
  request({ url: '/datasource/', params, method: 'GET' })

export const reqListMyDatasource = (params: any) => request({ url: '/datasource/my/', params, method: 'GET' })

// 获取上传链接
export const reqGetUploadUrl = (data: any) => request({ url: '/datasource/upload_url/', method: 'POST', data })

// 创建数据集
export const reqCreateDatasource = (data: FormData) =>
  request({
    url: '/datasource/',
    data,
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

// 获取数据集详情
export const reqGetDatasource = (dataId: any) => request({ url: `/datasource/${dataId}/`, method: 'GET' })

// 获取临时COS密钥
export const reqGetDatasourcePreviewInfo = (dataId: any) => request({ url: `/datasource/${dataId}/preview_info/`, method: 'POST' })

export const reqGetPreviewUrl = (dataId: any, name: string) => request({ url: `/datasource/${dataId}/preview_url/`, method: 'POST', data: { name } })

// 添加收藏
export const reqAddFavoriteDatasource = (data: any) => request({ url: '/datasource/add_favorites/', method: 'POST', data })

// 移除收藏
export const reqRemoveFavoriteDatasource = (data: any) => request({ url: '/datasource/remove_favorites/', method: 'POST', data })

// 获取收藏数据集
export const reqFavoriteDatasource = (params: any) => request({ url: '/datasource/favorites/', method: 'GET', params })
