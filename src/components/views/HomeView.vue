<template>
  <div class="min-h-screen bg-white dark:bg-[#050505] transition-colors duration-500">
    
    <section class="relative min-h-[60vh] flex items-center pt-18 overflow-hidden px-4 md:px-6">
      <div class="absolute top-0 right-0 w-full md:w-1/2 h-full bg-[#152C77]/5 dark:bg-[#DE1F27]/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4"></div>

      <div class="max-w-[1400px] mx-auto w-full relative z-10 grid lg:grid-cols-2 gap-12 items-center">
        <div class="space-y-6 md:space-y-8 text-center lg:text-left">
          <div class="space-y-4">
            <span class="inline-block px-4 py-1 bg-[#DE1F27]/10 text-[#DE1F27] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-[9px] md:text-[10px] rounded-full">
              Expertos en Bienestar Animal
            </span>
            <h1 class="text-5xl md:text-[110px] font-[1000] uppercase italic leading-[0.85] tracking-tighter text-[#152C77] dark:text-white">
              THE <span class="text-[#DE1F27]">PREMIUM</span> <br /> STATION.
            </h1>
            <p class="text-slate-500 dark:text-slate-400 font-bold uppercase italic text-[11px] md:text-base max-w-lg mx-auto lg:mx-0 leading-relaxed px-4 md:px-0">
              No somos solo una clínica, somos el destino de lujo para la salud, el estilo y la felicidad de tu mascota.
            </p>
          </div>

          <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start px-6 md:px-0">
            <button @click="router.push('/agendar')" 
              class="group flex items-center justify-center gap-3 bg-[#DE1F27] text-white px-8 py-5 md:px-10 md:py-6 rounded-[2rem] font-black uppercase text-[10px] md:text-xs tracking-widest shadow-xl shadow-[#DE1F27]/20 hover:scale-105 active:scale-95 transition-all">
              📅 Reservar Cita
            </button>
            <button @click="router.push('/tienda')" 
              class="group flex items-center justify-center gap-3 bg-[#152C77] text-white px-8 py-5 md:px-10 md:py-6 rounded-[2rem] font-black uppercase text-[10px] md:text-xs tracking-widest hover:bg-black dark:hover:bg-white dark:hover:text-[#152C77] active:scale-95 transition-all">
              🛒 Ir a la Tienda
            </button>
          </div>
        </div>

        <div class="hidden lg:block relative">
           <div class="w-full aspect-[4/5] rounded-[4rem] overflow-hidden border-2 border-slate-100 dark:border-white/5 p-4 bg-slate-50 dark:bg-white/5">
             <img src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80" 
                  class="w-full h-full object-cover rounded-[3rem] grayscale-[0.2] hover:grayscale-0 transition-all duration-1000" />
           </div>
           <div class="absolute -bottom-6 -left-6 bg-white dark:bg-[#050505] p-8 rounded-[2rem] shadow-2xl border border-slate-100 dark:border-white/10 animate-bounce">
              <p class="text-[#DE1F27] font-[1000] text-3xl italic leading-none">100%</p>
              <p class="text-[#152C77] dark:text-white font-black text-[9px] uppercase tracking-tighter">Pet Friendly</p>
           </div>
        </div>
      </div>
    </section>

    <section class="py-16 md:py-24 px-4 md:px-6 bg-slate-50 dark:bg-[#080808] transition-colors">
      <div class="max-w-[1400px] mx-auto">
        <div class="flex flex-col md:flex-row justify-between items-center md:items-end mb-12 md:mb-16 gap-6 text-center md:text-left">
          <div class="space-y-2">
            <h2 class="text-4xl md:text-6xl font-[1000] uppercase italic tracking-tighter text-[#152C77] dark:text-white leading-none">
              SERVICIOS <span class="text-[#DE1F27]">TOP.</span>
            </h2>
            <p class="text-slate-400 font-bold uppercase text-[9px] md:text-[10px] tracking-[0.3em]">Excelencia médica en cada detalle</p>
          </div>
          <router-link to="/servicios" class="text-[#DE1F27] font-black uppercase text-[10px] md:text-xs border-b-4 border-[#DE1F27] pb-1 hover:gap-4 transition-all">Ver portafolio completo →</router-link>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <div v-for="s in serviciosHome" :key="s.name" 
            class="group bg-white dark:bg-white/5 p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] border border-slate-100 dark:border-white/10 hover:border-[#DE1F27] transition-all duration-500 shadow-sm hover:shadow-xl">
            <span class="text-4xl md:text-5xl mb-6 md:mb-8 block group-hover:scale-110 transition-transform">{{ s.icon }}</span>
            <h3 class="text-xl md:text-2xl font-black uppercase italic text-[#152C77] dark:text-white mb-3">{{ s.name }}</h3>
            <p class="text-[9px] md:text-[10px] text-slate-500 font-bold uppercase italic leading-relaxed mb-6 md:mb-8">{{ s.desc }}</p>
            <router-link :to="s.link" class="inline-block bg-[#152C77] dark:bg-white/10 text-white px-6 py-3 rounded-xl font-black uppercase text-[9px] tracking-widest hover:bg-[#DE1F27] transition-all">
              Explorar
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <section class="py-16 md:py-24 px-4 md:px-6 relative overflow-hidden">
      <div class="max-w-[1400px] mx-auto bg-[#152C77] rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-20 text-white flex flex-col lg:flex-row items-center gap-10 md:gap-16 shadow-2xl relative">
        
        <div class="lg:w-1/2 space-y-6 md:space-y-8 text-center lg:text-left">
          <span class="text-[#DE1F27] font-black uppercase tracking-widest text-[10px] md:text-xs">Pet Station Boutique</span>
          <h2 class="text-4xl md:text-7xl font-[1000] uppercase italic leading-tight">ACCESORIOS <br/> <span class="text-[#DE1F27]">EXCLUSIVOS.</span></h2>
          <p class="text-white/60 font-bold uppercase italic text-xs md:text-sm leading-relaxed">
            Desde dermocosmética premium hasta nutrición especializada. Todo lo que tu mascota necesita con la garantía Pet Station.
          </p>
          <router-link to="/tienda" class="inline-block bg-white text-[#152C77] px-8 py-4 md:px-12 md:py-6 rounded-2xl font-black uppercase text-[10px] md:text-xs tracking-widest hover:bg-[#DE1F27] hover:text-white transition-all shadow-xl active:scale-95">
            Explorar Tienda 🛒
          </router-link>
        </div>

        <div class="lg:w-1/2 grid grid-cols-2 gap-4 w-full">
          <div class="aspect-square bg-white/10 rounded-[2rem] md:rounded-[2.5rem] p-4 flex items-center justify-center text-4xl md:text-6xl">🎾</div>
          <div class="aspect-square bg-white/10 rounded-[2rem] md:rounded-[2.5rem] p-4 flex items-center justify-center text-4xl md:text-6xl translate-y-6 md:translate-y-8">🧴</div>
        </div>

        <div class="absolute top-0 left-0 w-64 h-64 bg-[#DE1F27]/10 blur-[100px] rounded-full pointer-events-none"></div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();

const serviciosHome = [
  { name: 'Peluquería', desc: 'Higiene dermocosmética y spa de bajo estrés.', icon: '✂️', link: '/servicios/peluqueria' },
  { name: 'Medicina', desc: 'Consulta especializada y diagnóstico avanzado.', icon: '🩺', link: '/servicios/medicina' },
  { name: 'Viajes', desc: 'Expertos en ICA, microchips y serología.', icon: '✈️', link: '/servicios/viajes' },
  { name: 'Guardería', desc: 'Socialización segura y hotel veterinario.', icon: '🏡', link: '/servicios/guarderia' }
];
</script>