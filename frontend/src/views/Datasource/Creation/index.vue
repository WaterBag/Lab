<template>
  <CreationLayout title="创建数据集">
    <t-loading :loading="loading">
      <t-form
        label-align="top"
        :data="creationForm"
        :rules="formRules"
        @submit="submitCreateDatasource"
      >
        <t-form-item
          label="数据集名称"
          name="name"
        >
          <t-input v-model="creationForm.name" />
        </t-form-item>
        <t-form-item
          label="归属"
          name="belong"
        >
          <t-radio-group
            v-model="creationForm.belong"
            :options="belongOptions"
          />
        </t-form-item>
        <t-form-item
          v-if="creationForm.belong === 'team'"
          label="归属团队"
          name="team_id"
        >
          <t-select
            v-model="creationForm.team_id"
            filterable
            :options="teamOptions"
          />
        </t-form-item>
        <t-form-item
          label="数据集封面"
          name="image"
        >
          <t-upload
            v-model="creationForm.image"
            theme="image"
            :auto-upload="false"
            accept="image/*"
          />
        </t-form-item>
        <t-form-item
          label="描述"
          name="description"
        >
          <t-textarea v-model="creationForm.description" />
        </t-form-item>
        <t-form-item
          label="上传文件"
          name="files"
        >
          <t-upload
            v-if="mode === 'cos'"
            ref="dUpload"
            v-model:files="creationForm.files"
            theme="file-flow"
            multiple
            :request-method="uploadFile"
            :headers="{'x-web': 'lab'}"
            method="PUT"
            style="width: 100%;"
          />
          <t-upload
            v-if="mode === 'local'"
            ref="dUpload"
            v-model:files="creationForm.files"
            action="/api/file/"
            theme="file-flow"
            multiple
            style="width: 100%;"
            :with-credentials="true"
            :format-request="formatRequest"
          />
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
      <t-list>
        <t-list-item>数据下载到项目之后则项目内成员拥有该数据权限</t-list-item>
        <t-list-item>归属权限后续可以变更，下载到项目中的数据不受影响，请到项目中删除该数据</t-list-item>
        <t-list-item>
          <t-link theme="danger">
            请等待文件上传成功后再点击创建按钮
          </t-link>
        </t-list-item>
      </t-list>
    </template>
  </CreationLayout>
</template>

<script lang="ts" setup>
import COS from 'cos-js-sdk-v5'
import { reqCosTempCredential } from '@/api/Cos'
import { reqCreateDatasource } from '@/api/Datasource'
import { v4 as uuidv4 } from 'uuid'
import { ref, reactive } from 'vue'
import { reqListTeams } from '@/api/Team'
import { MessagePlugin } from 'tdesign-vue-next'
import { useRouter } from 'vue-router'
import { useCookies } from '@vueuse/integrations/useCookies'

const { get } = useCookies()

const pathId = uuidv4()
const mode = ref('local')

const creationForm = reactive({
  name: '',
  belong: 'private',
  team_id: '',
  description: '',
  image: [],
  files: [],
})

const formRules: any = {
  name: [
    { required: true, message: '请输入数据集名称', trigger: 'blur' },
  ],
  belong: [
    { required: true },
  ],
  files: [
    { required: true },
  ],
}

const belongOptions = [
  { label: '私有', value: 'private' },
  { label: '团队公开', value: 'team' },
  { label: '全局公开', value: 'public' },
]

const dUpload = ref()
const uploadFile: any = async (files: any) => {
  if (mode.value === 'cos') {
    const data = await reqCosTempCredential({ prefix: `${pathId}/${files[0].name}` }) // 需自行实现获取临时密钥逻辑
    /* eslint-disable */
    const cos = new COS({
      getAuthorization: async function (options, callback) {
        console.log(data)
        callback({
          TmpSecretId: data.credentials.tmpSecretId,
          TmpSecretKey: data.credentials.tmpSecretKey,
          SecurityToken: data.credentials.sessionToken,
          // 建议返回服务器时间作为签名的开始时间，避免客户端本地时间偏差过大导致签名错误
          StartTime: data.startTime, // 时间戳，单位秒，如：1580000000
          ExpiredTime: data.expiredTime, // 时间戳，单位秒，如：1580000000
          ScopeLimit: true, // 细粒度控制权限需要设为 true，会限制密钥只在相同请求时重复使用
        })
      },
    })
    return cos.uploadFile({
      Bucket: data.cos.bucket, // 填写自己的 bucket，必须字段
      Region: data.cos.region, // 存储桶所在地域，必须字段
      Key: `${pathId}/${files[0].name}`, // 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段
      Body: files[0].raw, // 上传文件对象
      SliceSize: 1024 * 1024 * 5, // 触发分块上传的阈值，超过5MB 使用分块上传，小于5MB使用简单上传。可自行设置，非必须
      onProgress: function (progressData) {
        console.log('上传进度：', progressData)
        dUpload.value.uploadFilePercent({ file: files[0], percent: progressData.percent })
      },
    }).then(() => {
      return {
        status: 'success',
      }
    }).catch(e => {
      return {
        status: 'fail',
        error: e.message
      }
    })
  }
}

const formatRequest = (requestData) => {
  return {
    csrfmiddlewaretoken: get('ZY__Secure-csrftoken'),
    app: 'datasource',
    path: pathId,
    ...requestData
  }
}

const loadingTeam = ref(true)
const teamOptions = ref([])
reqListTeams({ page_enabled: false }).then(resp => {
  teamOptions.value = resp.results.map((item: any) => {
    return {
      label: item.name,
      value: item.id,
    }
  })
}).finally(() => {
  loadingTeam.value = false
})

const router = useRouter()
const loading = ref(false)
const submitCreateDatasource = ({ validateResult }: any) => {
  if (validateResult !== true) {
    return false
  }
  if (creationForm.files.find((item: any) => item.percent < 100)) {
    MessagePlugin.warning('请等待文件全部上传成功')
  }
  loading.value = true
  const data: any = { ...creationForm }
  data.file_list = JSON.stringify(creationForm.files.map((item: any) => {
    return {
      name: item.name,
      type: item.type,
      size: item.size,
    }
  }))
  data.image = creationForm.image.length > 0 ? data.image[0].raw : null
  data.path = pathId
  delete data.files
  const formData = new FormData()
  Object.keys(data).forEach(key => {
    if (data[key]) {
      formData.append(key, data[key])
    }
  })
  reqCreateDatasource(formData).then(data => {
    MessagePlugin.success('创建数据集成功')
    router.push({ name: 'DataDetail', params: { data_id: data.id } })
  }).catch(e => {
    MessagePlugin.error(e.message)
  }).finally(() => {
    loading.value = false
  })
}
</script>

