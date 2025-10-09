<template>
  <Card>
    <t-form :data="form">
      <t-form-item label="Url">
        <t-input v-model="form.url" />
      </t-form-item>
      <t-form-item label="Method">
        <t-input v-model="form.method" />
      </t-form-item>
      <t-form-item label="Query">
        <t-textarea v-model="form.query" />
      </t-form-item>
      <t-form-item label="Data">
        <t-textarea v-model="form.data" />
      </t-form-item>

      <t-button
        content="发送"
        :loading="loading"
        @click="send"
      />
    </t-form>
    <br />
    <br />
    <t-button
      content="aaa"
      @click="test"
    />
    <br />
    <br />
  </Card>
</template>

<script lang="tsx" setup>
import axios from 'axios'
defineOptions({ name: 'TestPage' })
// console.log(a)
const test = () => {
  // const htmlStr = `<img src="${a}"></img>`
  // const div = document.createElement('div')
  // div.innerHTML = htmlStr
  // document.body.appendChild(div)

  // window.open('/webhook#10000')
  // console.log(a)
}

// * ------------------------

const form = reactive({
  url: '',
  query: '{}',
  data: '{}',
  method: 'GET' as any,
})

const loading = ref(false)

const send = async () => {
  loading.value = true
  try {
    const url = form.url.trim()
    const params = JSON.parse(form.query.trim())
    const data = JSON.parse(form.data.trim())
    const method = form.method.trim()
    await axios({ url, params, data, method })
  } catch (err: any) {
    console.log(err.message)
  }
  loading.value = false
}

</script>
