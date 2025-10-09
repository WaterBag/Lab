<template>
  <vxe-grid v-bind="tableConfig">
    <template #loading><t-loading /></template>
    <template #toolbar_tools>
      <router-link
        v-if="UserStore.is_superuser"
        :to="{ name: 'TeamCreation' }"
      >
        <t-button content="创建团队" />
      </router-link>
      <!-- <t-button
        style="margin-right: 10px;"
        @click="$router.push({ name: 'TeamApply'})"
      >
        加入团队
      </t-button> -->
    </template>
    <template #action="{ row }">
      <router-link :to="{ name: 'TeamDetail', params: { team_id: row.id } }">
        <t-link
          theme="primary"
          content="详情"
        />
      </router-link>
    </template>
  </vxe-grid>
</template>

<script lang="ts" setup>
import { reqListTeams } from '@/api/Team'
import { MessagePlugin } from 'tdesign-vue-next'
import { formatDate } from '@/common/plugins/tool'
import { useUserStore } from '@/stores/User'
import type { VxeGridProps } from 'vxe-table'

const UserStore = useUserStore()

const tableConfig: VxeGridProps = {
  height: 'auto',
  columns: [
    {
      field: 'name',
      title: '名称',
    },
    {
      field: 'created_at',
      title: '创建时间',
      formatter: ({ cellValue }) => formatDate(cellValue),
    },
    {
      field: 'created_by',
      title: '创建人',
    },
    {
      title: '操作',
      slots: { default: 'action' },
    },
  ],
  toolbarConfig: {
    slots: { tools: 'toolbar_tools' },
  },
  pagerConfig: {
    enabled: true,
    size: 'small',
    pageSize: 20,
  },
  proxyConfig: {
    props: {
      result: 'results', // 配置响应结果列表字段
      total: 'count', // 配置响应结果总页数字段
    },
    ajax: {
      query: ({ page }: any) => {
        // 默认接收 Promise<{ result: [], page: { total: 100 } }>
        return reqListTeams({ page_size: page.pageSize, page: page.currentPage }).catch(e => MessagePlugin.error(e.message))
      },
    },
  },
}
</script>
