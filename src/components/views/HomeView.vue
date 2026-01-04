<template>
  <div class="min-h-screen bg-white dark:bg-ps-black transition-colors duration-500">
    
    <section class="relative min-h-[90vh] flex items-center pt-20 overflow-hidden px-6">
      <div class="absolute top-0 right-0 w-full md:w-1/2 h-full bg-ps-blue/5 dark:bg-ps-red/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4"></div>

      <div class="max-w-[1400px] mx-auto w-full relative z-10 grid lg:grid-cols-2 gap-12 items-center">
        <div class="space-y-8 text-center lg:text-left">
          <div class="space-y-4">
            <span class="inline-block px-4 py-1 bg-ps-red/10 text-ps-red font-black uppercase tracking-[0.3em] text-[10px] rounded-full">
              Expertos en Bienestar Animal
            </span>
            <h1 class="text-6xl md:text-[110px] font-[1000] uppercase italic leading-[0.85] tracking-tighter text-ps-blue dark:text-white">
              THE <span class="text-ps-red">PREMIUM</span> <br /> STATION.
            </h1>
            <p class="text-slate-500 dark:text-slate-400 font-bold uppercase italic text-sm md:text-base max-w-lg mx-auto lg:mx-0 leading-relaxed">
              No somos solo una clínica, somos el destino de lujo para la salud y el estilo de tu mascota.
            </p>
          </div>

          <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <router-link to="/agendar" 
              class="group flex items-center justify-center gap-3 bg-ps-red text-white px-10 py-6 rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-2xl shadow-ps-red/20 hover:scale-105 transition-all">
              📅 Reservar Cita
            </router-link>
            <router-link to="/tienda" 
              class="group flex items-center justify-center gap-3 bg-ps-blue text-white px-10 py-6 rounded-[2rem] font-black uppercase text-xs tracking-widest hover:bg-ps-black dark:hover:bg-white dark:hover:text-ps-blue transition-all">
              🛒 Ir a la Tienda
            </router-link>
          </div>
        </div>

        <div class="hidden lg:block relative">
           <div class="w-full aspect-[4/5] rounded-[4rem] overflow-hidden border-2 border-slate-100 dark:border-white/5 p-4 bg-slate-50 dark:bg-white/5">
             <img src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80" 
                  class="w-full h-full object-cover rounded-[3rem] grayscale-[0.2] hover:grayscale-0 transition-all duration-1000" />
           </div>
           <div class="absolute -bottom-6 -left-6 bg-white dark:bg-ps-black p-8 rounded-[2rem] shadow-2xl border border-slate-100 dark:border-white/10 animate-bounce">
              <p class="text-ps-red font-[1000] text-3xl italic leading-none">100%</p>
              <p class="text-ps-blue dark:text-white font-black text-[9px] uppercase tracking-tighter">Pet Friendly</p>
           </div>
        </div>
      </div>
    </section>

    <section class="py-24 px-6 bg-slate-50 dark:bg-[#080808] transition-colors">
      <div class="max-w-[1400px] mx-auto">
        <div class="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div class="space-y-2">
            <h2 class="text-4xl md:text-6xl font-[1000] uppercase italic tracking-tighter text-ps-blue dark:text-white leading-none">
              SERVICIOS <span class="text-ps-red">TOP.</span>
            </h2>
            <p class="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">Calidad médica en cada detalle</p>
          </div>
          <router-link to="/servicios" class="text-ps-red font-black uppercase text-xs border-b-4 border-ps-red pb-1">Ver todos los servicios →</router-link>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="s in serviciosHome" :key="s.name" 
            class="group bg-white dark:bg-white/5 p-10 rounded-[3rem] border border-slate-100 dark:border-white/10 hover:border-ps-red transition-all duration-500">
            <span class="text-5xl mb-8 block group-hover:scale-110 transition-transform">{{ s.icon }}</span>
            <h3 class="text-2xl font-black uppercase italic text-ps-blue dark:text-white mb-4">{{ s.name }}</h3>
            <p class="text-[10px] text-slate-500 font-bold uppercase italic leading-relaxed mb-8">{{ s.desc }}</p>
            <router-link :to="s.link" class="inline-block bg-ps-blue dark:bg-white/10 text-white dark:text-white px-6 py-3 rounded-xl font-black uppercase text-[9px] tracking-widest hover:bg-ps-red transition-all">
              Reservar
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <section class="py-24 px-6 relative overflow-hidden">
      <div class="max-w-[1400px] mx-auto bg-ps-blue rounded-[4rem] p-10 md:p-20 text-white flex flex-col lg:flex-row items-center gap-16 shadow-2xl">
        <div class="lg:w-1/2 space-y-8">
          <span class="text-ps-red font-black uppercase tracking-widest text-xs">Pet Station Boutique</span>
          <h2 class="text-5xl md:text-7xl font-[1000] uppercase italic leading-none">ACCESORIOS <br/> <span class="text-ps-red">EXCLUSIVOS.</span></h2>
          <p class="text-white/60 font-bold uppercase italic text-sm leading-relaxed">
            Desde dermocosmética premium hasta juguetes interactivos. Todo lo que tu mascota necesita con la garantía Pet Station.
          </p>
          <router-link to="/tienda" class="inline-block bg-white text-ps-blue px-12 py-6 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-ps-red hover:text-white transition-all shadow-xl">
            Explorar Catálogo 🛒
          </router-link>
        </div>
        <div class="lg:w-1/2 grid grid-cols-2 gap-4">
          <div class="aspect-square bg-white/10 rounded-[2.5rem] p-4 flex items-center justify-center text-6xl">🎾</div>
          <div class="aspect-square bg-white/10 rounded-[2.5rem] p-4 flex items-center justify-center text-6xl translate-y-8">🧴</div>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
const serviciosHome = [
  { name: 'Peluquería', desc: 'Estética avanzada y spa de bajo estrés.', icon: '✂️', link: '/servicios/peluqueria' },
  { name: 'Medicina', desc: 'Consulta especializada y diagnóstico.', icon: '🩺', link: '/servicios/medicina' },
  { name: 'Viajes', desc: 'Certificados ICA y microchips ISO.', icon: '✈️', link: '/servicios/viajes' },
  { name: 'Guardería', desc: 'Socialización segura por tamaños.', icon: '🏡', link: '/servicios/guarderia' }
];
</script>