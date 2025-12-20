<template>
  <div class="flex flex-col items-center justify-center p-12 animate-fade-in">
    <div class="relative">
      <div class="w-20 h-20 border-4 border-slate-100 border-t-ps-red rounded-full animate-spin"></div>
      
      <div class="absolute inset-0 flex items-center justify-center animate-pulse">
        <span class="text-3xl">🐾</span>
      </div>
    </div>
    
    <div class="mt-6 text-center">
      <p class="text-ps-blue font-black uppercase tracking-widest text-xs">Preparando Experiencia</p>
      <p class="text-slate-400 text-[10px] font-bold mt-1 uppercase italic">Pet Station Low-Stress Mode</p>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>