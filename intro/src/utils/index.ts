/** 需要在使用sal的页面onMounted时调用一次sal，否则在浏览器前进/后退的时候会丢失效果，直接全部页面自动引入这个变量 */
// export { default as sal } from 'sal.js'
import _sal from 'sal.js'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import relativeTime from 'dayjs/plugin/relativeTime'
import duration from 'dayjs/plugin/duration'
import timezone from 'dayjs/plugin/timezone'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'

export const sal = () => _sal({ threshold: 0.2, root: null })

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(isSameOrAfter)
dayjs.extend(duration)
dayjs.extend(relativeTime)
// dayjs.tz.setDefault('Asia/Shanghai')

export { default as dayjs } from 'dayjs'
export const formatDate = (d: string | Date | number) => dayjs(d).format('YYYY-MM-DD HH:mm:ss')
