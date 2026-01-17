<template>
  <div class="space-y-4 animate-in slide-in-from-bottom duration-300">
    <div v-for="cita in filtered" :key="cita.id" class="admin-card flex justify-between items-center hover:border-ps-blue/30 transition-all">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-2xl bg-ps-red/10 text-ps-red flex items-center justify-center font-[1000] italic text-xl">{{ cita.mascotaNombre?.charAt(0) }}</div>
        <div>
          <h3 class="font-[1000] uppercase italic text-lg leading-none dark:text-white">{{ cita.mascotaNombre }} <span class="text-[10px] not-italic opacity-40 ml-2">ID: #{{ cita.id }}</span></h3>
          <p class="text-[10px] font-black text-ps-blue uppercase mt-1">{{ cita.servicioTipo }} — {{ formatDate(cita.fechaHora) }}</p>
          <p class="text-[9px] font-bold opacity-50 dark:text-white/50">Tutor: {{ cita.tutorNombre }}</p>
        </div>
      </div>
      <div class="flex gap-4 items-center">
        <span class="px-4 py-2 bg-ps-blue/10 text-ps-blue rounded-xl text-[10px] font-black uppercase italic">{{ cita.estado || 'Confirmada' }}</span>
        <button class="bg-black text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase hover:bg-ps-red transition-all">Gestionar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
const props = defineProps(['citas', 'searchQuery']);
const filtered = computed(() => {
  const q = props.searchQuery.toLowerCase();
  return props.citas.filter(c => c.mascotaNombre.toLowerCase().includes(q) || c.tutorNombre.toLowerCase().includes(q));
});
const formatDate = (ds) => ds ? new Date(ds).toLocaleString('es-ES', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '---';
</script>