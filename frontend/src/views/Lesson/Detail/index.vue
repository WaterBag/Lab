<template>
  <t-loading
    class="lesson-container"
    :loading="loading"
  >
    <t-card>
      <div class="lesson-info-content">
        <t-image
          :src="lesson.image"
          fit="contain"
          class="logo-image"
        />
        <h3 style="margin-left: 10px;">{{ lesson.name }}</h3>
        <div>
          {{ lesson.description }}
        </div>
      </div>
    </t-card>
    <t-card
      style="margin-top: 15px;"
      title="章节列表"
      header-bordered
    >
      <t-list stripe>
        <t-list-item
          v-for="chapter in lesson.chapters"
          :key="chapter.id"
        >
          <t-list-item-meta
            :title="chapter.name"
            :description="chapter.description"
          />
          <template #action>
            <t-link
              theme="primary"
              hover="color"
              style="margin-left: 16px"
              @click="$router.push({ name: 'ChapterDetail', params: { chapter_id: chapter.id} })"
            >
              进入
            </t-link>
          </template>
        </t-list-item>
      </t-list>
    </t-card>
  </t-loading>
</template>

<script lang="ts" setup>
import { reqGetLesson } from '@/api/Lesson.ts'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const loading = ref(false)
const lesson: any = ref({})
const route = useRoute()

loading.value = true
reqGetLesson(route.params.lesson_id).then(resp => {
  lesson.value = resp
}).finally(() => {
  loading.value = false
})
</script>

<style lang="scss">
.lesson-container {
  margin: 0 auto;
  max-width: 1200px;
  padding-top: 15px;

  .logo-image {
    width: 150px;
    height: 95px;
    // border-left: 1px solid var(--td-component-border);
    // border-top: 1px solid var(--td-component-border);
    // border-bottom: 1px solid var(--td-component-border);
    background: var(--td-bg-color-container);
  }

  .lesson-info-content {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
  }
}
</style>
