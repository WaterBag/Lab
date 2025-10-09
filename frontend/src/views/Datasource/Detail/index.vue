<template>
  <t-loading
    :loading="loading"
    class="detail-container main-box"
  >
    <PageTitle title="数据集详情">
      <template #action><t-button>编辑</t-button></template>
    </PageTitle>
    <div class="datasource-description">
      <t-image
        :src="datasource.image"
        fit="contain"
        class="logo-image"
      />
      <t-descriptions
        bordered
        :column="3"
        style="flex: 1;"
      >
        <t-descriptions-item label="数据集名称">{{ datasource.name }}</t-descriptions-item>
        <t-descriptions-item label="创建人">{{ datasource.created_by }}</t-descriptions-item>
        <t-descriptions-item label="创建时间">{{ formatDate(datasource.created_at) }}</t-descriptions-item>
        <t-descriptions-item label="描述">{{ datasource.description }}</t-descriptions-item>
      </t-descriptions>
    </div>
    <template v-if="datasource.name">
      <t-tabs
        v-model="dataTab"
        class="datasource-tabs"
      >
        <t-tab-panel
          label="概述"
          value="readme"
        >
          read me
        </t-tab-panel>
        <t-tab-panel
          label="文件"
          value="files"
        >
          <FileViewer :datasource="datasource" />
        </t-tab-panel>
      </t-tabs>
    </template>
  </t-loading>
</template>

<script lang="tsx" setup>
import { MessagePlugin } from 'tdesign-vue-next'
import { formatDate } from '@/common/plugins/tool'
import { reqGetDatasource } from '@/api/Datasource'
import FileViewer from './FileViewer/index.vue'

const route = useRoute()
const loading = ref(true)
const datasource: any = ref({})
const dataTab = ref('readme')

const getDatasourceData = () => {
  reqGetDatasource(route.params.data_id).then(resp => {
    datasource.value = resp
  }).catch(e => {
    MessagePlugin.error(e.message)
  }).finally(() => {
    loading.value = false
  })
}
getDatasourceData()

</script>

<style lang="scss" scoped>
.detail-container {
  height: 100%;
  display: flex;
  flex-direction: column;

  .datasource-description {
    background-color: var(--td-bg-color-container);
    border-bottom: none !important;
    margin-top: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .logo-image {
      width: 95px;
      height: 95px;
      border-left: 1px solid var(--border-color);
      border-top: 1px solid var(--border-color);
      border-bottom: 1px solid var(--border-color);
      background: var(--td-bg-color-container);
    }
  }

  .datasource-tabs {
    border-left: 1px solid var(--border-color);
    border-right: 1px solid var(--border-color);
    border-bottom: 1px solid var(--border-color);
    flex: 1;

    :deep(.t-tabs__content) {
      height: calc(100% - 48px);
      .t-tab-panel {
        height: 100%;
      }
    }
  }
}
</style>
