<template>
  <div class="min-h-screen bg-green-50 dark:bg-[#050505] pt-24 md:pt-32 transition-colors duration-500">
    <div class="max-w-7xl mx-auto px-4 md:px-6 pb-20">
      
      <router-link to="/servicios" class="text-green-600 font-black uppercase text-[10px] tracking-widest mb-8 inline-flex items-center gap-2 hover:gap-4 transition-all">
        ← Volver al catálogo
      </router-link>

      <div class="grid lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-white dark:bg-white/5 rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-12 shadow-xl border border-green-100 dark:border-green-900/20">
            <h1 class="text-5xl md:text-7xl font-[1000] uppercase italic text-green-800 dark:text-green-400 leading-[0.9] tracking-tighter">
              FUN & <br/> <span class="text-[#DE1F27]">SAFE.</span>
            </h1>
            <p class="text-green-900/60 dark:text-slate-400 font-bold uppercase text-[10px] md:text-xs mt-6 leading-relaxed max-w-xl">
              Más que cuidado, brindamos experiencias de socialización controlada bajo supervisión veterinaria profesional 24/7.
            </p>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12">
              <div v-for="m in modalidades" :key="m.t" 
                class="p-6 bg-green-50/50 dark:bg-green-900/5 border border-green-100/50 dark:border-white/5 rounded-[2rem] hover:border-green-400 transition-all group">
                <div class="flex justify-between items-start mb-4">
                  <span class="text-3xl">{{ m.icon }}</span>
                  <span class="text-[8px] font-black bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 px-2 py-1 rounded-full uppercase tracking-tighter">Disponible</span>
                </div>
                <h4 class="text-green-800 dark:text-green-400 font-[1000] uppercase italic text-lg mb-2">{{ m.t }}</h4>
                <p class="text-[9px] md:text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase leading-tight mb-4">{{ m.d }}</p>
                <div class="flex flex-wrap gap-2">
                  <span v-for="tag in m.tags" :key="tag" class="text-[7px] font-black text-green-600 uppercase border border-green-200 px-2 py-0.5 rounded-md italic">
                    # {{ tag }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div v-for="info in infoExtra" :key="info.t" class="bg-white dark:bg-white/5 p-4 rounded-3xl border border-green-100 dark:border-white/5 text-center">
              <p class="text-xl mb-1">{{ info.icon }}</p>
              <p class="text-[8px] font-black uppercase text-green-800 dark:text-green-400 leading-none">{{ info.t }}</p>
            </div>
          </div>
        </div>

        <div class="space-y-6">
          <div class="bg-[#152C77] p-8 md:p-10 rounded-[2.5rem] md:rounded-[4rem] text-white shadow-2xl relative overflow-hidden">
            <div class="relative z-10">
              <h3 class="text-2xl font-black italic uppercase text-[#DE1F27] mb-8 tracking-tighter">Checklist de <br/> Admisión</h3>
              <ul class="space-y-4">
                <li v-for="r in requisitos" :key="r" class="flex items-start gap-3 text-[10px] font-black uppercase italic leading-tight">
                  <span class="w-2 h-2 bg-[#DE1F27] rounded-full mt-1 shrink-0"></span> {{ r }}
                </li>
              </ul>
              
              <div class="mt-8 p-5 bg-white/5 rounded-2xl border border-white/10 space-y-3">
                <div>
                  <p class="text-[8px] text-[#DE1F27] font-black uppercase mb-1 italic">Gestión de Alimentos:</p>
                  <p class="text-[8px] text-white/60 font-bold uppercase leading-relaxed">
                    El tutor debe traer la porción exacta de alimento para los días de estancia para evitar desórdenes gastrointestinales.
                  </p>
                </div>
                <div class="pt-3 border-t border-white/10">
                  <p class="text-[8px] text-[#DE1F27] font-black uppercase mb-1 italic">Medicamentos:</p>
                  <p class="text-[8px] text-white/60 font-bold uppercase leading-relaxed">
                    Si requiere tratamiento, es obligatorio traer **historial médico actualizado y fórmula médica** firmada. No administramos fármacos sin orden profesional.
                  </p>
                </div>
              </div>
            </div>
            <div class="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
          </div>

          <a href="https://wa.me/573000000000" 
            class="block w-full text-center py-6 bg-green-600 hover:bg-green-700 text-white rounded-[2rem] font-[1000] uppercase text-xs tracking-[0.2em] shadow-xl transition-all hover:scale-[1.02] active:scale-95">
            Ver Disponibilidad
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const modalidades = [
  { 
    t: "Pasa Día", 
    d: "Socialización y juego durante la jornada diurna. Ideal para mascotas que pasan solas el día.", 
    icon: "☀️",
    tags: ["Recreación", "Socialización", "Veterinario"]
  },
  { 
    t: "Hotel", 
    d: "Alojamiento seguro con monitoreo profesional nocturno y áreas de descanso higienizadas.", 
    icon: "🏨",
    tags: ["Pernoctación", "Confort", "24/7"]
  },
  { 
    t: "Internado Méd./Cond.", 
    d: "Cuidado especializado para mascotas que requieren adiestramiento o recuperación bajo vigilancia médica.", 
    icon: "🎓",
    tags: ["Historial Clínico", "Conducta", "Especializado"]
  }
];

const infoExtra = [
  { t: "Cámaras 24/7", icon: "📹" },
  { t: "Reportes Video", icon: "📱" },
  { t: "Sin Jaulas", icon: "🏘️" },
  { t: "Zonas Verdes", icon: "🍃" }
];

const requisitos = [
  "Esquema de Vacunación Completo (incluye Tos de Perreras)", 
  "Desparasitación Interna y Externa (< 30 días)", 
  "Prueba de temperamento aprobada", 
  "No hembras en celo",
  "Alimento habitual proporcionado por el tutor",
  "Historial médico y fórmula (si usa medicamentos)"
];
</script>