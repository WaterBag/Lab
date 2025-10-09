<template>
  <div class="cpw-toolbar">
    <!-- eslint-disable vue/no-v-html -->
    <Btn
      v-for="btn, i in left"
      :key="i"
      v-bind="btn"
    />

    <Btn
      title="切换内核"
      :content="kernelStatusLabel[kernelStatus]"
      shape="round"
      style="margin-left: auto;"
      icon="kernel"
      @click="dispatchAction(widgetId, { type: 'kernelChange', data: null })"
    />

    <Btn
      v-for="btn, i in right"
      :key="i"
      v-bind="btn"
    />
  </div>
</template>

<script lang="tsx" setup>
import { btnIcons, dispatchAction, kernelStatusLabel, type ToolbarBtn } from '../utils'
import type { ISessionContext } from '@jupyterlab/apputils'
import { Button as TButton, Tooltip as TTooltip } from 'tdesign-vue-next'
import { inject } from 'vue'

const widgetId = inject<string>('widgetId')!

defineProps<{
  left: ToolbarBtn[]
  right: ToolbarBtn[]
  kernelStatus: ISessionContext['kernelDisplayStatus']
}>()

const Btn = ({ title, onClick, icon, disabled, ...res }: ToolbarBtn) => {
  return (
    <TTooltip content={title} placement="bottom-left" showArrow={false}>
      <TButton
        disabled={disabled}
        size="small"
        variant="text"
        shape="square"
        onClick={onClick}
        icon={() => <span class="t-icon" style="font-size: 16px" v-html={btnIcons[icon] || ''} />}
        {...res}
      />
    </TTooltip>
  )
}
</script>
