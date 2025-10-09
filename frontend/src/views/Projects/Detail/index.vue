<template>
  <div class="main-box">
    <PageTitle title="项目详情" />
    <t-loading :loading="loading">
      <t-card
        style="margin: 12px 0;"
        header-bordered
        title="基本信息"
      >
        <t-descriptions
          bordered
          :column="3"
        >
          <t-descriptions-item label="项目名称">{{ project.name }}</t-descriptions-item>
          <t-descriptions-item label="创建人">{{ project.created_by }}</t-descriptions-item>
          <t-descriptions-item label="创建时间">{{ formatDate(project.created_at) }}</t-descriptions-item>
          <t-descriptions-item label="描述">{{ project.description }}</t-descriptions-item>
        </t-descriptions>
        <template #actions>
          <t-button
            tag="a"
            :href="project.server_url"
            target="_blank"
          >
            运 行
          </t-button>
        </template>
      </t-card>
      <t-card
        v-if="project.is_admin"
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
            <t-button @click="clickAddProjectUser">新增成员</t-button>
            <t-button
              theme="default"
              style="margin-left: 15px;"
              @click="clickUpdateProjectUserList"
            >
              批量变更
            </t-button>
            <t-button
              theme="danger"
              style="margin-left: 15px;"
              @click="removeProjectUserList"
            >
              批量删除
            </t-button>
          </template>
          <template #action="{ row }">
            <t-link
              theme="primary"
              @click="clickUpdateProjectUser([row])"
            >
              变更
            </t-link>
            <t-link
              theme="danger"
              style="margin-left: 15px;"
              @click="removeProjectUser([row.username])"
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
                  v-if="item.inProject"
                  flex="none"
                >
                  <t-tag :theme="item.level === '项目管理员' ? 'primary' : 'default'">{{ item.level }}</t-tag>
                </t-col>
              </t-row>
            </t-option>
          </t-select>
        </t-form-item>
        <t-form-item
          label="项目角色"
          name="level"
          :rules="[{ required: true, message: '请选择项目角色', trigger: 'change' }]"
        >
          <t-radio-group
            v-model="addUserForms.level"
            :options="[{ label: '项目成员', value: 'normal' }, { label: '项目管理员', value: 'admin'}]"
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
import { formatDate } from '@/common/plugins/tool'
import { reqGetProject, reqUpdateProjectUsers, reqRemoveProjectUser } from '@/api/Project'
import { reqListUsers } from '@/api/Users'
import { MessagePlugin, DialogPlugin } from 'tdesign-vue-next'
import type { VxeGridProps } from 'vxe-table'

const loading = ref(false)
const project: any = ref({})
const route = useRoute()
const userSearch = ref('')

const getProjectData = () => {
  loading.value = true
  reqGetProject(route.params.project_id)
    .then(data => { project.value = data })
    .catch(e => { MessagePlugin.error(e.message) })
    .finally(() => { loading.value = false })
}
getProjectData()

const users = computed(() => {
  if (!userSearch.value) return project.value.users
  return project.value.users.filter((user: any) => Object.values(user).some((key: any) => key.includes(userSearch.value)))
})

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
    const tU = project.value.users.find((item: any) => item.username === user.username)
    let level = (tU || {}).level
    switch (level) {
    case 'admin':
      level = '项目管理员'
      break
    case 'normal':
      level = '项目成员'
      break
    default:
      break
    }
    return {
      label: user.name,
      value: user.username,
      inProject: !!tU,
      level,
    }
  })
})

reqListUsers().then(resp => {
  userList.value = resp
})
const showAddUserDialog = ref(false)
const dialogType = ref('create')
const clickAddProjectUser = () => {
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
  reqUpdateProjectUsers(route.params.project_id, addUserForms).then(() => {
    MessagePlugin.success('更新成员成功')
    showAddUserDialog.value = false
    getProjectData()
  }).catch(e => {
    MessagePlugin.error(e.message)
  }).finally(() => {
    addUserLoading.value = false
  })
}

const userGrid = ref()

const removeProjectUserList = () => {
  const users = userGrid.value.getCheckboxRecords()
  removeProjectUser(users.map((user: any) => user.username))
}

const removeProjectUser = (users: any) => {
  if (!users.length) return
  const confirmDia = DialogPlugin.confirm({
    header: '删除确认',
    body: '确认删除该批成员吗?',
    confirmBtn: '确认',
    cancelBtn: '取消',
    onConfirm: () => {
      loading.value = true
      reqRemoveProjectUser(route.params.project_id, { users }).then(() => {
        MessagePlugin.success('删除成功')
        getProjectData()
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

const clickUpdateProjectUser = (users: any) => {
  if (!users.length) return
  dialogType.value = 'update'
  addUserForms.users = users.map((user: any) => user.username)
  addUserForms.level = users[0].level
  showAddUserDialog.value = true
}

const clickUpdateProjectUserList = () => {
  const users = userGrid.value.getCheckboxRecords()
  clickUpdateProjectUser(users)
}
</script>
