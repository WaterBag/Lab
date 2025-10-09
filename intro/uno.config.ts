import { defineConfig/* , presetTypography, presetUno */ } from 'unocss'
import transformerVariantGroup from '@unocss/transformer-variant-group'
export default defineConfig({
  // presets: [
  //   presetUno(),
  //   presetTypography(),
  // ],
  transformers: [
    transformerVariantGroup(),
  ],
  rules: [
    // 文本溢出
    [
      /^ellipsis-(\d+)$/,
      ([, line]) => {
        if (line === '1') return {
          overflow: 'hidden',
          'text-overflow': 'ellipsis',
          'white-space': 'nowrap',
        }
        return {
          display: '-webkit-box',
          '-webkit-line-clamp': line,
          '-webkit-box-orient': 'vertical',
          overflow: 'hidden',
          'text-overflow': 'ellipsis',
        }
      }],
  ],
  theme: {
    // screens: {
    //   sm: { max: '767px' },
    //   lg: { min: '768px' },
    // },
    breakpoints: {
      sm: '0px',
      lg: '768px',
    },
  },
})
