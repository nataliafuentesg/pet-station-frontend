<template>
  <div class="min-h-screen bg-white dark:bg-[#050505] pt-5 md:pt-32 transition-colors duration-500">
    <div class="max-w-7xl mx-auto px-4 md:px-6 pb-20">

      <router-link to="/servicios" class="text-[#152C77] dark:text-white font-black uppercase text-[10px] tracking-widest mb-8 inline-flex items-center gap-2 hover:gap-4 transition-all">
        ← Volver a Servicios
      </router-link>

      <!-- Hero -->
      <div class="grid lg:grid-cols-3 gap-8 mt-4" data-reveal>

        <!-- Info principal -->
        <div class="reveal-child lg:col-span-2 space-y-6" style="--cd:0">
          <div class="bg-[#152C77] rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-12 text-white shadow-xl relative overflow-hidden">
            <div class="relative z-10">
              <span class="text-[9px] font-black uppercase text-[#DE1F27] tracking-widest">Especialidad · Ortopedia & Traumatología</span>
              <h1 class="text-3xl md:text-5xl font-[1000] uppercase italic leading-[0.95] tracking-tighter mt-3">
                CIRUGÍA <br /><span class="text-[#DE1F27]">ORTOPÉDICA.</span>
              </h1>
              <p class="text-white/60 font-bold uppercase text-[10px] md:text-xs mt-6 leading-relaxed max-w-xl">
                Diagnóstico y tratamiento quirúrgico de patologías musculoesqueléticas en perros y gatos. Técnicas avanzadas avaladas por más de 20 años de experiencia internacional.
              </p>

              <!-- Procedimientos -->
              <div class="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div v-for="cat in categorias" :key="cat.titulo"
                  class="p-5 bg-white/5 border border-white/10 rounded-[1.5rem] hover:border-[#DE1F27]/50 transition-all">
                  <span class="text-2xl">{{ cat.icon }}</span>
                  <h4 class="text-white font-[1000] uppercase italic text-sm mt-3 mb-2 leading-tight">{{ cat.titulo }}</h4>
                  <ul class="space-y-1">
                    <li v-for="p in cat.items" :key="p" class="text-[8px] font-bold uppercase text-white/50 leading-tight flex items-start gap-1.5">
                      <span class="w-1 h-1 bg-[#DE1F27] rounded-full mt-[4px] shrink-0"></span>{{ p }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="absolute -bottom-16 -right-16 w-64 h-64 bg-white/3 rounded-full blur-3xl pointer-events-none"></div>
          </div>

          <!-- Stats -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div v-for="s in stats" :key="s.valor" class="bg-slate-50 dark:bg-white/5 p-5 rounded-3xl border border-slate-100 dark:border-white/5 text-center">
              <p class="text-2xl font-[1000] italic text-[#152C77] dark:text-white">{{ s.valor }}</p>
              <p class="text-[8px] font-black uppercase text-slate-500 dark:text-slate-400 leading-tight mt-1">{{ s.label }}</p>
            </div>
          </div>
        </div>

        <!-- Especialista sidebar -->
        <div class="reveal-child space-y-6" style="--cd:1">

          <!-- Dr. Fontecha card -->
          <div class="bg-slate-50 dark:bg-white/5 rounded-[2.5rem] p-8 border border-slate-100 dark:border-white/5 shadow-sm">
            <span class="text-[8px] font-black uppercase text-[#DE1F27] tracking-widest">Especialista</span>
            <h3 class="text-xl font-[1000] uppercase italic text-[#152C77] dark:text-white leading-tight mt-1">
              Dr. Pedro<br />Fontecha Umaña
            </h3>
            <p class="text-[9px] font-bold uppercase text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              Doctor en Veterinaria · Especialista en Ortopedia y Traumatología
            </p>

            <ul class="mt-6 space-y-3">
              <li v-for="logro in logros" :key="logro" class="flex items-start gap-3 text-[9px] font-bold uppercase text-slate-600 dark:text-slate-300 leading-tight">
                <span class="w-1.5 h-1.5 bg-[#152C77] dark:bg-[#DE1F27] rounded-full mt-[3px] shrink-0"></span>{{ logro }}
              </li>
            </ul>
          </div>

          <!-- CTA -->
          <a href="https://wa.me/573053462413?text=Hola%20Pet%20Station!%20Quiero%20información%20sobre%20cirugía%20ortopédica%20con%20el%20Dr.%20Fontecha."
            target="_blank"
            @click="trackWaClick('ortopedia')"
            class="block w-full text-center py-6 bg-[#DE1F27] hover:bg-[#b91c1c] text-white rounded-[2rem] font-[1000] uppercase text-xs tracking-[0.2em] shadow-xl transition-all hover:scale-[1.02] active:scale-95">
            💬 Solicitar Consulta
          </a>

          <!-- Agendar cita -->
          <button @click="router.push('/agendar?servicio=CONSULTA')"
            class="w-full py-5 border-2 border-[#152C77] dark:border-white text-[#152C77] dark:text-white rounded-[2rem] font-[1000] uppercase text-[10px] tracking-widest hover:bg-[#152C77] hover:text-white dark:hover:bg-white dark:hover:text-[#152C77] transition-all">
            Reservar Consulta
          </button>
        </div>
      </div>

      <!-- Casos clínicos / técnicas -->
      <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6" data-reveal>
        <div v-for="(tecnica, i) in tecnicas" :key="tecnica.nombre"
          :class="['reveal-child bg-slate-50 dark:bg-white/5 rounded-[2rem] p-7 border border-slate-100 dark:border-white/5 hover:border-[#152C77] dark:hover:border-[#DE1F27] transition-all', `--cd:${i}`]"
          :style="`--cd:${i}`">
          <span class="text-3xl">{{ tecnica.icon }}</span>
          <h4 class="text-lg font-[1000] uppercase italic text-[#152C77] dark:text-white mt-3 mb-2">{{ tecnica.nombre }}</h4>
          <p class="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 leading-relaxed">{{ tecnica.descripcion }}</p>
        </div>
      </div>

      <!-- Formación académica -->
      <div class="mt-8 bg-white dark:bg-white/5 rounded-[2.5rem] p-8 md:p-12 border border-slate-100 dark:border-white/5 shadow-sm" data-reveal>
        <h2 class="text-xl md:text-2xl font-[1000] uppercase italic text-[#152C77] dark:text-white tracking-tighter mb-8">
          Trayectoria & Formación
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          <div v-for="item in trayectoria" :key="item.titulo" class="flex gap-4 items-start">
            <div class="w-2 h-2 bg-[#DE1F27] rounded-full mt-[6px] shrink-0"></div>
            <div>
              <p class="text-xs font-[1000] uppercase italic text-[#152C77] dark:text-white leading-tight">{{ item.titulo }}</p>
              <p class="text-[9px] font-bold uppercase text-slate-500 dark:text-slate-400 mt-0.5">{{ item.detalle }}</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useTracking } from '@/composables/useTracking';
import { useWaTracking } from '@/composables/useWaTracking';
import { useSeo } from '@/composables/useSeo';
import { useReveal } from '@/composables/useReveal';
import { useJsonLd } from '@/composables/useJsonLd';

const router = useRouter();
const { trackViewService } = useTracking();
const { trackView, trackWaClick } = useWaTracking();

onMounted(() => {
  trackViewService('Ortopedia');
  trackView('servicio', 'Ortopedia', '/servicios/ortopedia');
  useReveal();
  useJsonLd({
    '@context': 'https://schema.org',
    '@type': 'MedicalSpecialty',
    name: 'Ortopedia y Traumatología Veterinaria — Pet Station Chía',
    description: 'Cirugía ortopédica y traumatológica para perros y gatos en Chía. TPLO, TTA, prótesis de cadera y fijadores externos. Dr. Pedro Fontecha Umaña, especialista con 20 años de experiencia internacional.',
    url: 'https://petstationvet.com/servicios/ortopedia',
    provider: {
      '@type': 'Physician',
      name: 'Dr. Pedro Fontecha Umaña',
      medicalSpecialty: 'Orthopedic Surgery',
      alumniOf: { '@type': 'CollegeOrUniversity', name: 'Universidad Autónoma de Barcelona' }
    }
  });
  useSeo({
    titulo: 'Ortopedia y Cirugía Veterinaria en Chía | Dr. Fontecha | Pet Station',
    descripcion: 'Especialista en ortopedia veterinaria en Chía. TPLO, TTA, prótesis de cadera y cirugía de columna para perros y gatos. Dr. Pedro Fontecha, 20 años de experiencia.',
    url: 'https://petstationvet.com/servicios/ortopedia'
  });
});

const categorias = [
  {
    titulo: 'Ortopedia & Traumatología',
    icon: '🦴',
    items: ['TPLO', 'TTA', 'Artrodesis', 'Prótesis de cadera', 'Fijadores externos']
  },
  {
    titulo: 'Cirugía General',
    icon: '🔬',
    items: ['Tejidos blandos', 'Digestiva', 'Columna vertebral']
  },
  {
    titulo: 'Rehabilitación',
    icon: '⚡',
    items: ['Láser terapéutico', 'Protocolos post-quirúrgicos', 'Seguimiento clínico']
  }
];

const stats = [
  { valor: '+20', label: 'Años de experiencia' },
  { valor: 'UAB', label: 'Profesor Asociado' },
  { valor: 'TPLO', label: 'Cirugía avanzada' },
  { valor: 'BCN', label: 'Formación internacional' }
];

const logros = [
  'Profesor Asociado, Univ. Autónoma de Barcelona (2007–2020)',
  'Hospital Clínico Veterinario UAB (2007–2019)',
  'Hospital Veterinari Canis, Girona (2024–2025)',
  'Autor: "Estudio radiológico de patologías articulares del perro" (2007)',
  'Ponente AVEPA-SEVC y SECIVE',
  'Investigación en biomateriales y consolidación ósea'
];

const tecnicas = [
  {
    nombre: 'TPLO',
    icon: '🦿',
    descripcion: 'Tibial Plateau Leveling Osteotomy. Técnica gold-standard para rotura del ligamento cruzado craneal en perros. Alta tasa de éxito y retorno a actividad normal.'
  },
  {
    nombre: 'TTA',
    icon: '🔩',
    descripcion: 'Tibial Tuberosity Advancement. Alternativa al TPLO para corrección de rotura de ligamento cruzado. Especialmente indicada en razas de talla mediana.'
  },
  {
    nombre: 'Prótesis de Cadera',
    icon: '🦽',
    descripcion: 'Reemplazo total de cadera en pacientes con displasia severa o necrosis avascular. Formación específica en Alemania con la técnica de Total Hip Replacement.'
  },
  {
    nombre: 'Cirugía de Columna',
    icon: '🧬',
    descripcion: 'Tratamiento quirúrgico de hernias discales, estenosis espinal y fracturas vertebrales en pequeños animales. Manejo de urgencias neurológicas.'
  }
];

const trayectoria = [
  { titulo: 'Doctor en Veterinaria', detalle: 'Formación académica en Colombia y España' },
  { titulo: 'Profesor Asociado – UAB', detalle: 'Traumatología y Ortopedia de pequeños animales (2007–2020)' },
  { titulo: 'Hospital Clínico Veterinario UAB', detalle: 'Barcelona, España (2007–2019)' },
  { titulo: 'Hospital Veterinari Canis', detalle: 'Girona, España (2024–2025)' },
  { titulo: 'Servicio Freelance', detalle: 'Barcelona y Catalunya (2008–2025)' },
  { titulo: 'Workshops TPLO / TTA', detalle: 'Barcelona · Total Hip Replacement, Alemania' },
  { titulo: 'SEVC Barcelona', detalle: 'Múltiples participaciones como ponente' },
  { titulo: 'Investigación', detalle: 'Biomateriales aplicados a ortopedia veterinaria' }
];
</script>
