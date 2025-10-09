<template>
  <div class="--page-title">
    <h2 class="--page-title-text">{{ title }}</h2>
    <div
      v-if="slots.action"
      class="--page-title-actions"
    >
      <slot name="action" />
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{ title: string }>()
const slots = defineSlots<{
  action?(): any
}>()
</script>

<style lang="scss" scoped>
.--page-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  column-gap: 16px;
  flex-wrap: nowrap;

  .--page-title-text {
    font-size: 21px;
    font-weight: 600;
  }

  .--page-title-actions {
    line-height: 0;
  }
}
</style>
