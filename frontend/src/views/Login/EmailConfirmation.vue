<template>
  <div>
    <div class="login-card">
      <div
        class="login-title"
        style="margin: 0;font-weight: 600;"
      >
        邮箱验证
      </div>

      <div
        style="text-align: left;font-weight: 600; margin: 24px 0;"
      >
        确认就是你本人。
      </div>

      <div style="text-align: left;">
        <div style="color: #000;opacity: 0.4">
          确保你的安全——这是我们所做的。<br />
          我们已发送了一封带有链接的邮件至
        </div>
        <span style="font-weight: 600;">{{ email }}</span>.(<t-link
          theme="primary"
          hover="color"
          content="不是你？"
        />)
        <br />
        <div style="margin: 16px 0;color: #000;opacity: 0.4">
          请前往你的邮箱确认邮件并按照提示操作
        </div>
      </div>
      <t-button
        theme="primary"
        type="submit"
        block
        size="large"
        content="登录"
        @click="router.push('router')"
      />
      <t-button
        theme="primary"
        type="submit"
        variant="outline"
        block
        size="large"
        style="margin: 16px 0;"
        :content="buttonText"
        :loading="btnLoading"
        @click="reSend"
      />

      <div style="color: #000;opacity: 0.4">
        <div>没有收到邮件？</div>
        <div>· 邮件可能需要长达5分钟才能到达。</div>
        <div>· 检查你的垃圾邮件文件夹。</div>
      </div>
    </div>

    <div class="footer-text">
      已有账户？
      <router-link :to="{ name: 'Login' }">
        <t-link
          theme="primary"
          hover="color"
          content="登录"
        />
      </router-link>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router'
import { requestErrorMsg } from '@/common/plugins/request'
import { reqResendEmail } from '@/api/Users'
import { MessagePlugin } from 'tdesign-vue-next'

const route = useRoute()
const router = useRouter()

const email = route.query.email as string || ''

const btnLoading = ref(false)
const isDisabled = ref(false)
const buttonText = ref('重新发送邮件')
let timer: any = null

const reSend = async () => {
  if (isDisabled.value) return
  isDisabled.value = true
  let countdown = 60
  buttonText.value = `${countdown}S 重试`

  timer = setInterval(() => {
    countdown--
    if (countdown > 0) {
      buttonText.value = `${countdown}S 重试`
    } else {
      buttonText.value = '重新发送邮件'
      isDisabled.value = false
      clearInterval(timer!)
      timer = null
    }
  }, 1000)

  btnLoading.value = true
  try {
    const data: any = await reqResendEmail({ email })
    if (data.status === 'succeed') {
      MessagePlugin.success(data.message || '邮件已发送，请前往邮箱客户端查收')
    }
  } catch (err: any) {
    requestErrorMsg(err.message)
  }
  btnLoading.value = false
}

</script>
