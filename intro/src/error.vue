<template>
  <!-- eslint-disable vue/no-v-html -->
  <NuxtLayout>
    <div class="min-h-[--layout-content-min-height] flex flex-col items-center justify-center py-10vh font-500">
      <div class="text-144px text-#2c2c2c font-bold f-TencentW7">{{ err.statusCode }}</div>
      <div
        v-if="err.statusMessage || err.message"
        class="text-18px mt-24px max-w-70%"
      >
        <span v-if="err.statusCode === 404 && err.statusMessage === 'Not Found'">Sorry, this page doesn’t exist or has been removed. Please, return back to homepage.</span>
        <span v-else>{{ err.statusMessage || err.message }}</span>
      </div>

      <div
        v-if="isDev"
        class="max-w-90% overflow-auto mt-36px"
        v-html="err.stack"
      />

      <NuxtLink
        v-if="[404, 403].includes(err.statusCode)"
        :to="err.data?.__back_route__ || '/'"
        class="mt-36px"
      >
        <t-button
          size="large"
          variant="outline"
          shape="round"
          theme="primary"
        >
          <template #icon><ArrowLeftIcon size="18px" /></template>
          <span class="font-500">Go Back</span>
        </t-button>
      </NuxtLink>
    </div>
  </NuxtLayout>
</template>

<script lang="ts" setup>
import type { NuxtError } from '#app'
import { ArrowLeftIcon } from 'tdesign-icons-vue-next'
import { cloneFnJSON } from '@vueuse/core'

const props = defineProps<{ error: NuxtError }>()
const isDev = import.meta.dev

const err = cloneFnJSON(props.error) as NuxtError<Record<string, any>>

if (err.data) {
  if (typeof err.data === 'string') {
    try {
      err.data = JSON.parse(err.data)
    } catch {
      err.data = {}
    }
  }
}
</script>
