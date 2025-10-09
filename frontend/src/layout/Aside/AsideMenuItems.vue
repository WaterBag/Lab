<template>
  <template
    v-for="item in menuList"
    :key="item.name"
  >
    <t-submenu
      v-if="item.children && (item.children.length > 1 || !item.meta!.penetrate)"
      v-bind="SubmenuProps(item)"
    >
      <MenuItem :menu-list="item.children" />
    </t-submenu>

    <template v-else-if="item.children && item.children.length === 1 && item.meta!.penetrate">
      <t-submenu
        v-if="item.children[0].children && item.children[0].children.length"
        v-bind="SubmenuProps(item.children[0])"
      >
        <MenuItem :menu-list="item.children[0].children" />
      </t-submenu>

      <t-menu-item
        v-else
        v-bind="MenuItemProps(item.children[0])"
      />
    </template>

    <t-menu-item
      v-else
      v-bind="MenuItemProps(item)"
    />
  </template>
</template>

<script lang="tsx" setup>
import MenuIcon from '../components/MenuIcon.vue'
import type { RouteRecordRaw } from 'vue-router'
import { Submenu as TSubmenu, MenuItem as TMenuItem } from 'tdesign-vue-next'
defineOptions({ name: 'MenuItem' }) // 这个不能改
defineProps<{ menuList: RouteRecordRaw[] }>()

const SubmenuProps = (route: RouteRecordRaw) => ({
  popupProps: { overlayInnerClassName: '--jp-layout-menu-submenu-popup-inner' },
  value: route.name as string,
  title: route.meta!.title,
  icon: route.meta!.icon ? () => <MenuIcon icon={route.meta!.icon!} iconProps={route.meta!.iconProps} /> : undefined,
})

const MenuItemProps = (route: RouteRecordRaw) => ({
  value: route.name as string,
  title: route.meta!.title,
  routerLink: true,
  to: (route.meta!.dynamicRoute?.() || route.redirect || route as any),
  icon: route.meta!.icon ? () => <MenuIcon icon={route.meta!.icon!} iconProps={route.meta!.iconProps} /> : undefined,
  default: route.meta!.title,
})
</script>
