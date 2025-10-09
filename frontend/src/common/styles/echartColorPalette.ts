export const echart_colors = [
  // 色系一
  '#5470c6',
  '#91cc75',
  '#fac858',
  '#ee6666',
  '#73c0de',
  '#3ba272',
  '#fc8452',
  '#9a60b4',
  '#ea7ccc',
  // 色系二
  '#dd6b66',
  '#759aa0',
  '#e69d87',
  '#8dc1a9',
  '#ea7e53',
  '#eedd78',
  '#73a373',
  '#73b9bc',
  '#7289ab',
  '#91ca8c',
  '#f49f42',
  // 色系三
  '#37A2DA',
  '#32C5E9',
  '#67E0E3',
  '#9FE6B8',
  '#FFDB5C',
  '#ff9f7f',
  '#fb7293',
  '#E062AE',
  '#E690D1',
  '#e7bcf3',
  '#9d96f5',
  '#8378EA',
  '#96BFFF',
  // 色系四
  '#c23531',
  '#2f4554',
  '#61a0a8',
  '#d48265',
  '#91c7ae',
  '#749f83',
  '#c4ccd3',
  '#ca8622',
  '#bda29a',
  '#6e7074',
  '#546570',
]
export const hexToRgba = (hex: string, alpha: number): string => {
  // 将#符号从16进制颜色代码中删除
  hex = hex.replace('#', '')

  // 将16进制颜色代码分解为RGB值
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)

  // 返回RGBA格式的颜色
  return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')'
}
