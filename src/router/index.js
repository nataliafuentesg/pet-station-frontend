import { createRouter, createWebHistory } from 'vue-router'
// Importamos tus componentes tal cual están en tus carpetas
import HomeView from '../components/views/HomeView.vue'
import Servicios from '../components/views/ServiciosView.vue'
import PetExpediente from '../components/profile/PetExpediente.vue'
import AgendarCita from '../components/appointments/AgendarCita.vue'
import ProfileSelector from '../components/home/ProfileSelector.vue'
import TiendaView from '../components/views/TiendaView.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/servicios', component: Servicios },
  { path: '/servicios/peluqueria', component: () => import('../components/views/PeluqueriaView.vue') },
  { path: '/servicios/medicina', component: () => import('../components/views/MedicinaView.vue') },
  { path: '/servicios/viajes', component: () => import('../components/views/ViajesView.vue') },
  { path: '/servicios/guarderia', component: () => import('../components/views/GuarderiaView.vue') },
  { path: '/seleccionar-perfil', component: ProfileSelector },
  { path: '/expediente', component: PetExpediente },
  { path: '/agendar', component: AgendarCita },
  { path: '/tienda', component: TiendaView },
  {
    path: '/tienda/producto/:id',
    name: 'ProductoDetalle',
    component: () => import('../components/views/ProductoDetalleView.vue'),
    props: true
  },
  {
  path: '/checkout',
  name: 'Checkout',
  component: () => import('../components/views/CheckoutView.vue')
}
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  // ESTA ES LA PIEZA CLAVE:
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      // Siempre vuelve arriba al cambiar de ruta
      return { top: 0, behavior: 'smooth' };
    }
  }
});

export default router