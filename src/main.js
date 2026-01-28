import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router'
import vue3GoogleLogin from 'vue3-google-login'

const app = createApp(App)
const pinia = createPinia() 
app.use(vue3GoogleLogin, {
  clientId: '971218408628-t815e4am6a057ol1gunaq7intmadu47c.apps.googleusercontent.com'
})

app.use(pinia) 
app.use(router)
app.mount('#app')
