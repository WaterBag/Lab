<template>
  <template
    v-for="item in menuList"
    :key="item.name"
  >
    <Submenu
      v-if="item.children && (item.children.length > 1 || !item.meta!.penetrate)"
      :route="item"
      :root="isRoot"
    >
      <NavMenuItems :menu-list="item.children" />
    </Submenu>

    <template v-else-if="item.children && item.children.length === 1 && item.meta!.penetrate">
      <Submenu
        v-if="item.children[0].children && item.children[0].children"
        :route="item.children[0]"
        :root="isRoot"
      >
        <NavMenuItems :menu-list="item.children[0].children" />
      </Submenu>

      <MenuItem
        v-else
        :route="item.children[0]"
      />
    </template>

    <MenuItem
      v-else
      :route="item"
    />
  </template>
</template>

<script lang="tsx" setup>
import { RouterLink, useRoute, type RouteRecordRaw } from 'vue-router'
import MenuIcon from '../components/MenuIcon.vue'
import { Popup as TPopup } from 'tdesign-vue-next'
import { ChevronDownIcon, ChevronRightIcon } from 'tdesign-icons-vue-next'
defineOptions({ name: 'NavMenuItems' })
defineProps<{ isRoot?: boolean, menuList: RouteRecordRaw[] }>()

const _route = useRoute()

const activeRouteNames = computed(() => _route.matched.map(r => r.name))

const closeAllSubMenu = () => {
  document.body.querySelectorAll('.--jp-head-submenu-overlay').forEach((item) => {
    (item as HTMLDivElement).style.display = 'none'
  })
}

const Submenu = ({ route, root }: { route: RouteRecordRaw, root?: boolean }, { slots }: any) => {
  // popperOptions={{ modifiers: [{ name: 'offset', options: { offset: [0, -10] } }] }}
  return <TPopup
    placement={root ? 'bottom-left' : 'right-top'}
    overlayInnerClassName='--jp-head-submenu-content'
    overlayClassName='--jp-head-submenu-overlay'
    delay={100}
    popperOptions={root ? { modifiers: [{ name: 'offset', options: { offset: [12] } }] } : {}}
  >
    {{
      default: () => <div class={['--jp-head-menu-link', activeRouteNames.value.includes(route.name) && 'active-link']}>
        {route.meta!.icon && <MenuIcon icon={route.meta!.icon} iconProps={route.meta!.iconProps} class='--jp-heade-menu-link-icon' />}
        <div class='--jp-head-menu-link-text'>{route.meta!.title}</div>
        {root ? <ChevronDownIcon class='--jp-heade-menu-link-arrow' /> : <ChevronRightIcon class='--jp-heade-menu-link-arrow' />}
      </div>,
      content: slots.default,
    }}
  </TPopup>
}

const MenuItem = ({ route }: { route: RouteRecordRaw }) => {
  return <RouterLink
    to={route.meta!.dynamicRoute?.() || route.redirect || route as any}
    class={['--jp-head-menu-link', activeRouteNames.value.includes(route.name) && 'active-link']}
    // @ts-ignore
    onClick={closeAllSubMenu}
  >
    {route.meta!.icon && <MenuIcon icon={route.meta!.icon} iconProps={route.meta!.iconProps} class='--jp-heade-menu-link-icon' />}
    <div class='--jp-head-menu-link-text'>{route.meta!.title}</div>
  </RouterLink>
}
</script>
