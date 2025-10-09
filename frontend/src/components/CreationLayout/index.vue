<template>
  <div class="creation-layout main-box">
    <PageTitle :title="title" />
    <div class="creation-content">
      <t-card :style="{ gridColumn: slots.desc ? '' : '1 / 3' }"><slot /></t-card>
      <t-card
        v-if="slots.desc"
        title="使用说明"
        header-bordered
      >
        <slot name="desc" />
      </t-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{ title: string }>()
const slots = defineSlots<{
  default?(): any
  desc?(): any
}>()
</script>

<style lang="scss" scoped>
.creation-content {
  margin-top: 12px;
  display: grid;
  grid-template-columns: 3fr 1fr;
  column-gap: 12px;
  align-items: start;
}
</style>
