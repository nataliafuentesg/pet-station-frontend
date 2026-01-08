<template>
  <div class="min-h-screen bg-white dark:bg-[#050505] pt-5 md:pt-32 pb-20 transition-colors duration-500">
    <div class="max-w-7xl mx-auto px-4 md:px-6">
      
      <div class="flex flex-col lg:grid lg:grid-cols-2 gap-8 md:gap-16 items-center mb-12">
        <div class="space-y-4 md:space-y-8 text-center lg:text-left">
          <router-link to="/servicios" class="text-[#DE1F27] font-[1000] uppercase text-[10px] tracking-[0.3em] inline-flex items-center gap-2 hover:gap-4 transition-all">
            ← Volver a servicios
          </router-link>
          
          <h1 class="text-4xl md:text-8xl font-[1000] uppercase italic text-[#152C77] dark:text-white leading-[0.9] tracking-tighter">
            ESTÉTICA <br/> <span class="text-[#DE1F27]">PROFESIONAL.</span>
          </h1>
          
          <p class="text-slate-600 dark:text-slate-400 font-bold uppercase italic text-[10px] md:text-sm leading-relaxed max-w-md mx-auto lg:mx-0">
            Precios base sugeridos. El valor final depende del estado del manto, largo y temperamento de tu mascota.
          </p>
        </div>

        <div class="grid grid-cols-2 gap-3 md:gap-4 w-full">
          <div v-for="p in preciosPeluqueria" :key="p.talla" 
            @click="seleccionada = p"
            :class="[
              'cursor-pointer p-4 md:p-6 rounded-[2rem] border-2 transition-all duration-500 flex flex-col items-center gap-2 text-center h-full justify-center',
              seleccionada.talla === p.talla 
                ? 'border-[#DE1F27] bg-[#DE1F27] text-white shadow-lg md:scale-105' 
                : 'border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-[#152C77] dark:text-white'
            ]">
            <span class="text-xl md:text-3xl">{{ p.icono }}</span>
            <div>
              <p class="text-[9px] md:text-[11px] font-[1000] uppercase italic leading-none">{{ p.talla }}</p>
              <p :class="['text-[7px] md:text-[8px] font-bold uppercase mt-1', seleccionada.talla === p.talla ? 'text-white/70' : 'text-slate-400']">{{ p.ejemplo }}</p>
            </div>
          </div>
        </div>
      </div>

      <div v-if="seleccionada" class="animate-in fade-in slide-in-from-bottom-10 duration-700">
        <div class="bg-[#152C77] dark:bg-white/5 rounded-[2.5rem] md:rounded-[4rem] p-6 md:p-16 text-white overflow-hidden relative">
          
          <div class="flex flex-col md:grid md:grid-cols-3 gap-8 items-center relative z-10">
            <div class="space-y-2 text-center md:text-left">
              <span class="text-[#DE1F27] font-black uppercase text-[9px] italic tracking-widest">Información Base</span>
              <h3 class="text-3xl md:text-6xl font-[1000] uppercase italic leading-none">{{ seleccionada.talla }}</h3>
              <p class="text-white/60 text-[9px] font-bold uppercase tracking-widest leading-relaxed">
                Baño profundo, corte de uñas, limpieza de oídos y perfume premium.
              </p>
            </div>

            <div class="flex justify-center gap-8 border-y md:border-y-0 md:border-x border-white/10 py-6 md:py-0 w-full">
              <div class="text-center">
                <p class="text-[8px] font-black uppercase text-[#DE1F27] mb-1">Desde (Baño)</p>
                <p class="text-2xl md:text-4xl font-[1000] tracking-tighter">${{ seleccionada.bano }}</p>
              </div>
              <div v-if="seleccionada.corte !== 'N/A'" class="text-center">
                <p class="text-[8px] font-black uppercase text-[#DE1F27] mb-1">Desde (+ Corte)</p>
                <p class="text-2xl md:text-4xl font-[1000] tracking-tighter">${{ seleccionada.corte }}</p>
              </div>
            </div>

            <div class="w-full space-y-4">
              <button 
                @click="irAAgendar"
                class="w-full bg-[#DE1F27] text-white py-4 md:py-6 rounded-2xl font-[1000] uppercase text-[10px] tracking-widest shadow-xl active:scale-95 transition-transform">
                Solicitar Cita
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
        <div class="bg-slate-50 dark:bg-white/5 p-6 rounded-[2rem] border border-[#DE1F27]/20">
          <h4 class="text-[#152C77] dark:text-white font-black uppercase italic text-xs mb-2">Bienestar Primero</h4>
          <p class="text-[9px] text-slate-500 font-bold uppercase italic leading-relaxed">
            Si detectamos <strong class="text-[#DE1F27]">estrés excesivo</strong>, el servicio se detendrá inmediatamente.
          </p>
        </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const preciosPeluqueria = [
  { talla: 'Gatos', icono: '🐱', ejemplo: 'Persa, Criollo', bano: '55.000', corte: 'N/A' },
  { talla: 'Mini', icono: '🐶', ejemplo: 'Yorkie, Maltés', bano: '50.000', corte: '75.000' },
  { talla: 'Mediano', icono: '🐕', ejemplo: 'Beagle, Cocker', bano: '65.000', corte: '95.000' },
  { talla: 'Grande', icono: '🐩', ejemplo: 'Golden, Husky', bano: '85.000', corte: '125.000' },
  { talla: 'Gigante', icono: '🦁', ejemplo: 'Gran Danés, Bernés', bano: '110.000', corte: '160.000' },
];

const seleccionada = ref(preciosPeluqueria[1]); // Default Mini

const irAAgendar = () => {
  router.push({
    path: '/agendar',
    query: { 
      servicio: 'ESTETICA',
      talla: seleccionada.value.talla 
    }
  });
};
</script>

<style scoped>
/* Transición suave para la entrada de información */
.animate-in {
  animation-duration: 0.6s;
}
</style>