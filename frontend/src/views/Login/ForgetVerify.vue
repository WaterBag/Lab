<template>
  <div class="login-signup-card-page">
    <div class="login-signup-card-warpper">
      <div class="login-signup-card">
        <div class="login-title">重置密码</div>
        <t-form
          ref="roleFormRef"
          label-align="top"
          :data="formData"
          :required-mark="false"
          @submit="confirm"
        >
          <t-form-item
            label="邮箱"
            name="email"
            :rules="[
              { required: true },
              { email: true, message: '邮箱无效' },
            ]"
          >
            <t-input
              v-model="formData.email"
              class="form-input"
              placeholder="输入您的邮箱"
            />
          </t-form-item>

          <t-form-item
            label-width="0"
            style="padding-top: 10px;"
          >
            <t-button
              theme="primary"
              type="submit"
              block
              size="large"
              :content="buttonText"
              :loading="loading"
            />
          </t-form-item>
        </t-form>
        <div
          style="margin-top: 24px; text-align: left;"
          class="gray-text"
        >
          请前往你的电子邮箱收件箱确认邮件，并按照所提供的指示操作。
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { FormProps, FormInstanceFunctions } from 'tdesign-vue-next'
import { MessagePlugin } from 'tdesign-vue-next'
import { reqSendPwdEmail } from '@/api/Users'
import { requestErrorMsg } from '@/common/plugins/request'

const loading = ref(false)
const formData = reactive({
  email: '',
})

const roleFormRef = ref<FormInstanceFunctions>()

const isDisabled = ref(false)
const buttonText = ref('验证电子邮箱')
let timer: any = null

const confirm: FormProps['onSubmit'] = async ({ validateResult }) => {
  if (validateResult !== true) return

  if (isDisabled.value) return
  isDisabled.value = true
  let countdown = 60
  buttonText.value = `${countdown}S 重试`

  timer = setInterval(() => {
    countdown--
    if (countdown > 0) {
      buttonText.value = `${countdown}S 重试`
    } else {
      buttonText.value = '验证电子邮箱'
      isDisabled.value = false
      clearInterval(timer!)
      timer = null
    }
  }, 1000)

  const { email } = formData
  loading.value = true
  try {
    await reqSendPwdEmail({
      email,
    })
    MessagePlugin.success('Sent successfully, please check your email.')
  } catch (err: any) {
    requestErrorMsg(err.message)
  }
  loading.value = false
}

</script>
<style lang="scss" scoped>
.login-signup-card-page {
    width: 100%;
    height: 100%;
}
.login-signup-card-warpper {
  box-sizing: border-box;
  border-radius: 8px;
  margin: 16px;
  background-color: #fff;
  display: flex;
  align-items: center;
  /* justify-content: center; */
  flex-direction: column;
  /* min-height: calc(100% - 32px); */
  padding: 32px 0;
}
.login-signup-card {
  width: 460px;
  height: 100%;

    .login-title {
      margin-bottom: 16px;
      font-size: 24px;
      text-align: center;
      font-weight: 500;
    }

    .form-input .t-input {
      height: 40px;
      padding: 0 12px;
    }
  }
</style>
