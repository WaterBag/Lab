<template>
  <div
    class="--jp-nav-head-menu"
    style="position: relative;"
  >
    <div
      ref="renderRef"
      style="height: 100%; width: 100%; display: flex; align-items: center; overflow: hidden;"
    >
      <NavMenuItems
        :menu-list="menuList"
        is-root
      />

      <t-popup
        v-if="collapseList.length"
        overlay-inner-class-name="--jp-head-submenu-content"
        overlay-class-name="--jp-head-submenu-overlay"
      >
        <template #content><NavMenuItems :menu-list="collapseList" /></template>

        <div
          class="--jp-head-menu-link"
          data-collapse
        >
          <div class="--jp-head-menu-link-text">更多</div>
          <ChevronDownIcon class="--jp-heade-menu-link-icon" />
        </div>
      </t-popup>
    </div>

    <div
      ref="originRef"
      style="height: 100%; display: flex; align-items: center; position: absolute; top: -1000px; visibility: hidden; width: max-content;"
    >
      <NavMenuItems :menu-list="menuList" />
    </div>
  </div>
</template>

<script lang="tsx" setup>
import { ChevronDownIcon } from 'tdesign-icons-vue-next'
import NavMenuItems from './NavMenuItems.vue'
import { useSettingStore } from '@/stores/Setting'
import { throttle } from 'lodash-es'
import type { UnwrapRef } from 'vue'

const SettingStore = useSettingStore()

/** 如果需要除了自动计算navBarMenu菜单项之外的项, 则修改这个渲染列表的计算 */
const menuList = computed(() => SettingStore.navBarMenu)

const collapseList = shallowRef<UnwrapRef<typeof menuList>>([])

const renderRef = shallowRef<HTMLDivElement>()
const originRef = shallowRef<HTMLDivElement>()

const handleCollapses = throttle(
  () => {
    if (!menuList.value.length) {
      collapseList.value = []
      return
    }
    const { clientWidth, children } = renderRef.value!
    const nodes = Array.from(children) as HTMLElement[]
    if (nodes[nodes.length - 1].dataset.collapse) nodes.pop()

    const contentWidth = originRef.value!.clientWidth

    if (contentWidth > clientWidth) {
      let countWidth = 0
      let showIdx = 0
      for (let i = 0; i < nodes.length; i++) {
        countWidth += originRef.value!.children[i].clientWidth
        if (countWidth > clientWidth) {
          showIdx = i - 2
          break
        }
      }

      collapseList.value = menuList.value.filter((_, i) => {
        if (i <= showIdx) {
          nodes[i].style.display = ''
          return false
        } else {
          nodes[i].style.display = 'none'
          return true
        }
      })
    } else {
      collapseList.value = []
      nodes.forEach(el => { el.style.display = '' })
    }
  },
  300,
)

const ob = new ResizeObserver(handleCollapses)

onMounted(() => ob.observe(renderRef.value!))
onBeforeUnmount(() => {
  ob.unobserve(renderRef.value!)
  ob.disconnect()
})

</script>
