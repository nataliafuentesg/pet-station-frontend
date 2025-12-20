<template>
  <section class="bg-white p-8 md:p-12 rounded-[3rem] border border-slate-200 shadow-sm relative overflow-hidden">
    <div class="absolute -right-20 -top-20 w-64 h-64 bg-ps-blue/5 rounded-full blur-3xl"></div>

    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
      <div class="relative z-10">
        <h3 class="text-3xl font-black text-ps-blue tracking-tighter uppercase flex items-center gap-3">
          <span class="bg-ps-red p-2 rounded-xl">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04z" />
            </svg>
          </span>
          Botiquín de Prevención
        </h3>
        <p class="text-slate-500 mt-2 font-medium italic">Esenciales recomendados por nuestros veterinarios para este mes.</p>
      </div>
      <button class="text-ps-blue font-black text-sm uppercase tracking-widest hover:text-ps-red transition-colors">
        Ver plan de salud completo →
      </button>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
      <div v-for="kit in kits" :key="kit.title" 
           class="group bg-slate-50 p-8 rounded-[2rem] hover:bg-ps-blue hover:scale-[1.02] transition-all duration-500 cursor-pointer border border-transparent hover:shadow-2xl">
        
        <div class="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-4xl mb-6 shadow-sm group-hover:rotate-12 transition-transform">
          {{ kit.icon }}
        </div>
        
        <h4 class="font-black text-ps-blue text-xl mb-3 group-hover:text-white transition-colors uppercase tracking-tight">
          {{ kit.title }}
        </h4>
        
        <p class="text-slate-500 text-sm leading-relaxed group-hover:text-white/70 transition-colors mb-6">
          {{ kit.desc }}
        </p>

        <div class="flex items-center gap-2 text-ps-red group-hover:text-white font-bold text-xs uppercase tracking-widest">
          <span>Explorar opciones</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const kits = [
  { 
    title: 'Control Parasitario', 
    desc: 'Protección total contra pulgas, garrapatas y parásitos internos que afectan el corazón.', 
    icon: '🛡️' 
  },
  { 
    title: 'Refuerzo Inmune', 
    desc: 'Suplementos y vitaminas esenciales según la etapa de vida de tu mascota.', 
    icon: '💊' 
  },
  { 
    title: 'Higiene & Cuidado', 
    desc: 'Limpieza profunda de oídos, dental y cuidado de almohadillas para evitar infecciones.', 
    icon: '🪥' 
  }
];
</script>