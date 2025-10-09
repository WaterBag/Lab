<template>
  <div class="main-box">
    <PageTitle title="团队详情" />
    <t-loading :loading="loading">
      <t-card
        style="margin: 16px 0;"
        header-bordered
        title="基本信息"
      >
        <t-descriptions
          bordered
          :column="3"
        >
          <t-descriptions-item label="团队名称">{{ team.name }}</t-descriptions-item>
          <t-descriptions-item label="创建人">{{ team.created_by }}</t-descriptions-item>
          <t-descriptions-item label="创建时间">{{ formatDate(team.created_at) }}</t-descriptions-item>
          <t-descriptions-item label="描述">{{ team.description }}</t-descriptions-item>
        </t-descriptions>
      </t-card>
      <t-card
        v-if="team.is_admin"
        header-bordered
        title="成员信息"
      >
        <vxe-grid
          v-bind="tableConfig"
          ref="userGrid"
          :data="users"
        >
          <template #toolbar_buttons>
            <t-input
              v-model="userSearch"
              style="width: 300px;"
              placeholder="搜索用户"
              clearable
            >
              <template #suffixIcon>
                <search-icon :style="{ cursor: 'pointer' }" />
              </template>
            </t-input>
          </template>
          <template #toolbar_tools>
            <t-button @click="clickAddTeamUser">新增成员</t-button>
            <t-button
              theme="default"
              style="margin-left: 15px;"
              @click="clickUpdateTeamUserList"
            >
              批量变更
            </t-button>
            <t-button
              theme="danger"
              style="margin-left: 15px;"
              @click="removeTeamUserList"
            >
              批量删除
            </t-button>
          </template>
          <template #action="{ row }">
            <t-link
              theme="primary"
              @click="clickUpdateTeamUser([row])"
            >
              变更
            </t-link>
            <t-link
              theme="danger"
              style="margin-left: 15px;"
              @click="removeTeamUser([row.username])"
            >
              移除
            </t-link>
          </template>
        </vxe-grid>
      </t-card>
    </t-loading>

    <t-dialog
      v-model:visible="showAddUserDialog"
      :header="dialogType ? '添加成员' : '变更成员'"
      :on-confirm="onConfirmAddUser"
      :confirm-loading="addUserLoading"
    >
      <t-form :data="addUserForms">
        <t-form-item
          label="用户"
          name="name"
          :rules="[{ required: true, message: '请选择用户', trigger: 'change' }]"
        >
          <t-select
            v-model="addUserForms.users"
            multiple
            filterable
          >
            <t-option
              v-for="item in userOptions"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            >
              <t-row>
                <t-col flex="auto">{{ item.label }}</t-col>
                <t-col
                  v-if="item.inTeam"
                  flex="none"
                >
                  <t-tag :theme="item.level === '团队管理员' ? 'primary' : 'default'">{{ item.level }}</t-tag>
                </t-col>
              </t-row>
            </t-option>
          </t-select>
        </t-form-item>
        <t-form-item
          label="团队角色"
          name="level"
          :rules="[{ required: true, message: '请选择团队角色', trigger: 'change' }]"
        >
          <t-radio-group
            v-model="addUserForms.level"
            :options="[{ label: '团队成员', value: 'normal' }, { label: '团队管理员', value: 'admin'}]"
          />
        </t-form-item>
        <t-form-item label="注：">
          如果将已有成员添加到非该用户组中则为变更身份
        </t-form-item>
      </t-form>
    </t-dialog>
  </div>
</template>

<script lang="tsx" setup>
import { useRoute } from 'vue-router'
import { reqGetTeam, reqAddTeamUser, reqRemoveTeamUser } from '@/api/Team'
import { reqListUsers } from '@/api/Users'
import { MessagePlugin, DialogPlugin } from 'tdesign-vue-next'
import { formatDate } from '@/common/plugins/tool'
import { computed, reactive, ref } from 'vue'
import type { VxeGridProps } from 'vxe-table'

const route = useRoute()
const loading = ref(true)
const team: any = ref({})
const users = computed(() => {
  if (!userSearch.value) return team.value.users
  return team.value.users.filter((user: any) => Object.values(user).some((key: any) => key.includes(userSearch.value)))
})

const getTeamData = () => {
  reqGetTeam(route.params.team_id)
    .then(resp => { team.value = resp })
    .catch(e => { MessagePlugin.error(e.message) })
    .finally(() => { loading.value = false })
}
getTeamData()

const userSearch = ref('')
const tableConfig: VxeGridProps = {
  toolbarConfig: {
    slots: {
      buttons: 'toolbar_buttons',
      tools: 'toolbar_tools',
    },
  },
  columns: [
    { type: 'checkbox', width: 50 },
    { field: 'name', title: '昵称' },
    { field: 'username', title: '用户账号' },
    { field: 'real_name', title: '姓名' },
    { field: 'email', title: '邮箱' },
    {
      field: 'level',
      title: '角色',
      slots: {
        default: ({ row }) => {
          if (row.level === 'admin') return <t-tag theme="primary" content="项目管理员" />
          else return <t-tag theme="default" content="项目成员" />
        },
      },
    },
    {
      title: '操作',
      slots: { default: 'action' },
    },
  ],
}

const userList = ref([])
const userOptions: any = computed(() => {
  return userList.value.map((user: any) => {
    const tU = team.value.users.find((item: any) => item.username === user.username)
    let level = (tU || {}).level
    switch (level) {
    case 'admin':
      level = '团队管理员'
      break
    case 'normal':
      level = '团队成员'
      break
    default:
      break
    }
    return {
      label: user.name,
      value: user.username,
      inTeam: !!tU,
      level,
    }
  })
})

reqListUsers().then(resp => { userList.value = resp })

const showAddUserDialog = ref(false)
const dialogType = ref('create')
const clickAddTeamUser = () => {
  showAddUserDialog.value = true
  dialogType.value = 'create'
}
const addUserForms = reactive({
  users: [],
  level: 'normal',
})

const addUserLoading = ref(false)
const onConfirmAddUser = () => {
  addUserLoading.value = true
  reqAddTeamUser(route.params.team_id, addUserForms).then(() => {
    MessagePlugin.success('更新成员成功')
    showAddUserDialog.value = false
    getTeamData()
  }).catch(e => {
    MessagePlugin.error(e.message)
  }).finally(() => {
    addUserLoading.value = false
  })
}

const userGrid = ref()

const removeTeamUserList = () => {
  const users = userGrid.value.getCheckboxRecords()
  removeTeamUser(users.map((user: any) => user.username))
}

const removeTeamUser = (users: any) => {
  if (!users.length) return
  const confirmDia = DialogPlugin.confirm({
    header: '删除确认',
    body: '确认删除该批成员吗?',
    confirmBtn: '确认',
    cancelBtn: '取消',
    onConfirm: () => {
      loading.value = true
      reqRemoveTeamUser(route.params.team_id, { users }).then(() => {
        MessagePlugin.success('删除成功')
        getTeamData()
      }).catch(e => {
        MessagePlugin.error(e.message)
      }).finally(() => {
        loading.value = false
      })
      // 请求成功后，销毁弹框
      confirmDia.destroy()
    },
    onClose: () => {
      confirmDia.hide()
    },
  })
}

const clickUpdateTeamUser = (users: any) => {
  if (!users.length) return
  dialogType.value = 'update'
  addUserForms.users = users.map((user: any) => user.username)
  addUserForms.level = users[0].level
  showAddUserDialog.value = true
}

const clickUpdateTeamUserList = () => {
  const users = userGrid.value.getCheckboxRecords()
  clickUpdateTeamUser(users)
}
</script>
