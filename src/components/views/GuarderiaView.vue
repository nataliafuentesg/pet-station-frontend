<template>
  <div class="min-h-screen bg-green-50 dark:bg-[#050505] pt-32 transition-colors">
    <div class="max-w-7xl mx-auto px-6 pb-20">
      <router-link to="/servicios" class="text-green-600 font-black uppercase text-[10px] tracking-widest mb-8 block">
        ← Volver al Hub
      </router-link>

      <div class="grid lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-8">
          <div class="bg-white dark:bg-white/5 rounded-[4rem] p-12 shadow-xl border border-green-100 dark:border-green-900/20">
            <h1 class="text-7xl font-[1000] uppercase italic text-green-800 dark:text-green-400 leading-none">FUN & <br/> <span class="text-ps-red">SAFE</span></h1>
            <p class="text-green-900/60 dark:text-slate-400 font-bold uppercase text-xs mt-6 leading-relaxed">
              No es solo un lugar de espera, es un centro de socialización controlada bajo supervisión veterinaria constante.
            </p>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-12">
              <div v-for="g in infoGuarderia" :key="g.t" class="p-6 bg-green-50/50 dark:bg-green-900/5 rounded-3xl">
                <h4 class="text-green-700 dark:text-green-400 font-black uppercase text-[11px] mb-2">{{ g.t }}</h4>
                <p class="text-[10px] text-slate-500 font-bold uppercase italic leading-tight">{{ g.d }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-6">
          <div class="bg-[#0a163d] p-10 rounded-[4rem] text-white">
            <h3 class="text-2xl font-black italic uppercase text-ps-red mb-8">Requisitos</h3>
            <ul class="space-y-4">
              <li v-for="r in requisitos" :key="r" class="flex items-center gap-3 text-[10px] font-black uppercase italic">
                <span class="w-2 h-2 bg-ps-red rounded-full"></span> {{ r }}
              </li>
            </ul>
          </div>
          <a href="https://wa.me/573000000000" class="block w-full text-center py-6 bg-green-600 text-white rounded-[2rem] font-[1000] uppercase text-xs tracking-widest shadow-xl">Ver Disponibilidad</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const infoGuarderia = [
  { t: "Grupos por Talla", d: "Zonas separadas para juego seguro." },
  { t: "Reportes WhatsApp", d: "Fotos y vídeos de su jornada." },
  { t: "Supervisión Médica", d: "Veterinarios presentes 24/7." },
  { t: "Socialización", d: "Actividades de enriquecimiento ambiental." }
];
const requisitos = ["Vacunas al día", "Desparasitación Vigente", "Evaluación de Temperamento", "No hembras en celo"];
</script>