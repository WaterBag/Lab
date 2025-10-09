// import 'ofetch'

// declare module 'ofetch' {
//   export interface FetchOptions {
//     /** 仅在client端有效，如果为true，则不会对返回结果判断code和提取data。（在server端不会对请求进行处理） */
//     raw?: boolean
//   }
// }

/** @description 只在client端使用的请求函数，server端请直接使用$fetch */
export const request = $fetch.create({
  // baseURL: import.meta.env.VITE_API_BASE, // 前后端不分离，可以不用全局请求前缀
  // onRequest ({ options }) {
  // options.parseResponse = (txt) => {
  //   return txt
  // }
  // options.parseResponse = str => {
  // const response = JSON.parse(str)

  // console.log(1111, response)

  // if (response.code !== 200) throw new Error(response)
  // return response.data
  // }

  // const portal_language = useRuntimeConfig().public.lang
  // options.headers.set('Portal-Language', portal_language)
  // if (import.meta.server) Object.entries(useRequestHeaders() || {}).forEach(([k, v]) => options.headers.set(k, v))
  // options.headers.delete('accept')
  // },
  onResponse ({ response }) {
    const { code } = response._data
    // 表示没有接口http状态错误, 业务code判断抛出错误
    if (response.ok && code !== 200) throw createError(response._data)
    response._data = response._data.data
  },
  // onResponseError ({ response }) {
  //   // http状态错误才会走这里
  //   console.log(1111, response._data.message || response.statusText)
  // },
  // onResponseError ({ response }) {
  //   if (response.status === 401) { console.log('需要登录逻辑') }
  // },
})
