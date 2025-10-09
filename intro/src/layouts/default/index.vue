<template>
  <div>
    <LayoutHeader />
    <main class="--layout-main min-h-[--layout-content-min-height]"><slot /></main>
    <LayoutFooter />

    <ClientOnly>
      <t-back-top
        v-if="appConfig.size === 'lg'"
        :visible-height="200"
        :offset="['20px', '20px']"
        shape="circle"
        size="small"
      />
    </ClientOnly>
  </div>
</template>

<script lang="ts" setup>
import LayoutHeader from './Header/index.vue'
import LayoutFooter from './Footer.vue'

import { throttle } from 'lodash-es'

useHeadSafe({
  titleTemplate: title => title ? `${title} | AI科研平台` : 'AI科研平台',
})

useServerSeoMeta({
  description: 'AI科研平台', // SEO简短简短网站描述，应该在每个不同的页面大模块中进行更改对当页的描述
  // ogDescription: 'Tencent OIT CEP Portal', // 分享链接卡片描述, 没有的话会用description
  // ogTitle: 'Tencent OIT CEP Portal', // 分享链接卡片描述, 没有的话会用html当前的title
  ogImage: '/logos/logo.png', // 分享链接卡片图标, 注意要公网可以访问的图片url, 否则社交媒体无法访问

  // twitter和google等分享卡片目前无需支持
})

const appConfig = useAppConfig()

const setSize = throttle(() => {
  if (window.innerWidth < 768) appConfig.size = 'sm'
  else appConfig.size = 'lg'
}, 150)

onMounted(() => {
  setSize()
  window.addEventListener('resize', setSize)
})

onBeforeUnmount(() => window.removeEventListener('reset', setSize))
</script>
