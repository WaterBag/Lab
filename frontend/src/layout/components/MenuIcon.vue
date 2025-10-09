<template>
  <!-- 渲染在headmenu或menu时,为了与t-icon的样式保持一致会有8px的右外边距, 当collapsed无边距, 在popup出现的时候保持8px的右边距 -->
  <!-- 默认宽高为20px, 在popup出现是默认宽高为1em-->
  <Icon
    v-if="icon!.includes(':')"
    :icon="icon"
    v-bind="iconProps"
    class="t-icon"
  />
  <TIcon
    v-else
    :name="icon"
    v-bind="iconProps"
  />
</template>

<script lang="ts" setup>
// eslint-disable-next-line vue/component-definition-name-casing
defineOptions({ name: '__PortalLayoutMenuIcon__' })
defineProps<{
  icon: string;
  iconProps?: { [key: string]: any };
}>()
</script>
