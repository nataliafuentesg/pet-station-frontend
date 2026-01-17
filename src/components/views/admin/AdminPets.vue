<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in zoom-in duration-300">
    <div v-for="m in filtered" :key="m.id" class="pet-card group">
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
          <p class="stat-val" :class="m.ultimaVacuna ? 'text-green-500' : 'text-ps-red'">{{ m.ultimaVacuna || 'PENDIENTE' }}</p>
        </div>
        <div class="stat-box">
          <p class="stat-label">Nacimiento</p>
          <p class="stat-val">{{ m.fechaNacimiento || '---' }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
const props = defineProps(['mascotas', 'searchQuery']);
const filtered = computed(() => {
    const q = (props.searchQuery || '').toLowerCase();
    return (props.mascotas || []).filter(m => m.nombre?.toLowerCase().includes(q) || m.tutorNombre?.toLowerCase().includes(q));
});
</script>

<style scoped>
@reference "../../../style.css";

.pet-card { @apply bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-6 rounded-[2.5rem] hover:scale-[1.02] transition-all; }
.avatar { @apply w-16 h-16 rounded-2xl bg-slate-100 dark:bg-white/10 overflow-hidden shrink-0 border-2 border-transparent group-hover:border-ps-blue transition-all; }
.pet-name { @apply text-lg font-[1000] uppercase italic leading-none truncate dark:text-white; }
.pet-breed { @apply text-[9px] font-black text-ps-blue uppercase tracking-tighter mt-1; }
.pet-tutor { @apply text-[8px] opacity-50 font-bold uppercase truncate mt-0.5; }

.pet-stats { @apply mt-4 pt-4 border-t border-slate-100 dark:border-white/5 grid grid-cols-2 gap-2; }
.stat-box { @apply text-center bg-slate-50 dark:bg-black p-2 rounded-xl; }
.stat-label { @apply text-[7px] opacity-50 uppercase font-black mb-1; }
.stat-val { @apply text-[9px] font-black uppercase; }
</style>