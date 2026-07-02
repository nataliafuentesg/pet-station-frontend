<template>
  <div class="space-y-6">

    <!-- Buscador -->
    <div class="relative">
      <span class="absolute left-4 top-1/2 -translate-y-1/2 opacity-40">🔍</span>
      <input v-model="q" @input="buscar" placeholder="Buscar por nombre, email..."
        class="w-full pl-10 pr-4 py-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-sm font-bold dark:text-white focus:outline-none focus:ring-2 focus:ring-[#152C77]" />
    </div>

    <!-- Tabla -->
    <div class="bg-white dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10 overflow-hidden">
      <div v-if="loading" class="py-20 text-center">
        <div class="w-8 h-8 border-4 border-[#DE1F27] border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
      <table v-else class="w-full text-left">
        <thead class="bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-white/10">
          <tr>
            <th class="px-5 py-3 text-[8px] font-black uppercase opacity-40 tracking-widest">Tutor / Propietario</th>
            <th class="px-5 py-3 text-[8px] font-black uppercase opacity-40 tracking-widest">Email</th>
            <th class="px-5 py-3 text-[8px] font-black uppercase opacity-40 tracking-widest">Teléfono</th>
            <th class="px-5 py-3 text-[8px] font-black uppercase opacity-40 tracking-widest">Pacientes</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 dark:divide-white/5">
          <tr v-for="u in usuarios" :key="u.id"
            class="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
            <td class="px-5 py-3 font-[1000] uppercase italic text-sm dark:text-white">
              {{ u.nombre }} {{ u.apellido }}
            </td>
            <td class="px-5 py-3 text-[11px] font-bold text-slate-500 dark:text-slate-400">{{ u.email }}</td>
            <td class="px-5 py-3 text-[11px] font-bold text-slate-500 dark:text-slate-400">
              <a v-if="u.telefono" :href="`https://wa.me/57${u.telefono.replace(/\D/g,'')}`"
                target="_blank" class="text-[#25D366] font-black hover:underline">
                💬 {{ u.telefono }}
              </a>
              <span v-else class="opacity-30">—</span>
            </td>
            <td class="px-5 py-3">
              <div class="flex flex-wrap gap-1">
                <span v-for="m in u.mascotas" :key="m.id"
                  class="px-2 py-1 bg-[#152C77] text-white rounded-lg text-[8px] font-black italic">
                  🐾 {{ m.nombre }}
                </span>
                <span v-if="!u.mascotas?.length" class="text-[9px] opacity-30 font-bold">Sin mascotas</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Paginación -->
    <div class="flex items-center justify-between">
      <p class="text-[10px] font-bold text-slate-400">{{ total.toLocaleString() }} usuarios registrados · página {{ page + 1 }} de {{ paginas }}</p>
      <div class="flex gap-2">
        <button @click="page--; cargar()" :disabled="page === 0"
          class="px-4 py-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-[10px] font-black disabled:opacity-30">
          ← Anterior
        </button>
        <button @click="page++; cargar()" :disabled="page >= paginas - 1"
          class="px-4 py-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-[10px] font-black disabled:opacity-30">
          Siguiente →
        </button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/api/axios';

const usuarios = ref([]);
const total = ref(0);
const paginas = ref(1);
const page = ref(0);
const q = ref('');
const loading = ref(false);
let debounceTimer = null;

const cargar = async () => {
  loading.value = true;
  try {
    const { data } = await api.get('/admin/usuarios/lista', {
      params: { q: q.value, page: page.value, size: 40 }
    });
    usuarios.value = data.usuarios;
    total.value = data.total;
    paginas.value = data.paginas;
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
