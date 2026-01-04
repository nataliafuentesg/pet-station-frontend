<template>
  <div class="min-h-screen bg-white dark:bg-[#050505] pt-32 pb-20 transition-colors duration-500">
    <div class="max-w-7xl mx-auto px-6">
      
      <div class="grid lg:grid-cols-2 gap-16 items-start mb-16">
        <div class="space-y-8">
          <router-link to="/servicios" class="text-ps-red font-[1000] uppercase text-[10px] tracking-[0.3em] flex items-center gap-2 hover:gap-4 transition-all">
            ← Volver al catálogo
          </router-link>
          <h1 class="text-7xl md:text-8xl font-[1000] uppercase italic text-ps-blue dark:text-white leading-[0.85] tracking-tighter">
            GLOBAL <br/> <span class="text-ps-red">TRAVEL.</span>
          </h1>
          <p class="text-slate-600 dark:text-slate-400 font-bold uppercase italic text-sm leading-relaxed max-w-md">
            Selecciona el destino de tu próximo viaje y descubre el protocolo legal necesario.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div v-for="d in destinos" :key="d.nombre" 
            @click="destinoActual = d"
            :class="[
              'cursor-pointer p-6 rounded-[2.5rem] border-2 transition-all duration-500 text-center flex flex-col items-center justify-center gap-4',
              destinoActual.nombre === d.nombre 
                ? 'border-ps-blue bg-ps-blue text-white shadow-2xl scale-105' 
                : 'border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-ps-blue dark:text-white'
            ]">
            <span class="text-4xl">{{ d.bandera }}</span>
            <p class="text-[11px] font-[1000] uppercase italic">{{ d.nombre }}</p>
          </div>
        </div>
      </div>

      <div v-if="destinoActual" class="animate-in fade-in slide-in-from-bottom-10 duration-700">
        <div class="bg-slate-50 dark:bg-white/5 rounded-[4rem] p-8 md:p-16 border border-slate-200 dark:border-white/10">
          <div class="grid lg:grid-cols-3 gap-12">
            
            <div class="space-y-6">
              <span class="text-ps-red font-black uppercase text-xs italic tracking-widest">Requisitos para {{ destinoActual.nombre }}</span>
              <h3 class="text-4xl font-[1000] uppercase italic text-ps-blue dark:text-white">Protocolo Legal</h3>
              <p class="text-[10px] font-bold text-slate-500 uppercase italic">Tiempo estimado de gestión: {{ destinoActual.tiempo }}</p>
            </div>

            <div class="lg:col-span-2 grid sm:grid-cols-2 gap-6">
              <div v-for="req in destinoActual.requisitos" :key="req" class="flex gap-4 p-6 bg-white dark:bg-white/10 rounded-3xl shadow-sm">
                <span class="text-ps-red font-black">✓</span>
                <p class="text-[11px] font-black uppercase italic dark:text-white">{{ req }}</p>
              </div>
            </div>
          </div>

          <div class="mt-12 flex flex-col md:flex-row gap-6 items-center border-t border-slate-200 dark:border-white/10 pt-12">
            <div class="flex-1">
              <p class="text-ps-blue dark:text-white font-black uppercase italic">¿Dudas con el guacal o la aerolínea?</p>
              <p class="text-[10px] text-slate-500 font-bold uppercase italic mt-1">Nuestros expertos IATA te asesoran en la logística completa.</p>
            </div>
            <button @click="router.push('/agendar?servicio=CONSULTA')" class="bg-ps-red text-white px-12 py-6 rounded-2xl font-[1000] uppercase text-xs tracking-widest hover:scale-105 transition-all shadow-xl">
              Agendar Cita de Viaje
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const destinos = [
  { nombre: 'USA / CANADA', bandera: '🇺🇸', tiempo: '1-2 meses', requisitos: ['Microchip ISO', 'Vacuna Rabia Vigente', 'Certificado ICA', 'Tratamiento Antiparasitario'] },
  { nombre: 'EUROPA (UE)', bandera: '🇪🇺', tiempo: '4 meses', requisitos: ['Microchip ISO', 'Test Serología Rabia', 'Espera de 90 días post-test', 'Certificado ICA'] },
  { nombre: 'SURAMÉRICA', bandera: '🇧🇷', tiempo: '15 días', requisitos: ['Certificado Nacional', 'Vacunas al día', 'Examen Clínico < 48h', 'Apostilla (según país)'] }
];
const destinoActual = ref(destinos[0]);
</script>