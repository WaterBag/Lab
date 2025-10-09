<template>
  <component
    :is="tag ? tag : 'div'"
    ref="textRef"
  >
    {{ text }}
  </component>
</template>

<script lang="ts" setup>
import { throttle } from 'lodash-es'

const { locale } = useI18n()

const props = defineProps<{
  /** 渲染的标签，默认为div。注意，不能为行内元素 */
  tag?: string
  /** 传入的text中，使用\n表示期望的换行位置。如果当前的文本宽度无需换行，则会replace掉\n */
  text: string
 }>()

const textRef = shallowRef<HTMLElement>()

const checkBreakLine = throttle(() => {
  const text = props.text
  textRef.value!.style.whiteSpace = 'normal'
  textRef.value!.innerText = text!.replaceAll('\n', '')
  const { height, paddingTop, paddingBottom, borderTopWidth, borderBottomWidth, lineHeight } = getComputedStyle(textRef.value!)
  if ((parseFloat(height) - parseFloat(paddingTop) - parseFloat(paddingBottom) - parseFloat(borderTopWidth) - parseFloat(borderBottomWidth)) > parseFloat(lineHeight)) {
    textRef.value!.style.whiteSpace = 'pre-line'
    textRef.value!.innerText = text!
  }
}, 100)

if (locale.value === 'zh') {
  onMounted(() => {
    checkBreakLine()
    window.addEventListener('resize', checkBreakLine)
  })

  onBeforeUnmount(() => window.removeEventListener('resize', checkBreakLine))
}
</script>
