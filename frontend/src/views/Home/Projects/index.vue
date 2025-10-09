<template>
  <vxe-grid v-bind="tableConfig">
    <template #loading><t-loading /></template>
    <template #toolbar_tools>
      <router-link :to="{ name: 'ProjectCreation' }"><t-button content="创建项目" /></router-link>
    </template>
    <template #action="{row}">
      <router-link :to="{ name: 'ProjectDetail', params: { project_id: row.id}}">
        <t-link
          theme="primary"
          content="详情"
        />
      </router-link>
      <t-link
        theme="success"
        style="margin-left: 16px;"
        :href="row.server_url"
        target="_blank"
        content="进入"
      />
    </template>
  </vxe-grid>
</template>

<script lang="tsx" setup>
import { reqListProjects } from '@/api/Project'
import { MessagePlugin } from 'tdesign-vue-next'
import { formatDate } from '@/common/plugins/tool'
import type { VxeGridProps } from 'vxe-table'

const tableConfig: VxeGridProps = {
  showOverflow: true,
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
      field: 'description',
      title: '描述',
    },
    {
      field: 'created_by',
      title: '创建人',
    },
    {
      field: 'team.name',
      title: '所属团队',
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
  },
  proxyConfig: {
    props: {
      result: 'results', // 配置响应结果列表字段
      total: 'count', // 配置响应结果总页数字段
    },
    ajax: {
      query: ({ page }: any) => {
        // 默认接收 Promise<{ result: [], page: { total: 100 } }>
        return reqListProjects({ page_size: page.pageSize, page: page.currentPage }).catch(e => MessagePlugin.error(e.message))
      },
    },
  },
}

</script>
