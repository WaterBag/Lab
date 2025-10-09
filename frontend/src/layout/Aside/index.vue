<template>
  <div :class="['--jp-layout-aside', collapsed && 'collapsed', hideAside && 'hide']">
    <t-menu
      v-model:expanded="asideExpanded"
      :value="active"
      :collapsed="collapsed"
    >
      <AsideMenuItems :menu-list="asideMenuList" />
      <template #operations>
        <t-button
          variant="text"
          shape="square"
          @click="SettingStore.toggleCollapse"
        >
          <t-icon name="view-list" />
        </t-button>
      </template>
    </t-menu>
  </div>
</template>

<script lang="ts" setup>
import AsideMenuItems from './AsideMenuItems.vue'
import { useSettingStore } from '@/stores/Setting'
import { LayoutCfg } from '@/setting'
const route = useRoute()

const SettingStore = useSettingStore()

const collapsed = computed(() => SettingStore.collapsed)

const asideMenuList = computed(() => SettingStore.asideMenu(route))

const active = computed(() => route.matched.at(-1)?.name as string || '')
const asideExpanded = ref<string[]>([])

watch(
  () => route.matched,
  () => { asideExpanded.value = route.matched.map(({ name }) => name as string) },
  { immediate: true, deep: true },
)

const hideAside = computed(() => {
  if (LayoutCfg.layout === 'aside') return !!route.meta.hideAside // 子级路由会继承上级的meta
  return LayoutCfg.layout === 'top'
})

</script>

<style lang="scss">
.--jp-layout-aside {
  height: 100%;
  flex-shrink: 0;
  width: var(--jp-aside-width);
  overflow-x: hidden;
  border-right: 1px solid var(--border-color);
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);

  &.collapsed {
    --jp-aside-width: 65px;
  }

  &.hide {
    --jp-aside-width: 0;
    border-right: 0;
  }

  .t-default-menu:not(.t-is-collapsed) {
    width: calc(var(--jp-aside-width) - 1px) !important;
  }

  .t-default-menu {
    .t-menu {
      padding: 8px;

      .t-menu__item {
        .t-menu__item-link {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
    .t-menu__operations {
      border-color: var(--border-color);
    }
  }
}
.--jp-layout-menu-submenu-popup-inner .t-menu__item {
  height: 32px;
  line-height: 32px;
  color: var(--td-text-color-secondary);

  &.t-is-active {
    color: var(--td-brand-color);
    background-color: var(--td-brand-color-light);
  }
}
</style>
