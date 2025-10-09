<template>
  <div class="main-box data-market">
    <t-input
      v-model="searhForm.search"
      placeholder="搜索数据集"
      clearable
      style="width: 50%;"
    >
      <template #suffixIcon><search-icon /></template>
    </t-input>
    <div class="market-container">
      <t-list
        :async-loading="asyncLoading"
        split
        stripe
        class="market-list"
        @load-more="loadDatasource"
      >
        <t-list-item
          v-for="datasource in displayDatasource"
          :key="datasource.id"
          style="cursor: pointer"
          @click="clickDatasource(datasource)"
        >
          <t-list-item-meta
            :title="datasource.name"
            :description="datasource.description"
          >
            <template #image>
              <t-image
                :src="datasource.image"
                :style="{ height: '100%', width: '100%' }"
              >
                <template #error><ImageErrorIcon /></template>
                <template #loading><ImageErrorIcon /></template>
              </t-image>
            </template>
          </t-list-item-meta>
          <template #action>
            <t-button
              variant="outline"
              shape="round"
              :loading="datasource.loadingFavorite"
              :theme="datasource.favorite ? 'warning' : 'default'"
              @click.stop="clickChangeFavorite(datasource)"
            >
              <template #icon>
                <StarFilledIcon v-if="datasource.favorite" />
                <StarIcon v-else />
              </template>
              <template v-if="datasource.favorite">已收藏</template>
              <template v-else>收藏</template>
            </t-button>
          </template>
        </t-list-item>
      </t-list>
    </div>
  </div>
</template>

<script lang="tsx" setup>
import { ImageErrorIcon } from 'tdesign-icons-vue-next'
import { reqListDatasource, reqAddFavoriteDatasource, reqRemoveFavoriteDatasource, reqFavoriteDatasource } from '@/api/Datasource'
import { useRoute, useRouter } from 'vue-router'
import { remove } from 'lodash-es'

const datasourceList: any = ref([])
const asyncLoadingRadio = ref('load-more')
const route = useRoute()

const page = ref(0)
const pageSize = 5

watch(() => route.name, () => {
  datasourceList.value = []
  page.value = 0
  loadDatasource()
})

const displayDatasource = computed(() => {
  const searchKeys = ['name', 'description', 'created_by']
  return datasourceList.value.filter((item: any) => {
    return !!searchKeys.find(key => item[key].includes(searhForm.search))
  })
})

const loadDatasource = () => {
  asyncLoadingRadio.value = 'loading'
  page.value += 1
  let req
  if (route.name === 'DataFavorite') {
    req = reqFavoriteDatasource({ page: page.value, page_size: pageSize, belong: 'public' })
  } else {
    req = reqListDatasource({ page: page.value, page_size: pageSize, belong: 'public' })
  }
  req.then((data: any) => {
    datasourceList.value = datasourceList.value.concat(data.results)
    if ((page.value + 1) * pageSize > data.count + pageSize) {
      asyncLoadingRadio.value = 'loading-custom'
    } else {
      asyncLoadingRadio.value = 'load-more'
    }
  })
}
loadDatasource()

const asyncLoading = computed(() => {
  if (asyncLoadingRadio.value === 'loading-custom') return '没有更多数据了'
  return asyncLoadingRadio.value
})

const searhForm = reactive({
  search: '',
})

const clickChangeFavorite = (datasource: any) => {
  let req
  if (datasource.favorite) {
    req = reqRemoveFavoriteDatasource({ datasource_ids: [datasource.id] }).then(() => {
      datasource.favorite = false
      if (route.name === 'DataFavorite') {
        remove(datasourceList.value, (v: any) => v.id === datasource.id)
      }
    })
  } else {
    req = reqAddFavoriteDatasource({ datasource_ids: [datasource.id] }).then(() => {
      datasource.favorite = true
    })
  }
  req.finally(() => {
    datasource.loadingFavorite = false
  })
}

const router = useRouter()
const clickDatasource = (datasource: any) => {
  router.push({ name: 'DataDetail', params: { data_id: datasource.id } })
}

</script>

<style lang="scss">
.data-market {

  .market-list {
    margin-top: 12px;
    border: 1px solid var(--border-color);
  }

  .t-list-item__meta-avatar {
    border-radius: 0 !important;
  }
}
</style>
