<template>
  <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding-bottom: 15vh; min-height: 100%;">
    <img
      v-if="imgs[title]"
      :src="imgs[title]"
      :alt="title"
      style="height: 280px;"
    />
    <h2 style="font-size: 60px;">{{ title }}</h2>
    <p style="margin-top: 24px; font-size: 20px;">{{ subTitle }}</p>
    <router-link
      replace
      to="/"
      style="margin-top: 36px;"
    >
      <t-button
        content="返回首页"
        theme="primary"
        variant="outline"
        shape="round"
        size="large"
      >
        <template #icon><t-icon name="arrow-left" /></template>
      </t-button>
    </router-link>
  </div>
</template>

<script lang="ts" setup>
import img404 from './imgs/404.png'
import img403 from './imgs/403.png'

defineOptions({ name: 'ErrorPage' })

defineProps<{
  title: string
  subTitle?: string
}>()

const imgs: Record<string, string> = { 404: img404, 403: img403 }
</script>
