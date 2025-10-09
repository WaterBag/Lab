import empty from './empty.svg'
import type { ECharts, EChartsOption } from 'echarts'

interface SizeModeItem {
  symbolSize: [number, number]
  fontSize: number
  offset: [number, number]
}
interface SizeMode {
  large: SizeModeItem
  middle: SizeModeItem
  mini: SizeModeItem
}
const sizeMode:SizeMode = {
  large: {
    symbolSize: [160, 180],
    fontSize: 15,
    offset: [0, 60],
  },
  middle: {
    symbolSize: [120, 140],
    fontSize: 13.5,
    offset: [0, 45],
  },
  mini: {
    symbolSize: [90, 100],
    fontSize: 11,
    offset: [0, 45],
  },
}

/**
 *
 * @param {EChartsInstance} echart 实例
 * @param {'large' | 'middle' | 'mini'} size 中心图案和文本的尺寸
 * @param {Object?} titleOption 空状态时显示的chart的title选项，用于保留图表标题
 * @returns {EChartsCoreOption} 渲染空状态的echart配置项
 * @description 调用这个函数，返回一个空状态图片的echart配置项，注意当需要从空状态重新传入数据时，不能默认merge配置项；或者先调用clear清空配置。
 */
export const useEmptyChart = (echart:ECharts, size:keyof SizeMode, titleOption?: EChartsOption['title']):EChartsOption => {
  echart.clear()

  const { symbolSize, fontSize, offset } = sizeMode[size]

  return {
    title: titleOption,
    xAxis: {
      data: ['暂无数据'],
      show: false,
    },
    yAxis: {
      show: false,
    },
    series: {
      type: 'pictorialBar',
      data: [100],
      symbol: `image://${empty}`,
      symbolPosition: 'center',
      symbolSize,
      symbolOffset: [0, '-20%'],
      label: {
        show: true,
        formatter: ({ name }: { name:string }) => name,
        fontSize,
        color: '#2c2c2c',
        offset,
      },
    },
    grid: {
      top: 20,
      bottom: 0,
      right: 10,
      left: 10,
    },
  }
}
