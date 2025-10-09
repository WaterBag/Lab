<template>
  <div class="login-signup-card-page">
    <div class="login-signup-card-warpper">
      <div class="login-signup-card">
        <div
          v-if="isResetPwd"
          class="login-title"
        >
          重置密码
        </div>
        <div
          v-else
          class="login-title"
        >
          完成注册您的信息
        </div>
        <t-form
          ref="roleFormRef"
          label-align="top"
          :data="formData"
          :required-mark="false"
          :rules="roleFormRule"
          @submit="confirm"
        >
          <t-form-item
            :label="'密码'"
            name="password"
          >
            <t-input
              v-model="formData.password"
              class="form-input"
              type="password"
              :placeholder="'输入密码'"
            />
          </t-form-item>

          <t-form-item
            label="确认密码"
            name="password2"
          >
            <t-input
              v-model="formData.password2"
              class="form-input"
              type="password"
              placeholder="重新输入密码"
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
              content="提交"
              :loading="loading"
            />
          </t-form-item>
        </t-form>
        <div
          style="margin-top: 24px; text-align: center;"
          class="gray-text"
        >
          提交后，您将被重定向到登录页面。
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { FormProps, FormInstanceFunctions, FormRule } from 'tdesign-vue-next'
import { useRouter, useRoute } from 'vue-router'

import { validatePwd, validatePwdLength } from '@/common/utils'
// import { MessagePlugin } from 'tdesign-vue-next'
import { reqChangePwd } from '@/api/Users'
import { requestErrorMsg } from '@/common/plugins/request'

const router = useRouter()
const route = useRoute()
const loading = ref(false)

const key = route.query.key as string || ''

const isResetPwd = ref(route.name === 'ResetPwd')

// const emailInfo = base64Decode(valid.slice(12))
// const email = emailInfo.split(':')[1]
// if (!validateEmail(email)) {
//   MessagePlugin.error(t('邮箱名称解析错误'))
//   setTimeout(() => {
//     router.push({ name: 'Login' })
//   }, 3000)
// }
const formData = reactive({
  password: '',
  password2: '',
  desc: '',
})

const roleFormRef = ref<FormInstanceFunctions>()
// 自定义异步校验器
const rePassword = (val: string) => formData.password === val

const roleFormRule: {[k:string]:FormRule[]} = {
  password: [
    {
      validator: validatePwdLength,
      message: '请创建一个6到18个字符之间的密码。',
      trigger: 'blur',
    },
    // 自定义校验规则：自定义异步校验规则
    {
      validator: validatePwd,
      message: '包含数字、小写字母和大写字母。',
      trigger: 'blur',
    },
  ],
  password2: [
    {
      required: true,
      type: 'error',
    },
    // 自定义校验规则：自定义异步校验规则
    {
      validator: rePassword,
      message: '密码不一致，请重新输入',
      trigger: 'blur',
    },
  ],
}

const confirm: FormProps['onSubmit'] = async ({ validateResult }) => {
  if (validateResult !== true) return
  const { password } = formData

  loading.value = true
  try {
    if (isResetPwd.value) {
      await reqChangePwd({
        key,
        password,
      })
    }
    router.replace('/')
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

<i18n lang="json">
  {
    "zh": {
      "重置密码": "重置密码",
      "完成注册您的信息": "完成注册您的信息",
      "用户账户": "账户",
      "输入您的邮箱": "输入您的邮箱",
      "密码": "密码",
      "输入密码": "输入密码",
      "确认密码": "确认密码",
      "重新输入密码": "重新输入密码",
      "备注": "备注",
      "请输入": "请输入",
      "提交": "提交",
      "提交后，您将被重定向到登录页面。": "提交后，您将被重定向到登录页面。",
      "邮箱名称解析错误": "邮箱名称解析错误",
      "请创建一个6到18个字符之间的密码。": "请创建一个6到18个字符之间的密码。",
      "包含数字、小写字母和大写字母。": "包含数字、小写字母和大写字母。",
      "密码不一致，请重新输入": "密码不一致，请重新输入"
    },
    "en": {
      "重置密码": "Reset Password",
      "完成注册您的信息": "Finish Registering Your Details",
      "用户账户": "User Account",
      "输入您的邮箱": "Enter your email",
      "密码": "Password",
      "输入密码": "Enter password",
      "确认密码": "Confirm Password",
      "重新输入密码": "Re-enter password",
      "备注": "Remark",
      "请输入": "Optional",
      "提交": "Submit",
      "提交后，您将被重定向到登录页面。": "After submission, you will be redirected to the login page",
      "邮箱名称解析错误": "Incorrect mailbox name resolution",
      "请创建一个6到18个字符之间的密码。": "Please create a password between 6 and 18 characters long",
      "包含数字、小写字母和大写字母。": "Containing numbers, lower case letters, and upper case letters",
      "密码不一致，请重新输入": "password is different, please re-enter"
    }
  }
</i18n>
