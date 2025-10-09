import type { ECharts } from 'echarts'
import { throttle } from 'lodash-es'

/** 在onMounted时调用 */
export const useEchartsResize = (instance: ECharts) => {
  const trigger = throttle(instance.resize, 60)
  const resizeObserver = new ResizeObserver(trigger as any)
  const dom = instance.getDom()
  resizeObserver.observe(dom)

  onBeforeUnmount(() => {
    resizeObserver.unobserve(dom)
    resizeObserver.disconnect()
    instance.dispose()
  })
}
