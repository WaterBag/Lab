<template>
  <t-layout class="chapter-layout">
    <t-aside>
      <t-menu
        v-if="lesson.id && chapter.id"
        theme="light"
        :default-value="chapter.id"
      >
        <t-menu-item
          v-for="chapterItem in lesson.chapters"
          :key="chapterItem.id"
          :value="chapterItem.id"
          :to="{ name: 'ChapterDetail', params: { chapter_id: chapterItem.id } }"
        >
          {{ chapterItem.name }}
        </t-menu-item>
      </t-menu>
    </t-aside>
    <t-content>
      <t-loading
        :loading="loading"
        class="chapter-container"
      >
        <MarkdownViewer
          v-if="chapter.content"
          :content="chapter.content"
        />
      </t-loading>
    </t-content>
  </t-layout>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'
import MarkdownViewer from '@/components/MarkdownViewer/index.vue'
import { reqGetChapter, reqGetLesson } from '@/api/Lesson.ts'
import { watch } from 'vue'

const route = useRoute()
const loading = ref(false)
const chapter: any = ref({})
const lesson: any = ref({})

const reqData = () => {
  loading.value = true
  reqGetChapter(route.params.chapter_id).then(resp => {
    chapter.value = resp
    reqGetLesson(resp.lesson_id).then(data => {
      lesson.value = data
    })
  }).finally(() => {
    loading.value = false
  })
}

reqData()

watch(route, () => {
  reqData()
})

</script>

<style lang="scss">
.chapter-layout {
  height: var(--jp-content-height);
}
.chapter-container {
  margin: 0 auto;
  max-width: 1200px;
  padding-top: 15px;
}
</style>
