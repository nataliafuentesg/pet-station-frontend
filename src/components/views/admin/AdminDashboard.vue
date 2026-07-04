<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue';
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
import { suscribirNotificaciones } from '@/composables/usePushNotifications';

const notifActivas = ref(Notification.permission === 'granted');
const activandoNotif = ref(false);

const activarNotificaciones = async () => {
  activandoNotif.value = true;
  const ok = await suscribirNotificaciones();
  notifActivas.value = ok;
  activandoNotif.value = false;
};

const currentTab = ref('stats');
const searchQuery = ref('');
const loading = ref(false);

const data = reactive({
    stats: { totalCitasHistorico: 0, ventasTotales: 0, totalPedidos: 0, ticketPromedio: 0, agendaFutura: [] },
    pedidos: [],
    mascotas: [],
    citas: [],
    productos: [],
    usuarios: [],
    formulas: []
});

// Definimos los tabs con íconos para que se vean bien en el celular
const tabs = [
    { id: 'stats', label: 'Resumen', icon: '📊' },
    { id: 'pedidos', label: 'Ventas', icon: '🛍️' },
    { id: 'formulas', label: 'Fórmulas', icon: '🧾' },
    { id: 'mascotas', label: 'Pacientes', icon: '🐾' },
    { id: 'citas', label: 'Agenda', icon: '📅' },
    { id: 'usuarios', label: 'Usuarios', icon: '👥' },
    { id: 'clientes', label: 'Base Clientes', icon: '🗂️' },
    { id: 'inventario', label: 'Inventario', icon: '📦' },
    { id: 'recordatorios', label: 'Recordatorios', icon: '🔔' }
];

const tabTitle = computed(() => {
    const t = tabs.find(x => x.id === currentTab.value);
    return t ? t.label : 'Panel de Control';
});

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
        }
    } catch (e) {
        console.error("Error en Dashboard:", e);
    } finally { loading.value = false; }
};

watch(currentTab, fetchData);
onMounted(fetchData);

const tabClass = (active) => [
    'flex items-center gap-3 px-4 py-4 rounded-2xl text-left text-[10px] font-black uppercase tracking-widest transition-all duration-300 w-full',
    active ? 'bg-ps-red text-white shadow-xl shadow-ps-red/20 translate-x-2 italic' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-ps-blue'
];

// LÓGICA DE LOGOUT DIRECTA (Sin depender de App.vue)
const doLogout = () => {
    localStorage.removeItem('ps_token');
    localStorage.removeItem('ps_session');
    localStorage.removeItem('ps_active_pet');
    // Al forzar la recarga a la raíz, Vue limpia toda la memoria y cierra la sesión
    window.location.href = '/'; 
};
</script>

<template>
    <div class="flex flex-col lg:flex-row min-h-screen bg-slate-50 dark:bg-[#080808] text-slate-900 dark:text-white">
        
        <header class="lg:hidden flex flex-col bg-white dark:bg-[#050505] border-b border-slate-200 dark:border-white/10 sticky top-0 z-[100] shadow-sm">
            <div class="flex items-center justify-between p-4 border-b border-slate-100 dark:border-white/5">
                <div class="text-xl font-[1000] uppercase italic tracking-tighter">
                    <span class="text-ps-red">PS</span> <span class="text-ps-blue dark:text-white">ADMIN</span>
                </div>
                <button @click="doLogout" class="text-[9px] font-black uppercase tracking-widest text-[#DE1F27] bg-[#DE1F27]/10 px-4 py-2 rounded-xl flex items-center gap-1 active:scale-95 transition-all">
                    <span>🚪</span> Salir
                </button>
            </div>
            
            <nav class="flex gap-2 overflow-x-auto custom-scrollbar p-3">
                <button v-for="t in tabs" :key="t.id" @click="currentTab = t.id"
                    class="px-4 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest whitespace-nowrap flex items-center gap-2 transition-all"
                    :class="currentTab === t.id ? 'bg-[#152C77] text-white shadow-lg shadow-[#152C77]/20 italic' : 'bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-[#152C77]'">
                    <span class="text-sm">{{ t.icon }}</span> {{ t.label }}
                </button>
            </nav>
        </header>

        <aside class="w-64 border-r border-slate-200 dark:border-white/10 p-6 flex flex-col gap-8 hidden lg:flex bg-white dark:bg-[#050505] shrink-0 sticky top-0 h-screen z-40">
            <div class="text-3xl font-[1000] uppercase italic tracking-tighter pt-4">
                <span class="text-ps-red">PS</span> <span class="text-ps-blue dark:text-white">ADMIN</span>
            </div>
            
            <nav class="flex flex-col gap-2 overflow-y-auto custom-scrollbar pr-2">
                <button v-for="t in tabs" :key="t.id" @click="currentTab = t.id" :class="tabClass(currentTab === t.id)">
                    <span class="text-lg w-6 text-center">{{ t.icon }}</span> 
                    <span>{{ t.label }}</span>
                </button>
            </nav>

            <div class="mt-auto pt-6 border-t border-slate-100 dark:border-white/5 space-y-4">
                <button @click="doLogout" class="w-full flex items-center gap-3 px-4 py-4 rounded-2xl text-left text-[10px] font-black uppercase tracking-widest text-[#DE1F27] hover:bg-[#DE1F27]/10 transition-all duration-300">
                    <span class="text-lg w-6 text-center">🚪</span> Salir de la Torre
                </button>
                <p class="text-[8px] font-black opacity-30 uppercase tracking-[0.3em] px-4">PetStation v2.0</p>
            </div>
        </aside>

        <main class="flex-1 p-4 md:p-12 pb-32 w-full overflow-x-hidden">
            <header class="mb-10 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
                <div>
                    <h1 class="text-4xl md:text-5xl font-[1000] uppercase italic leading-none text-[#152C77] dark:text-white">{{ tabTitle }}</h1>
                    <p class="text-xs font-bold opacity-50 uppercase tracking-widest mt-2 text-[#DE1F27]">Torre de control PetStation</p>
                </div>
                <div class="flex gap-3 items-center w-full lg:w-auto">
                    <button @click="activarNotificaciones" :disabled="notifActivas || activandoNotif"
                        :class="[
                            'px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all',
                            notifActivas
                                ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400 cursor-default'
                                : 'bg-[#152C77] text-white hover:bg-[#DE1F27] active:scale-95'
                        ]">
                        {{ notifActivas ? '🔔 Notificaciones activas' : activandoNotif ? '...' : '🔔 Activar notificaciones' }}
                    </button>
                    <div class="relative w-full lg:w-80">
                        <span class="absolute left-4 top-1/2 -translate-y-1/2 opacity-50">🔍</span>
                        <input v-model="searchQuery" placeholder="BUSCAR..." class="admin-input-header" />
                    </div>
                </div>
            </header>

            <div v-if="loading" class="text-center py-32">
                <div class="w-10 h-10 border-4 border-[#DE1F27] border-t-transparent rounded-full animate-spin mx-auto mb-6 shadow-xl"></div>
                <p class="font-black uppercase text-[10px] tracking-widest text-[#152C77] dark:text-white animate-pulse italic">Sincronizando Base de Datos...</p>
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
                    </div>
                </Transition>
            </template>
        </main>
    </div>
</template>

<style scoped>
@reference "../../../style.css";

/* Evita que el scroll del main afecte al sidebar en PC */
aside {
    z-index: 40;
}

.admin-input-header {
    @apply w-full bg-white dark:bg-[#050505] border-2 border-slate-200 dark:border-white/10 p-4 pl-12 rounded-2xl text-[10px] font-black uppercase tracking-widest focus:border-[#152C77] dark:focus:border-white outline-none transition-all shadow-sm;
}

/* Scrollbar sutil y elegante */
.custom-scrollbar::-webkit-scrollbar {
    height: 4px;
    width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
    @apply bg-[#DE1F27]/30 rounded-full;
}

/* Animación sutil al cambiar de pestaña */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>