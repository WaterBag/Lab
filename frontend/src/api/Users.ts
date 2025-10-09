/* eslint-disable camelcase */
import { request } from '@/common/plugins/request'

/** 用户信息 */
export const reqUserInfo = () => request({ url: '/users/me/' })

/** 平台自有用户用户名密码登录 */
export const reqSelfLogin = (data: { username: string, password: string }) =>
  request({ url: '/accounts/browser/v1/auth/login', data, method: 'POST' })

/** 平台自有用户用户注册 */
export const reqRegisterVerify = (data: { email: string }) =>
  request({ url: '/accounts/browser/v1/auth/signup', data, method: 'POST' })

/** 平台自有用户用户注册发送邮件 */
export const reqResendEmail = (data: { email: string }) =>
  request({ url: '/accounts/email_confirmation/', data, method: 'POST' })

/** 平台自有用户用户注册发送邮件 */
export const reqUserRegister = (data: { email: string, password: string, desc: string }) =>
  request({ url: '/user_register/', data, method: 'POST' })

/** 平台自有用户用户密码重置发送邮件 */
export const reqSendPwdEmail = (data: { email: string }) =>
  request({ url: '/accounts/browser/v1/auth/password/request', data, method: 'POST' })

/** 平台自有用户用户密码重置 */
export const reqChangePwd = (data: { key: string, password: string }) =>
  request({ url: '/accounts/browser/v1/auth/password/reset', data, method: 'POST' })

// 用户邮件验证链接请求
export const reqVerifyEmail = (data: { key: string }) =>
  request({ url: '/accounts/browser/v1/auth/email/verify', data, method: 'POST' })

// 用户注销
export const reqSelfLogout = () =>
  request({ url: '/accounts/browser/v1/auth/session', method: 'DELETE' })

// 拉取用户列表
export const reqListUsers = () => request({ url: '/users/', method: 'GET' })
