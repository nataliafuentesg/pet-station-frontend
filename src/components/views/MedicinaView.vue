<template>
  <div class="min-h-screen bg-white dark:bg-[#050505] pt-32 pb-20 transition-colors">
    <div class="max-w-7xl mx-auto px-6">
      
      <div class="max-w-4xl mb-20 space-y-6">
        <router-link to="/servicios" class="text-ps-red font-black uppercase text-[10px] tracking-widest mb-4 block">← Volver</router-link>
        <h1 class="text-7xl md:text-8xl font-[1000] uppercase italic text-ps-blue dark:text-white leading-[0.85] tracking-tighter">
          CIENCIA <br/> <span class="text-ps-red">& CORAZÓN.</span>
        </h1>
        <p class="text-slate-600 dark:text-slate-400 font-bold uppercase italic text-sm">Medicina preventiva y especializada con equipos de última generación.</p>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="s in especialidades" :key="s.t" class="p-10 bg-slate-50 dark:bg-white/5 rounded-[3rem] border border-slate-100 dark:border-white/10 hover:border-ps-blue transition-all group">
          <span class="text-4xl mb-6 block">{{ s.icon }}</span>
          <h3 class="text-2xl font-black uppercase italic text-ps-blue dark:text-white mb-4 group-hover:text-ps-red transition-colors">{{ s.t }}</h3>
          <p class="text-[10px] text-slate-500 font-bold uppercase italic leading-relaxed mb-8">{{ s.d }}</p>
          <button @click="router.push('/agendar?servicio=CONSULTA')" class="w-full py-4 bg-ps-blue dark:bg-ps-red text-white rounded-xl font-black uppercase text-[9px] tracking-widest">Agendar</button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();
const especialidades = [
  { t: "Consulta General", d: "Examen físico detallado y planes de vacunación personalizados.", icon: "🩺" },
  { t: "Rayos X Digital", d: "Diagnóstico por imagen inmediato con mínima radiación.", icon: "🦴" },
  { t: "Cirugía", d: "Quirófano equipado para tejidos blandos y esterilizaciones.", icon: "⚔️" },
  { t: "Laboratorio", d: "Resultados rápidos de sangre, orina y citologías.", icon: "🔬" },
  { t: "Odontología", d: "Limpieza ultrasónica y profilaxis para aliento fresco.", icon: "🦷" },
  { t: "Dermatología", d: "Manejo de alergias, hongos y problemas de piel crónicos.", icon: "🧴" }
];
</script>