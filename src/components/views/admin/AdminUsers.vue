<template>
  <div class="admin-card overflow-hidden p-0 animate-in zoom-in duration-300">
    <table class="w-full text-left">
      <thead class="bg-slate-50 dark:bg-white/5 text-[10px] uppercase opacity-50 font-black">
        <tr>
          <th class="p-6">Tutor / Propietario</th>
          <th class="p-6">Email de Contacto</th>
          <th class="p-6 text-center">Pacientes Vinculados</th>
        </tr>
      </thead>
      <tbody class="text-xs font-bold">
        <tr v-for="tutor in filtered" :key="tutor.id" class="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50/50 dark:hover:bg-white/5 transition-all">
          <td class="p-6 uppercase italic font-[1000] text-sm">{{ tutor.nombre }} {{ tutor.apellido }}</td>
          <td class="p-6 opacity-70 font-black tracking-tighter">{{ tutor.email }}</td>
          <td class="p-6 flex flex-wrap justify-center gap-2">
            <span v-for="p in tutor.mascotas" :key="p.id" class="px-3 py-1.5 bg-ps-blue text-white rounded-xl uppercase text-[8px] font-black italic shadow-lg">🐾 {{ p.nombre }}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { computed } from 'vue';
const props = defineProps(['usuarios', 'searchQuery']);
const filtered = computed(() => {
    const q = (props.searchQuery || '').toLowerCase();
    return (props.usuarios || []).filter(u => u.nombre?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q));
});
</script>

<style scoped>
@reference "../../../style.css";
.admin-card { @apply bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[2.5rem] transition-all; }
</style>