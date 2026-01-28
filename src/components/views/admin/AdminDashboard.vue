<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue';
import api from '@/api/axios';
import AdminStats from './AdminStats.vue';
import AdminOrders from './AdminOrders.vue';
import AdminPets from './AdminPets.vue';
import AdminCitas from './AdminCitas.vue';
import AdminUsers from './AdminUsers.vue';
import AdminInventory from './AdminInventory.vue';

const currentTab = ref('stats');
const searchQuery = ref('');
const loading = ref(false);

const data = reactive({
    stats: { totalCitasHistorico: 0, ventasTotales: 0, totalPedidos: 0, ticketPromedio: 0, agendaFutura: [] },
    pedidos: [],
    mascotas: [],
    citas: [],
    productos: [],
    usuarios: []
});

const tabTitle = computed(() => {
    const titles = { stats: 'Resumen', pedidos: 'Ventas PetStation', mascotas: 'Expedientes Pacientes', citas: 'Agenda Veterinaria', usuarios: 'Base de Clientes', inventario: 'Control de Inventario' };
    return titles[currentTab.value];
});

const fetchData = async () => {
    loading.value = true;
    try {
        if (currentTab.value === 'stats') {
            const res = await api.get('/admin/stats');
            data.stats = res.data;
            // Sincronizamos citas para otros componentes si es necesario
            data.citas = res.data.agendaFutura || [];
        } else if (currentTab.value === 'pedidos') {
            const { data: p } = await api.get('/pedidos/admin/lista');
            data.pedidos = p || [];
            if (!data.productos.length) {
                const { data: pr } = await api.get('/admin/productos');
                data.productos = pr;
            }
        } else if (currentTab.value === 'mascotas') {
            const { data: m } = await api.get('/admin/dashboard/completo');
            data.mascotas = m.flatMap(t => (t.mascotas || []).map(p => ({ ...p, tutorNombre: `${t.nombre} ${t.apellido}` })));
        } else if (currentTab.value === 'usuarios') {
            const { data: u } = await api.get('/admin/dashboard/completo');
            data.usuarios = u || [];
        } else if (currentTab.value === 'inventario') {
            const { data: pr } = await api.get('/admin/productos');
            data.productos = pr || [];
        } else if (currentTab.value === 'citas') {
            const { data: c } = await api.get('/admin/citas/todas');
            data.citas = c || [];
        }
    } catch (e) {
        console.error("Error en Dashboard:", e);
    } finally { loading.value = false; }
};

watch(currentTab, fetchData);
onMounted(fetchData);

const tabClass = (active) => [
    'px-4 py-4 rounded-2xl text-left text-[10px] font-black uppercase tracking-widest transition-all duration-300',
    active ? 'bg-ps-red text-white shadow-xl shadow-ps-red/20 translate-x-2 italic' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-ps-blue'
];
</script>

<template>
    <div class="flex min-h-screen bg-slate-50 dark:bg-[#080808] text-slate-900 dark:text-white pt-20">
        
        <aside class="w-64 border-r border-slate-200 dark:border-white/10 p-6 flex flex-col gap-8 hidden lg:flex bg-white dark:bg-black shrink-0 sticky top-20 h-[calc(100vh-80px)]">
            <div class="text-xl font-[1000] uppercase italic tracking-tighter">
                <span class="text-ps-red">PS</span> <span class="text-ps-blue dark:text-white">ADMIN</span>
            </div>
            
            <nav class="flex flex-col gap-2 overflow-y-auto custom-scrollbar">
                <button v-for="t in ['stats', 'pedidos', 'mascotas', 'citas', 'usuarios', 'inventario']" 
                        :key="t" 
                        @click="currentTab = t" 
                        :class="tabClass(currentTab === t)">
                    <span class="capitalize">{{ t }}</span>
                </button>
            </nav>

            <div class="mt-auto pt-6 border-t border-slate-100 dark:border-white/5">
                <p class="text-[8px] font-black opacity-30 uppercase tracking-[0.3em]">PetStation v2.0</p>
            </div>
        </aside>

        <main class="flex-1 p-6 md:p-12 pb-32">
            <header class="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 class="text-4xl font-[1000] uppercase italic leading-none">{{ tabTitle }}</h1>
                    <p class="text-xs font-bold opacity-50 uppercase tracking-widest mt-2">Torre de control PetStation</p>
                </div>
                <div class="relative w-full md:w-80">
                    <span class="absolute left-4 top-1/2 -translate-y-1/2 opacity-30">🔍</span>
                    <input v-model="searchQuery" placeholder="BUSCAR..." class="admin-input-header" />
                </div>
            </header>

            <div v-if="loading" class="text-center py-20">
                <div class="w-8 h-8 border-4 border-ps-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p class="font-black uppercase text-[10px] animate-pulse italic">Sincronizando con Hetzner...</p>
            </div>

            <template v-else>
                <AdminStats v-if="currentTab === 'stats'" :stats="data.stats" />
                
                <AdminOrders v-if="currentTab === 'pedidos'" :orders="data.pedidos" :productos="data.productos" :searchQuery="searchQuery" @refresh="fetchData" />
                <AdminPets v-if="currentTab === 'mascotas'" :mascotas="data.mascotas" :searchQuery="searchQuery" />
                <AdminCitas v-if="currentTab === 'citas'" :citas="data.citas" :searchQuery="searchQuery" />
                <AdminUsers v-if="currentTab === 'usuarios'" :usuarios="data.usuarios" :searchQuery="searchQuery" />
                <AdminInventory v-if="currentTab === 'inventario'" :productos="data.productos" :searchQuery="searchQuery" @refresh="fetchData" />
            </template>
        </main>
    </div>
</template>

<style scoped>
@reference "../../../style.css";

/* Evita que el scroll del main afecte al sidebar */
aside {
    z-index: 40;
}

.admin-input-header {
    @apply w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-4 pl-12 rounded-2xl text-[10px] font-black uppercase tracking-widest focus:border-ps-blue outline-none transition-all shadow-xl;
}

/* Scrollbar sutil para el menú lateral */
.custom-scrollbar::-webkit-scrollbar {
    width: 3px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
    @apply bg-ps-red/20 rounded-full;
}
</style>