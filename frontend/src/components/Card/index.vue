<template>
  <div :class="['--card-container', 't-card', border && 't-card--bordered']">
    <slot />
  </div>
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{ border?: boolean }>(),
  { border: true },
)
</script>

<style lang="scss">
.--card-container {
  padding: 16px;
}
</style>
