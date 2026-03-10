<template>
  <div class="h-[100dvh] md:min-h-screen flex flex-col justify-start md:justify-center items-center bg-white dark:bg-[#050505] -mt-24 md:mt-0 px-6 pt-32 md:pt-0 transition-colors duration-500 overflow-hidden">
    
    <div class="w-full max-w-[360px] md:max-w-[450px] bg-slate-50 dark:bg-[#0A0A0A] rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden relative z-[10]">
      
      <div class="h-1.5 w-full bg-[#DE1F27]"></div>

      <div class="p-8 md:p-12 flex flex-col items-center text-center">
        
        <div class="text-xl md:text-3xl font-[1000] italic uppercase tracking-tighter mb-4 md:mb-8">
          <span class="text-[#DE1F27]">PET</span><span class="dark:text-white text-[#152C77]"> STATION</span>
        </div>

        <div class="space-y-2 mb-6 md:mb-10">
          <h1 class="text-[11px] md:text-base font-[1000] uppercase italic tracking-widest text-[#152C77] dark:text-white leading-none">
            ¡BIENVENIDA COMUNIDAD <span class="text-[#DE1F27]">@LAGAITA</span>!
          </h1>
          <p class="text-[9px] md:text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tighter">
            Tu beneficio exclusivo de Grooming está listo
          </p>
        </div>

        <div class="w-full bg-[#152C77] dark:bg-white/5 p-6 md:p-8 rounded-[2rem] border border-white/10 shadow-inner mb-8 md:mb-10">
          <span class="text-[7px] md:text-[8px] font-[1000] uppercase tracking-widest text-white/60 mb-2 block">Usa este código en WhatsApp</span>
          <div class="text-3xl md:text-4xl font-[1000] text-white tracking-[0.15em] italic uppercase leading-none">
            GAITAPETS
          </div>
        </div>

        <div class="w-full space-y-3">
          <p class="text-[7px] md:text-[8px] font-black uppercase tracking-[0.4em] text-slate-400 animate-pulse">
            Redirigiendo a reserva
          </p>
          <div class="w-full h-1 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
            <div class="h-full bg-[#DE1F27] rounded-full animate-progress-grow"></div>
          </div>
        </div>

      </div>
    </div>
    
    <div class="mt-8 opacity-20 md:hidden">
       <span class="text-[9px] font-black uppercase tracking-[0.4em] text-[#152C77] dark:text-white italic">Alianza Exclusiva 2026</span>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';

onMounted(() => {
  setTimeout(() => {
    const phone = "573208221778";
    const msg = encodeURIComponent("¡Hola Pet Station! 🐾 Soy parte de la comunidad de @lagaita y quiero redimir mi beneficio GAITAPETS.");
    window.location.href = `https://wa.me/${phone}?text=${msg}`;
  }, 3000);
});
</script>

<style scoped>
.animate-progress-grow {
  width: 0%;
  animation: grow 3s linear forwards;
}

@keyframes grow {
  from { width: 0%; }
  to { width: 100%; }
}
</style>