/* eslint-disable camelcase */
import { request } from '@/common/plugins/request'

export const reqCosTempCredential = (data: any) => request({ url: '/cos/temp_credential/', method: 'POST', data })
