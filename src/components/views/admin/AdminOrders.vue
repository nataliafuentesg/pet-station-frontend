<template>
  <div class="space-y-6 container-reveal">
    <div class="flex gap-3 mb-6 overflow-x-auto pb-2 no-scrollbar">
      <button v-for="st in ['EN PROCESO', 'COMPLETADOS', 'CANCELADOS']" 
              :key="st" @click="filtroPrincipal = st" 
              :class="[filtroPrincipal === st ? 'bg-ps-red text-white shadow-xl' : 'bg-white dark:bg-white/5 text-slate-400']" 
              class="px-6 py-3 rounded-2xl text-[10px] font-[1000] uppercase tracking-widest border border-white/5 transition-all italic">
        {{ st }}
      </button>
    </div>

    <div v-for="order in itemsFiltrados" :key="order.id" 
         class="admin-card flex justify-between items-center border-l-8 transition-all hover:translate-x-1" 
         :class="statusBorder(order.estado)">
      <div class="flex-1">
        <div class="flex items-center gap-3 mb-2">
            <h3 class="font-[1000] uppercase italic text-lg leading-none dark:text-white">{{ order.nombreCliente }}</h3>
            <span class="text-[10px] font-black px-2 py-0.5 bg-slate-100 dark:bg-white/10 rounded">#{{ order.id }}</span>
            <span class="text-[9px] font-black px-3 py-1 bg-ps-blue/10 text-ps-blue rounded-full">{{ order.estado }}</span>
        </div>
        <div class="flex gap-4 text-[10px] font-black uppercase opacity-60">
            <span>📍 {{ order.zona || 'Sucursal' }}</span>
            <span class="text-ps-red">💰 ${{ order.total.toLocaleString() }}</span>
        </div>
      </div>
      <button @click="abrirModal(order)" class="btn-manage">Gestionar Orden</button>
    </div>

    <div v-if="!itemsFiltrados.length" class="text-center py-20 opacity-20 font-black uppercase italic text-xs">
        No hay órdenes en esta categoría
    </div>

    <div v-if="showModal" class="modal-overlay">
        <div class="modal-window custom-scrollbar modal-reveal">
            <div class="flex justify-between items-center mb-8 shrink-0">
                <h2 class="text-3xl font-[1000] uppercase italic dark:text-white">ORDEN <span class="text-ps-red">#{{ form.id }}</span></h2>
                <button @click="showModal = false" class="btn-close-circle">✕</button>
            </div>

            <div class="mb-6 relative">
                <label class="label">Añadir Producto a la Venta</label>
                <div class="relative">
                    <span class="absolute left-4 top-1/2 -translate-y-1/2">🔍</span>
                    <input v-model="searchProd" placeholder="Buscar por nombre o marca..." class="admin-input-dark pl-12 border-ps-blue/20" />
                </div>
                
                <div v-if="searchProd && prodsResultados.length" class="search-dropdown custom-scrollbar">
                    <div v-for="p in prodsResultados" :key="p.id" @click="addProd(p)" class="search-result-item">
                        <span class="font-[1000] uppercase italic text-[11px]">{{ p.nombre }}</span>
                        <span class="text-ps-red font-black text-[11px]">${{ p.precio }}</span>
                    </div>
                </div>
            </div>
            
            <div class="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar min-h-[200px]">
                <div v-for="(item, idx) in form.items" :key="idx" class="item-row">
                    <div class="flex-1">
                        <p class="text-[10px] font-[1000] uppercase italic dark:text-white">{{ item.nombreProducto }}</p>
                        <p class="text-[8px] font-black opacity-40 uppercase">Precio Unit: ${{ item.precioSnapshot }}</p>
                    </div>
                    <div class="flex items-center gap-4">
                        <div class="qty-controls">
                            <button @click="item.cantidad > 1 ? item.cantidad-- : null" type="button" class="qty-btn">-</button>
                            <span class="w-6 text-center text-xs font-black dark:text-white">{{ item.cantidad }}</span>
                            <button @click="item.cantidad++" type="button" class="qty-btn">+</button>
                        </div>
                        <button @click="form.items.splice(idx, 1)" type="button" class="delete-item">✕</button>
                    </div>
                </div>
            </div>

            <div class="mt-8 pt-8 border-t dark:border-white/5">
                <div class="flex flex-col md:flex-row justify-between items-end gap-6 mb-8">
                    <div class="w-full md:w-1/2">
                        <label class="label">Estado de la Venta</label>
                        <select v-model="form.estado" class="admin-input-dark">
                            <option value="PENDIENTE">⏳ PENDIENTE</option>
                            <option value="PAGADO">💳 PAGADO</option>
                            <option value="EN_CAMINO">🚚 EN CAMINO</option>
                            <option value="ENTREGADO">✅ ENTREGADO</option>
                            <option value="CANCELADO">❌ CANCELADO</option>
                        </select>
                    </div>
                    <div class="text-right">
                        <p class="label">Total de la Orden</p>
                        <p class="text-5xl font-[1000] italic text-ps-red leading-none">${{ totalCalculado.toLocaleString() }}</p>
                    </div>
                </div>
                <button @click="guardarCambios" class="btn-save-order" :disabled="isSaving">
                    {{ isSaving ? 'SINCRONIZANDO...' : 'ACTUALIZAR PEDIDO' }}
                </button>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import api from '@/api/axios';

const props = defineProps(['orders', 'productos', 'searchQuery']);
const emit = defineEmits(['refresh']);

const filtroPrincipal = ref('EN PROCESO');
const showModal = ref(false);
const searchProd = ref('');
const isSaving = ref(false);
const form = ref({ items: [] });

const itemsFiltrados = computed(() => {
    let list = props.orders || [];
    if (filtroPrincipal.value === 'EN PROCESO') {
        list = list.filter(o => ['PENDIENTE', 'PAGADO', 'EN_CAMINO'].includes(o.estado));
    } else if (filtroPrincipal.value === 'COMPLETADOS') {
        list = list.filter(o => o.estado === 'ENTREGADO');
    } else {
        list = list.filter(o => o.estado === 'CANCELADO');
    }
    const q = (props.searchQuery || '').toLowerCase();
    return list.filter(o => o.nombreCliente?.toLowerCase().includes(q) || o.id.toString().includes(q));
});

const prodsResultados = computed(() => {
    if (!searchProd.value) return [];
    return (props.productos || []).filter(p => p.nombre.toLowerCase().includes(searchProd.value.toLowerCase())).slice(0, 5);
});

const totalCalculado = computed(() => {
    return form.value.items.reduce((acc, i) => acc + (Number(i.precioSnapshot) * Number(i.cantidad)), 0);
});

const abrirModal = (order) => {
    const clone = JSON.parse(JSON.stringify(order));
    clone.items = clone.items.map(item => ({
        id: item.id,
        productoId: item.productoId,
        nombreProducto: item.nombreProducto,
        precioSnapshot: Number(item.precioSnapshot),
        cantidad: Number(item.cantidad)
    }));
    form.value = clone;
    showModal.value = true;
};

const addProd = (p) => {
    form.value.items.push({
        id: `new-${Date.now()}`,
        productoId: p.id,
        nombreProducto: p.nombre,
        precioSnapshot: Number(p.precio),
        cantidad: 1,
        categoria: p.categoria
    });
    searchProd.value = '';
};

const guardarCambios = async () => {
    isSaving.value = true;
    try {
        const payload = {
            id: form.value.id,
            estado: form.value.estado,
            total: totalCalculado.value,
            items: form.value.items.map(item => ({
                id: (typeof item.id === 'string' && item.id.startsWith('new-')) ? null : item.id,
                productoId: item.productoId,
                nombreProducto: item.nombreProducto,
                precioSnapshot: Number(item.precioSnapshot),
                cantidad: Number(item.cantidad)
            }))
        };
        await api.put(`/pedidos/admin/${form.value.id}`, payload);
        showModal.value = false;
        emit('refresh');
    } catch (e) {
        alert("Error al guardar cambios.");
    } finally { isSaving.value = false; }
};

const statusBorder = (s) => {
    if (s === 'PENDIENTE') return 'border-amber-400';
    if (s === 'ENTREGADO') return 'border-green-500';
    if (s === 'CANCELADO') return 'border-red-500';
    return 'border-ps-blue';
};
</script>

<style scoped>
@reference "../../../style.css";

/* ANIMACIONES MANUALES PARA EVITAR ERROR VITE */
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
@keyframes slideIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }

.container-reveal { animation: fadeIn 0.4s ease-out forwards; }
.modal-reveal { animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

/* ESTILOS DE COMPONENTES */
.admin-card { @apply bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-8 rounded-[2.5rem] transition-all duration-300; }
.btn-manage { @apply bg-black text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase italic shadow-xl hover:bg-ps-blue transition-all active:scale-95; }
.modal-overlay { @apply fixed inset-0 z-[8000] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md; }
.modal-window { @apply bg-white dark:bg-[#0a0a0a] w-full max-w-3xl rounded-[3.5rem] p-10 shadow-2xl max-h-[90vh] flex flex-col border border-white/10; }

.admin-input-dark { @apply w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 p-5 rounded-2xl text-xs font-bold focus:border-ps-blue outline-none transition-all dark:text-white placeholder:opacity-30; }
.label { @apply text-[9px] font-black uppercase opacity-40 block mb-2 ml-2 tracking-widest; }

.search-dropdown { @apply absolute z-[9000] w-full bg-white dark:bg-[#151515] border border-white/10 rounded-2xl mt-2 shadow-2xl overflow-hidden max-h-60 overflow-y-auto; }
.search-result-item { @apply p-4 hover:bg-ps-blue/10 cursor-pointer flex justify-between items-center border-b border-white/5 dark:text-white; }

.item-row { @apply flex items-center gap-4 bg-slate-50 dark:bg-white/5 p-5 rounded-[2rem] border border-slate-100 dark:border-white/5; }
.qty-controls { @apply flex items-center gap-3 bg-white dark:bg-black p-1 rounded-xl border border-white/10; }
.qty-btn { @apply w-8 h-8 flex items-center justify-center font-black dark:text-white hover:text-ps-red transition-colors; }
.delete-item { @apply text-ps-red p-2 hover:bg-ps-red/10 rounded-xl transition-all font-black; }

.btn-save-order { @apply w-full bg-ps-red text-white py-6 rounded-[2.5rem] font-[1000] uppercase text-xs italic shadow-xl shadow-ps-red/20 hover:scale-[1.02] active:scale-95 transition-all; }
.btn-close-circle { @apply w-12 h-12 flex items-center justify-center bg-white dark:bg-white/5 rounded-full text-xl hover:bg-ps-red hover:text-white transition-all; }

.no-scrollbar::-webkit-scrollbar { display: none; }
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { @apply bg-ps-red/20 rounded-full; }
</style>