<template>
  <header class="--layout-header --layout-default-header">
    <nav class="flex items-center">
      <NuxtLink
        to="/"
        class="header-logo"
      >
        <img
          src="/logos/logo.png"
          alt="LOGO"
          class="h-50%"
        />
      </NuxtLink>

      <template v-if="appConfig.size === 'lg'">
        <NuxtLink
          to="/science"
          class="header-link"
        >
          科研
        </NuxtLink>

        <NuxtLink
          :to="tutorialIndexDoc?.path"
          class="header-link"
        >
          教程
        </NuxtLink>
      </template>
    </nav>

    <Right />
  </header>
</template>

<script lang="ts" setup>
import Right from './Right.vue'
const appConfig = useAppConfig()

const { data: tutorialIndexDoc } = await useAsyncData('tutorial-index-doc', () => queryCollection('tutorial').where('extension', '=', 'md').first())

</script>

<style lang="scss" scoped>
$innerHeight: calc(var(--layout-header-height) - 1px); // 有1px被下边框占了所以内容区最大高度要-1
.--layout-default-header {
  height: var(--layout-header-height);
  position: sticky;
  top: 0;
  width: 100%;
  padding: 0 20px;
  background-color: #fff;
  border-bottom: 1px solid #e5e5e5;
  z-index: 100;
  font-size: 14px;

  .header-logo {
    flex-shrink: 0;
    cursor: pointer;
    height: $innerHeight;
    display: flex;
    align-items: center;
    margin-right: 20px;
  }

  .router-link-active.header-link {
    color: var(--td-brand-color-7);
  }

  :deep(.header-link) {
    flex-shrink: 0;
    padding: 0 12px;
    line-height: $innerHeight;
    cursor: pointer;
    transition: color 300ms;

    &:hover {
      color: var(--td-brand-color-6);
    }

    &:active {
      color: var(--td-brand-color-5);
    }
  }
}
</style>
