<template>
  <div v-html="markdownDom" />
</template>

<script setup lang="ts">
import { watchEffect, ref } from 'vue'
import MarkdownIt from 'markdown-it'
// import markdownItHighlightjs from 'markdown-it-highlightjs'
// import markdownItCodeCopy from 'markdown-it-code-copy'

const props = defineProps<{
    content: string
}>()

// 用于存放最终解析出来的dom
const markdownDom = ref<any>('')

// 初始化 markdown-it 实例
const md = new MarkdownIt({
  html: true,
  breaks: true,
})
// 配置代码高亮插件
// md.use(markdownItHighlightjs)
// // 配置代码块复制插件
// md.use(markdownItCodeCopy)

// 解析markdown
const handleMarkdown = () => {
  // 判断markdown为空不解析
  if (!props.content) {
    return
  }

  // 解析markdown获取HTML
  const html = md.render(props.content)
  markdownDom.value = html
}

watchEffect(() => {
  handleMarkdown()
})

</script>

<style>

</style>
