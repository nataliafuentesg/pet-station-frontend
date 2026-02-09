<template>
  <div class="min-h-screen bg-white dark:bg-[#050505] transition-colors duration-500 font-sans">
    
    <section class="pt-2 md:pt-28 pb-4 px-3 md:px-6">
      <div class="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-6">
        
        <div class="lg:col-span-8 bg-[#152C77] rounded-[1.8rem] md:rounded-[3.5rem] p-7 md:p-20 text-white relative overflow-hidden flex flex-col justify-center min-h-[300px] md:min-h-[550px]">
          <div class="relative z-10 space-y-4 md:space-y-8">
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 bg-[#DE1F27] rounded-full animate-pulse"></span>
              <span class="text-[8px] md:text-[11px] font-[1000] uppercase tracking-widest opacity-80">
                Respaldo Médico Ético • Chía
              </span>
            </div>
            
            <h1 class="text-4xl md:text-[100px] font-[1000] uppercase italic leading-[0.8] tracking-tighter italic">
              CIENCIA <br /> <span class="text-[#DE1F27]">QUE CUIDA.</span>
            </h1>
            
            <p class="text-white/60 font-bold uppercase italic text-[11px] md:text-xl max-w-md leading-tight">
              Brindamos la confianza médica que tu familia necesita. Salud real, sin rodeos.
            </p>

            <div class="flex gap-3 md:gap-6 pt-2 md:pt-6">
              <button @click="router.push('/agendar')" class="flex-1 md:flex-none bg-[#DE1F27] text-white px-6 py-4 md:px-12 md:py-6 rounded-xl md:rounded-2xl font-[1000] uppercase text-[10px] md:text-sm tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl">
                Agendar Cita
              </button>
              <button @click="router.push('/tienda')" class="flex-1 md:flex-none bg-white/10 backdrop-blur-md text-white px-6 py-4 md:px-12 md:py-6 rounded-xl md:rounded-2xl font-[1000] uppercase text-[10px] md:text-sm tracking-widest border border-white/20 hover:bg-white hover:text-[#152C77] transition-all">
                Tienda
              </button>
            </div>
          </div>
          <div class="absolute -right-20 -bottom-20 w-80 h-80 bg-[#DE1F27]/20 blur-[120px] rounded-full"></div>
        </div>

        <div class="lg:col-span-4 grid grid-cols-1 gap-3 md:gap-6">
          <div class="h-40 md:h-full bg-slate-100 dark:bg-white/5 rounded-[1.8rem] md:rounded-[3.5rem] overflow-hidden border border-slate-100 dark:border-white/10 relative group">
            <img src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80" 
                 class="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-1000" />
            <div class="absolute inset-0 bg-gradient-to-t from-[#152C77]/80 via-transparent flex items-end p-6 md:p-10">
               <p class="text-white font-[1000] italic uppercase text-lg md:text-2xl leading-none italic">
                 Compromiso <br/><span class="text-[#DE1F27]">Garantizado.</span>
               </p>
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-3">
            <div class="bg-slate-50 dark:bg-white/5 rounded-[1.5rem] md:rounded-[2.5rem] p-5 md:p-10 flex flex-col justify-center border border-slate-100 dark:border-white/10">
              <span class="text-2xl md:text-4xl font-[1000] text-[#152C77] dark:text-white italic leading-none">100%</span>
              <span class="text-[7px] md:text-[10px] font-black uppercase text-slate-400 tracking-widest mt-2">Ética Profesional</span>
            </div>
            <div class="bg-[#DE1F27] rounded-[1.5rem] md:rounded-[2.5rem] p-5 md:p-10 flex flex-col justify-center shadow-xl shadow-[#DE1F27]/10">
              <span class="text-2xl md:text-4xl font-[1000] text-white italic leading-none">CHÍA</span>
              <span class="text-[7px] md:text-[10px] font-black uppercase text-white/80 tracking-widest mt-2">Variante Chía-Cota</span>
            </div>
          </div>
        </div>

      </div>
    </section>

    <section class="py-6 px-3 md:px-6">
      <div class="max-w-[1400px] mx-auto bg-slate-50 dark:bg-[#0A0A0A] border border-slate-200 dark:border-white/10 rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-16 text-center relative overflow-hidden">
        
        <div class="relative z-10 mb-12">
          <p class="text-[#DE1F27] font-black uppercase text-[9px] md:text-xs tracking-[0.4em] mb-4">Innovación Veterinaria</p>
          <h2 class="text-3xl md:text-6xl font-[1000] uppercase italic text-[#152C77] dark:text-white leading-[0.9] italic">
            DESCUBRE <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#152C77] to-[#DE1F27]">PET STATION APP</span>
          </h2>
          <p class="text-slate-500 dark:text-slate-400 font-bold text-[10px] md:text-sm mt-6 max-w-2xl mx-auto leading-relaxed uppercase">
            Más que una clínica, somos una plataforma integral. Conecta tu cuenta Google para acceder al 
            <span class="text-[#152C77] dark:text-white">Perfil Digital de tu Mascota</span>, gestionar tus <span class="text-[#152C77] dark:text-white">Citas</span> y recibir recomendaciones personalizadas.
          </p>
        </div>

        <div class="relative z-10 grid md:grid-cols-3 gap-6 text-left">
          
          <div class="bg-white dark:bg-white/5 p-8 rounded-[2rem] border border-slate-100 dark:border-white/5 hover:border-[#DE1F27] transition-all group">
            <span class="text-4xl mb-4 block group-hover:scale-110 transition-transform">📂</span>
            <h3 class="text-lg font-[1000] uppercase italic text-[#152C77] dark:text-white mb-2 italic">Perfil Digital</h3>
            <p class="text-[9px] font-bold text-slate-400 uppercase leading-relaxed">
              Centraliza la información básica, fotos y preferencias de tu mascota en un solo lugar seguro.
            </p>
          </div>

          <div class="bg-white dark:bg-white/5 p-8 rounded-[2rem] border border-slate-100 dark:border-white/5 hover:border-[#DE1F27] transition-all group">
            <span class="text-4xl mb-4 block group-hover:scale-110 transition-transform">📅</span>
            <h3 class="text-lg font-[1000] uppercase italic text-[#152C77] dark:text-white mb-2 italic">Smart Booking</h3>
            <p class="text-[9px] font-bold text-slate-400 uppercase leading-relaxed">Agenda citas médicas y grooming en tiempo real sin llamadas.</p>
          </div>

          <div class="bg-white dark:bg-white/5 p-8 rounded-[2rem] border border-slate-100 dark:border-white/5 hover:border-[#DE1F27] transition-all group">
            <span class="text-4xl mb-4 block group-hover:scale-110 transition-transform">🧬</span>
            <h3 class="text-lg font-[1000] uppercase italic text-[#152C77] dark:text-white mb-2 italic">Filtro Genético</h3>
            <p class="text-[9px] font-bold text-slate-400 uppercase leading-relaxed">Nuestra tienda filtra productos automáticamente según la raza y edad de tu mascota.</p>
          </div>

        </div>

      </div>
    </section>

    <section class="pb-12 px-3 md:px-6">
      <div class="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
        <div v-for="s in serviciosHome" :key="s.name" 
             @click="router.push(s.link)"
             class="group bg-white dark:bg-white/5 p-6 md:p-12 rounded-[1.8rem] md:rounded-[3rem] border border-slate-100 dark:border-white/10 hover:border-[#DE1F27] transition-all cursor-pointer flex flex-col items-center text-center">
          <span class="text-3xl md:text-6xl mb-3 md:mb-6 group-hover:rotate-12 transition-transform">{{ s.icon }}</span>
          <h3 class="text-[10px] md:text-sm font-[1000] uppercase italic text-[#152C77] dark:text-white leading-tight italic">{{ s.name }}</h3>
          <p class="text-[7px] md:text-[10px] font-black text-[#DE1F27] uppercase mt-2 opacity-0 group-hover:opacity-100 transition-all">Ver Más</p>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();

const serviciosHome = [
  { name: 'Medicina Especializada', icon: '🩺', link: '/servicios/medicina' },
  { name: 'Grooming', icon: '✂️', link: '/servicios/peluqueria' },
  { name: 'Documentos Viajes', icon: '✈️', link: '/servicios/viajes' },
  { name: 'Guardería', icon: '🏡', link: '/servicios/guarderia' }
];
</script>

<style scoped>
@reference "../../style.css";
</style>