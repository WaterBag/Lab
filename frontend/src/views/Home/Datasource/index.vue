<template>
  <vxe-grid
    ref="dataGrid"
    v-bind="tableConfig"
  >
    <template #loading><t-loading /></template>
    <template #toobar_buttons>
      <t-input
        v-model="search"
        style="width: 300px;"
        placeholder="搜索数据集"
        clearable
        @input="inputSearch"
      >
        <template #suffixIcon><search-icon /></template>
      </t-input>
    </template>

    <template #toolbar_tools>
      <router-link :to="{ name: 'DataCreation' }"><t-button content="创建数据集" /></router-link>
    </template>

    <template #action="{row}">
      <router-link :to="{ name: 'DataDetail', params: { data_id: row.id} }">
        <t-link
          theme="primary"
          content="详情"
        />
      </router-link>
    </template>
  </vxe-grid>
</template>

<script lang="ts" setup>

import { reqListMyDatasource } from '@/api/Datasource'
import { formatDate } from '@/common/plugins/tool'
import { MessagePlugin } from 'tdesign-vue-next'
import { debounce } from 'lodash-es'
import type { VxeGridInstance, VxeGridProps } from 'vxe-table'

const search = ref('')
const tableConfig: VxeGridProps = {
  showOverflow: true,
  height: 'auto',
  columns: [
    {
      field: 'name',
      title: '名称',
    },
    {
      field: 'description',
      title: '描述',
    },
    {
      field: 'created_at',
      title: '创建时间',
      formatter: ({ cellValue }) => formatDate(cellValue),
    },
    {
      field: 'belong',
      title: '类型',
      formatter: ({ cellValue }) => {
        switch (cellValue) {
        case 'private':
          return '私有'
        case 'team':
          return '团队公开'
        case 'public':
          return '全局公开'
        default:
          return ''
        }
      },
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
    slots: {
      tools: 'toolbar_tools',
      buttons: 'toobar_buttons',
    },
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
        return reqListMyDatasource({ page_size: page.pageSize, page: page.currentPage }).catch(e => MessagePlugin.error(e.message))
      },
    },
  },
}

const dataGrid = useTemplateRef<VxeGridInstance>('dataGrid')

const inputSearch = debounce(() => dataGrid.value!.commitProxy('query'), 500)
</script>
