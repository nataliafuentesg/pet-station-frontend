<template>
  <div class="min-h-screen bg-slate-50 dark:bg-[#050505] pt-32 pb-20 px-6 transition-colors duration-500">
    
    <div class="max-w-7xl mx-auto mb-20">
      <span class="text-ps-red font-black uppercase tracking-[0.4em] text-[10px]">Pet Station Portafolio</span>
      <h2 class="text-6xl md:text-8xl font-[1000] uppercase italic tracking-tighter leading-none text-ps-blue dark:text-white mt-4">
        NUESTRO <br/><span class="text-ps-red">UNIVERSO</span>
      </h2>
    </div>

    <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
      
      <div class="group relative overflow-hidden bg-white dark:bg-white/5 rounded-[3.5rem] p-10 border border-slate-200 dark:border-white/10 shadow-xl transition-all hover:-translate-y-2">
        <div class="relative z-10 space-y-6">
          <div class="w-16 h-16 bg-ps-blue dark:bg-ps-red rounded-2xl flex items-center justify-center text-white text-3xl">✂️</div>
          <h3 class="text-4xl font-[1000] uppercase italic text-ps-blue dark:text-white">Peluquería <br/> Premium</h3>
          <p class="text-slate-500 dark:text-slate-400 font-bold uppercase text-[11px] leading-relaxed">Higiene y dermocosmética de alta gama para mascotas que exigen lo mejor.</p>
          
          <div class="flex flex-col gap-3 pt-4">
            <button @click="router.push('/agendar?servicio=PELUQUERIA')" 
              class="w-full py-5 bg-ps-red text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-[1.02] transition-all">
              Agendar Turno
            </button>
            <router-link to="/servicios/peluqueria" class="text-center py-4 text-ps-blue dark:text-white font-black uppercase text-[10px] tracking-widest border-2 border-slate-100 dark:border-white/10 rounded-2xl hover:bg-slate-100 dark:hover:bg-white/10 transition-all">
              Ver Precios y Detalles
            </router-link>
          </div>
        </div>
      </div>

      <div class="group relative overflow-hidden bg-ps-blue rounded-[3.5rem] p-10 shadow-xl transition-all hover:-translate-y-2">
        <div class="relative z-10 space-y-6 text-white">
          <div class="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl">🩺</div>
          <h3 class="text-4xl font-[1000] uppercase italic">Consulta <br/> Especializada</h3>
          <p class="text-white/70 font-bold uppercase text-[11px] leading-relaxed">Diagnóstico digital, laboratorio y medicina preventiva con corazón.</p>
          
          <div class="flex flex-col gap-3 pt-4">
            <button @click="router.push('/agendar?servicio=CONSULTA')" 
              class="w-full py-5 bg-white text-ps-blue rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-[1.02] transition-all">
              Reservar Valoración
            </button>
            <router-link to="/servicios/medicina" class="text-center py-4 text-white font-black uppercase text-[10px] tracking-widest border-2 border-white/20 rounded-2xl hover:bg-white/10 transition-all">
              Explorar Especialidades
            </router-link>
          </div>
        </div>
        <div class="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      <div class="group bg-white dark:bg-white/5 rounded-[3.5rem] p-10 border border-slate-200 dark:border-white/10 flex flex-col justify-between">
        <div class="space-y-4">
          <span class="text-ps-red font-black uppercase text-[10px]">Global Travel</span>
          <h3 class="text-3xl font-[1000] uppercase italic text-ps-blue dark:text-white">Gestión de Viajes</h3>
          <p class="text-slate-500 dark:text-slate-400 font-bold uppercase text-[11px]">ICA, Microchip y Serologías internacionales.</p>
        </div>
        <router-link to="/servicios/viajes" class="mt-8 flex items-center justify-between group/btn text-ps-blue dark:text-white font-black uppercase text-xs">
          Ver Checklist 
          <span class="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center group-hover/btn:bg-ps-red group-hover/btn:text-white transition-all">→</span>
        </router-link>
      </div>

      <div class="group bg-green-50 dark:bg-green-900/10 rounded-[3.5rem] p-10 border border-green-100 dark:border-green-800/20 flex flex-col justify-between">
        <div class="space-y-4">
          <span class="text-green-600 font-black uppercase text-[10px]">Hotel & Fun</span>
          <h3 class="text-3xl font-[1000] uppercase italic text-green-800 dark:text-green-400">Guardería</h3>
          <p class="text-green-700/60 dark:text-green-400/60 font-bold uppercase text-[11px]">Socialización segura en grupos por talla.</p>
        </div>
        <router-link to="/servicios/guarderia" class="mt-8 flex items-center justify-between group/btn text-green-800 dark:text-green-400 font-black uppercase text-xs">
          Conocer Instalaciones
          <span class="w-10 h-10 rounded-full bg-green-100 dark:bg-green-800/20 flex items-center justify-center group-hover/btn:bg-green-600 group-hover/btn:text-white transition-all">→</span>
        </router-link>
      </div>

    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();
defineProps(['darkMode']);
</script>