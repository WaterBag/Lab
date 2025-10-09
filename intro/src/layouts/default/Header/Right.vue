<template>
  <div class="--layout-header-right">
    <template v-if="appConfig.size === 'lg'">
      <div class="header-link">
        <t-button
          :href="LAB_ORIGIN"
          shape="round"
          content="工作台"
          target="_blank"
        >
          <template #suffix><SwapRightIcon /></template>
        </t-button>
      </div>
    </template>

    <template v-else-if="appConfig.size === 'sm'">
      <t-button
        variant="text"
        shape="square"
        class="relative z-1001"
        @click="isExpand = !isExpand"
      >
        <CloseIcon
          v-if="isExpand"
          size="18px"
        />
        <ViewListIcon
          v-else
          size="18px"
        />
      </t-button>

      <Teleport to="body">
        <div
          class="fixed z-1000 top-[--layout-header-height] right-0 left-0 h-0 bg-#fff of-auto transition-height-300 sm-header-menu-warpper"
          :style="isExpand && 'height: calc(100dvh - var(--layout-header-height))'"
        >
          <SmMenuItem
            v-for="item in smMenu"
            :key="item.to"
            :step="1"
            v-bind="item"
          />
        </div>
      </Teleport>
    </template>
  </div>
</template>

<script lang="tsx" setup>
import {
  ViewListIcon,
  CloseIcon,
  ChevronDownIcon,
  SwapRightIcon,
} from 'tdesign-icons-vue-next'
import { NuxtLink } from '#components'

const appConfig = useAppConfig()

// * ----------- 小屏逻辑 ----------------
const isExpand = ref(false)

watch(
  () => isExpand.value, (bool) => {
    if (bool) document.documentElement.style.overflow = 'hidden'
    else {
      document.documentElement.style.overflow = 'auto'
      Object.keys(expandItem).forEach(k => { expandItem[k] = false })
    }
  },
)

const route = useRoute()

watch(() => [route.fullPath, appConfig.size], () => { isExpand.value = false })

interface MenuItem { to: string, label: string, children?: MenuItem[] }

const smMenu = computed(() => [
  // {
  //   to: '1',
  //   label: t('产品'),
  //   children: ProductInfo.value.map(cate => ({ to: cate.id, label: cate.name, children: cate.products.map(pro => ({ label: pro.name, to: `/product/${pro.long_id}` })) })),
  // },
  { to: '/science', label: '科研' },
  { to: '/tutorial', label: '教程' },

] as MenuItem[])

const expandItem = reactive<Record<string, boolean>>({})

const SmMenuItem = ({ to, label, children, step }: MenuItem & { step: number }) => {
  if (children?.length) return <>
    <div class={['sm-menu-item', expandItem[to] && 'is-expand']} style={`--step: ${step}`} onClick={() => { expandItem[to] = !expandItem[to] }}>
      <div class='sm-menu-item-label'>{label}</div>
      <ChevronDownIcon class='sm-menu-item-arrow' />
    </div>
    <div class={['sm-menu-children-warpper', expandItem[to] && 'is-expand']}>
      {children.map(item => <SmMenuItem {...item} step={step + 1} />)}
    </div>
  </>
  // @ts-ignore
  return <NuxtLink class='sm-menu-item' style={`--step: ${step}`} to={to} onClick={() => { isExpand.value = false }}>
    <div class='sm-menu-item-label'>{label}</div>
  </NuxtLink>
}
</script>

<style lang="scss" scoped>
.--layout-header-right {
  position: absolute;
  right: 0;
  top: 0;
  display: flex;
  align-items: center;
  height: 100%;
  padding-right: 8px;
}
</style>

<style lang="scss">
.sm-header-menu-warpper {
  a {
    background-color: #f5f9fd;
  }
  .sm-menu-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 48px;
    border-bottom: 1px solid #e7e7e7;
    padding-right: 16px;
    padding-left: calc(var(--step) * 16px);
    transition: color 300ms;

    &.is-expand {
      color: #0052d9;

      .sm-menu-item-arrow {
        transform: rotateZ(180deg);
      }
    }

    &:focus {
      color: #0052d9;
    }

    .sm-menu-item-label {
      flex: 1;
      font-size: 14px;
      line-height: 18px;
      @include ellipsis(1);
    }

    .sm-menu-item-arrow {
      flex-shrink: 0;
      font-size: 16px;
      transition: transform 300ms;
    }
  }

  .sm-menu-children-warpper {
    height: 0;
    overflow: hidden;

    &.is-expand {
      height: auto;
    }
  }
}
</style>
