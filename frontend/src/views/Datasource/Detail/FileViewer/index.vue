<template>
  <div class="datasource-file-viewer">
    <div class="file-list">
      <div class="header-row">文件列表</div>

      <div class="file-scroll --small-scroll">
        <div
          v-for="item in fileList"
          :key="item.name"
          :class="['file-item', nowSelect.name === item.name && 'selected']"
          @click="selectFile(item)"
        >
          {{ item.name }}
        </div>
      </div>
    </div>

    <div class="file-preview">
      <div class="header-row">
        <template v-if="nowSelect.name">
          <div class="file-name">{{ nowSelect.name }}</div>
          <div>{{ formatBytes(nowSelect.size) }}</div>
        </template>
        <template v-else>请选择文件</template>
      </div>

      <div class="file-preview-content">
        <template v-if="nowSelect.name">
          文件预览
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { formatBytes } from '@/common/utils'

const props = defineProps<{
  datasource: any
}>()

const fileList = computed(() => props.datasource.files)

const nowSelect: any = ref({})
const selectFile = (file: any) => {
  nowSelect.value = file
  reqDocPreview(file)
}

// const nowImage = ref('')
const reqDocPreview = (file: any) => {
  console.log(file)
  // reqGetPreviewUrl(props.datasource.id, file.name).then(url => {
  //   nowImage.value = `${url}&ci-process=doc-preview&dstType=html`
  //   // axios.get(`${url}&ci-process=doc-preview&dstType=html`).then(resp => {
  //   //   console.log(resp)
  //   // })
  // })
}
</script>

<style lang="scss">
.datasource-file-viewer {
  height: 100%;
  display: flex;

  .header-row {
    line-height: 39px;
    border-bottom: 1px solid var(--border-color);
    padding: 0 8px;
  }

  .file-list {
    width: 230px;
    height: 100%;
    display: flex;
    flex-direction: column;

    .header-row {
      color: #00000099;
    }

    .file-scroll {
      flex: 1;
      height: 0;
      overflow-y: auto;

      .file-item {
        line-height: 39px;
        padding: 0 8px;
        transition-property: color backrgound-color;
        transition-duration: 200ms;
        cursor: pointer;
        @include ellipsis(1);

        &:not(:last-child) {
          border-bottom: 1px solid var(--border-color);
        }

        &:hover {
          background-color: #f3f3f3;
        }

        &.selected {
          background-color: #f2f3ff;
          color: #0052d9;
        }
      }
    }
  }

  .file-preview {
    flex: 1;
    width: 0;
    height: 100%;
    border-left: 1px solid var(--border-color);
    display: flex;
    flex-direction: column;

    .header-row {
      display: flex;
      flex-wrap: nowrap;
      justify-content: space-between;
      column-gap: 8px;

      .file-name {
        flex: 1;
        @include ellipsis(1);
      }
    }

    .file-preview-content {
      flex: 1;
      height: 0;
      background-color: #eee;
    }
  }
}

</style>
