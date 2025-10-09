<template>
  <div class="lesson-market-wrapper">
    <t-loading :loading="loading">
      <t-space break-line>
        <t-card
          v-for="lesson of lessonList"
          :key="lesson.id"
          class="lesson-card"
          :title="lesson.name"
          :cover="lesson.image"
          style="width: 300px;"
          bordered
          header-bordered
          size="small"
        >
          <template #actions>
            <t-button
              variant="text"
              theme="primary"
              @click="$router.push({ name: 'LessonDetail', params: { lesson_id: lesson.id } })"
            >
              进入
            </t-button>
          </template>
          <template #footer>
            <t-row
              :align="'middle'"
              justify="center"
              style="gap: 24px"
            >
              <t-col>
                <t-button
                  variant="text"
                  shape="square"
                >
                  <thumb-up-icon />
                </t-button>
              </t-col>

              <t-col
                flex="auto"
                style="display: inline-flex; justify-content: center"
              >
                <t-button
                  variant="text"
                  shape="square"
                >
                  <chat-icon />
                </t-button>
              </t-col>

              <t-col
                flex="auto"
                style="display: inline-flex; justify-content: center"
              >
                <t-button
                  variant="text"
                  shape="square"
                >
                  <share-icon />
                </t-button>
              </t-col>
            </t-row>
          </template>
        </t-card>
      </t-space>
    </t-loading>
  </div>
</template>

<script lang="ts" setup>
import { reqListLesson } from '@/api/Lesson'
import { ref } from 'vue'

const loading = ref(false)
const lessonList: any = ref([])
loading.value = true

reqListLesson()
  .then(data => { lessonList.value = data })
  .finally(() => { loading.value = false })
</script>

<style lang="scss">
.lesson-market-wrapper {
  margin: 0 auto;
  max-width: 1200px;
  margin-top: 15px;

  .lesson-card {
    .t-card__cover {
      height: 166px;
    }
  }
}
</style>
