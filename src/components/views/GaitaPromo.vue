<template>
  <div class="min-h-screen flex items-center justify-center p-6 bg-white dark:bg-[#050505] transition-colors duration-500">
    
    <div class="w-full max-w-[450px] bg-slate-50 dark:bg-[#0A0A0A] rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden relative">
      
      <div class="h-2 w-full bg-[#DE1F27]"></div>

      <div class="p-8 md:p-12 flex flex-col items-center text-center">
        
        <div class="text-3xl font-[1000] italic uppercase tracking-tighter mb-8">
          <span class="text-[#DE1F27]">PET</span><span class="dark:text-white text-[#152C77]"> STATION</span>
        </div>

        <div class="space-y-4 mb-10">
          <h1 class="text-sm md:text-base font-[1000] uppercase italic tracking-widest text-[#152C77] dark:text-white">
            ¡Hola comunidad de <span class="text-[#DE1F27]">@lagaita</span>!
          </h1>
          <p class="text-[11px] font-bold text-slate-500 dark:text-slate-400 leading-relaxed uppercase tracking-tight">
            Estás a un paso de redimir tu beneficio exclusivo para el cuidado de tu mascota.
          </p>
        </div>

        <div class="w-full bg-[#152C77] dark:bg-white/5 p-6 rounded-[2rem] border border-white/10 shadow-inner mb-10 group hover:scale-[1.02] transition-transform">
          <span class="text-[9px] font-[1000] uppercase tracking-[0.2em] text-white/60 mb-2 block">Tu Código Especial</span>
          <div class="text-3xl md:text-4xl font-[1000] text-white tracking-[0.15em] italic">
            GAITAPETS
          </div>
        </div>

        <div class="w-full space-y-4">
          <p class="text-[9px] font-black uppercase tracking-widest text-slate-400 animate-pulse">
            Redirigiéndote al WhatsApp de Citas...
          </p>
          <div class="w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
            <div class="h-full bg-[#DE1F27] rounded-full animate-progress-grow"></div>
          </div>
        </div>

      </div>

      <div class="absolute -bottom-10 -right-10 opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
        <svg class="w-40 h-40 fill-current text-[#152C77] dark:text-white" viewBox="0 0 24 24">
           <path d="M12,2C10.9,2,10,2.9,10,4s0.9,2,2,2s2-0.9,2-2S13.1,2,12,2z M7,7c-1.1,0-2,0.9-2,2s0.9,2,2,2s2-0.9,2-2S8.1,7,7,7z M17,7 c-1.1,0-2,0.9-2,2s0.9,2,2,2s2-0.9,2-2S18.1,7,17,7z M12,11c-2.2,0-4,1.8-4,4s1.8,4,4,4s4-1.8,4-4S14.2,11,12,11z"/>
        </svg>
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