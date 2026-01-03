<template>
  <div class="min-h-screen">
    <section class="relative min-h-[90vh] flex items-center bg-[#0a163d] overflow-hidden px-6 md:px-12">
      <div class="space-y-8 relative z-10">
        <h1 class="text-6xl md:text-[120px] font-black uppercase italic leading-[0.85] tracking-tighter text-white">
          THE<br /><span class="text-[#152C77]">PREMIUM</span><br />STATION.
        </h1>
        <p class="text-slate-400 text-sm md:text-xl font-medium border-l-4 border-ps-red pl-4 uppercase">
          Cuidado de élite para tus mejores amigos.
        </p>
        <div class="flex gap-4">
          <router-link to="/servicios" class="bg-white text-ps-dark px-10 py-5 rounded-2xl font-black uppercase text-[11px] hover:bg-ps-red hover:text-white transition-all">
            Explorar Servicios
          </router-link>
          <button @click="$emit('open-onboarding')" class="bg-ps-red text-white px-10 py-5 rounded-2xl font-black uppercase text-[11px] hover:brightness-110 transition-all">
            Unirse Ahora
          </button>
        </div>
      </div>
    </section>
  </div>
</template>