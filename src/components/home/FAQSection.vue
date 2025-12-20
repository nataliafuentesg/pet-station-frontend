<template>
  <section class="max-w-4xl mx-auto py-20 px-6">
    <div class="text-center mb-12">
      <h2 class="text-4xl font-black text-ps-blue uppercase italic tracking-tighter">Preguntas <span class="text-ps-red">Frecuentes</span></h2>
      <p class="text-slate-500 mt-2">Todo lo que necesitas saber antes de visitarnos en Chía.</p>
    </div>

    <div class="grid gap-4">
      <div v-for="(faq, i) in faqs" :key="i" class="bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm">
        <button @click="openIndex = openIndex === i ? null : i" class="w-full p-6 text-left flex justify-between items-center group">
          <span class="font-black text-ps-blue text-xs uppercase tracking-widest group-hover:text-ps-red transition-colors">{{ faq.q }}</span>
          <span class="text-ps-red text-2xl leading-none">{{ openIndex === i ? '−' : '+' }}</span>
        </button>
        <transition name="expand">
          <div v-if="openIndex === i" class="px-6 pb-6 text-slate-500 text-sm leading-relaxed italic">
            {{ faq.a }}
          </div>
        </transition>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
const openIndex = ref(null);
const faqs = [
  { q: '¿Qué objetos puedo llevar a peluquería?', a: 'Por seguridad y bienestar, no se admiten collares, correas, camas ni juguetes. Nosotros proveemos todo lo necesario.' },
  { q: '¿Tienen servicio de urgencias?', a: 'Atendemos urgencias dentro de nuestro horario habitual (Lun-Sáb 9-7pm, Dom 9-3pm). Fuera de horario, recomendamos clínicas 24h.' },
  { q: '¿Cómo funcionan los trámites de viaje?', a: 'Realizamos el certificado de salud, implantación de microchip y asesoría sobre requisitos ICA según tu destino.' },
  { q: '¿Qué productos usan en peluquería?', a: 'Usamos exclusivamente la línea profesional Hydra. Si tu mascota tiene piel sensible, puedes traer su shampoo medicado.' }
];
</script>

<style scoped>
.expand-enter-active, .expand-leave-active { transition: all 0.3s ease; max-height: 200px; }
.expand-enter-from, .expand-leave-to { max-height: 0; opacity: 0; }
</style>