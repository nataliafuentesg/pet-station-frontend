<template>
  <div class="space-y-8 animate-in fade-in duration-500">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div class="flex gap-2 items-center">
            <span class="w-3 h-3 bg-ps-blue rounded-full animate-pulse"></span>
            <h3 class="text-[10px] font-black uppercase text-ps-blue italic tracking-widest">
                {{ filtered.length }} Productos en Inventario Real
            </h3>
        </div>
        <button @click="abrirModal()" class="btn-new-product">
          + REGISTRAR NUEVO PRODUCTO
        </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="prod in filtered" :key="prod.id" class="inventory-card group">
        <div class="image-wrapper">
          <img v-if="prod.fotosUrls?.length" :src="prod.fotosUrls[0]" class="main-img" />
          <div v-else class="placeholder-img">📦</div>
          
          <div class="badge-stock" :class="prod.stock <= 5 ? 'bg-ps-red' : 'bg-black/80'">
            STOCK: {{ prod.stock }}
          </div>
          <div class="badge-category">{{ prod.categoria }}</div>
          
          <div v-if="prod.requiereReceta" class="badge-rx">💊 RECETA</div>
        </div>

        <div class="p-5 flex flex-col flex-1">
          <h3 class="title">{{ prod.nombre }}</h3>
          <div class="flex items-center gap-2 mb-4">
            <p class="brand">{{ prod.marca }}</p>
            <span v-if="prod.presentacion" class="tag-sm">{{ prod.presentacion }}</span>
          </div>

          <div class="footer-card">
            <span class="price">${{ prod.precio.toLocaleString() }}</span>
            <div class="flex gap-2">
              <button @click="abrirModal(prod)" class="action-btn edit">✏️</button>
              <button @click="eliminar(prod.id)" class="action-btn delete">🗑️</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showModal" class="modal-overlay">
      <div class="modal-window custom-scrollbar">
        <div class="flex justify-between items-center mb-10">
          <div>
            <h2 class="text-3xl font-[1000] uppercase italic dark:text-white">
              {{ editMode ? 'EDITAR' : 'NUEVO' }} <span class="text-ps-red">PRODUCTO</span>
            </h2>
            <p class="text-[9px] font-black opacity-40 uppercase tracking-widest mt-1">Sincronización directa con base de datos</p>
          </div>
          <button @click="showModal = false" class="btn-close">✕</button>
        </div>

        <form @submit.prevent="guardar" class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="md:col-span-2">
            <label class="label">Nombre Comercial del Producto</label>
            <input v-model="form.nombre" class="admin-input" required placeholder="Ej: NexGard Spectra Perros 2-3.5kg" />
          </div>
          <div>
            <label class="label">Precio de Venta ($)</label>
            <input v-model.number="form.precio" type="number" step="0.01" class="admin-input" required />
          </div>

          <div class="md:col-span-3">
            <label class="label">Descripción y Beneficios (Tienda)</label>
            <textarea v-model="form.descripcion" class="admin-input h-28 resize-none" placeholder="Ingresa detalles técnicos..."></textarea>
          </div>

          <div><label class="label">Stock Actual</label><input v-model.number="form.stock" type="number" class="admin-input" required /></div>
          <div><label class="label">Marca / Laboratorio</label><input v-model="form.marca" class="admin-input" placeholder="Boehringer Ingelheim" /></div>
          <div><label class="label">SKU / Código</label><input v-model="form.sku" class="admin-input" placeholder="000-000-000" /></div>

          <div>
            <label class="label">Categoría Principal</label>
            <select v-model="form.categoria" class="admin-input">
              <option value="NUTRICION">Nutrición</option>
              <option value="FARMACIA">Farmacia</option>
              <option value="ACCESORIOS">Accesorios</option>
            </select>
          </div>
          <div>
            <label class="label">Subcategoría</label>
            <input v-model="form.subcategoria" class="admin-input" placeholder="Ej: Antipulgas, Medicado..." />
          </div>
          <div>
            <label class="label">Presentación</label>
            <input v-model="form.presentacion" class="admin-input" placeholder="Ej: Caja x3 Tabletas, 15kg..." />
          </div>

          <div>
            <label class="label">Especie Destino</label>
            <select v-model="form.especie" class="admin-input">
              <option value="TODOS">Todas las especies</option>
              <option value="CANINO">Canino (Perros)</option>
              <option value="FELINO">Felino (Gatos)</option>
            </select>
          </div>
          <div>
            <label class="label">Etapa de Vida</label>
            <select v-model="form.etapaVida" class="admin-input">
              <option value="TODOS">Cualquier etapa</option>
              <option value="CACHORRO">Cachorro / Kitten</option>
              <option value="ADULTO">Adulto</option>
              <option value="SENIOR">Senior</option>
            </select>
          </div>
          <div>
            <label class="label">Rango de Peso</label>
            <select v-model="form.rangoPeso" class="admin-input">
              <option value="TODOS">Cualquier peso</option>
              <option value="RAZA PEQUEÑA">Raza Pequeña (0-10kg)</option>
              <option value="RAZA MEDIANA">Raza Mediana (11-25kg)</option>
              <option value="RAZA GRANDE">Raza Grande (25kg+)</option>
            </select>
          </div>

          <div class="md:col-span-3 flex items-center gap-6 bg-ps-red/5 p-6 rounded-[2rem] border border-ps-red/10">
            <div class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="form.requiereReceta" class="sr-only peer">
                <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-white/10 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:width-5 after:transition-all peer-checked:bg-ps-red"></div>
            </div>
            <div>
                <p class="text-[10px] font-[1000] uppercase text-ps-red italic">Control de Receta Médica</p>
                <p class="text-[9px] opacity-60 dark:text-white/40">Si se activa, el cliente debe presentar fórmula veterinaria para la compra.</p>
            </div>
          </div>

          <div class="md:col-span-3">
            <label class="label text-ps-blue">URLs de Imágenes (Una URL por línea para galería)</label>
            <textarea v-model="fotosTexto" class="admin-input h-24 font-mono text-[10px] leading-relaxed" placeholder="https://imagen1.jpg&#10;https://imagen2.jpg"></textarea>
            
            <div v-if="fotosTexto" class="flex gap-3 mt-4 overflow-x-auto pb-2 custom-scrollbar">
                <div v-for="(url, idx) in fotosTexto.split('\n')" :key="idx" class="w-16 h-16 rounded-xl border border-white/10 overflow-hidden shrink-0">
                    <img v-if="url" :src="url" class="w-full h-full object-cover" />
                </div>
            </div>
          </div>
          
          <button type="submit" class="btn-save-full">
            {{ editMode ? 'ACTUALIZAR PRODUCTO EN NUBE' : 'PUBLICAR PRODUCTO EN TIENDA' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import api from '@/api/axios';

const props = defineProps(['productos', 'searchQuery']);
const emit = defineEmits(['refresh']);

const showModal = ref(false);
const editMode = ref(false);
const form = ref({});
const fotosTexto = ref('');

const filtered = computed(() => {
    const q = (props.searchQuery || '').toLowerCase();
    return (props.productos || []).filter(p => 
        p.nombre?.toLowerCase().includes(q) || 
        p.marca?.toLowerCase().includes(q) ||
        p.sku?.toLowerCase().includes(q)
    );
});

const abrirModal = (prod = null) => {
    if (prod) {
        form.value = { ...prod };
        fotosTexto.value = prod.fotosUrls ? prod.fotosUrls.join('\n') : '';
        editMode.value = true;
    } else {
        form.value = { 
            stock: 0, 
            precio: 0, 
            especie: 'TODOS', 
            etapaVida: 'TODOS', 
            categoria: 'NUTRICION', 
            rangoPeso: 'TODOS',
            requiereReceta: false,
            subcategoria: '',
            presentacion: '',
            sku: ''
        };
        fotosTexto.value = '';
        editMode.value = false;
    }
    showModal.value = true;
};

const guardar = async () => {
    form.value.fotosUrls = fotosTexto.value.split('\n').filter(u => u.trim() !== '');
    try {
        if (editMode.value) await api.put(`/admin/productos/${form.value.id}`, form.value);
        else await api.post('/admin/productos', form.value);
        showModal.value = false;
        emit('refresh');
    } catch (e) { alert("Error al sincronizar con el servidor de PetStation"); }
};

const eliminar = async (id) => {
    if (!confirm("¿Deseas eliminar este producto permanentemente de la tienda?")) return;
    try { await api.delete(`/admin/productos/${id}`); emit('refresh'); } catch (e) { alert("Error al eliminar"); }
};
</script>

<style scoped>
@reference "../../../style.css";

/* UI COMPONENTS SCOPED */
.inventory-card { @apply bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[2.5rem] flex flex-col transition-all hover:shadow-2xl hover:border-ps-blue/30; }
.image-wrapper { @apply h-48 m-2 rounded-[2rem] overflow-hidden bg-white dark:bg-black relative border border-slate-100 dark:border-white/5; }
.main-img { @apply w-full h-full object-contain p-4 group-hover:scale-110 transition-all duration-700; }
.placeholder-img { @apply w-full h-full flex items-center justify-center text-4xl opacity-10; }

.badge-stock { @apply absolute top-3 right-3 text-white px-3 py-1 rounded-full text-[8px] font-black uppercase shadow-lg; }
.badge-category { @apply absolute bottom-3 left-3 bg-ps-blue text-white text-[7px] px-3 py-1.5 rounded-lg font-black uppercase italic shadow-lg; }
.badge-rx { @apply absolute bottom-3 right-3 bg-ps-red text-white text-[7px] px-3 py-1.5 rounded-lg font-black uppercase italic shadow-lg; }

.title { @apply font-[1000] uppercase italic leading-tight text-sm dark:text-white px-2; }
.brand { @apply text-[9px] font-black opacity-40 uppercase tracking-widest px-2; }
.tag-sm { @apply bg-ps-blue/10 text-ps-blue text-[8px] px-2 py-0.5 rounded font-black uppercase; }

.footer-card { @apply mt-auto pt-4 border-t border-slate-100 dark:border-white/5 flex justify-between items-center; }
.price { @apply text-xl font-[1000] text-ps-red italic; }

.action-btn { @apply w-10 h-10 flex items-center justify-center rounded-xl transition-all; }
.action-btn.edit { @apply bg-ps-blue/10 text-ps-blue hover:bg-ps-blue hover:text-white; }
.action-btn.delete { @apply bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white; }

.btn-new-product { @apply bg-ps-blue text-white px-8 py-4 rounded-2xl font-[1000] uppercase text-[10px] italic shadow-xl hover:bg-black transition-all active:scale-95; }

.modal-overlay { @apply fixed inset-0 z-[7000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md; }
.modal-window { @apply bg-white dark:bg-[#080808] w-full max-w-4xl rounded-[3.5rem] p-10 shadow-2xl max-h-[92vh] overflow-y-auto border border-white/10; }
.admin-input { @apply w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 p-4 rounded-2xl text-xs font-bold focus:border-ps-blue outline-none transition-all dark:text-white placeholder:opacity-20; }
.label { @apply text-[9px] font-black uppercase opacity-40 block mb-2 ml-3 tracking-widest; }

.btn-save-full { @apply md:col-span-3 bg-ps-red text-white py-6 rounded-[2rem] font-[1000] uppercase italic shadow-xl shadow-ps-red/20 active:scale-95 transition-all mt-4 tracking-widest; }
.btn-close { @apply w-12 h-12 flex items-center justify-center bg-ps-red text-white rounded-2xl hover:rotate-90 transition-all shadow-lg; }
</style>