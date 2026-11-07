<script setup>
import { ref, reactive, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
    LayoutDashboard, ShoppingBag, CalendarDays, Pill, Package, PawPrint, Contact, Users, BellRing,
    MessagesSquare, Radar, Megaphone, ChartColumn, Stethoscope, Timer, FilePen, Activity, KeyRound,
    ShieldCheck, MessageCircle, Send, Instagram, PanelLeftClose, PanelLeftOpen, Menu, X, LogOut,
    Search, Bell, BellOff, Sun, Moon
} from 'lucide-vue-next';
import api from '@/api/axios';
import AdminStats from './AdminStats.vue';
import AdminOrders from './AdminOrders.vue';
import AdminPets from './AdminPets.vue';
import AdminCitas from './AdminCitas.vue';
import AdminUsers from './AdminUsers.vue';
import AdminInventory from './AdminInventory.vue';
import AdminFormulas from './AdminFormulas.vue';
import AdminClientes from './AdminClientes.vue';
import AdminRecordatorios from './AdminRecordatorios.vue';
import AdminLeads from './AdminLeads.vue';
import AdminMarketing from './AdminMarketing.vue';
import AdminWaAnalytics from './AdminWaAnalytics.vue';
import AdminVeterinarios from './AdminVeterinarios.vue';
import AdminHealth from './AdminHealth.vue';
import AdminJornada from './AdminJornada.vue';
import AdminFormularios from './AdminFormularios.vue';
import AdminAccesos from './AdminAccesos.vue';
import AdminChatWeb from './AdminChatWeb.vue';
import AdminSesiones from './AdminSesiones.vue';
import { suscribirNotificaciones } from '@/composables/usePushNotifications';
import { messaging, onMessage } from '@/firebase';

const notifActivas = ref(typeof Notification !== 'undefined' && Notification.permission === 'granted');
const activandoNotif = ref(false);

const activarNotificaciones = async () => {
  activandoNotif.value = true;
  const ok = await suscribirNotificaciones();
  notifActivas.value = ok;
  activandoNotif.value = false;
};

const route = useRoute();
const router = useRouter();
// Vacía hasta saber qué pestañas tiene este administrador, para no mostrar Resumen de paso
const currentTab = ref('');
const searchQuery = ref('');
const loading = ref(true);

const data = reactive({
    stats: { totalCitasHistorico: 0, ventasTotales: 0, totalPedidos: 0, ticketPromedio: 0, agendaFutura: [] },
    pedidos: [],
    mascotas: [],
    citas: [],
    productos: [],
    usuarios: [],
    formulas: [],
    leads: null
});

// Pestañas agrupadas para que la barra lateral se lea por temas
const todasLasTabs = [
    { id: 'stats', label: 'Resumen', icon: LayoutDashboard, grupo: 'Día a día' },
    { id: 'pedidos', label: 'Ventas', icon: ShoppingBag, grupo: 'Día a día' },
    { id: 'citas', label: 'Agenda', icon: CalendarDays, grupo: 'Día a día' },
    { id: 'formulas', label: 'Fórmulas', icon: Pill, grupo: 'Día a día' },
    { id: 'inventario', label: 'Inventario', icon: Package, grupo: 'Día a día' },
    { id: 'mascotas', label: 'Pacientes', icon: PawPrint, grupo: 'Clientes' },
    { id: 'clientes', label: 'Base Clientes', icon: Contact, grupo: 'Clientes' },
    { id: 'usuarios', label: 'Usuarios', icon: Users, grupo: 'Clientes' },
    { id: 'recordatorios', label: 'Recordatorios', icon: BellRing, grupo: 'Clientes' },
    { id: 'chat-web', label: 'Chat Web', icon: MessagesSquare, grupo: 'Clientes' },
    { id: 'leads', label: 'Leads', icon: Radar, grupo: 'Crecimiento' },
    { id: 'marketing', label: 'Marketing', icon: Megaphone, grupo: 'Crecimiento' },
    { id: 'wa-analytics', label: 'WA Analytics', icon: ChartColumn, grupo: 'Crecimiento' },
    { id: 'veterinarios', label: 'Veterinarios', icon: Stethoscope, grupo: 'Equipo' },
    { id: 'jornada', label: 'Productividad', icon: Timer, grupo: 'Equipo' },
    { id: 'formularios', label: 'Formularios', icon: FilePen, grupo: 'Equipo' },
    { id: 'health', label: 'Sistema', icon: Activity, grupo: 'Sistema' },
    { id: 'accesos', label: 'Accesos', icon: KeyRound, grupo: 'Sistema' },
    { id: 'sesiones', label: 'Sesiones', icon: ShieldCheck, grupo: 'Sistema' }
];

// Pestañas que usan el buscador de arriba; en las demás no se muestra
const TABS_CON_BUSCADOR = ['pedidos', 'citas'];

// WhatsApp e Instagram son páginas aparte que solo abre el admin completo
const enlacesSociales = [
    { to: '/admin/whatsapp', label: 'WhatsApp', icon: MessageCircle },
    { to: '/admin/instagram/dms', label: 'Instagram DMs', icon: Send },
    { to: '/admin/instagram', label: 'Instagram Auto-DM', icon: Instagram }
];

// Un administrador limitado solo ve las pestañas que se le asignaron; "Accesos" y "Sesiones" son solo del admin completo
const SOLO_ADMIN_COMPLETO = ['accesos', 'sesiones'];
const accesos = ref(null);
const tabs = computed(() => {
    if (!accesos.value) return [];
    return todasLasTabs.filter(t => SOLO_ADMIN_COMPLETO.includes(t.id) ? accesos.value.completo : accesos.value.secciones.includes(t.id));
});

async function iniciarPanel() {
    try {
        const { data } = await api.get('/admin/mis-accesos');
        accesos.value = data;
    } catch {
        // Servidor sin esta función todavía: solo existen admins completos
        accesos.value = { completo: true, secciones: todasLasTabs.map(t => t.id) };
    }
    // Vuelve a la pestaña de la URL o la última abierta, si este administrador la tiene
    const guardada = route.query.tab || leerGuardado(CLAVE_TAB);
    const inicial = tabs.value.some(t => t.id === guardada) ? guardada : (tabs.value[0]?.id || '');
    currentTab.value = inicial;
    if (!inicial) loading.value = false;
}

const tabActual = computed(() => tabs.value.find(x => x.id === currentTab.value));
const tabTitle = computed(() => tabActual.value?.label || 'Panel de Control');

const gruposTabs = computed(() => {
    const grupos = [];
    for (const t of tabs.value) {
        let g = grupos.find(x => x.nombre === t.grupo);
        if (!g) grupos.push(g = { nombre: t.grupo, tabs: [] });
        g.tabs.push(t);
    }
    return grupos;
});

const CLAVE_TAB = 'ps_admin_tab';
const CLAVE_BARRA = 'ps_admin_barra_colapsada';
const leerGuardado = (clave) => { try { return localStorage.getItem(clave); } catch { return null; } };
const guardar = (clave, valor) => { try { localStorage.setItem(clave, valor); } catch { /* navegador sin almacenamiento */ } };

function recordarTab(id) {
    if (!id) return;
    guardar(CLAVE_TAB, id);
    if (route.query.tab !== id) router.replace({ query: { ...route.query, tab: id } });
}

// Barra lateral: en PC se puede dejar solo con íconos; en celular es un menú que se abre y se cierra
const barraColapsada = ref(leerGuardado(CLAVE_BARRA) === '1');
const menuMovilAbierto = ref(false);
const alternarBarra = () => {
    barraColapsada.value = !barraColapsada.value;
    guardar(CLAVE_BARRA, barraColapsada.value ? '1' : '0');
};
const elegirTab = (id) => {
    currentTab.value = id;
    menuMovilAbierto.value = false;
};
watch(menuMovilAbierto, (abierto) => { document.body.style.overflow = abierto ? 'hidden' : ''; });
const cerrarConEscape = (e) => { if (e.key === 'Escape') menuMovilAbierto.value = false; };
onMounted(() => window.addEventListener('keydown', cerrarConEscape));
onBeforeUnmount(() => {
    window.removeEventListener('keydown', cerrarConEscape);
    document.body.style.overflow = '';
});

const modoOscuro = ref(document.documentElement.classList.contains('dark'));
const alternarTema = () => {
    window.dispatchEvent(new Event('ps-theme'));
    modoOscuro.value = document.documentElement.classList.contains('dark');
};

const fetchData = async () => {
    loading.value = true;
    try {
        if (currentTab.value === 'stats') {
            const res = await api.get('/admin/stats');
            data.stats = res.data;
            data.citas = res.data.agendaFutura || [];
        } else if (currentTab.value === 'pedidos') {
            const { data: p } = await api.get('/pedidos/admin/lista');
            data.pedidos = p || [];
            if (!data.productos.length) {
                const { data: pr } = await api.get('/admin/productos');
                data.productos = pr;
            }
        } else if (currentTab.value === 'mascotas') {
            // AdminPets maneja su propia carga y paginación
        } else if (currentTab.value === 'usuarios') {
            // AdminUsers maneja su propia carga y paginación
        } else if (currentTab.value === 'inventario') {
            const { data: pr } = await api.get('/admin/productos');
            data.productos = pr || [];
        } else if (currentTab.value === 'citas') {
            const { data: c } = await api.get('/admin/citas/todas');
            data.citas = c || [];
        } else if (currentTab.value === 'formulas') {
            const { data: f } = await api.get('/formulas/pendientes');
            data.formulas = f || [];
        } else if (currentTab.value === 'leads') {
            const { data: l } = await api.get('/leads');
            data.leads = l;
        }
    } catch (e) {
        console.error("Error en Dashboard:", e);
    } finally { loading.value = false; }
};

watch(currentTab, (id) => { recordarTab(id); fetchData(); });
onMounted(iniciarPanel);

// Con el panel abierto FCM no muestra nada por sí solo: el mensaje llega aquí y hay que mostrarlo
onMounted(() => {
  try {
    onMessage(messaging, async (payload) => {
      const n = payload.notification;
      if (!n || Notification.permission !== 'granted') return;
      const reg = await navigator.serviceWorker?.getRegistration('/firebase-cloud-messaging-push-scope');
      if (reg) reg.showNotification(n.title, { body: n.body, icon: '/images/logo-pet-station.png' });
      else new Notification(n.title, { body: n.body });
    });
  } catch { /* navegador sin soporte de push */ }
});

// LÓGICA DE LOGOUT DIRECTA (Sin depender de App.vue)
const doLogout = async () => {
    // Ese token deja de servir en el servidor, no solo en este navegador
    await api.post('/sesiones/salir', null, { timeout: 4000 }).catch(() => {});
    localStorage.removeItem('ps_token');
    localStorage.removeItem('ps_session');
    localStorage.removeItem('ps_active_pet');
    // Al forzar la recarga a la raíz, Vue limpia toda la memoria y cierra la sesión
    window.location.href = '/'; 
};
</script>

<template>
    <div class="flex min-h-screen bg-slate-50 dark:bg-[#080808] text-slate-900 dark:text-white">

        <!-- Celular: fondo oscuro detrás del menú abierto -->
        <Transition name="velo">
            <div v-if="menuMovilAbierto" class="lg:hidden fixed inset-0 z-[110] bg-black/40 backdrop-blur-[2px]" @click="menuMovilAbierto = false"></div>
        </Transition>

        <aside
            :class="[
                'fixed top-0 left-0 z-[120] lg:z-40 h-[100dvh] flex flex-col',
                'bg-white dark:bg-[#050505] border-r border-slate-200/80 dark:border-white/[0.06]',
                'transition-[transform,width] duration-200 ease-out w-64',
                menuMovilAbierto ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0',
                barraColapsada ? 'lg:w-[72px]' : 'lg:w-60'
            ]"
            aria-label="Menú del panel">

            <div :class="['flex items-center h-16 px-4 shrink-0', barraColapsada ? 'lg:justify-center lg:px-0' : 'justify-between']">
                <div class="text-lg font-[1000] uppercase italic tracking-tighter whitespace-nowrap">
                    <span class="text-ps-red">PS</span><span :class="['text-ps-blue dark:text-white', barraColapsada ? 'lg:hidden' : '']"> ADMIN</span>
                </div>
                <button @click="menuMovilAbierto = false" class="lg:hidden icon-btn" aria-label="Cerrar menú">
                    <X :size="18" />
                </button>
            </div>

            <nav class="flex-1 overflow-y-auto barra-scroll px-3 pb-4 space-y-5">
                <div v-for="g in gruposTabs" :key="g.nombre">
                    <p :class="['grupo-titulo', barraColapsada ? 'lg:hidden' : '']">{{ g.nombre }}</p>
                    <div v-if="barraColapsada" class="hidden lg:block h-px mx-3 mb-2 bg-slate-100 dark:bg-white/5"></div>
                    <button v-for="t in g.tabs" :key="t.id" @click="elegirTab(t.id)"
                        :title="barraColapsada ? t.label : undefined"
                        :aria-current="currentTab === t.id ? 'page' : undefined"
                        :class="['nav-item', currentTab === t.id ? 'nav-item-activo' : '', barraColapsada ? 'lg:justify-center lg:px-0' : '']">
                        <component :is="t.icon" :size="18" :stroke-width="1.75" class="shrink-0" />
                        <span :class="['truncate', barraColapsada ? 'lg:hidden' : '']">{{ t.label }}</span>
                    </button>
                </div>

                <div v-if="accesos?.completo">
                    <p :class="['grupo-titulo', barraColapsada ? 'lg:hidden' : '']">Social</p>
                    <div v-if="barraColapsada" class="hidden lg:block h-px mx-3 mb-2 bg-slate-100 dark:bg-white/5"></div>
                    <router-link v-for="s in enlacesSociales" :key="s.to" :to="s.to"
                        :title="barraColapsada ? s.label : undefined"
                        :class="['nav-item', barraColapsada ? 'lg:justify-center lg:px-0' : '']">
                        <component :is="s.icon" :size="18" :stroke-width="1.75" class="shrink-0" />
                        <span :class="['truncate', barraColapsada ? 'lg:hidden' : '']">{{ s.label }}</span>
                    </router-link>
                </div>
            </nav>

            <div class="shrink-0 border-t border-slate-100 dark:border-white/5 p-3 space-y-0.5">
                <button @click="alternarTema" :title="barraColapsada ? (modoOscuro ? 'Modo claro' : 'Modo oscuro') : undefined"
                    :class="['nav-item', barraColapsada ? 'lg:justify-center lg:px-0' : '']">
                    <component :is="modoOscuro ? Sun : Moon" :size="18" :stroke-width="1.75" class="shrink-0" />
                    <span :class="barraColapsada ? 'lg:hidden' : ''">{{ modoOscuro ? 'Modo claro' : 'Modo oscuro' }}</span>
                </button>
                <button @click="alternarBarra" :title="barraColapsada ? 'Expandir menú' : undefined"
                    :class="['nav-item hidden lg:flex', barraColapsada ? 'lg:justify-center lg:px-0' : '']">
                    <component :is="barraColapsada ? PanelLeftOpen : PanelLeftClose" :size="18" :stroke-width="1.75" class="shrink-0" />
                    <span :class="barraColapsada ? 'lg:hidden' : ''">Contraer menú</span>
                </button>
                <button @click="doLogout" :title="barraColapsada ? 'Salir' : undefined"
                    :class="['nav-item text-ps-red! hover:bg-ps-red/10!', barraColapsada ? 'lg:justify-center lg:px-0' : '']">
                    <LogOut :size="18" :stroke-width="1.75" class="shrink-0" />
                    <span :class="barraColapsada ? 'lg:hidden' : ''">Salir</span>
                </button>
            </div>
        </aside>

        <!-- La barra es fija (el contenedor de App.vue no deja usar sticky): se le deja su espacio -->
        <div :class="['flex-1 min-w-0 flex flex-col transition-[padding] duration-200 ease-out', barraColapsada ? 'lg:pl-[72px]' : 'lg:pl-60']">
            <!-- Celular: barra superior con el botón del menú -->
            <header class="lg:hidden sticky top-0 z-[100] flex items-center gap-3 h-14 px-3 bg-white/90 dark:bg-[#050505]/90 backdrop-blur border-b border-slate-200/80 dark:border-white/[0.06]">
                <button @click="menuMovilAbierto = true" class="icon-btn" aria-label="Abrir menú">
                    <Menu :size="20" />
                </button>
                <p class="flex-1 min-w-0 truncate text-sm font-bold text-ps-blue dark:text-white">{{ tabTitle }}</p>
                <span class="text-sm font-[1000] uppercase italic tracking-tighter"><span class="text-ps-red">PS</span></span>
            </header>

            <main class="flex-1 w-full p-4 md:p-8 pb-24 overflow-x-hidden">
                <header class="mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div class="hidden lg:block">
                        <p class="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-white/40">{{ tabActual?.grupo || 'Panel' }}</p>
                        <h1 class="text-2xl font-extrabold tracking-tight text-ps-blue dark:text-white">{{ tabTitle }}</h1>
                    </div>
                    <div class="flex gap-2 items-center w-full sm:w-auto sm:ml-auto">
                        <div v-if="TABS_CON_BUSCADOR.includes(currentTab)" class="relative flex-1 sm:w-72">
                            <Search :size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input v-model="searchQuery" placeholder="Buscar…" class="admin-input-header" />
                        </div>
                        <button @click="activarNotificaciones" :disabled="notifActivas || activandoNotif"
                            :title="notifActivas ? 'Notificaciones activas' : 'Activar notificaciones'"
                            :class="['shrink-0 h-10 flex items-center gap-2 px-3 rounded-xl text-xs font-semibold border transition-colors',
                                notifActivas
                                    ? 'border-transparent text-emerald-600 dark:text-emerald-400 cursor-default'
                                    : 'border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-ps-blue dark:text-white hover:border-ps-blue dark:hover:border-white/30']">
                            <component :is="notifActivas ? Bell : BellOff" :size="16" />
                            <span :class="notifActivas ? 'hidden md:inline' : ''">{{ notifActivas ? 'Avisos activos' : activandoNotif ? 'Activando…' : 'Activar avisos' }}</span>
                        </button>
                    </div>
                </header>

                <div v-if="loading" class="text-center py-32">
                    <div class="w-8 h-8 border-[3px] border-ps-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p class="text-xs font-medium text-slate-400 dark:text-white/40">Cargando…</p>
                </div>

                <template v-else>
                    <Transition name="fade" mode="out-in">
                        <div :key="currentTab">
                            <AdminStats v-if="currentTab === 'stats'" :stats="data.stats" />
                            <AdminOrders v-if="currentTab === 'pedidos'" :orders="data.pedidos" :productos="data.productos" :searchQuery="searchQuery" @refresh="fetchData" />
                            <AdminPets v-if="currentTab === 'mascotas'" :mascotas="data.mascotas" :searchQuery="searchQuery" />
                            <AdminCitas v-if="currentTab === 'citas'" :citas="data.citas" :searchQuery="searchQuery" />
                            <AdminUsers v-if="currentTab === 'usuarios'" :usuarios="data.usuarios" :searchQuery="searchQuery" />
                            <AdminInventory v-if="currentTab === 'inventario'" :productos="data.productos" :searchQuery="searchQuery" @refresh="fetchData" />
                            <AdminFormulas v-if="currentTab === 'formulas'" :formulas="data.formulas" @refresh="fetchData" />
                            <AdminClientes v-if="currentTab === 'clientes'" />
                            <AdminRecordatorios v-if="currentTab === 'recordatorios'" />
                            <AdminLeads v-if="currentTab === 'leads'" :data="data.leads" />
                            <AdminMarketing v-if="currentTab === 'marketing'" />
                            <AdminVeterinarios v-if="currentTab === 'veterinarios'" />
                            <AdminWaAnalytics v-if="currentTab === 'wa-analytics'" />
                            <AdminJornada v-if="currentTab === 'jornada'" :solo-lectura="!accesos?.completo" />
                            <AdminFormularios v-if="currentTab === 'formularios'" />
                            <AdminHealth v-if="currentTab === 'health'" />
                            <AdminChatWeb v-if="currentTab === 'chat-web'" />
                            <AdminAccesos v-if="currentTab === 'accesos'" />
                            <AdminSesiones v-if="currentTab === 'sesiones'" />
                        </div>
                    </Transition>
                </template>
            </main>
        </div>
    </div>
</template>

<style scoped>
@reference "../../../style.css";

/* En una capa para que las utilidades (hidden, lg:hidden…) puedan ganarles */
@layer components {
    .grupo-titulo {
        @apply px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-white/30;
    }

    .nav-item {
        @apply relative w-full flex items-center gap-3 px-3 h-10 lg:h-9 rounded-lg whitespace-nowrap overflow-hidden text-[13px] font-medium text-left
            text-slate-600 dark:text-white/60 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-ps-blue dark:hover:text-white transition-colors;
    }

    .nav-item-activo {
        @apply bg-ps-blue/[0.07] text-ps-blue font-semibold dark:bg-white/10 dark:text-white;
    }

    .nav-item-activo::before {
        content: '';
        @apply absolute -left-3 top-1.5 bottom-1.5 w-[3px] rounded-r-full bg-ps-red;
    }

    .icon-btn {
        @apply w-9 h-9 flex items-center justify-center rounded-lg text-slate-600 dark:text-white/70 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors;
    }

    .admin-input-header {
        @apply w-full h-10 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 pl-9 pr-3 rounded-xl text-sm
            placeholder:text-slate-400 focus:border-ps-blue dark:focus:border-white/40 outline-none transition-colors;
    }
}

/* Scrollbar sutil */
.barra-scroll::-webkit-scrollbar {
    height: 4px;
    width: 4px;
}
.barra-scroll::-webkit-scrollbar-track {
    background: transparent;
}
.barra-scroll::-webkit-scrollbar-thumb {
    @apply bg-slate-300/60 dark:bg-white/10 rounded-full;
}

/* Animación sutil al cambiar de pestaña */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(6px);
}

.velo-enter-active,
.velo-leave-active {
  transition: opacity 0.2s ease;
}
.velo-enter-from,
.velo-leave-to {
  opacity: 0;
}
</style>
