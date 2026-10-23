<template>
  <div class="min-h-screen bg-white dark:bg-[#050505] pt-5 md:pt-32 transition-colors duration-500">
    <div class="max-w-7xl mx-auto px-4 md:px-6 pb-20">

      <router-link to="/servicios" class="text-[#152C77] dark:text-white font-black uppercase text-[10px] tracking-widest mb-8 inline-flex items-center gap-2 hover:gap-4 transition-all">
        ← Volver a Servicios
      </router-link>

      <div class="flex flex-col items-center justify-center text-center py-20 gap-8" data-reveal>
        <div class="reveal-child" style="--cd:0">
          <div class="w-20 h-20 bg-[#152C77] rounded-3xl flex items-center justify-center text-4xl mx-auto mb-6 shadow-xl">🦴</div>
          <span class="text-[9px] font-black uppercase text-[#DE1F27] tracking-widest">Ortopedia & Traumatología Veterinaria</span>
          <h1 class="text-4xl md:text-6xl font-[1000] uppercase italic text-[#152C77] dark:text-white leading-[0.95] tracking-tighter mt-4">
            MUY<br /><span class="text-[#DE1F27]">PRONTO.</span>
          </h1>
          <p class="text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] md:text-xs mt-8 leading-relaxed max-w-md mx-auto">
            Estamos preparando algo grande. Próximamente tendremos disponible nuestro servicio de cirugía ortopédica y traumatología veterinaria avanzada.
          </p>
        </div>

        <div class="reveal-child mt-4" style="--cd:1">
          <a href="https://wa.me/573053462413?text=Hola%20Pet%20Station!%20Quiero%20información%20sobre%20ortopedia%20veterinaria."
            target="_blank"
            class="inline-flex items-center gap-3 bg-[#152C77] hover:bg-[#DE1F27] text-white px-8 py-5 rounded-2xl font-[1000] uppercase text-[10px] tracking-widest shadow-xl transition-all hover:scale-[1.02] active:scale-95">
            💬 Contáctanos para más información
          </a>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useSeo } from '@/composables/useSeo';
import { useReveal } from '@/composables/useReveal';

onMounted(() => {
  useReveal();
  useSeo({
    titulo: 'Ortopedia Veterinaria en Chía · Próximamente | Pet Station',
    descripcion: 'Próximamente: cirugía ortopédica y traumatología veterinaria avanzada en Pet Station Chía. TPLO, TTA, displasia de cadera y más.',
    url: 'https://petstationvet.com/servicios/ortopedia'
  });
});
</script>
