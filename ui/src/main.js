import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// import BalmUI from 'balm-ui'; // Official Google Material Components
// import BalmUIPlus from 'balm-ui/dist/balm-ui-plus'; // BalmJS Team Material Components
// import UiButton from 'balm-ui/components/button';
// import $alert from 'balm-ui/plugins/alert';
// import UiTextfieldComponents from 'balm-ui/components/textfield';

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { Vue3Mq } from "vue3-mq"; //responsive interface
//const Vue3Mq = require('vue3-mq')

createApp(App).use(store).use(router).use(ElementPlus).use(Vue3Mq, {
  preset: 'devices'
})
  // .use(BalmUI,  {
  //     $theme: {

  //     }
  //   })
  //   .use(BalmUIPlus).use(UiButton).use(UiTextfieldComponents)
  .mount('#app')
