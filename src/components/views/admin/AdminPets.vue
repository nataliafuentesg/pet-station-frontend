<template>
  <div class="space-y-6">

    <!-- Buscador -->
    <div class="relative">
      <span class="absolute left-4 top-1/2 -translate-y-1/2 opacity-40">🔍</span>
      <input v-model="q" @input="buscar" placeholder="Buscar por nombre, especie, raza o tutor..."
        class="w-full pl-10 pr-4 py-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-sm font-bold dark:text-white focus:outline-none focus:ring-2 focus:ring-[#152C77]" />
    </div>

    <!-- Grid de tarjetas -->
    <div v-if="loading" class="py-20 text-center">
      <div class="w-8 h-8 border-4 border-[#DE1F27] border-t-transparent rounded-full animate-spin mx-auto"></div>
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="m in mascotas" :key="m.id" class="pet-card group">
        <div class="flex items-center gap-4">
          <div class="avatar">
            <img v-if="m.fotoUrl" :src="m.fotoUrl" class="w-full h-full object-cover" />
            <div v-else class="w-full h-full flex items-center justify-center text-2xl">🐾</div>
          </div>
          <div class="min-w-0">
            <h3 class="pet-name">{{ m.nombre }}</h3>
            <p class="pet-breed">{{ m.especie }} | {{ m.raza }}</p>
            <p class="pet-tutor">Tutor: {{ m.tutorNombre }}</p>
          </div>
        </div>
        <div class="pet-stats">
          <div class="stat-box">
            <p class="stat-label">Últ. Vacuna</p>
            <p class="stat-val" :class="m.ultimaVacuna ? 'text-green-500' : 'text-[#DE1F27]'">
              {{ m.ultimaVacuna || 'PENDIENTE' }}
            </p>
          </div>
          <div class="stat-box">
            <p class="stat-label">Nacimiento</p>
            <p class="stat-val">{{ m.fechaNacimiento || '---' }}</p>
          </div>
        </div>
      </div>
      <div v-if="!mascotas.length" class="col-span-4 py-20 text-center text-slate-400 font-bold">
        No se encontraron pacientes
      </div>
    </div>

    <!-- Paginación -->
    <div class="flex items-center justify-between">
      <p class="text-[10px] font-bold text-slate-400">{{ total.toLocaleString() }} pacientes · página {{ page + 1 }} de {{ paginas }}</p>
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

const mascotas = ref([]);
const total = ref(0);
const paginas = ref(1);
const page = ref(0);
const q = ref('');
const loading = ref(false);
let debounceTimer = null;

const cargar = async () => {
  loading.value = true;
  try {
    const { data } = await api.get('/admin/mascotas/todas', {
      params: { q: q.value, page: page.value, size: 60 }
    });
    mascotas.value = data.mascotas;
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

<style scoped>
@reference "../../../style.css";
.pet-card { @apply bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-6 rounded-[2.5rem] hover:scale-[1.02] transition-all; }
.avatar { @apply w-16 h-16 rounded-2xl bg-slate-100 dark:bg-white/10 overflow-hidden shrink-0 border-2 border-transparent group-hover:border-[#152C77] transition-all; }
.pet-name { @apply text-lg font-[1000] uppercase italic leading-none truncate dark:text-white; }
.pet-breed { @apply text-[9px] font-black text-[#152C77] uppercase tracking-tighter mt-1; }
.pet-tutor { @apply text-[8px] opacity-50 font-bold uppercase truncate mt-0.5; }
.pet-stats { @apply mt-4 pt-4 border-t border-slate-100 dark:border-white/5 grid grid-cols-2 gap-2; }
.stat-box { @apply text-center bg-slate-50 dark:bg-black p-2 rounded-xl; }
.stat-label { @apply text-[7px] opacity-50 uppercase font-black mb-1; }
.stat-val { @apply text-[9px] font-black uppercase; }
</style>
