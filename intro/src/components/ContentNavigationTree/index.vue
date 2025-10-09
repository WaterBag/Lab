<template>
  <nav class="content-navigation-tree">
    <template
      v-for="item in navigation"
      :key="item.path"
    >
      <NuxtLink
        v-if="item.page === undefined"
        :to="item.path"
        class="nav-link"
        :title="item.title"
      >
        <Icon
          v-if="item.icon"
          :name="(item.icon as string)"
          size="20px"
          class="nav-link-icon"
        />
        <span class="nav-link-text">{{ item.title }}</span>
      </NuxtLink>

      <div
        v-else-if="item.page === false && item.children?.length"
        :class="['nav-cate', opened[item.path] && 'nav-cate-opened']"
      >
        <div
          class="nav-cate-item"
          :title="item.title"
          @click="toggleCategory(item.path)"
        >
          <Icon
            v-if="item.icon"
            :name="(item.icon as string)"
            size="20px"
            class="nav-cate-item-icon"
          />
          <span class="nav-cate-item-text">{{ item.title }}</span>
          <Icon
            name="material-symbols:chevron-right-rounded"
            size="20px"
            class="nav-cate-item-toggle"
          />
        </div>

        <!-- 递归渲染子项 -->
        <div class="nav-cate-children">
          <ContentNavigationTree :navigation="item.children" />
        </div>
      </div>
    </template>
  </nav>
</template>

<script lang="ts" setup>
import type { ContentNavigationItem } from '@nuxt/content'

const props = defineProps<{
  navigation: ContentNavigationItem[]
}>()

const opened = reactive<Record<string, boolean>>({})
// 初始化时递归设置所有分类为展开状态
const initOpened = (navItems: ContentNavigationItem[]) => {
  for (const item of navItems) {
    if (!item.page && item.children?.length) {
      opened[item.path] = true
      initOpened(item.children)
    }
  }
}
initOpened(props.navigation)

// 切换分类的展开/折叠状态
const toggleCategory = (path: string) => {
  opened[path] = !opened[path]
}

</script>

<style lang="scss" scoped>
.content-navigation-tree {

  .nav-link-icon,
  .nav-cate-item-icon,
  .nav-cate-item-toggle {
    flex-shrink: 0;
    font-size: 20px;
  }

  .nav-link,
  .nav-cate-item {
    display: flex;
    align-items: center;
    column-gap: 8px;
    font-size: 14px;
  }

  .nav-link {
    transition: color 0.2s;
    color: #00000099;
    margin-top: 8px;

    &:first-of-type {
      margin-top: 0;
    }

    &:hover {
      color: rgba(0,0,0,0.9);
    }

    &.router-link-active {
      color: #0052d9;
    }

    .nav-link-text {
      flex: 1;
      @include ellipsis(1);
    }
  }

  .nav-cate-item {
    color: rgba(0,0,0,0.9);
    cursor: pointer;
    font-weight: 600;

    .nav-cate-item-text {
      flex: 1;
      @include ellipsis(1);
    }

    &:hover .nav-cate-item-toggle {
      opacity: 1;
    }

    .nav-cate-item-toggle {
      opacity: 0.6;
      transition-property: transform opcacity;
      transition-duration: 0.2s;
    }
  }

  .nav-cate {
    &.nav-cate-opened {

      .nav-cate-item-toggle {
        transform: rotate(90deg);
        opacity: 1;
      }

      .nav-cate-children{
        height: auto;
      }
    }

    .nav-cate-children {
      border-left: 1px solid #e2e8f0;
      margin-left: 10px;
      margin-top: 8px;
      margin-bottom: 8px;
      padding-left: 18px;
      height: 0;
      overflow: hidden;
      transition: height 0.2s;
      interpolate-size: allow-keywords;
    }
  }
}
</style>
