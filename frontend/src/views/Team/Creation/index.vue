<template>
  <CreationLayout title="创建团队">
    <t-loading :loading="loading">
      <t-form
        :data="formData"
        :rules="formRules"
        label-align="top"
        @submit="submitForm"
      >
        <t-form-item
          label="团队名称"
          name="name"
        >
          <t-input v-model="formData.name" />
        </t-form-item>
        <t-form-item
          label="团队管理员"
          name="admins"
        >
          <t-select
            v-model="formData.admins"
            :options="userOptions"
            :loading="loadingUsers"
            multiple
          />
        </t-form-item>
        <t-form-item
          label="团队成员"
          name="users"
        >
          <t-select
            v-model="formData.users"
            :options="userOptions"
            :loading="loadingUsers"
            multiple
          />
        </t-form-item>
        <t-form-item
          label="描述"
          name="description"
        >
          <t-textarea v-model="formData.description" />
        </t-form-item>
        <t-form-item>
          <t-button type="submit">创 建</t-button>
          <t-button
            theme="default"
            style="margin-left: 15px;"
            @click="$router.replace('/')"
          >
            取 消
          </t-button>
        </t-form-item>
      </t-form>
    </t-loading>
    <template #desc>
      <t-list
        size="small"
      >
        <t-list-item>团队创建者自动成为管理员</t-list-item>
        <t-list-item>团队成员后续可通过申请或管理员配置加入</t-list-item>
        <t-list-item>团队管理员可以查看所有成员项目、数据、模型等</t-list-item>
        <t-list-item>项目、数据、模型等以团队维度支持共享</t-list-item>
        <t-list-item>团队成员可以创建或管理自己的项目</t-list-item>
      </t-list>
    </template>
  </CreationLayout>
</template>

<script lang="ts" setup>
import { reqListUsers } from '@/api/Users'
import { reqCreateTeam } from '@/api/Team'
import { MessagePlugin } from 'tdesign-vue-next'
import { useRouter } from 'vue-router'
import { ref, reactive } from 'vue'

const router = useRouter()

const formData = reactive({
  name: '',
  admins: [],
  users: [],
  description: '',
})

const formRules: any = {
  name: [
    { required: true, message: '请输入团队名称', trigger: 'blur' },
  ],
}

const userOptions = ref([])
const loadingUsers = ref(true)
reqListUsers().then(resp => {
  userOptions.value = resp.map((item: any) => {
    return {
      label: item.name,
      value: item.username,
    }
  })
  loadingUsers.value = false
}).catch(() => {
  loadingUsers.value = false
})

const loading = ref(false)
const submitForm = (valRes: any) => {
  if (valRes) {
    loading.value = true
    reqCreateTeam(formData).then((resp: any) => {
      MessagePlugin.success('创建团队成功')
      router.push({ name: 'TeamDetail', params: { team_id: resp.id } })
    }).catch(e => {
      MessagePlugin.error(e.message)
    }).finally(() => {
      loading.value = false
    })
  }
}
</script>
