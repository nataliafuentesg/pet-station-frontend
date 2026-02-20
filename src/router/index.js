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
  { 
    path: '/', 
    name: 'Home', 
    component: HomeView,
    meta: {
      title: 'Veterinaria en Chía - Especialistas y Pet Shop | Pet Station',
      description: 'Clínica veterinaria líder en Chía. Medicina interna, cirugía, peluquería, tienda de mascotas y trámites de viaje internacional. Tu aliado en salud animal.'
    }
  },
  { 
    path: '/servicios', 
    component: Servicios,
    meta: {
      title: 'Servicios Veterinarios Integrales en Chía | Pet Station',
      description: 'Portafolio completo de salud animal: Medicina interna, cirugía, laboratorio clínico e imágenes diagnósticas en Chía.'
    }
  },
  { 
    path: '/servicios/peluqueria', 
    component: () => import('../components/views/PeluqueriaView.vue'),
    meta: {
      title: 'Peluquería Canina y Spa de Mascotas en Chía | Pet Station',
      description: 'Grooming profesional y baños medicados para perros y gatos en Chía. Estética animal con los mejores productos dermatológicos.'
    }
  },
  { 
    path: '/servicios/medicina', 
    component: () => import('../components/views/MedicinaView.vue'),
    meta: {
      title: 'Consultas Médicas y Especialistas Veterinarios Chía | Pet Station',
      description: 'Atención médica experta: Vacunación, desparasitación, cirugía y medicina interna para tu mascota en Chía y Cundinamarca.'
    }
  },
  { 
    path: '/servicios/viajes', 
    component: () => import('../components/views/ViajesView.vue'),
    meta: {
      title: 'Viajar con Mascotas a USA y Europa - Trámites ICA | Pet Station',
      description: 'Expertos en certificados de viaje internacional, serología de rabia, microchips y permisos CDC/ICA para exportación de mascotas.'
    }
  },
  { 
    path: '/servicios/guarderia', 
    component: () => import('../components/views/GuarderiaView.vue'),
    meta: {
      title: 'Guardería Canina Campestre y Hotel en Chía | Pet Station',
      description: 'El mejor cuidado para tu perro mientras no estás. Zonas verdes, recreación dirigida y supervisión veterinaria constante.'
    }
  },
  { 
    path: '/seleccionar-perfil', 
    component: ProfileSelector,
    meta: { title: 'Selecciona tu Mascota | Pet Station' }
  },
  { 
    path: '/expediente', 
    component: PetExpediente,
    meta: { title: 'Historia Clínica y Expediente Digital | Pet Station' }
  },
  { 
    path: '/agendar', 
    component: AgendarCita,
    meta: {
      title: 'Agendar Cita Veterinaria Online Chía | Pet Station',
      description: 'Reserva tu cita médica, baño o servicio de guardería fácil y rápido. Disponibilidad en tiempo real.'
    }
  },
  { 
    path: '/tienda', 
    component: TiendaView,
    meta: {
      title: 'Pet Shop Online Chía - Alimento Premium y Farmacia | Pet Station',
      description: 'Tienda de mascotas con domicilio en Chía. Encuentra Royal Canin, Pro Plan, Bravecto y farmacia veterinaria especializada.'
    }
  },
  {
    path: '/tienda/producto/:id',
    name: 'ProductoDetalle',
    component: () => import('../components/views/ProductoDetalleView.vue'),
    props: true,
    meta: { 
      title: 'Detalle de Producto - Pet Shop Chía | Pet Station',
      description: 'Compra los mejores productos para tu mascota con entrega rápida en Chía y alrededores.'
    }
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: () => import('../components/views/CheckoutView.vue'),
    meta: { title: 'Finalizar Compra Segura | Pet Station' }
  },
  { 
    path: '/seleccionar-perfil', 
    component: ProfileSelector,
    meta: { requiresAuth: true, title: 'Selecciona tu Mascota | Pet Station' }
  },
  { 
    path: '/expediente', 
    component: PetExpediente,
    meta: { requiresAuth: true, title: 'Historia Clínica | Pet Station' }
  },
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { 
      requiresAuth: true, 
      requiresAdmin: true,
      title: 'Panel Administrativo | Pet Station' 
    }
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: () => import('@/components/auth/ResetPassword.vue'),
    meta: { title: 'Recuperar Contraseña | Pet Station' }
  },
  {
    path: '/privacy',
    name: 'Privacy',
    component: PrivacyView,
    meta: { title: 'Política de Privacidad | Pet Station' }
  },
  {
    path: '/terms',
    name: 'Terms',
    component: TermsView,
    meta: { title: 'Términos y Condiciones | Pet Station' }
  },
  { 
    path: '/:pathMatch(.*)*', 
    redirect: '/' 
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
  document.title = to.meta.title || 'Pet Station - Veterinaria en Chía';
  const token = localStorage.getItem('ps_token');
  const sessionStr = localStorage.getItem('ps_session');
  const session = sessionStr ? JSON.parse(sessionStr) : null;
  const userRol = session?.tutor?.rol || session?.rol;

  if (to.meta.requiresAuth && !token) {
    return next({ path: '/', query: { login_required: 'true' } });
  }

  if (to.meta.requiresAdmin && (userRol !== 'ROLE_ADMIN' && userRol !== 'ADMIN')) {
    console.error("ACCESO PROHIBIDO: Rol insuficiente.");
    return next('/');
  }

  next();
});

router.afterEach((to) => {
  if (window.dataLayer) {
    window.dataLayer.push({
      event: 'pageview',
      pagePath: to.fullPath,
      pageTitle: to.meta.title || document.title
    });
  }
});

export default router