<template>
  <div class="min-h-screen bg-white dark:bg-[#050505] transition-colors duration-500">
    
    <section class="relative min-h-[70vh] flex items-center pt-20 overflow-hidden px-4 md:px-6 font-sans">
      <div class="absolute top-0 right-0 w-full md:w-1/2 h-full bg-[#152C77]/5 dark:bg-[#DE1F27]/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4"></div>

      <div class="max-w-[1400px] mx-auto w-full relative z-10 grid lg:grid-cols-2 gap-12 items-center">
        <div class="space-y-6 md:space-y-8 text-center lg:text-left">
          <div class="space-y-4">
            <span class="inline-block px-4 py-1 bg-[#152C77] text-white font-[1000] uppercase tracking-widest text-[9px] md:text-[10px] rounded-lg">
              Ciencia y Ética Veterinaria
            </span>
            <h1 class="text-5xl md:text-[90px] font-[1000] uppercase italic leading-[0.85] tracking-tighter text-[#152C77] dark:text-white">
              SABEMOS <br /> <span class="text-[#DE1F27]">CUIDARLOS.</span>
            </h1>
            <p class="text-slate-500 dark:text-slate-400 font-bold uppercase italic text-xs md:text-lg max-w-lg mx-auto lg:mx-0 leading-tight px-4 md:px-0">
              No se trata de estilo, se trata de conocimiento. Brindamos la confianza médica que tu familia necesita para estar tranquila.
            </p>
          </div>

          <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start px-6 md:px-0">
            <button @click="router.push('/agendar')" 
              class="group flex items-center justify-center gap-3 bg-[#DE1F27] text-white px-8 py-5 md:px-10 md:py-6 rounded-[2rem] font-[1000] uppercase text-[10px] md:text-xs tracking-widest shadow-2xl shadow-[#DE1F27]/20 hover:scale-105 active:scale-95 transition-all">
              📅 Agendar Cita
            </button>
            <button @click="router.push('/tienda')" 
              class="group flex items-center justify-center gap-3 bg-[#152C77] text-white px-8 py-5 md:px-10 md:py-6 rounded-[2rem] font-[1000] uppercase text-[10px] md:text-xs tracking-widest hover:bg-black active:scale-95 transition-all">
              🛒 Productos 
            </button>
          </div>
        </div>

        <div class="hidden lg:block relative">
           <div class="w-full aspect-[4/5] rounded-[4rem] overflow-hidden border-2 border-slate-100 dark:border-white/5 p-4 bg-slate-50 dark:bg-white/5">
             <img src="https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?auto=format&fit=crop&q=80" 
                  class="w-full h-full object-cover rounded-[3rem] transition-all duration-1000" />
           </div>
           <div class="absolute -bottom-6 -left-6 bg-[#152C77] p-8 rounded-[2rem] shadow-2xl border-b-8 border-[#DE1F27]">
              <p class="text-white font-[1000] text-3xl italic leading-none">ÉTICA</p>
              <p class="text-[#DE1F27] font-black text-[9px] uppercase tracking-[0.2em]">Profesionalismo Garantizado</p>
           </div>
        </div>
      </div>
    </section>

    <section class="py-16 md:py-24 px-4 md:px-6 bg-slate-50 dark:bg-[#080808] transition-colors font-sans">
      <div class="max-w-[1400px] mx-auto">
        <div class="flex flex-col md:flex-row justify-between items-center md:items-end mb-12 md:mb-16 gap-6 text-center md:text-left">
          <div class="space-y-2">
            <h2 class="text-4xl md:text-6xl font-[1000] uppercase italic tracking-tighter text-[#152C77] dark:text-white leading-none">
              RESPALDO <span class="text-[#DE1F27]">MÉDICO.</span>
            </h2>
            <p class="text-slate-400 font-bold uppercase text-[9px] md:text-[10px] tracking-[0.3em]">Protocolos rigurosos para pacientes reales</p>
          </div>
          <router-link to="/servicios" class="text-[#DE1F27] font-black uppercase text-[10px] md:text-xs border-b-4 border-[#DE1F27] pb-1">Conoce nuestros procesos →</router-link>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <div v-for="s in serviciosHome" :key="s.name" 
            class="group bg-white dark:bg-white/5 p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] border border-slate-100 dark:border-white/10 hover:border-[#DE1F27] transition-all duration-500 shadow-sm hover:shadow-xl">
            <span class="text-4xl md:text-5xl mb-6 md:mb-8 block group-hover:scale-110 transition-transform">{{ s.icon }}</span>
            <h3 class="text-xl md:text-2xl font-[1000] uppercase italic text-[#152C77] dark:text-white mb-3">{{ s.name }}</h3>
            <p class="text-[9px] md:text-[11px] text-slate-500 font-bold uppercase italic leading-relaxed mb-6 md:mb-8">{{ s.desc }}</p>
            <router-link :to="s.link" class="inline-block bg-[#152C77] text-white px-6 py-3 rounded-xl font-black uppercase text-[9px] tracking-widest hover:bg-[#DE1F27] transition-all">
              Ver Detalles
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <section class="py-16 md:py-24 px-4 md:px-6 relative overflow-hidden font-sans">
      <div class="max-w-[1400px] mx-auto bg-[#152C77] rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-20 text-white flex flex-col lg:flex-row items-center gap-10 md:gap-16 shadow-2xl relative">
        <div class="lg:w-1/2 space-y-6 md:space-y-8 text-center lg:text-left">
          <span class="text-[#DE1F27] font-black uppercase tracking-widest text-[10px] md:text-xs">Curaduría Pet Station</span>
          <h2 class="text-4xl md:text-7xl font-[1000] uppercase italic leading-[0.9] tracking-tighter">SOLO LO QUE <br/> <span class="text-[#DE1F27]">FUNCIONA.</span></h2>
          <p class="text-white/60 font-bold uppercase italic text-xs md:text-base leading-relaxed">
            No vendemos por vender. Cada producto ha sido seleccionado bajo criterios médicos para garantizar la salud real de tu mascota.
          </p>
          <router-link to="/tienda" class="inline-block bg-white text-[#152C77] px-8 py-4 md:px-12 md:py-6 rounded-2xl font-black uppercase text-[10px] md:text-xs tracking-widest hover:bg-[#DE1F27] hover:text-white transition-all shadow-xl active:scale-95">
            Ver Productos Avalados 🩺
          </router-link>
        </div>

        <div class="lg:w-1/2 grid grid-cols-2 gap-4 w-full">
          <div class="aspect-square bg-white/10 rounded-[2rem] border border-white/10 flex flex-col items-center justify-center text-center p-4">
            <span class="text-4xl md:text-6xl mb-2">💊</span>
            <p class="text-[8px] font-black uppercase tracking-widest">Farmacia Ética</p>
          </div>
          <div class="aspect-square bg-white/10 rounded-[2rem] border border-white/10 flex flex-col items-center justify-center text-center p-4 translate-y-6 md:translate-y-8">
            <span class="text-4xl md:text-6xl mb-2">🥩</span>
            <p class="text-[8px] font-black uppercase tracking-widest">Nutrición Clínica</p>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();

const serviciosHome = [
  { name: 'Clínica', desc: 'Diagnóstico preciso con equipos de última generación.', icon: '🩺', link: '/servicios/medicina' },
  { name: 'Peluquería', desc: 'Higiene dermocosmética sin estrés, enfocada en salud.', icon: '✂️', link: '/servicios/peluqueria' },
  { name: 'Viajes', desc: 'Toda la gestión internacional (ICA y microchips) sin errores.', icon: '✈️', link: '/servicios/viajes' },
  { name: 'Guardería', desc: 'Socialización controlada bajo supervisión veterinaria.', icon: '🏡', link: '/servicios/guarderia' }
];
</script>

<style scoped>
@reference "../../style.css";
/* Se eliminó la importación manual de fuentes para usar las de la app */
</style>