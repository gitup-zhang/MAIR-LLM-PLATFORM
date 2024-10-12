import { createApp } from 'vue'
import { createPinia } from 'pinia'
// 引入 Pinia 持久化组件
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'

import ArcoVue from '@arco-design/web-vue'
import '@arco-design/web-vue/dist/arco.css'
import ArcoVueIcon from '@arco-design/web-vue/es/icon'
// 引入 UI 库
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/display.css'

// 引入国际化组件
import i18n from "@/i18n"

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)
app.use(ArcoVueIcon)
app.use(ArcoVue);
app.use(ElementPlus)
// 引入 Windi CSS
import 'virtual:windi.css'
app.use(i18n)
app.use(pinia)
app.use(router)

app.mount('#app')
