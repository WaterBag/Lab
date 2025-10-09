<template>
  <CreationLayout title="创建项目">
    <t-form
      label-align="top"
      :data="creationForm"
      :rules="formRules"
      @submit="submitForm"
    >
      <t-form-item
        label="项目名称"
        name="name"
      >
        <t-input v-model="creationForm.name" />
      </t-form-item>

      <t-form-item
        label="所属团队"
        name="team_id"
      >
        <t-select
          v-model="creationForm.team_id"
          :options="teamOptions"
          :loading="teamLoading"
        />
      </t-form-item>

      <t-form-item
        label="项目成员"
        name="users"
      >
        <UserSelect v-model="creationForm.users" />
      </t-form-item>

      <t-form-item
        label="描述"
        name="description"
      >
        <t-textarea v-model="creationForm.description" />
      </t-form-item>

      <t-form-item>
        <t-button
          type="submit"
          content="创 建"
          :loading="loading"
          style="margin-right: 8px;"
        />
        <router-link to="/">
          <t-button
            theme="default"
            content="取 消"
          />
        </router-link>
      </t-form-item>
    </t-form>

    <template #desc>
      <t-list size="small">
        <t-list-item>项目创建者自动成为管理员</t-list-item>
        <t-list-item>项目成员后续可通过管理员配置加入</t-list-item>
      </t-list>
    </template>
  </CreationLayout>
</template>

<script lang="ts" setup>
import { reqCreateProject } from '@/api/Project'
import { reqListTeams } from '@/api/Team'
import UserSelect from '@/components/UserSelect/index.vue'
import { MessagePlugin, type FormRules } from 'tdesign-vue-next'

const creationForm = reactive({
  name: '',
  team_id: '',
  users: [],
  description: '',
})

const formRules: FormRules = {
  name: [{ required: true, message: '请输入数据集名称', trigger: 'blur' }],
  team_id: [{ required: true, message: '请选择归属团队', trigger: 'change' }],
}

const loading = ref(false)

const router = useRouter()
const submitForm = ({ validateResult }: any) => {
  if (validateResult !== true) return false
  loading.value = true
  reqCreateProject(creationForm)
    .then(resp => {
      MessagePlugin.success('项目创建成功')
      router.push({ name: 'ProjectDetail', params: { project_id: resp.id } })
    })
    .catch(e => MessagePlugin.error(e.message))
    .finally(() => { loading.value = false })
}

const teamLoading = ref(true)
const teamOptions = shallowRef([])
reqListTeams({ page_enabled: false })
  .then(resp => { teamOptions.value = resp.results.map((team: any) => ({ label: team.name, value: team.id })) })
  .finally(() => { teamLoading.value = false })

</script>
