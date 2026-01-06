<template>
  <div class="min-h-screen bg-white dark:bg-[#050505] pt-24 md:pt-32 pb-20 transition-colors duration-500">
    <div class="max-w-7xl mx-auto px-4 md:px-6">
      
      <div class="grid lg:grid-cols-2 gap-8 md:gap-16 items-start mb-12">
        <div class="space-y-6 md:space-y-8 text-center md:text-left">
          <router-link to="/servicios" class="text-[#DE1F27] font-[1000] uppercase text-[10px] tracking-[0.3em] inline-flex items-center gap-2 hover:gap-4 transition-all">
            ← Volver a servicios
          </router-link>
          <h1 class="text-5xl md:text-8xl font-[1000] uppercase italic text-[#152C77] dark:text-white leading-[0.85] tracking-tighter">
            GLOBAL <br/> <span class="text-[#DE1F27]">TRAVEL.</span>
          </h1>
          <p class="text-slate-600 dark:text-slate-400 font-bold uppercase italic text-[10px] md:text-sm leading-relaxed max-w-md mx-auto md:mx-0">
            Expertos en normativa ICA para salida de mascotas desde Colombia. Selecciona tu destino:
          </p>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-2 gap-3 md:gap-4">
          <div v-for="d in destinos" :key="d.nombre" 
            @click="destinoActual = d"
            :class="[
              'cursor-pointer p-4 md:p-6 rounded-[2rem] border-2 transition-all duration-500 text-center flex flex-col items-center justify-center gap-2 md:gap-4',
              destinoActual.nombre === d.nombre 
                ? 'border-[#152C77] bg-[#152C77] text-white shadow-xl scale-105' 
                : 'border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-[#152C77] dark:text-white'
            ]">
            <span class="text-2xl md:text-4xl">{{ d.bandera }}</span>
            <p class="text-[9px] md:text-[11px] font-[1000] uppercase italic leading-tight">{{ d.nombre }}</p>
          </div>
        </div>
      </div>

      <div v-if="destinoActual" class="animate-in fade-in slide-in-from-bottom-10 duration-700">
        <div class="bg-slate-50 dark:bg-white/5 rounded-[2.5rem] md:rounded-[4rem] p-6 md:p-12 border border-slate-200 dark:border-white/10">
          
          <div class="grid lg:grid-cols-3 gap-8 md:gap-12">
            
            <div class="space-y-4 md:space-y-6 text-center md:text-left">
              <span class="text-[#DE1F27] font-black uppercase text-[10px] italic tracking-widest">Requisitos {{ destinoActual.nombre }}</span>
              <h3 class="text-3xl md:text-4xl font-[1000] uppercase italic text-[#152C77] dark:text-white leading-none">Protocolo <br/> Obligatorio</h3>
              <div class="bg-white dark:bg-white/10 p-4 rounded-2xl inline-block w-full">
                <p class="text-[9px] font-black text-slate-400 uppercase">Tiempo de gestión</p>
                <p class="text-sm font-black text-[#DE1F27] uppercase italic">{{ destinoActual.tiempo }}</p>
              </div>
            </div>

            <div class="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div v-for="req in destinoActual.requisitos" :key="req" 
                class="flex items-start gap-3 p-5 bg-white dark:bg-white/10 rounded-2xl shadow-sm border border-transparent hover:border-[#DE1F27]/20 transition-all">
                <span class="text-[#DE1F27] font-black mt-1">✓</span>
                <p class="text-[10px] md:text-[11px] font-black uppercase italic dark:text-white leading-snug">{{ req }}</p>
              </div>
            </div>
          </div>

          <div v-if="destinoActual.nota" class="mt-8 p-6 bg-[#DE1F27]/5 border-l-4 border-[#DE1F27] rounded-r-2xl">
            <p class="text-[10px] font-black text-[#DE1F27] uppercase mb-1 italic">Aviso Crítico:</p>
            <p class="text-[10px] text-slate-600 dark:text-slate-300 font-bold uppercase italic leading-relaxed">{{ destinoActual.nota }}</p>
          </div>

          <div class="mt-8 md:mt-12 flex flex-col md:flex-row gap-6 items-center border-t border-slate-200 dark:border-white/10 pt-8 md:pt-12">
            <div class="flex-1 text-center md:text-left">
              <p class="text-[#152C77] dark:text-white font-black uppercase italic text-sm md:text-base">¿Necesitas ayuda con el trámite ICA?</p>
              <p class="text-[9px] md:text-[10px] text-slate-500 font-bold uppercase italic mt-1">Realizamos la implantación de microchip, toma de muestras y radicación ante el ICA.</p>
            </div>
            <button @click="router.push('/agendar?servicio=VIAJES')" class="w-full md:w-auto bg-[#DE1F27] text-white px-10 py-5 rounded-2xl font-[1000] uppercase text-[10px] tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl">
              Iniciar Trámite de Viaje
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const destinos = [
  { 
    nombre: 'ESTADOS UNIDOS', 
    bandera: '🇺🇸', 
    tiempo: '2-3 meses', 
    requisitos: [
      'Microchip de 15 dígitos (ISO 11784/11785)', 
      'Serología de Rabia (Obligatorio CDC)', 
      'Vacuna Rabia emitida por Veterinario Licenciado', 
      'Formulario de Importación CDC Dog Import Form',
      'Inspección Clínica (Certificado de Salud)',
      'Certificado de Exportación ICA'
    ],
    nota: 'Desde agosto de 2024, Colombia es clasificado como país de alto riesgo de rabia por la CDC. La serología debe realizarse en laboratorios aprobados por la OMS y el microchip DEBE ser implantado ANTES de la vacuna de rabia.'
  },
  { 
    nombre: 'UNIÓN EUROPEA', 
    bandera: '🇪🇺', 
    tiempo: '4 meses', 
    requisitos: [
      'Microchip ISO obligatorio', 
      'Test Serología Rabia (Título > 0.5 UI/ml)', 
      'Espera obligatoria de 90 días después de la toma de muestra', 
      'Tratamiento contra Echinococcus (Perros)',
      'Certificado Sanitario de la UE radicado en ICA'
    ],
    nota: 'La muestra de sangre para la serología debe tomarse al menos 30 días después de la vacunación. No se puede viajar antes de los 3 meses contados desde la fecha de extracción de sangre.'
  },
  { 
    nombre: 'SURAMÉRICA', 
    bandera: '🇧🇷', 
    tiempo: '10-15 días', 
    requisitos: [
      'Certificado de Salud Profesional', 
      'Vacunación completa (Triple Viral/Parvo/Rabia)', 
      'Tratamiento Antiparasitario Interno y Externo', 
      'Inspección y Certificado ICA CIS',
      'Apostilla de documentos (Depende del país destino)'
    ],
    nota: 'Para países del Mercosur los requisitos son más ágiles, pero la inspección del ICA no debe superar los 10 días de emitida al momento de llegar al país destino.'
  },
  { 
    nombre: 'NACIONAL (COL)', 
    bandera: '🇨🇴', 
    tiempo: '1-3 días', 
    requisitos: [
      'Carnet de Vacunación Físico/Digital', 
      'Vacuna de Rabia vigente (> 15 días de aplicada)', 
      'Certificado de Salud Nacional (Para algunas aerolíneas)', 
      'Guacal reglamentario según peso y talla'
    ],
    nota: 'Recuerda que para vuelos nacionales, Avianca y Latam exigen que la mascota tenga al menos 4 meses de edad y el carnet debe especificar marca y lote de la vacuna.'
  }
];

const destinoActual = ref(destinos[0]);
</script>

<style scoped>
.animate-in {
  animation: fadeInSlide 0.8s ease-out;
}
@keyframes fadeInSlide {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>