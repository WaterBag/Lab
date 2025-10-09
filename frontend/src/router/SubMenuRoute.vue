<template>
  <router-view v-slot="{ Component }">
    <transition
      mode="out-in"
      enter-active-class="--jp-layout-animate --jp-layout-animate-in"
      leave-active-class="--jp-layout-animate --jp-layout-animate-out"
      appear
    >
      <!-- <keep-alive :include="[]"> -->
      <component :is="Component" />
      <!-- </keep-alive> -->
    </transition>
  </router-view>
</template>

<script lang="ts" setup>
defineOptions({ name: 'SubMenuRoute' })
</script>
