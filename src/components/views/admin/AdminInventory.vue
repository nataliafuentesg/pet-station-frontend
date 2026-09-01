<template>
  <div class="space-y-6 animate-in fade-in duration-500">
    <div class="flex flex-col md:flex-row justify-between items-end gap-4 bg-white dark:bg-white/5 p-6 rounded-[2rem] border border-slate-200 dark:border-white/10">
        <div class="flex-1 w-full">
            <h3 class="text-[10px] font-[1000] uppercase text-ps-blue italic tracking-widest mb-3">Panel de Control de Existencias (SKU Focus)</h3>
            <div class="flex gap-4">
                <div class="relative flex-1">
                    <span class="absolute left-4 top-1/2 -translate-y-1/2 opacity-30">🔍</span>
                    <input v-model="localSearch" placeholder="BUSCAR POR SKU, NOMBRE O LABORATORIO..." class="search-input" />
                </div>
            </div>
        </div>
        <div class="flex gap-3">
          <button @click="exportarCSV" class="btn-export">⬇ DESCARGAR CSV</button>
          <button @click="abrirModal()" class="btn-add">+ REGISTRAR NUEVO SKU</button>
        </div>
    </div>

    <div class="bg-white dark:bg-[#080808] rounded-[2.5rem] border border-slate-200 dark:border-white/10 overflow-hidden shadow-xl">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-slate-50 dark:bg-white/5 text-[9px] font-[1000] uppercase tracking-tighter opacity-50">
            <th class="p-5">SKU / CÓDIGO</th>
            <th class="p-5">PRODUCTO</th>
            <th class="p-5">CATEGORÍA</th>
            <th class="p-5">PRECIO</th>
            <th class="p-5 text-center">STOCK</th>
            <th class="p-5 text-right">GESTIÓN</th>
          </tr>
        </thead>
        <tbody class="text-[11px] font-bold">
          <tr v-for="prod in paginated" :key="prod.id" class="border-b border-slate-100 dark:border-white/5 hover:bg-ps-blue/5 transition-colors">
            <td class="p-5 font-mono text-ps-blue">{{ prod.sku || 'N/A' }}</td>
            <td class="p-5">
                <div class="flex flex-col">
                    <span class="uppercase italic font-[1000] text-xs dark:text-white">{{ prod.nombre }}</span>
                    <span class="text-[9px] opacity-40 uppercase">{{ prod.marca }}</span>
                </div>
            </td>
            <td class="p-5">
                <span class="px-2 py-1 bg-slate-100 dark:bg-white/10 rounded text-[8px] uppercase font-black dark:text-white/60">
                    {{ prod.categoria }}
                </span>
            </td>
            <td class="p-5 font-[1000] text-ps-red">${{ prod.precio.toLocaleString() }}</td>
            <td class="p-5">
                <div class="flex justify-center">
                    <span :class="stockClass(prod.stock)" class="stock-pill">
                        {{ prod.stock }} UNID.
                    </span>
                </div>
            </td>
            <td class="p-5 text-right">
                <div class="flex justify-end gap-2">
                    <button @click="abrirModal(prod)" class="tool-btn" title="Editar Stock/Datos">✏️</button>
                    <button @click="eliminar(prod.id)" class="tool-btn text-red-500" title="Eliminar">🗑️</button>
                </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="p-6 flex justify-between items-center bg-slate-50/50 dark:bg-white/5">
        <p class="text-[9px] font-black uppercase opacity-40">Total: {{ filtered.length }} SKU's encontrados</p>
        <div class="flex gap-2">
            <button @click="page--" :disabled="page === 1" class="page-btn">ANT.</button>
            <span class="text-xs font-black px-4 py-2 bg-white dark:bg-black rounded-xl border border-white/10 dark:text-white">{{ page }} / {{ totalPages || 1 }}</span>
            <button @click="page++" :disabled="page >= totalPages" class="page-btn">SIG.</button>
        </div>
      </div>
    </div>

    <!-- Panel Sync Aliaddo -->
    <div class="bg-white dark:bg-white/5 rounded-[2rem] border border-slate-200 dark:border-white/10 p-6 space-y-4">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 class="text-[10px] font-[1000] uppercase text-ps-blue italic tracking-widest">Sincronización Aliaddo</h3>
          <p v-if="ultimoSync" class="text-[9px] opacity-40 uppercase font-black mt-1">
            Última sync: {{ formatFecha(ultimoSync.fechaSync) }} · {{ ultimoSync.actualizados }} actualizados · disparada por {{ ultimoSync.disparadoPor }}
          </p>
          <p v-else class="text-[9px] opacity-40 uppercase font-black mt-1">Sin registros de sync aún</p>
        </div>
        <button @click="lanzarSync" :disabled="syncCargando" class="btn-sync">
          {{ syncCargando ? '⏳ SINCRONIZANDO...' : '⚡ SINCRONIZAR AHORA' }}
        </button>
      </div>

      <!-- Resultado del último sync manual -->
      <div v-if="syncResultado" class="bg-green-500/10 border border-green-500/20 rounded-2xl p-4">
        <p class="text-[10px] font-[1000] uppercase text-green-500">
          Sync completada: {{ syncResultado.actualizados }} productos actualizados
        </p>
        <div v-if="syncResultado.cambios && syncResultado.cambios.length" class="mt-3 space-y-1 max-h-48 overflow-y-auto">
          <div v-for="c in syncResultado.cambios" :key="c.sku"
            class="flex flex-wrap gap-3 text-[9px] font-black uppercase border-b border-white/5 pb-1">
            <span class="font-mono opacity-60">{{ c.sku }}</span>
            <span class="text-white/80">{{ c.nombre }}</span>
            <span v-if="c.precioAntes !== undefined" class="text-amber-400">
              ${{ Number(c.precioAntes).toLocaleString('es-CO') }} → ${{ Number(c.precioDespues).toLocaleString('es-CO') }}
            </span>
            <span v-if="c.stockAntes !== undefined" class="text-blue-400">
              stock {{ c.stockAntes }} → {{ c.stockDespues }}
            </span>
          </div>
        </div>
      </div>

      <!-- Historial de syncs -->
      <div v-if="historialSync.length" class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="text-[8px] font-[1000] uppercase opacity-30 tracking-widest border-b border-white/10">
              <th class="pb-2 pr-4">Fecha</th>
              <th class="pb-2 pr-4">Actualizados</th>
              <th class="pb-2 pr-4">Sin match</th>
              <th class="pb-2">Disparada por</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="h in historialPaginado" :key="h.id"
              class="text-[9px] font-bold border-b border-white/5 hover:bg-white/5 cursor-pointer"
              @click="verDetalle(h)">
              <td class="py-2 pr-4 font-mono opacity-60">{{ formatFecha(h.fechaSync) }}</td>
              <td class="py-2 pr-4">
                <span :class="h.actualizados > 0 ? 'text-green-400' : 'opacity-40'">{{ h.actualizados }}</span>
              </td>
              <td class="py-2 pr-4">
                <span :class="h.sinMatch > 0 ? 'text-amber-400' : 'opacity-40'">{{ h.sinMatch }}</span>
              </td>
              <td class="py-2">
                <span :class="h.disparadoPor === 'manual' ? 'text-amber-400' : 'opacity-40'" class="uppercase">
                  {{ h.disparadoPor }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="flex justify-between items-center pt-3">
          <p class="text-[8px] font-black uppercase opacity-30">{{ historialSync.length }} registros en total</p>
          <div class="flex gap-2">
            <button @click="syncPage--" :disabled="syncPage === 1" class="page-btn">ANT.</button>
            <span class="text-[9px] font-black px-3 py-1 bg-white dark:bg-black rounded-xl border border-white/10 dark:text-white">{{ syncPage }} / {{ syncTotalPages || 1 }}</span>
            <button @click="syncPage++" :disabled="syncPage >= syncTotalPages" class="page-btn">SIG.</button>
          </div>
        </div>
      </div>

      <!-- Detalle de sync seleccionada -->
      <div v-if="detalleSync" class="bg-slate-50 dark:bg-black/50 rounded-2xl p-4 space-y-3">
        <p class="text-[9px] font-[1000] uppercase opacity-50">Detalle del {{ formatFecha(detalleSync.fechaSync) }}</p>

        <!-- Cambios de precio/stock -->
        <div v-if="parsedDetalle.length" class="max-h-48 overflow-y-auto space-y-1">
          <p class="text-[8px] font-[1000] uppercase text-green-400 opacity-70 mb-1">Cambios ({{ parsedDetalle.length }})</p>
          <div v-for="c in parsedDetalle" :key="c.sku"
            class="flex flex-wrap gap-3 text-[9px] font-black uppercase border-b border-white/5 pb-1">
            <span class="font-mono opacity-60">{{ c.sku }}</span>
            <span>{{ c.nombre }}</span>
            <span v-if="c.precioAntes !== undefined" class="text-amber-400">
              ${{ Number(c.precioAntes).toLocaleString('es-CO') }} → ${{ Number(c.precioDespues).toLocaleString('es-CO') }}
            </span>
            <span v-if="c.stockAntes !== undefined" class="text-blue-400">
              stock {{ c.stockAntes }} → {{ c.stockDespues }}
            </span>
          </div>
        </div>
        <div v-else class="text-[9px] opacity-40 uppercase">Sin cambios en esta sync</div>

        <!-- SKUs sin match -->
        <div v-if="parsedSinMatchSkus.length" class="max-h-48 overflow-y-auto space-y-1">
          <p class="text-[8px] font-[1000] uppercase text-amber-400 opacity-70 mb-1">SKUs sin match en Aliaddo ({{ parsedSinMatchSkus.length }})</p>
          <div class="flex flex-wrap gap-2">
            <span v-for="sku in parsedSinMatchSkus" :key="sku"
              class="font-mono text-[9px] px-2 py-1 bg-amber-500/10 border border-amber-500/20 rounded text-amber-400">
              {{ sku }}
            </span>
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
            <p class="text-[9px] font-black opacity-40 uppercase tracking-widest mt-1">Gestión Centralizada de Inventario</p>
          </div>
          <button @click="showModal = false" class="btn-close">✕</button>
        </div>

        <form @submit.prevent="guardar" class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="md:col-span-2">
            <label class="label">Nombre Comercial</label>
            <input v-model="form.nombre" class="admin-input" required />
          </div>
          <div>
            <label class="label">Precio ($)</label>
            <input v-model.number="form.precio" type="number" step="0.01" class="admin-input" required />
          </div>

          <div class="md:col-span-3">
            <label class="label">Descripción Técnica</label>
            <textarea v-model="form.descripcion" class="admin-input h-24 resize-none"></textarea>
          </div>

          <div><label class="label">Stock Actual (Manual)</label><input v-model.number="form.stock" type="number" class="admin-input" required /></div>
          <div><label class="label">Laboratorio / Marca</label><input v-model="form.marca" class="admin-input" /></div>
          <div><label class="label">SKU (Programa Facturas)</label><input v-model="form.sku" class="admin-input" /></div>

          <div>
            <label class="label">Categoría</label>
            <select v-model="form.categoria" class="admin-input">
              <option value="NUTRICION">Nutrición</option>
              <option value="FARMACIA">Farmacia</option>
              <option value="ACCESORIOS">Accesorios</option>
              <option value="HIGIENE">Higiene</option>
            </select>
          </div>
          <div><label class="label">Subcategoría</label><input v-model="form.subcategoria" class="admin-input" /></div>
          <div><label class="label">Presentación (Kg/Unid)</label><input v-model="form.presentacion" class="admin-input" /></div>

          <div>
            <label class="label">Especie</label>
            <select v-model="form.especie" class="admin-input">
              <option value="TODOS">Todos</option>
              <option value="CANINO">Canino</option>
              <option value="FELINO">Felino</option>
            </select>
          </div>
          <div>
            <label class="label">Etapa de Vida (puede ser varias)</label>
            <div class="admin-input flex flex-wrap gap-3">
              <label v-for="e in ['CACHORRO','ADULTO','SENIOR']" :key="e" class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" :value="e" :checked="etapasSeleccionadas.includes(e)" @change="toggleEtapa(e)" class="accent-ps-blue w-4 h-4" />
                <span class="text-[10px] font-black uppercase">{{ e.charAt(0) + e.slice(1).toLowerCase() }}</span>
              </label>
            </div>
          </div>
          <div>
            <label class="label">Tamaño / Raza</label>
            <select v-model="form.rangoPeso" class="admin-input">
              <option value="TODOS">Cualquier tamaño</option>
              <option value="RAZA MINIATURA">Miniatura (hasta ~4 kg)</option>
              <option value="RAZA PEQUEÑA">Pequeña (4–10 kg)</option>
              <option value="RAZA MEDIANA">Mediana (10–25 kg)</option>
              <option value="RAZA GRANDE">Grande (25–45 kg)</option>
              <option value="RAZA GIGANTE">Gigante (+45 kg)</option>
            </select>
          </div>

          <div class="md:col-span-3 flex items-center gap-6 bg-ps-red/5 p-6 rounded-[2rem] border border-ps-red/10">
            <input type="checkbox" v-model="form.requiereReceta" class="w-5 h-5 accent-ps-red">
            <div>
                <p class="text-[10px] font-[1000] uppercase text-ps-red italic">Requiere Receta Médica</p>
                <p class="text-[9px] opacity-60 dark:text-white/40">Bloquea la venta directa sin validación veterinaria.</p>
            </div>
          </div>

          <div class="md:col-span-3">
            <label class="label">Imágenes (URLs - Una por línea)</label>
            <textarea v-model="fotosTexto" class="admin-input h-20 font-mono text-[10px]"></textarea>
          </div>
          
          <button type="submit" class="btn-save-full">
            {{ editMode ? 'GUARDAR CAMBIOS EN SKU' : 'CREAR REGISTRO DE PRODUCTO' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import api from '@/api/axios';

const props = defineProps(['productos', 'searchQuery']);
const emit = defineEmits(['refresh']);

// Sync Aliaddo
const historialSync = ref([]);
const ultimoSync = computed(() => historialSync.value[0] || null);
const syncCargando = ref(false);
const syncResultado = ref(null);
const detalleSync = ref(null);
const syncPage = ref(1);
const syncPerPage = 10;
const syncTotalPages = computed(() => Math.ceil(historialSync.value.length / syncPerPage));
const historialPaginado = computed(() => {
  const start = (syncPage.value - 1) * syncPerPage;
  return historialSync.value.slice(start, start + syncPerPage);
});
const parsedDetalle = computed(() => {
  try { return JSON.parse(detalleSync.value?.detalleCambios || '[]'); } catch { return []; }
});
const parsedSinMatchSkus = computed(() => {
  try { return JSON.parse(detalleSync.value?.sinMatchSkus || '[]'); } catch { return []; }
});

const cargarHistorial = async () => {
  try {
    const r = await api.get('/admin/aliaddo/historial');
    historialSync.value = r.data;
  } catch (e) { console.error('Error cargando historial sync', e); }
};

const lanzarSync = async () => {
  syncCargando.value = true;
  syncResultado.value = null;
  try {
    const r = await api.post('/admin/aliaddo/sync-stock');
    syncResultado.value = r.data;
    await cargarHistorial();
    emit('refresh');
  } catch (e) { alert('Error al sincronizar'); }
  finally { syncCargando.value = false; }
};

const verDetalle = (h) => {
  detalleSync.value = detalleSync.value?.id === h.id ? null : h;
};

const formatFecha = (iso) => {
  if (!iso) return '-';
  const d = new Date(iso);
  return d.toLocaleString('es-CO', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

onMounted(cargarHistorial);

const localSearch = ref('');
const page = ref(1);
const itemsPerPage = 12;
const showModal = ref(false);
const editMode = ref(false);
const form = ref({});
const fotosTexto = ref('');

// Sincronización con buscador global
watch(() => props.searchQuery, (newVal) => { localSearch.value = newVal; page.value = 1; });

const filtered = computed(() => {
    const q = (localSearch.value || '').toLowerCase();
    return (props.productos || []).filter(p => 
        p.nombre?.toLowerCase().includes(q) || 
        p.sku?.toLowerCase().includes(q) ||
        p.marca?.toLowerCase().includes(q)
    );
});

const totalPages = computed(() => Math.ceil(filtered.value.length / itemsPerPage));
const paginated = computed(() => {
    const start = (page.value - 1) * itemsPerPage;
    return filtered.value.slice(start, start + itemsPerPage);
});

const stockClass = (s) => {
    if (s <= 0) return 'bg-red-500/20 text-red-500 border-red-500/30';
    if (s <= 5) return 'bg-amber-500/20 text-amber-500 border-amber-500/30';
    return 'bg-green-500/20 text-green-500 border-green-500/30';
};

const etapasSeleccionadas = computed(() => {
    const v = form.value.etapaVida || 'TODOS';
    if (v === 'TODOS' || !v) return [];
    return v.split(',').map(s => s.trim()).filter(Boolean);
});

const toggleEtapa = (etapa) => {
    let actual = etapasSeleccionadas.value.slice();
    if (actual.includes(etapa)) actual = actual.filter(e => e !== etapa);
    else actual.push(etapa);
    form.value.etapaVida = actual.length ? actual.join(',') : 'TODOS';
};

const abrirModal = (prod = null) => {
    if (prod) {
        form.value = { ...prod };
        fotosTexto.value = prod.fotosUrls ? prod.fotosUrls.join('\n') : '';
        editMode.value = true;
    } else {
        form.value = { stock: 0, precio: 0, especie: 'TODOS', etapaVida: 'TODOS', categoria: 'NUTRICION', rangoPeso: 'TODOS', requiereReceta: false };
        fotosTexto.value = '';
        editMode.value = false;
    }
    showModal.value = true;
};

const guardar = async () => {
    form.value.fotosUrls = fotosTexto.value.split('\n').filter(u => u.trim() !== '');
    if (form.value.sku && !editMode.value) {
        const duplicado = (props.productos || []).some(p => p.sku && p.sku.toLowerCase() === form.value.sku.toLowerCase());
        if (duplicado) { alert(`Ya existe un producto con el SKU "${form.value.sku}". Revisa antes de continuar.`); return; }
    }
    try {
        if (editMode.value) await api.put(`/admin/productos/${form.value.id}`, form.value);
        else await api.post('/admin/productos', form.value);
        showModal.value = false;
        emit('refresh');
    } catch (e) { alert("Error al guardar producto"); }
};

const eliminar = async (id) => {
    if (!confirm("¿Eliminar este SKU permanentemente?")) return;
    try { await api.delete(`/admin/productos/${id}`); emit('refresh'); } catch (e) { alert("Error"); }
};

// Exporta el inventario completo (filtrado) a CSV
const exportarCSV = () => {
    const datos = filtered.value;
    if (!datos.length) { alert('No hay productos para exportar'); return; }

    const headers = ['SKU', 'Nombre', 'Marca', 'Categoria', 'Subcategoria', 'Especie', 'Etapa', 'Presentacion', 'Precio', 'Stock', 'Requiere Receta'];

    // Escapa comillas y comas para CSV válido
    const esc = (v) => {
        const s = (v === null || v === undefined) ? '' : String(v);
        return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
    };

    const filas = datos.map(p => [
        p.sku, p.nombre, p.marca, p.categoria, p.subcategoria,
        p.especie, p.etapaVida, p.presentacion, p.precio, p.stock,
        p.requiereReceta ? 'SI' : 'NO'
    ].map(esc).join(','));

    // BOM para que Excel lea acentos correctamente
    const csv = '﻿' + headers.join(',') + '\n' + filas.join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const fecha = new Date().toISOString().split('T')[0];
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventario-petstation-${fecha}.csv`;
    a.click();
    URL.revokeObjectURL(url);
};
</script>

<style scoped>
@reference "../../../style.css";

.search-input { @apply w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 p-4 pl-12 rounded-2xl text-[10px] font-black uppercase tracking-widest focus:border-ps-blue outline-none transition-all; }
.btn-add { @apply bg-ps-blue text-white px-8 py-4 rounded-2xl font-[1000] uppercase text-[10px] italic shadow-xl hover:bg-black transition-all whitespace-nowrap; }
.btn-export { @apply bg-green-600 text-white px-6 py-4 rounded-2xl font-[1000] uppercase text-[10px] italic shadow-xl hover:bg-green-700 transition-all whitespace-nowrap; }
.stock-pill { @apply px-3 py-1 rounded-lg text-[9px] font-black border uppercase; }
.tool-btn { @apply w-8 h-8 flex items-center justify-center bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl hover:scale-110 transition-all; }
.page-btn { @apply px-4 py-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-[9px] font-black hover:bg-ps-blue hover:text-white disabled:opacity-30 transition-all; }

.modal-overlay { @apply fixed inset-0 z-[7000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md; }
.modal-window { @apply bg-white dark:bg-[#080808] w-full max-w-4xl rounded-[3rem] p-10 shadow-2xl max-h-[92vh] overflow-y-auto border border-white/10; }
.admin-input { @apply w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 p-4 rounded-xl text-xs font-bold focus:border-ps-blue outline-none transition-all dark:text-white; }
.label { @apply text-[9px] font-black uppercase opacity-40 block mb-1 ml-3 tracking-widest; }
.btn-save-full { @apply md:col-span-3 bg-ps-red text-white py-6 rounded-[2rem] font-[1000] uppercase italic shadow-xl shadow-ps-red/20 active:scale-95 transition-all mt-4 tracking-widest; }
.btn-sync { @apply bg-ps-blue text-white px-8 py-3 rounded-2xl font-[1000] uppercase text-[10px] italic shadow-xl hover:bg-ps-red transition-all disabled:opacity-50 whitespace-nowrap; }
.btn-close { @apply w-12 h-12 flex items-center justify-center bg-ps-red text-white rounded-2xl hover:rotate-90 transition-all shadow-lg; }
</style>