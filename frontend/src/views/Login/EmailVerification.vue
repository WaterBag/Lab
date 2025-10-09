<template>
  <div>
    邮箱验证
  </div>
</template>
<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { requestErrorMsg } from '@/common/plugins/request'
import { reqVerifyEmail } from '@/api/Users'
import { MessagePlugin } from 'tdesign-vue-next'

const route = useRoute()
// const router = useRouter()

const key = route.query.key as string || ''

const btnLoading = ref(false)

const verify = async () => {
  btnLoading.value = true
  try {
    await reqVerifyEmail({ key })
    MessagePlugin.success('邮箱验证成功，正在跳转登录')
    window.location.href = '/'
  } catch (err: any) {
    requestErrorMsg(err.message)
  }
  btnLoading.value = false
}

verify()

</script>
