<template>
  <div class="min-h-[100dvh] flex flex-col md:justify-center items-center p-6 pt-32 md:pt-0 bg-white dark:bg-[#050505] transition-colors duration-500">
    
    <div class="w-full max-w-[450px] bg-slate-50 dark:bg-[#0A0A0A] rounded-[2rem] md:rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden relative">
      
      <div class="h-1.5 w-full bg-[#DE1F27]"></div>

      <div class="p-8 md:p-12 flex flex-col items-center text-center">
        
        <div class="text-2xl md:text-3xl font-[1000] italic uppercase tracking-tighter mb-6 md:mb-8">
          <span class="text-[#DE1F27]">PET</span><span class="dark:text-white text-[#152C77]"> STATION</span>
        </div>

        <div class="space-y-3 md:space-y-4 mb-6 md:mb-10">
          <h1 class="text-xs md:text-base font-[1000] uppercase italic tracking-widest text-[#152C77] dark:text-white">
            ¡Hola <span class="text-[#DE1F27]">@lagaita</span>!
          </h1>
          <p class="text-[10px] md:text-[11px] font-bold text-slate-500 dark:text-slate-400 leading-tight uppercase">
            Estás a un paso de redimir tu beneficio exclusivo.
          </p>
        </div>

        <div class="w-full bg-[#152C77] dark:bg-white/5 p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border border-white/10 shadow-inner mb-6 md:mb-10">
          <span class="text-[8px] font-[1000] uppercase tracking-widest text-white/60 mb-1 block">Tu Código</span>
          <div class="text-2xl md:text-4xl font-[1000] text-white tracking-widest italic uppercase">
            GAITAPETS
          </div>
        </div>

        <div class="w-full space-y-3">
          <p class="text-[8px] font-black uppercase tracking-widest text-slate-400 animate-pulse">
            Abriendo WhatsApp...
          </p>
          <div class="w-full h-1 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
            <div class="h-full bg-[#DE1F27] rounded-full animate-progress-grow"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';

onMounted(() => {
  // Tracking GA4 - Usando tu lógica de analytics
  // gtag('event', 'referral_gaita_grooming');

  setTimeout(() => {
    const textoWA = "¡Hola Pet Station! 🐾 Vengo de parte de @lagaita y quiero el descuento GAITAPETS para el servicio de Grooming.";
    window.location.href = `https://wa.me/573208221778?text=${encodeURIComponent(textoWA)}`;
  }, 3500); 
});
</script>

<style scoped>
@keyframes progress {
  from { width: 0%; }
  to { width: 100%; }
}
.animate-progress-grow {
  animation: progress 3.5s linear forwards;
}
</style>