<template>
  <div class="flex flex-col items-center justify-start w-full px-4 pt-32 md:pt-48 pb-20 min-h-screen overflow-y-auto">
    
    <div class="text-center mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
      <h2 class="text-3xl md:text-5xl font-black uppercase italic tracking-tighter text-white">
        ¿Quién viene <span class="text-[#DE1F27]">hoy?</span>
      </h2>
      <p class="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] mt-4">Selecciona un perfil para continuar</p>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-10 md:gap-16 max-w-6xl w-full justify-items-center">
      
      <div v-for="pet in availablePets" :key="pet.id" 
        @click="$emit('selected', pet)"
        class="group cursor-pointer flex flex-col items-center gap-5 transition-all hover:scale-110 active:scale-95">
        
        <div class="relative">
          <div class="w-32 h-32 md:w-44 md:h-44 rounded-full border-4 border-white/10 overflow-hidden shadow-2xl group-hover:border-[#152C77] transition-all duration-500">
            <img v-if="pet.fotoUrl || pet.foto" :src="pet.fotoUrl || pet.foto" class="w-full h-full object-cover" />
            <div v-else class="w-full h-full bg-[#152C77]/30 flex items-center justify-center text-3xl font-black italic text-white/20">
              {{ pet.nombre.charAt(0) }}
            </div>
          </div>
          
          <div class="absolute inset-0 bg-[#152C77]/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
            <span class="text-white font-black text-[10px] uppercase tracking-widest bg-black/40 px-4 py-2 rounded-full border border-white/20">Entrar</span>
          </div>
        </div>
        
        <p class="text-[12px] font-black uppercase tracking-[0.2em] text-white/80 group-hover:text-white transition-colors italic">
          {{ pet.nombre }}
        </p>
      </div>

      <div @click="$emit('createNew')"
        class="group cursor-pointer flex flex-col items-center gap-5 transition-all hover:scale-105 active:scale-95">
        
        <div class="w-32 h-32 md:w-44 md:h-44 rounded-full border-4 border-dashed border-white/10 flex items-center justify-center group-hover:border-[#DE1F27] group-hover:bg-[#DE1F27]/5 transition-all duration-500">
          <span class="text-5xl text-white/10 group-hover:text-[#DE1F27] font-light transition-colors">+</span>
        </div>
        
        <p class="text-[12px] font-black uppercase tracking-[0.2em] text-white/20 group-hover:text-[#DE1F27] transition-colors">
          Añadir
        </p>
      </div>

    </div>

    <button @click="$emit('logout')" class="mt-24 text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-[#DE1F27] transition-colors border-b border-transparent hover:border-[#DE1F27] pb-1">
      Cerrar Sesión de Tutor
    </button>
  </div>
</template>

<script setup>
defineProps(['availablePets', 'tutorLogueado']);
defineEmits(['selected', 'createNew', 'openLogin', 'openActivation', 'logout']);
</script>

<style scoped>
/* Animación suave de entrada para los perfiles */
.grid > div {
  animation: profile-pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  opacity: 0;
  transform: scale(0.5);
}

@keyframes profile-pop {
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Retraso progresivo para cada perfil */
.grid > div:nth-child(1) { animation-delay: 0.1s; }
.grid > div:nth-child(2) { animation-delay: 0.2s; }
.grid > div:nth-child(3) { animation-delay: 0.3s; }
.grid > div:nth-child(4) { animation-delay: 0.4s; }
</style>