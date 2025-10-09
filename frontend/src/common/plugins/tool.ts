/* eslint-disable no-template-curly-in-string */
// import Cookies from 'js-cookie'

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import relativeTime from 'dayjs/plugin/relativeTime'
import duration from 'dayjs/plugin/duration'
import timezone from 'dayjs/plugin/timezone'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import type { App } from 'vue'
import { useUserStore } from '@/stores/User'
import { reqSelfLogin } from '@/api/Users'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(isSameOrAfter)
dayjs.extend(duration)
dayjs.extend(relativeTime)

dayjs.tz.setDefault('Asia/Shanghai')

const formatDate = (d?: string | Date | number) => dayjs(d).format('YYYY-MM-DD HH:mm:ss')

const setupTool = (app: App) => {
  Object.assign(window, {
    __logout: () => {
      const store = useUserStore()
      store.$reset()
    },
    __testLogin: async (username: string, password: string) => {
      try {
        const data = await reqSelfLogin({ username, password })
        console.log('__testLogin ok', data)
      } catch (error) {
        console.error('__testLogin error', error)
      }
    },
  })
}

export { dayjs, formatDate, setupTool }
