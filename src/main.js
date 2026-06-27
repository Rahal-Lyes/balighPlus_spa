import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import SvgIcon from '@jamescoyle/vue-icon'
import router from './router'
import './assets/main.css'

const app = createApp(App)
app.component('svg-icon', SvgIcon)
app.use(createPinia())
app.use(router)
app.mount('#app')