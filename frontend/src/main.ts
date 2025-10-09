import '@/common/styles/index.scss'
import App from './App.vue'
import { setupRouter } from './router'
import { createPinia } from 'pinia'
import { setupUI } from './common/plugins/ui'

import { setupTool } from './common/plugins/tool'
import { presetup } from './presetup'

const app = createApp(App)
// 确保Store和i18n最先挂载
app.use(createPinia())
setupUI(app)
setupTool(app)

const setupApp = async () => {
  await presetup()

  setupRouter(app)
  app.mount('#app--jp')
}

setupApp()
