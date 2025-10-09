<template>
  <div class="main-box home-container">
    <Card
      class="welcome"
      :border="false"
    >
      <t-avatar size="80px"><template #icon><UserIcon /></template></t-avatar>
      <div style="margin-left: 20px;">
        <h2 class="user-name">你好，{{ UserStore.name }}</h2>
        <span class="user-id">账号ID：{{ UserStore.username }}</span>
      </div>
    </Card>

    <div class="tabs">
      <div
        v-for="item in tabs"
        :key="item.value"
        :class="['tab-item', nowTab === item.value && 'active']"
        @click="nowTab = item.value"
      >
        {{ item.label }}
      </div>
    </div>

    <Card
      class="tab-content"
      :border="false"
    >
      <ProjectPanel v-if="nowTab === 'project'" />
      <DatasourcePanel v-else-if="nowTab === 'data'" />
      <TeamPanel v-else-if="nowTab === 'team'" />
    </Card>
  </div>
</template>

<script lang="ts" setup>
import ProjectPanel from './Projects/index.vue'
import DatasourcePanel from './Datasource/index.vue'
import TeamPanel from './Team/index.vue'
import { UserIcon } from 'tdesign-icons-vue-next'
import { useUserStore } from '@/stores/User'

const UserStore = useUserStore()

const nowTab = ref('project')

const tabs = [
  { label: '我的项目', value: 'project' },
  { label: '我的数据', value: 'data' },
  { label: '我的团队', value: 'team' },
]

</script>

<style lang="scss" scoped>
.home-container {
  height: 100%;
  display: flex;
  flex-direction: column;

  .welcome {
    display: flex;
    align-items: center;
    padding: 32px;
    margin-bottom: 12px;
    flex-shrink: 0;
    background: linear-gradient(180.31deg,#4b8fff33 0%,#4b8fff00 50%), linear-gradient(0deg,#fff,#fff);

    .user-name {
      font-size: 21px;
      font-weight: 600;
      margin-bottom: 8px;
    }

    .user-id {
      color: #00000099;
    }
  }

  .tabs {
    flex-shrink: 0;
    display: flex;
    // align-items: center;
    column-gap: 12px;
    padding: 8px;
    background-color: #f0e8e8;
    margin-bottom: 12px;
    border-radius: var(--td-radius-medium);

    .tab-item {
      text-align: center;
      line-height: 36px;
      flex: 1;
      // background-color: #fff;
      border-radius: var(--td-radius-medium);
      cursor: pointer;
      color: #00000099;
      transition-property: color background-color;
      transition-duration: 200ms;

      &.active {
        background-color: #fff;
        // margin-bottom: 0;
        // font-weight: 600;
        // color: #0052d9;
        color: inherit;
      }
    }
  }

  .tab-content {
    flex: 1;
    height: 0;
    // display: flex;
    // flex-direction: column;
    border-radius: var(--td-radius-medium);
    background-color: #fff;
    padding-top: 0;
    padding-bottom: 0;
  }
}
</style>
