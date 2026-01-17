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
    stats: { totalCitas: 0, totalMascotas: 0, totalClientes: 0 },
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
            const [resS, resC] = await Promise.all([api.get('/admin/stats'), api.get('/admin/citas/todas')]);
            data.stats = resS.data;
            data.citas = resC.data;
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
    <div class="flex min-h-screen bg-slate-50 dark:bg-[#080808] text-slate-900 dark:text-white">
        <aside class="w-64 border-r border-slate-200 dark:border-white/10 p-6 flex flex-col gap-8 hidden lg:flex bg-white dark:bg-black shrink-0">
            <div class="text-xl font-[1000] uppercase italic tracking-tighter">
                <span class="text-ps-red">PS</span> <span class="text-ps-blue dark:text-white">ADMIN</span>
            </div>
            <nav class="flex flex-col gap-2">
                <button v-for="t in ['stats', 'pedidos', 'mascotas', 'citas', 'usuarios', 'inventario']" :key="t" @click="currentTab = t" :class="tabClass(currentTab === t)">
                    <span class="capitalize">{{ t }}</span>
                </button>
            </nav>
        </aside>

        <main class="flex-1 p-6 md:p-12 pb-32 overflow-y-auto">
            <header class="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 class="text-4xl font-[1000] uppercase italic leading-none">{{ tabTitle }}</h1>
                    <p class="text-xs font-bold opacity-50 uppercase tracking-widest mt-2">Torre de control PetStation</p>
                </div>
                <div class="relative w-full md:w-80">
                    <input v-model="searchQuery" placeholder="BUSCAR..." class="admin-input-header" />
                </div>
            </header>

            <div v-if="loading" class="text-center py-20 font-black uppercase text-xs animate-pulse italic">Cargando datos...</div>
            <template v-else>
                <AdminStats v-if="currentTab === 'stats'" :stats="data.stats" :citas="data.citas" :mascotas="data.mascotas" />
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
.admin-input-header {
    @apply w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-4 pl-12 rounded-2xl text-[10px] font-black uppercase tracking-widest focus:border-ps-blue outline-none transition-all shadow-xl;
}
</style>