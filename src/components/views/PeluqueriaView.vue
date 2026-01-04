<template>
  <div class="min-h-screen bg-white dark:bg-[#050505] pt-32 pb-20 transition-colors duration-500">
    <div class="max-w-7xl mx-auto px-6">
      
      <div class="grid lg:grid-cols-2 gap-16 items-center mb-20">
        <div class="space-y-8">
          <router-link to="/servicios" class="text-ps-red font-[1000] uppercase text-[10px] tracking-[0.3em] flex items-center gap-2 hover:gap-4 transition-all">
            ← Volver al catálogo
          </router-link>
          <h1 class="text-7xl md:text-8xl font-[1000] uppercase italic text-ps-blue dark:text-white leading-[0.85] tracking-tighter">
            ESTÉTICA <br/> <span class="text-ps-red">CANINA.</span>
          </h1>
          <p class="text-slate-600 dark:text-slate-400 font-bold uppercase italic text-sm leading-relaxed max-w-md">
            Selecciona el tamaño de tu mascota para ver el plan de cuidado ideal y los costos base.
          </p>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div v-for="p in preciosPeluqueria" :key="p.talla" 
            @click="seleccionada = p"
            :class="[
              'cursor-pointer p-6 rounded-[2.5rem] border-2 transition-all duration-500 flex flex-col items-center gap-4 text-center',
              seleccionada.talla === p.talla 
                ? 'border-ps-red bg-ps-red text-white shadow-2xl scale-105' 
                : 'border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-ps-blue dark:text-white hover:border-ps-blue'
            ]">
            <span class="text-3xl">{{ p.icono }}</span>
            <div>
              <p class="text-[11px] font-[1000] uppercase italic leading-none">{{ p.talla }}</p>
              <p :class="['text-[8px] font-bold uppercase mt-1', seleccionada.talla === p.talla ? 'text-white/70' : 'text-slate-400']">{{ p.ejemplo }}</p>
            </div>
          </div>
        </div>
      </div>

      <div v-if="seleccionada" class="animate-in fade-in slide-in-from-bottom-10 duration-700">
        <div class="bg-ps-blue dark:bg-white/5 rounded-[4rem] p-8 md:p-16 text-white grid md:grid-cols-3 gap-12 items-center relative overflow-hidden">
          
          <div class="absolute top-0 right-0 w-64 h-64 bg-ps-red/20 blur-[100px] rounded-full"></div>

          <div class="space-y-4 relative z-10">
            <span class="text-ps-red font-black uppercase text-xs italic tracking-widest">Plan Seleccionado</span>
            <h3 class="text-5xl font-[1000] uppercase italic leading-none">{{ seleccionada.talla }}</h3>
            <p class="text-white/60 text-[10px] font-bold uppercase tracking-widest italic">Incluye: Baño profundo, corte de uñas, limpieza de oídos y perfume premium.</p>
          </div>

          <div class="flex justify-center gap-8 relative z-10 border-x border-white/10 px-4">
            <div class="text-center">
              <p class="text-[10px] font-black uppercase text-ps-red mb-1">Solo Baño</p>
              <p class="text-4xl font-[1000] tracking-tighter">${{ seleccionada.bano }}</p>
            </div>
            <div class="text-center">
              <p class="text-[10px] font-black uppercase text-ps-red mb-1">Baño + Corte</p>
              <p class="text-4xl font-[1000] tracking-tighter">${{ seleccionada.corte }}</p>
            </div>
          </div>

          <div class="relative z-10 space-y-4">
            <button 
              @click="irAAgendar"
              class="w-full bg-ps-red text-white py-6 rounded-2xl font-[1000] uppercase text-xs tracking-widest shadow-xl hover:bg-white hover:text-ps-red transition-all scale-110">
              Agendar para {{ seleccionada.talla }}
            </button>
            <p class="text-center text-[8px] font-bold uppercase opacity-50">* Los precios pueden variar según el estado del manto.</p>
          </div>
        </div>
      </div>

      <div class="mt-20 grid md:grid-cols-2 gap-8">
        <div class="bg-slate-50 dark:bg-white/5 p-10 rounded-[3rem] border border-slate-100 dark:border-white/10">
          <h4 class="text-ps-blue dark:text-white font-black uppercase italic mb-4">¿Qué productos usamos?</h4>
          <p class="text-xs text-slate-500 font-bold uppercase italic leading-relaxed">Solo líneas dermatológicas profesionales (Hydra, Artero) libres de parabenos, ajustadas al pH de cada especie para evitar alergias.</p>
        </div>
        <div class="bg-slate-50 dark:bg-white/5 p-10 rounded-[3rem] border border-slate-100 dark:border-white/10">
          <h4 class="text-ps-blue dark:text-white font-black uppercase italic mb-4">Manejo de bajo estrés</h4>
          <p class="text-xs text-slate-500 font-bold uppercase italic leading-relaxed">No usamos bozales si no es estrictamente necesario, permitimos que la mascota explore el área y usamos secadores de bajo ruido.</p>
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
  { talla: 'Mini', icono: '🐶', ejemplo: 'Yorkie, Maltés', bano: '50.000', corte: '75.000' },
  { talla: 'Mediano', icono: '🐕', ejemplo: 'Schnauzer, Beagle', bano: '65.000', corte: '95.000' },
  { talla: 'Grande', icono: '🐩', ejemplo: 'Golden, Husky', bano: '85.000', corte: '125.000' },
  { talla: 'Gigante', icono: '🦁', ejemplo: 'San Bernardo', bano: '110.000', corte: '160.000' },
];

const seleccionada = ref(preciosPeluqueria[0]);

const irAAgendar = () => {
  // Pasamos el servicio y el tamaño sugerido
  router.push({
    path: '/agendar',
    query: { 
      servicio: 'PELUQUERIA',
      talla: seleccionada.value.talla 
    }
  });
};
</script>