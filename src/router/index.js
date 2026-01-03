import { createRouter, createWebHistory } from 'vue-router'
// Importamos tus componentes tal cual están en tus carpetas
import HomeView from '../components/views/HomeView.vue'
import Servicios from '../components/views/ServiciosView.vue'
import PetExpediente from '../components/profile/PetExpediente.vue'
import AgendarCita from '../components/appointments/AgendarCita.vue'
import ProfileSelector from '../components/home/ProfileSelector.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/servicios', component: Servicios },
  { path: '/seleccionar-perfil', component: ProfileSelector },
  { path: '/expediente', component: PetExpediente },
  { path: '/agendar', component: AgendarCita }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router