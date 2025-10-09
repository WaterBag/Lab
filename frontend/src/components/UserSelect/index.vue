<template>
  <div class="user-select-wrapper">
    <t-select
      v-model="model"
      :options="userOptions"
      filterable
      multiple
      :loading="loading"
      clearable
      v-bind="$attrs"
    >
      <template #prefixIcon><User1Icon /></template>
    </t-select>

    <t-button
      shape="circle"
      variant="text"
      theme="primary"
      @click="refreshUsers"
    >
      <template #icon><RefreshIcon /></template>
    </t-button>
  </div>
</template>

<script lang="ts" setup>
import { reqListUsers } from '@/api/Users'
import { useCommonStore } from '@/stores/Common'
import type { PropType } from 'vue'
import { User1Icon, RefreshIcon } from 'tdesign-icons-vue-next'

const commonStore = useCommonStore()

const userOptions = computed(() => commonStore.users.map((user: any) => ({ label: user.name, value: user.username })))

const loading = ref(false)

const model = defineModel({ type: [Array<string>, String] as PropType<Array<string> | string> })

const refreshUsers = () => {
  loading.value = true
  reqListUsers()
    .then(resp => { commonStore.users = resp })
    .finally(() => { loading.value = false })
}

if (commonStore.users.length <= 0) refreshUsers()

</script>

<style lang="scss" scoped>
.user-select-wrapper {
  display: flex;
  align-items: center;
  width: 100%;
  column-gap: 8px;
}
</style>
