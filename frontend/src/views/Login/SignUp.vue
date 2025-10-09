<template>
  <div>
    <div class="login-card">
      <div class="login-title" style="font-weight: 600">注册</div>

      <div class="gray-text" style="text-align: center; margin-bottom: 16px">请完善以下信息</div>

      <t-form label-align="top" :data="formData" :rules="roleFormRule" @submit="confirm">
        <t-form-item label="用户名" name="username" :rules="[{ required: true, message: '用户名是必填项' }]">
          <t-input v-model="formData.username" class="form-input" placeholder="输入您的用户名" />
        </t-form-item>

        <t-form-item label="邮箱" name="email" :rules="[{ required: true, message: '邮箱是必填项' }, { email: true, message: '邮箱无效' }]">
          <t-input v-model="formData.email" class="form-input" placeholder="输入您的邮箱" />
        </t-form-item>

        <t-form-item label="机构" name="org" :rules="[{ required: true, message: '机构是必填项' }]">
          <t-input v-model="formData.org" class="form-input" placeholder="请输入您的机构" />
        </t-form-item>

        <t-form-item label="真实姓名" name="real_name" :rules="[{ required: true, message: '真实姓名是必填项' }]">
          <t-input v-model="formData.real_name" class="form-input" placeholder="输入您的真实姓名" />
        </t-form-item>

        <t-form-item label="密码" name="password">
          <t-input v-model="formData.password" class="form-input" placeholder="输入您的密码" type="password" />
        </t-form-item>

        <t-form-item label="密码确认" name="check_password">
          <t-input v-model="formData.check_password" class="form-input" placeholder="请再次输入密码" type="password" />
        </t-form-item>

        <t-form-item label-width="0" style="padding-top: 10px">
          <t-button theme="primary" type="submit" block size="large" content="注册并验证邮箱" :loading="loading" />
        </t-form-item>
      </t-form>
    </div>

    <div class="footer-text">
      已有账户？
      <router-link :to="{ name: 'Login' }">
        <t-link theme="primary" hover="color" content="登录" />
      </router-link>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { FormProps, FormRule } from 'tdesign-vue-next'
import { useRouter } from 'vue-router'
import { reqRegisterVerify } from '@/api/Users'
import { requestErrorMsg } from '@/common/plugins/request'

const router = useRouter()
const loading = ref(false)

const formData = reactive({
  username: '',
  org: '',
  real_name: '',
  email: '',
  password: '',
  check_password: '',
})

const validatePwd = (pwd: string) => {
  if (!pwd) return false
  const hasUpperCase = /[A-Z]/.test(pwd)
  const hasLowerCase = /[a-z]/.test(pwd)
  const hasNumbers = /\d/.test(pwd)
  return [hasUpperCase, hasLowerCase, hasNumbers].filter(Boolean).length === 3
}

const validatePwdLength = (pwd: string) => {
  if (!pwd) return false
  return pwd.length >= 6 && pwd.length <= 18
}

const rePassword = (val: string) => formData.password === val

const roleFormRule: { [k: string]: FormRule[] } = {
  password: [
    { required: true, type: 'error' },
    { validator: validatePwdLength, message: '请创建一个长度为 6-18 个字符的密码', trigger: 'blur' },
    { validator: validatePwd, message: '包含数字、小写字母和大写字母', trigger: 'blur' },
  ],
  check_password: [
    { required: true, type: 'error' },
    { validator: rePassword, message: '密码不一致，请重新输入', trigger: 'blur' },
  ],
}

const confirm: FormProps['onSubmit'] = async ({ validateResult }) => {
  if (validateResult !== true) return
  loading.value = true
  try {
    await reqRegisterVerify(formData)
    router.push({ name: 'EmailConfirmation', query: { email: formData.email } })
  } catch (err: any) {
    requestErrorMsg(err?.message ?? '请求失败')
  }
  loading.value = false
}
</script>
