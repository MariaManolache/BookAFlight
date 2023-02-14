import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { Vue3Mq } from "vue3-mq";

createApp(App).use(store).use(router).use(ElementPlus).use(Vue3Mq, {
  preset: 'devices'
})
  .mount('#app')
