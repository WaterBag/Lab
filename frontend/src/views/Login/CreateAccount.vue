<template>
  <div>
    <div class="login-card">
      <div class="login-title">Create an account</div>

      <div
        class="gray-text"
        style="text-align: center; margin: 24px 0;"
      >
        Fill in your information.
      </div>

      <t-form
        label-align="top"
        :data="formData"
        :required-mark="false"
        @submit="login"
      >
        <t-form-item
          label="Username"
          name="username"
          :rules="[{ required: true, message: 'Username is required.' }]"
        >
          <t-input
            v-model="formData.username"
            class="form-input"
            placeholder="Enter your username"
          />
        </t-form-item>
        <t-form-item
          name="password"
          label="Password"
          :rules="[{ required: true, message: 'Password is required.' }]"
        >
          <t-input
            v-model="formData.password"
            placeholder="Enter your password"
            type="password"
            class="form-input"
          />
        </t-form-item>

        <!-- <t-checkbox
          v-model="formData.remember"
          label="记住账号14天"
          style="margin-bottom: 30px;"
        /> -->

        <t-form-item
          label-width="0"
          style="padding-top: 10px;"
        >
          <t-button
            theme="primary"
            type="submit"
            block
            size="large"
            content="Create account"
            :loading="loading"
          />
        </t-form-item>
      </t-form>
    </div>

    <div class="footer-text">
      Already have an account?
      <router-link :to="{ name: 'Login' }">
        <t-link
          theme="primary"
          hover="color"
          content="Log in"
        />
      </router-link>
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { FormProps } from 'tdesign-vue-next'

const loading = ref(false)

const formData = reactive({
  username: '',
  password: '',
})

const login: FormProps['onSubmit'] = async ({ validateResult }) => {
  if (validateResult !== true) return
  // todo 验证密码强度和规则
  console.log('Create an account')
}

</script>
