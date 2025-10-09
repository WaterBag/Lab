import type { App } from 'vue'
import { Icon, addAPIProvider } from '@iconify/vue'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import 'tdesign-vue-next/es/style/index.css'
// import 'tdesign-vue-next/dist/reset.css'
import '../styles/tailwind-compat.css'
import { Card } from 'tdesign-vue-next'

import VxeTable from 'vxe-table'
import 'vxe-table/lib/style.css'
import VxeUI from 'vxe-pc-ui'
import 'vxe-pc-ui/lib/style.css'

NProgress.configure({ showSpinner: false })

// 图标检索页 https://icon.devops.tencent-cep.com/
addAPIProvider('', { resources: ['https://iconapi.devops.tencent-cep.com'] })

VxeTable.VxeUI.setConfig({
  table: {
    scrollY: { enabled: true },
    showOverflow: 'tooltip',
    round: true,
    rowConfig: { isHover: true },
  },
})

console.log(VxeUI)
console.log(VxeTable)

export const setupUI = (app: App) => {
  app
    .use(VxeUI)
    .use(VxeTable)
    .component('Icon', Icon)
    .component('TCard', Card) // 因为全局自定义Card直接使用了t-card的类目，需要样式，直接全局引用，否则按需加载时可能在没有使用t-card的页面丢失Card样式
  // app.use(LoadingPlugin)
  // TDesign使用自动按需引入时，组件原型上的install的方法如$message还需要单独use一下
  // app.use(MessagePlugin).use(DialogPlugin).use(NotifyPlugin).use(LoadingPlugin)
}
