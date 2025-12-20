<template>
  <div class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0f172a] text-white">
    
    <h1 class="text-3xl md:text-5xl font-bold mb-12 animate-fade-in">
      ¿Para quién compramos hoy?
    </h1>

    <div class="flex flex-wrap justify-center gap-10">
      
      <div 
        @click="select('dog')" 
        class="group flex flex-col items-center cursor-pointer"
      >
        <div class="w-36 h-36 md:w-48 md:h-48 rounded-xl bg-[#152c77] flex items-center justify-center border-4 border-transparent group-hover:border-[#de1f27] group-hover:scale-105 transition-all duration-300 shadow-2xl">
          <span class="text-6xl md:text-8xl group-hover:animate-bounce">🐶</span>
        </div>
        <span class="mt-4 text-xl font-medium text-slate-300 group-hover:text-white">Perros</span>
      </div>

      <div 
        @click="select('cat')" 
        class="group flex flex-col items-center cursor-pointer"
      >
        <div class="w-36 h-36 md:w-48 md:h-48 rounded-xl bg-[#152c77] flex items-center justify-center border-4 border-transparent group-hover:border-[#de1f27] group-hover:scale-105 transition-all duration-300 shadow-2xl">
          <span class="text-6xl md:text-8xl group-hover:animate-bounce">🐱</span>
        </div>
        <span class="mt-4 text-xl font-medium text-slate-300 group-hover:text-white">Gatos</span>
      </div>

      <div 
        @click="select('both')" 
        class="group flex flex-col items-center cursor-pointer"
      >
        <div class="w-36 h-36 md:w-48 md:h-48 rounded-xl bg-slate-800 flex items-center justify-center border-4 border-transparent group-hover:border-white group-hover:scale-105 transition-all duration-300 shadow-2xl">
          <span class="text-5xl md:text-7xl">🐾</span>
        </div>
        <span class="mt-4 text-xl font-medium text-slate-400 group-hover:text-white">Ver Todo</span>
      </div>

    </div>

    <button class="mt-16 text-slate-500 hover:text-[#de1f27] transition-colors font-medium border border-slate-700 px-6 py-2 rounded-full">
      Administrar perfiles de mascotas
    </button>
  </div>
</template>

<script setup>
// Definimos los eventos que este componente puede enviar al padre (App.vue)
const emit = defineEmits(['selected']);

const select = (type) => {
  emit('selected', type);
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.8s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>