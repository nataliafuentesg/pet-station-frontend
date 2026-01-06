<template>
  <div class="min-h-screen bg-white dark:bg-[#050505] pt-24 md:pt-32 pb-20 transition-colors duration-500">
    <div class="max-w-7xl mx-auto px-4 md:px-6">
      
      <div class="max-w-4xl mb-12 md:mb-20 space-y-4 md:space-y-6 text-center md:text-left">
        <router-link to="/servicios" class="text-[#DE1F27] font-black uppercase text-[10px] tracking-widest block">← Volver</router-link>
        <h1 class="text-4xl md:text-8xl font-[1000] uppercase italic text-[#152C77] dark:text-white leading-[0.9] tracking-tighter">
          CIENCIA <br/> <span class="text-[#DE1F27]">& CORAZÓN.</span>
        </h1>
        <p class="text-slate-600 dark:text-slate-400 font-bold uppercase italic text-[10px] md:text-sm max-w-lg mx-auto md:mx-0">
          Medicina preventiva, diagnósticos precisos y cirugía avanzada con estándares hospitalarios internacionales.
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <div v-for="s in especialidades" :key="s.t" 
          class="p-8 md:p-10 bg-slate-50 dark:bg-white/5 rounded-[2.5rem] md:rounded-[3rem] border border-slate-100 dark:border-white/10 hover:border-[#152C77] transition-all group flex flex-col justify-between shadow-sm hover:shadow-xl">
          <div>
            <span class="text-4xl mb-6 block transform group-hover:scale-110 transition-transform">{{ s.icon }}</span>
            <h3 class="text-xl md:text-2xl font-black uppercase italic text-[#152C77] dark:text-white mb-3 group-hover:text-[#DE1F27] transition-colors">
              {{ s.t }}
            </h3>
            <p class="text-[9px] md:text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase italic leading-relaxed mb-8">
              {{ s.d }}
            </p>
          </div>
          <button @click="router.push('/agendar?servicio=CONSULTA')" 
            class="w-full py-4 bg-[#152C77] dark:bg-[#DE1F27] text-white rounded-2xl font-black uppercase text-[9px] tracking-widest active:scale-95 transition-all">
            Solicitar Turno
          </button>
        </div>
      </div>

      <div class="mt-16 md:mt-24 grid md:grid-cols-2 gap-8 items-center bg-[#152C77] rounded-[3rem] md:rounded-[4rem] p-8 md:p-16 text-white relative overflow-hidden">
        <div class="relative z-10 space-y-6">
          <span class="text-[#DE1F27] font-black uppercase text-xs tracking-widest italic">Estándar Quirúrgico</span>
          <h2 class="text-4xl md:text-5xl font-[1000] uppercase italic leading-none">Cirugía con <br/> Monitoreo Vital</h2>
          <p class="text-white/60 font-bold uppercase text-[10px] md:text-[11px] leading-relaxed italic">
            Nuestros quirófanos cuentan con anestesia inhalatoria, monitoreo multiparámetros (ECG, Presión Arterial, Capnografía) y protocolos de manejo de dolor multimodales para garantizar un despertar seguro.
          </p>
          <div class="flex flex-wrap gap-4">
            <div class="bg-white/10 px-4 py-2 rounded-full border border-white/10 text-[9px] font-black uppercase italic tracking-widest">✅ Anestesia Inhalatoria</div>
            <div class="bg-white/10 px-4 py-2 rounded-full border border-white/10 text-[9px] font-black uppercase italic tracking-widest">✅ Oxigenoterapia</div>
          </div>
        </div>
        <div class="relative z-10 grid grid-cols-2 gap-4">
          <div class="bg-white/5 p-6 rounded-[2rem] border border-white/10 text-center">
            <p class="text-3xl mb-2">⚡</p>
            <h4 class="font-black uppercase italic text-[10px] text-[#DE1F27]">Inmediatez</h4>
            <p class="text-[8px] opacity-50 uppercase font-bold">Resultados de laboratorio en minutos</p>
          </div>
          <div class="bg-white/5 p-6 rounded-[2rem] border border-white/10 text-center">
            <p class="text-3xl mb-2">🛡️</p>
            <h4 class="font-black uppercase italic text-[10px] text-[#DE1F27]">Bioseguridad</h4>
            <p class="text-[8px] opacity-50 uppercase font-bold">Protocolos de esterilización clínica</p>
          </div>
        </div>
        <div class="absolute -bottom-20 -left-20 w-80 h-80 bg-[#DE1F27]/20 blur-[120px] rounded-full"></div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();

const especialidades = [
  { 
    t: "Consulta General", 
    d: "Examen físico por sistemas, medicina preventiva, planes vacúnales y desparasitación bajo protocolos internacionales.", 
    icon: "🩺" 
  },
  { 
    t: "Rayos X Digital", 
    d: "Imagenología de alta resolución con procesamiento inmediato. Evaluación ortopédica y de órganos internos sin esperas.", 
    icon: "🦴" 
  },
  { 
    t: "Cirugía Avanzada", 
    d: "Tejidos blandos, esterilizaciones mínimamente invasivas y traumatología en quirófano de alta complejidad.", 
    icon: "⚔️" 
  },
  { 
    t: "Laboratorio Clínico", 
    d: "Hemogramas, bioquímicas, urianálisis y pruebas rápidas (Sida/Leucemia, Parvovirus) con resultados in-situ.", 
    icon: "🔬" 
  },
  { 
    t: "Odontología Pro", 
    d: "Limpieza ultrasónica profunda con pulido dental, extracciones de persistencia decidua y prevención de enfermedad periodontal.", 
    icon: "🦷" 
  },
  { 
    t: "Dermatología", 
    d: "Pruebas de citología, manejo de atopias, alergias alimentarias y diagnóstico microbiológico de afecciones cutáneas.", 
    icon: "🧴" 
  }
];
</script>