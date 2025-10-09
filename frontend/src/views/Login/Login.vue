<template>
  <div>
    <div class="login-card">
      <div class="login-title">使用您的用户名登录</div>

      <t-form
        ref="loginForm"
        label-align="top"
        :data="formData"
        :required-mark="false"
        @submit="login"
      >
        <t-form-item
          label="用户名"
          name="username"
          :rules="[{ required: true }]"
        >
          <t-input
            v-model="formData.username"
            class="form-input"
            placeholder="请输入用户名"
          />
        </t-form-item>
        <t-form-item
          label="密码"
          name="password"
          :rules="[{ required: true }]"
        >
          <template #label>
            <div style="display: flex; justify-content: space-between;">
              <span>密码</span>
              <router-link
                :to="{ name: 'ForgetVerify' }"
                tabindex="-1"
              >
                <t-link
                  theme="primary"
                  hover="color"
                  content="忘记密码？"
                />
              </router-link>
            </div>
          </template>
          <t-input
            v-model="formData.password"
            placeholder="请输入密码"
            type="password"
            class="form-input"
          />
        </t-form-item>

        <t-form-item
          label-width="0"
          style="padding-top: 4px;"
        >
          <t-button
            theme="primary"
            type="submit"
            block
            size="large"
            content="登录"
            :loading="loading"
          />
        </t-form-item>
      </t-form>

      <!-- <t-divider :content="t('或')" />

      <div class="or-container">
        <a
          class="opt-btn flex-xy-center"
          href="/users/login"
        >
          <img
            :src="OA"
            alt="OA"
          />&nbsp;&nbsp;{{ t('使用 {name} 登录', { name: 'OA' }) }}
        </a>
        <a
          href="https://login.iam.intlgame.com/login?goto=https%3A%2F%2Flogin.iam.intlgame.com%2Fsso%2Ftn-869bbe512bb54c14921d85c69ae839dc%2Fai-609207d7c4f14f5ba6714fe4692ab80e%2Fsso-123&cmp=a"
          class="opt-btn flex-xy-center"
        >
          <img
            :src="YUFU"
            alt="Yufu"
          />&nbsp;&nbsp;{{ t('使用 {name} 登录', { name: 'YUFU' }) }}
        </a>
        <div class="opt-btn flex-xy-center">
          <MailIcon style="font-size: 14px;" />&nbsp;&nbsp;Log in with Email
        </div>
      </div> -->
    </div>

    <div class="footer-text">
      还没有账号？
      <router-link :to="{ name: 'SignUp' }">
        <t-link
          theme="primary"
          hover="color"
          content="注册"
        />
      </router-link>
    </div><div class="footer-text">
      忘记密码？
      <router-link :to="{ name: 'ForgetVerify' }">
        <t-link
          theme="primary"
          hover="color"
          content="重置密码"
        />
      </router-link>
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { FormProps } from 'tdesign-vue-next'
import { useRouter, useRoute } from 'vue-router'
import { presetup } from '@/presetup'
import { requestErrorMsg } from '@/common/plugins/request'
import { reqSelfLogin } from '@/api/Users'
// import { validateEmail } from '@/common/utils'
import isEmail from 'validator/es/lib/isEmail'
// import OA from '@/assets/icons/OA.png'
// import YUFU from '@/assets/icons/YUFU.png'
// import { useUserStore } from '@/stores/User'
const router = useRouter()
const route = useRoute()
// if (useUserStore().isLogin) router.replace('/')
// const form = ref<FormInstanceFunctions>()

const loading = ref(false)

let username = route.query.email as string || ''

if (!isEmail(username)) {
  username = ''
}
const formData = reactive({
  username,
  password: '',
  // email: '',
  // remember: true,
})

// const emailSuffix = ['@qq.com', '@163.com', '@gmail.com']
// const emailOptions = computed<AutoCompleteProps['options']>(() => {
//   const emailPrefix = formData.email.split('@')[0]
//   if (!emailPrefix) return []
//   return emailSuffix.map((suffix) => emailPrefix + suffix)
// })

const login: FormProps['onSubmit'] = async ({ validateResult }) => {
  if (validateResult !== true) return
  loading.value = true
  try {
    await reqSelfLogin(formData)
    await presetup()
    router.replace('/')
  } catch (err: any) {
    console.log(err)
    requestErrorMsg(err.message)
  }
  loading.value = false
}

// const yufuLogin = async () => { window.location.href = '/users/login' }

</script>
