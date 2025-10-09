<template>
  <div class="--jp-layout-nav">
    <router-link
      class="--jp-logo"
      to="/"
    >
      AI 科研平台
    </router-link>

    <NavMenu />

    <div class="--jp-nav-right">
      <!-- -------------- 语言切换按钮 --------------------->

      <!-- -------------- 用户信息 --------------------->
      <t-popup>
        <template #content>
          <div class="--user-meta">
            <div
              v-if="UserStore.name"
              class="name ellipsis-1"
              :title="UserStore.name"
            >
              <!-- eslint-disable-next-line no-irregular-whitespace -->
              用户名: {{ UserStore.name || '　' }}
            </div>
            <div
              class="username ellipsis-1"
              :title="UserStore.username"
            >
              账号ID: {{ UserStore.username }}
            </div>

            <div style="background-color: #e7e7e7; height: 1px; margin: 10px 0;" />

            <div class="actions">
              <!-- <router-link :to="{ name: 'UserInfoDetail' }">
                <t-button
                  :content="'用户信息'"
                  block
                  variant="text"
                  class="btn"
                >
                  <template #icon><t-icon name="verify" /></template>
                </t-button>
              </router-link> -->

              <t-button
                :content="'退出登录'"
                block
                variant="text"
                class="btn"
                theme="danger"
                @click="logout"
              >
                <template #icon><t-icon name="logout" /></template>
              </t-button>
            </div>
          </div>
        </template>

        <div class="--jp-avatar-warpper">
          <t-avatar size="28px">
            <template #icon><UserIcon /></template>
          </t-avatar>
        </div>
      </t-popup>
    </div>
  </div>
</template>

<script lang="ts" setup>
import NavMenu from './NavMenu.vue'
import { useUserStore } from '@/stores/User'
import { useCookies } from '@vueuse/integrations/useCookies'
import { UserIcon } from 'tdesign-icons-vue-next'

const UserStore = useUserStore()

const logout = () => {
  const { remove } = useCookies()
  remove('ZY__Secure-sessionid', { path: '/' })
  remove('ZY__Secure-csrftoken', { path: '/' })
  remove('sessionid', { path: '/' })
  remove('csrftoken', { path: '/' })
  window.location.reload()
}
</script>

<style lang="scss">
$itemXPadding: 12px;

.--jp-layout-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--jp-nav-bar-height);
  background-color: var(--jp-nav-bar-bg);
  color: #fff;
  overflow: hidden;
  padding: 0 20px;
}

.--jp-logo {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  font-weight: bold;
  margin-right: 10px;
  text-decoration: unset;
  color: #fff;
  cursor: pointer;
  user-select: none;
  height: 100%;
  // font-family: var(--TencentW7-en);
}

.--jp-nav-head-menu {
  flex: 1;
  overflow: hidden;
  height: 100%;
}

.--jp-nav-right {
  display: flex;
  align-items: center;
  height: 100%;
}

.active-link.--jp-head-menu-link {
  color: var(--td-brand-color-4);
}

.--jp-head-menu-link {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  flex-shrink: 0;
  column-gap: 3px;
  padding: 0 $itemXPadding;
  line-height: var(--jp-nav-bar-height);
  height: var(--jp-nav-bar-height);
  cursor: pointer;
  text-decoration: none;
  transition: color 300ms;
  color: #fff;

  &:hover {
    color: var(--td-brand-color-5);
  }

  &:active {
    color: var(--td-brand-color-6);
  }

  .--jp-head-menu-link-text,
  .--jp-heade-menu-link-icon,
  .--jp-heade-menu-link-arrow {
    flex-shrink: 0;
  }
}

// .--jp-head-submenu-overlay {
  // margin-left: -2px !important;
  // padding-left: 3px !important;
  // padding-right: 3px !important;
// }

.--jp-head-submenu-content {
  background: var(--jp-nav-bar-bg);
  margin-top: 0 !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
  box-shadow: none;
  border: 1px solid var(--td-gray-color-10);
  display: flex;
  flex-direction: column;
  padding: 4px 0;

  .--jp-head-menu-link {
    line-height: 36px;
    height: 36px;
  }
}

.--jp-avatar-warpper {
  display: flex;
  align-items: center;
  cursor: pointer;
  height: 100%;
}
</style>

<style lang="scss">
.--user-meta {
  padding: 6px;
  width: 200px;

  .name {
    font-size: 16px;
    font-weight: 500;
  }

  .username {
    margin-top: 4px;
    color: var(--td-text-color-secondary);
  }

  .actions {
    display: flex;
    flex-direction: column;
    row-gap: 6px;
  }

  .btn {
    padding: 0 8px;
    justify-content: flex-start;
  }
}

.--collapse-content {
  background: var(--portal-nav-bar-bg);
  margin-top: 8px !important;
  .t-popup__arrow::before {
    background: var(--portal-nav-bar-bg);
    box-shadow: none !important;
  }
  display: flex;
  flex-direction: column;
  padding: 8px 6px;
  .--portal-head-menu-link {
    line-height: 36px;
  }
}
</style>
