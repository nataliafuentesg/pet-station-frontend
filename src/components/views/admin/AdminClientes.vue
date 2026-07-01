<template>
  <div class="space-y-6">

    <!-- Stats -->
    <div class="grid grid-cols-2 gap-4">
      <div class="bg-white dark:bg-white/5 rounded-2xl p-5 border border-slate-100 dark:border-white/10">
        <p class="text-[8px] font-black uppercase opacity-40 tracking-widest mb-1">Total clientes</p>
        <p class="text-3xl font-[1000] italic text-[#152C77] dark:text-white">{{ total.toLocaleString() }}</p>
        <p class="text-[9px] font-bold text-slate-400 mt-1">importados de Aliaddo</p>
      </div>
      <div class="bg-white dark:bg-white/5 rounded-2xl p-5 border border-slate-100 dark:border-white/10">
        <p class="text-[8px] font-black uppercase opacity-40 tracking-widest mb-1">Con cuenta activa</p>
        <p class="text-3xl font-[1000] italic text-green-600">{{ registrados.toLocaleString() }}</p>
        <p class="text-[9px] font-bold text-slate-400 mt-1">se registraron en la web</p>
      </div>
    </div>

    <!-- Buscador -->
    <div class="flex gap-3">
      <div class="relative flex-1">
        <span class="absolute left-4 top-1/2 -translate-y-1/2 opacity-40">🔍</span>
        <input v-model="q" @input="buscar" placeholder="Buscar por nombre, email o cédula..."
          class="w-full pl-10 pr-4 py-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-sm font-bold dark:text-white focus:outline-none focus:ring-2 focus:ring-[#152C77]" />
      </div>
    </div>

    <!-- Tabla -->
    <div class="bg-white dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10 overflow-hidden">
      <div v-if="loading" class="py-20 text-center">
        <div class="w-8 h-8 border-4 border-[#DE1F27] border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
      <table v-else class="w-full text-[11px]">
        <thead class="bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-white/10">
          <tr>
            <th class="text-left px-4 py-3 font-black uppercase opacity-40 tracking-widest text-[8px]">Nombre</th>
            <th class="text-left px-4 py-3 font-black uppercase opacity-40 tracking-widest text-[8px]">Email</th>
            <th class="text-left px-4 py-3 font-black uppercase opacity-40 tracking-widest text-[8px]">Teléfono</th>
            <th class="text-left px-4 py-3 font-black uppercase opacity-40 tracking-widest text-[8px]">Estado</th>
            <th class="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 dark:divide-white/5">
          <tr v-for="c in clientes" :key="c.id" class="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
            <td class="px-4 py-3 font-bold dark:text-white">{{ c.nombre }} {{ c.apellido }}</td>
            <td class="px-4 py-3 text-slate-500 dark:text-slate-400">{{ c.email }}</td>
            <td class="px-4 py-3 text-slate-500 dark:text-slate-400">{{ c.telefono || '—' }}</td>
            <td class="px-4 py-3">
              <span :class="[
                'px-2 py-1 rounded-lg text-[8px] font-black uppercase',
                c.password === 'ALIADDO_IMPORT'
                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'
                  : 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400'
              ]">
                {{ c.password === 'ALIADDO_IMPORT' ? 'Sin cuenta' : 'Registrado' }}
              </span>
            </td>
            <td class="px-4 py-3">
              <a v-if="c.telefono" :href="`https://wa.me/57${c.telefono.replace(/\D/g,'')}?text=Hola ${c.nombre}, te escribimos de Pet Station 🐾`"
                target="_blank"
                class="text-[#25D366] hover:text-green-600 font-black text-lg">💬</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Paginación -->
    <div class="flex items-center justify-between">
      <p class="text-[10px] font-bold text-slate-400">{{ total.toLocaleString() }} clientes · página {{ page + 1 }} de {{ paginas }}</p>
      <div class="flex gap-2">
        <button @click="page--; cargar()" :disabled="page === 0"
          class="px-4 py-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-[10px] font-black disabled:opacity-30">← Anterior</button>
        <button @click="page++; cargar()" :disabled="page >= paginas - 1"
          class="px-4 py-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-[10px] font-black disabled:opacity-30">Siguiente →</button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/api/axios';

const clientes = ref([]);
const total = ref(0);
const paginas = ref(1);
const registrados = ref(0);
const page = ref(0);
const q = ref('');
const loading = ref(false);
let debounceTimer = null;

const cargar = async () => {
  loading.value = true;
  try {
    const { data } = await api.get('/tutores/admin/lista', {
      params: { q: q.value, page: page.value, size: 50 }
    });
    clientes.value = data.clientes;
    total.value = data.total;
    paginas.value = data.paginas;
    registrados.value = data.registrados;
  } finally {
    loading.value = false;
  }
};

const buscar = () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => { page.value = 0; cargar(); }, 400);
};

onMounted(cargar);
</script>
