/* eslint-disable prefer-promise-reject-errors */
import axios, { type Axios, type AxiosRequestConfig } from 'axios'
import { MessagePlugin } from 'tdesign-vue-next'
import { router } from '@/router'

//! 原来的axios不能定义返回值类型，拓展moudle，接收类型参数，参数为服务器返回内容的类?

interface RequestInstance extends Axios {
  <T = any>(config: AxiosRequestConfig): Promise<T>
  <T = any>(url: string, config?: AxiosRequestConfig): Promise<T>
  getUri(config?: AxiosRequestConfig): string
  request<T = any>(config: AxiosRequestConfig): Promise<T>
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>
  head<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>
  options<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>
  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>
  postForm<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>
  putForm<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>
  patchForm<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>
}

const request: RequestInstance = axios.create({
  xsrfCookieName: import.meta.env.VITE_CSRF_TOKEN,
  xsrfHeaderName: 'x-csrftoken',
  withCredentials: true,
  headers: { 'x-requested-with': 'XMLHttpRequest' },
  responseType: 'json',
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 60000,
})

request.interceptors.response.use(
  response => {
    const code = response.data.code

    if (code === 401) {
      try {
        const mailAction = response.data.data.flows.find((item: any) => item.id === 'verify_email')
        if (mailAction.is_pending) router.push({ name: 'EmailConfirmation', query: { email: mailAction.email } })
      } catch {
        router.push({ name: 'Login' })
      }
      return Promise.reject(response.data)
    }
    if (code === 409) router.go(0)
    // 错误状态：422请求参数传输错误 412请求数据操作错误 403无该操作权限 401未登录
    return code === 200 ? response.data.data : Promise.reject(response.data)
  },
  error => {
    if (axios.isCancel(error)) return Promise.reject({ message: `Cancel Request ${error.message}` })
    return Promise.reject(error)
  },
)

const requestErrorMsg = (title: string, message?: string) => {
  if (title.startsWith('Cancel Request') || title.includes('Request aborted')) {
    console.log(title) // 开发便于看取消理由
    return
  }
  if (title.startsWith('timeout') || title.startsWith('Network Error')) return

  // NotifyPlugin.error({ title, content, closeBtn: true, duration: 0 })
  MessagePlugin.error({ content: title + (message ? ` - ${message}` : ''), duration: 6000, closeBtn: true })
}

export { request, requestErrorMsg }
