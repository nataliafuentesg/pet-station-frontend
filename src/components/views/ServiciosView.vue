<template>
  <div class="min-h-screen bg-slate-50 dark:bg-[#050505] pt-2 md:pt-32 pb-20 px-4 md:px-6 transition-colors duration-500">
    
    <div class="max-w-7xl mx-auto mb-12 md:mb-20">
      <span class="text-[#DE1F27] font-black uppercase tracking-[0.2em] md:tracking-[0.4em] text-[9px] md:text-[10px]">Pet Station Portafolio</span>
      <h2 class="text-4xl md:text-8xl font-[1000] uppercase italic tracking-tighter leading-[0.9] text-[#152C77] dark:text-white mt-4">
        NUESTROS <br/><span class="text-[#DE1F27]">SERVICIOS</span>
      </h2>
    </div>

    <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
      
      <div class="group relative overflow-hidden bg-white dark:bg-white/5 rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-10 border border-slate-200 dark:border-white/10 shadow-xl transition-all hover:-translate-y-1">
        <div class="relative z-10 space-y-6">
          <div class="w-14 h-14 md:w-16 md:h-16 bg-[#152C77] dark:bg-[#DE1F27] rounded-2xl flex items-center justify-center text-white text-2xl md:text-3xl">✂️</div>
          <h3 class="text-3xl md:text-4xl font-[1000] uppercase italic text-[#152C77] dark:text-white leading-tight">Peluquería <br/> & Spa</h3>
          <p class="text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] md:text-[11px] leading-relaxed">Higiene y dermocosmética de alta gama para mascotas que exigen lo mejor.</p>
          
          <div class="flex flex-col gap-3 pt-2">
            <button @click="router.push('/agendar?servicio=PELUQUERIA')" 
              class="w-full py-4 md:py-5 bg-[#DE1F27] text-white rounded-2xl font-black uppercase text-[10px] md:text-xs tracking-widest active:scale-95 transition-all">
              Agendar Turno
            </button>
            <router-link to="/servicios/peluqueria" class="text-center py-4 text-[#152C77] dark:text-white font-black uppercase text-[9px] md:text-[10px] tracking-widest border-2 border-slate-100 dark:border-white/10 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/10 transition-all">
              Ver Precios y Detalles
            </router-link>
          </div>
        </div>
      </div>

      <div class="group relative overflow-hidden bg-[#152C77] rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-10 shadow-xl transition-all hover:-translate-y-1">
        <div class="relative z-10 space-y-6 text-white">
          <div class="w-14 h-14 md:w-16 md:h-16 bg-white/20 rounded-2xl flex items-center justify-center text-2xl md:text-3xl">🩺</div>
          <h3 class="text-3xl md:text-4xl font-[1000] uppercase italic leading-tight">Consulta <br/> Especializada</h3>
          <p class="text-white/70 font-bold uppercase text-[10px] md:text-[11px] leading-relaxed">Diagnóstico digital, laboratorio y medicina preventiva con corazón.</p>
          
          <div class="flex flex-col gap-3 pt-2">
            <button @click="router.push('/agendar?servicio=CONSULTA')" 
              class="w-full py-4 md:py-5 bg-white text-[#152C77] rounded-2xl font-black uppercase text-[10px] md:text-xs tracking-widest active:scale-95 transition-all">
              Reservar Valoración
            </button>
            <router-link to="/servicios/medicina" class="text-center py-4 text-white font-black uppercase text-[9px] md:text-[10px] tracking-widest border-2 border-white/20 rounded-2xl hover:bg-white/10 transition-all">
              Explorar Especialidades
            </router-link>
          </div>
        </div>
        <div class="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      <div class="group bg-white dark:bg-white/5 rounded-[2.5rem] p-8 border border-slate-200 dark:border-white/10 flex flex-col justify-between min-h-[220px]">
        <div class="space-y-4">
          <span class="text-[#DE1F27] font-black uppercase text-[9px]">Global Travel</span>
          <h3 class="text-2xl md:text-3xl font-[1000] uppercase italic text-[#152C77] dark:text-white">Gestión de Viajes</h3>
          <p class="text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px]">ICA, Microchip y Serologías internacionales.</p>
        </div>
        <router-link to="/servicios/viajes" class="mt-6 flex items-center justify-between group/btn text-[#152C77] dark:text-white font-black uppercase text-[10px]">
          Ver Checklist 
          <span class="w-10 h-10 rounded-full bg-slate-50 dark:bg-white/10 flex items-center justify-center group-hover/btn:bg-[#DE1F27] group-hover/btn:text-white transition-all">→</span>
        </router-link>
      </div>

      <div class="group bg-green-50 dark:bg-green-900/10 rounded-[2.5rem] p-8 border border-green-100 dark:border-green-800/20 flex flex-col justify-between min-h-[220px]">
        <div class="space-y-4">
          <span class="text-green-600 font-black uppercase text-[9px]">Hotel & Fun</span>
          <h3 class="text-2xl md:text-3xl font-[1000] uppercase italic text-green-800 dark:text-green-400">Guardería</h3>
          <p class="text-green-700/60 dark:text-green-400/60 font-bold uppercase text-[10px]">Socialización segura en grupos por talla.</p>
        </div>
        <router-link to="/servicios/guarderia" class="mt-6 flex items-center justify-between group/btn text-green-800 dark:text-green-400 font-black uppercase text-[10px]">
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