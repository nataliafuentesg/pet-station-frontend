import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
const app = createApp(App)
const pinia = createPinia() // 2. Crear la instancia

app.use(pinia) // 3. Usarla
app.mount('#app')
