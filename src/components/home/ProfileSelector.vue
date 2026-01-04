<template>
  <div class="flex flex-col items-center justify-start w-full px-4 pt-40 pb-20 min-h-screen">
    
    <div class="text-center mb-20 animate-in fade-in slide-in-from-bottom-10 duration-1000">
      <h2 class="text-5xl md:text-7xl font-[1000] uppercase italic tracking-[ -0.05em] dark:text-white text-[#152C77]">
        ¿Quién viene <span class="text-[#DE1F27] drop-shadow-sm">hoy?</span>
      </h2>
      <div class="flex items-center justify-center gap-4 mt-6">
        <div class="h-[2px] w-10 bg-[#DE1F27]"></div>
        <p class="text-slate-400 dark:text-white/20 text-[11px] font-black uppercase tracking-[0.5em]">Mis Mascotas</p>
        <div class="h-[2px] w-10 bg-[#DE1F27]"></div>
      </div>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-12 gap-y-16 max-w-6xl w-full">
      
      <div v-for="pet in availablePets" :key="pet.id" class="group relative flex flex-col items-center gap-8">
        
        <div class="absolute -top-4 -right-2 z-30 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <button v-if="confirmingId !== pet.id" @click="confirmingId = pet.id" 
            class="bg-white dark:bg-[#1a1a1a] p-3 rounded-2xl shadow-2xl border border-slate-100 dark:border-white/10 text-slate-300 hover:text-red-500 hover:scale-110 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div v-else class="flex flex-col gap-2 animate-in zoom-in duration-200">
            <button @click="confirmDelete(pet.id)" class="bg-red-600 text-white text-[8px] font-black px-5 py-2.5 rounded-xl shadow-lg hover:bg-red-700">BORRAR</button>
            <button @click="confirmingId = null" class="bg-slate-800 text-white text-[8px] font-black px-5 py-2.5 rounded-xl shadow-lg">NO</button>
          </div>
        </div>

        <div @click="$emit('selected', pet)" class="relative cursor-pointer transition-all duration-700 hover:scale-110 active:scale-95 group/avatar">
          <div :class="[
            'w-40 h-40 md:w-52 md:h-52 rounded-[3.5rem] border-[6px] overflow-hidden transition-all duration-700 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)]', 
            confirmingId === pet.id ? 'border-red-600 grayscale blur-[2px]' : 'border-white dark:border-white/5 group-hover:border-[#152C77] dark:group-hover:border-[#DE1F27] group-hover:rotate-3'
          ]">
            <img v-if="pet.fotoUrl" :src="pet.fotoUrl" class="w-full h-full object-cover transition-transform duration-700 group-hover/avatar:scale-110" />
            
            <div v-else class="w-full h-full bg-slate-50 dark:bg-white/5 flex items-center justify-center text-6xl font-[1000] italic text-[#152C77]/10 dark:text-white/10">
              {{ pet.nombre.charAt(0) }}
            </div>
          </div>

          <div class="absolute inset-0 rounded-[3.5rem] bg-[#152C77]/40 dark:bg-[#DE1F27]/20 opacity-0 group-hover:opacity-100 flex items-center justify-center backdrop-blur-[2px] transition-all duration-500">
            <div class="bg-white dark:bg-black px-8 py-3 rounded-2xl shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              <span class="text-[#152C77] dark:text-white font-[1000] text-[10px] uppercase tracking-[0.2em]">Entrar</span>
            </div>
          </div>
        </div>

        <div class="flex flex-col items-center gap-1">
          <p class="text-[14px] font-[1000] uppercase tracking-[0.2em] italic text-slate-400 dark:text-white/40 group-hover:text-[#152C77] dark:group-hover:text-white transition-all duration-500">
            {{ pet.nombre }}
          </p>
          <div class="h-1 w-0 group-hover:w-full bg-[#DE1F27] transition-all duration-500"></div>
        </div>
      </div>

      <div @click="$emit('createNew')" class="group cursor-pointer flex flex-col items-center gap-8">
        <div class="w-40 h-40 md:w-52 md:h-52 rounded-[3.5rem] border-4 border-dashed border-slate-200 dark:border-white/10 flex items-center justify-center group-hover:border-[#DE1F27] group-hover:bg-[#DE1F27]/5 transition-all duration-500 hover:scale-105 active:scale-95">
          <div class="relative">
            <span class="text-6xl text-slate-200 dark:text-white/10 group-hover:text-[#DE1F27] font-light transition-colors">+</span>
          </div>
        </div>
        <p class="text-[12px] font-black uppercase tracking-[0.3em] text-slate-300 dark:text-white/20 group-hover:text-[#DE1F27]">Añadir Mascota</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps(['availablePets']);
const emit = defineEmits(['selected', 'createNew', 'deletePet']);
const confirmingId = ref(null);

const confirmDelete = (id) => {
  emit('deletePet', id);
  confirmingId.value = null;
};
</script>