import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../components/views/HomeView.vue'
import Servicios from '../components/views/ServiciosView.vue'
import PetExpediente from '../components/profile/PetExpediente.vue'
import AgendarCita from '../components/appointments/AgendarCita.vue'
import ProfileSelector from '../components/home/ProfileSelector.vue'
import TiendaView from '../components/views/TiendaView.vue'
import AdminDashboard from '../components/views/admin/AdminDashboard.vue';
import PrivacyView from '../components/views/legal/PrivacyView.vue';
import TermsView from '../components/views/legal/TermsView.vue';

const routes = [
  { path: '/', name: 'Home', component: HomeView },
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
  },
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { requiresAdmin: true } // Importante
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: () => import('@/components/auth/ResetPassword.vue')
  },
  {
    path: '/privacy',
    name: 'Privacy',
    component: PrivacyView
  },
  {
    path: '/terms',
    name: 'Terms',
    component: TermsView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0, behavior: 'smooth' };
  }
});

router.beforeEach((to, from, next) => {
  const sessionStr = localStorage.getItem('ps_session');
  if (!sessionStr) {
    return to.meta.requiresAdmin ? next('/') : next();
  }

  const session = JSON.parse(sessionStr);
  const userRol = session.tutor?.rol || session.rol;

  if (to.meta.requiresAdmin) {
    if (userRol === 'ROLE_ADMIN' || userRol === 'ADMIN') {
      next();
    } else {
      console.error("ACCESO PROHIBIDO: Rol insuficiente.");
      next('/');
    }
  } else {
    next();
  }
});

export default router