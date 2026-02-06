<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// BASE DE DATOS DE DESTINOS
const destinos = [
  { 
    nombre: 'ESTADOS UNIDOS', 
    bandera: '🇺🇸', 
    tiempo: '3 a 4 Meses', 
    // SECCIÓN EXCLUSIVA USA: AEROPUERTOS PERMITIDOS
    aeropuertos: [
      { code: 'MIA', city: 'Miami' },
      { code: 'JFK', city: 'New York' },
      { code: 'LAX', city: 'Los Angeles' },
      { code: 'ATL', city: 'Atlanta' },
      { code: 'IAD', city: 'Washington' },
      { code: 'PHL', city: 'Philadelphia' },
    ],
    // SECCIÓN EXCLUSIVA USA: PASO A PASO (INFO DEL AUDIO)
    pasoAPaso: [
      { 
        titulo: '1. Microchip y Vacunación', 
        detalle: 'Protocolo estricto: Primero implantamos el Microchip ISO de 15 dígitos y luego aplicamos la vacuna antirrábica. El orden inverso anula el proceso ante la CDC.',
        tip: 'Verificamos que el chip sea legible antes de empezar.'
      },
      { 
        titulo: '2. Periodo de Inmunización', 
        detalle: 'Debemos esperar obligatoriamente 30 días calendario después de la vacuna para que el organismo de la mascota genere los anticuerpos necesarios.',
        tip: 'No se puede tomar la muestra de sangre antes del día 31.'
      },
      { 
        titulo: '3. Serología de Rabia (Titer Test)', 
        detalle: 'Tomamos la muestra de suero sanguíneo y gestionamos su envío internacional a un laboratorio certificado por la CDC en Estados Unidos (Kansas/Missouri).',
        tip: 'Este resultado es válido por la vida de la mascota si se revacuna a tiempo.'
      },
      { 
        titulo: '4. Permiso de Importación CDC', 
        detalle: 'Con la serología aprobada, tomamos fotos dentales (frontales y laterales) para validar la edad y radicamos la solicitud ante el gobierno de EE.UU.',
        tip: 'La mascota debe tener mínimo 6 meses de edad cumplidos.'
      },
      { 
        titulo: '5. Coordinación Broker / ACF', 
        detalle: 'Contactamos a la Estación de Cuidado Animal (ACF) en el aeropuerto de llegada para reservar el cupo de ingreso y la validación veterinaria.',
        tip: 'Sin esta reserva confirmada, la aerolínea no permite el embarque.'
      },
      { 
        titulo: '6. Certificado ICA y Viaje', 
        detalle: '5 días antes del vuelo, emitimos el certificado de salud y realizamos la inspección final en la oficina del ICA en el aeropuerto El Dorado.',
      }
    ]
  },
  { 
    nombre: 'UNIÓN EUROPEA', 
    bandera: '🇪🇺', 
    tiempo: '4 Meses', 
    requisitos: [
      'Microchip ISO 11784/11785 obligatorio', 
      'Test Serología Rabia (Título > 0.5 UI/ml)', 
      'Espera obligatoria de 90 días después de la toma de muestra para poder viajar', 
      'Tratamiento contra Echinococcus (Solo Perros)',
      'Certificado Sanitario de la UE radicado en ICA',
      'Certificado de salud en formato oficial UE'
    ]
  },
  { 
    nombre: 'SURAMÉRICA', 
    bandera: '🇧🇷', 
    tiempo: '10-15 Días', 
    requisitos: [
      'Certificado de Salud Profesional', 
      'Vacunación completa (Triple Viral/Parvo/Rabia)', 
      'Desparasitación Interna y Externa reciente', 
      'Inspección y Certificado ICA CIS',
      'Apostilla de documentos (Depende del país destino, ej. Argentina)'
    ]
  },
  { 
    nombre: 'NACIONAL (COL)', 
    bandera: '🇨🇴', 
    tiempo: '1-3 Días', 
    requisitos: [
      'Carnet de Vacunación Físico/Digital al día', 
      'Vacuna de Rabia vigente (> 15 días de aplicada)', 
      'Certificado de Salud Nacional (Vigencia 5 días)', 
      'Guacal reglamentario según peso y talla',
      'Edad mínima 4 meses (Restricción aerolíneas)'
    ]
  }
];

const destinoActual = ref(destinos[0]);
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-[#050505] pt-5 md:pt-32 pb-20 transition-colors duration-500 font-sans">
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
            Normativa actualizada CDC e ICA para el transporte internacional de mascotas desde Colombia.
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
          
          <div class="flex flex-col md:flex-row gap-8 items-start justify-between mb-12 border-b border-slate-200 dark:border-white/10 pb-12">
            <div class="space-y-2">
              <span class="text-[#DE1F27] font-black uppercase text-[10px] italic tracking-widest">Trámite Seleccionado</span>
              <h3 class="text-4xl md:text-6xl font-[1000] uppercase italic text-[#152C77] dark:text-white leading-none">
                {{ destinoActual.nombre }}
              </h3>
            </div>
            <div class="bg-white dark:bg-white/10 p-5 rounded-3xl border border-slate-100 dark:border-white/5 text-center min-w-[120px]">
              <p class="text-[9px] font-black text-slate-400 uppercase mb-1">Duración Proceso</p>
              <p class="text-xl font-[1000] text-[#DE1F27] uppercase italic leading-none">{{ destinoActual.tiempo }}</p>
            </div>
          </div>

          <div v-if="destinoActual.aeropuertos" class="mb-16">
            <div class="p-8 bg-[#152C77] rounded-[2.5rem] text-white relative overflow-hidden shadow-2xl">
              <div class="absolute -top-20 -right-20 w-64 h-64 bg-[#DE1F27] blur-[80px] opacity-40 rounded-full"></div>
              <div class="relative z-10">
                <div class="flex flex-col md:flex-row items-start md:items-center gap-4 mb-8">
                  <span class="bg-[#DE1F27] text-white text-[10px] font-black px-4 py-2 rounded-xl uppercase italic tracking-widest">Restricción CDC</span>
                  <h4 class="text-xl md:text-2xl font-[1000] uppercase italic">Puntos de Ingreso Autorizados</h4>
                </div>
                <p class="text-[11px] md:text-xs font-bold opacity-80 mb-8 max-w-3xl leading-relaxed">
                  Debido a la regulación actual para países con riesgo de rabia, tu mascota <span class="text-[#DE1F27] bg-white px-2 py-0.5 rounded font-black">SOLO</span> puede ingresar a EE.UU. a través de aeropuertos que cuenten con una Estación de Cuidado Animal (ACF). No compres tiquetes a otras ciudades sin escala técnica en estos puntos:
                </p>
                
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <div v-for="ap in destinoActual.aeropuertos" :key="ap.code" 
                    class="bg-white/10 border border-white/20 p-4 rounded-2xl text-center hover:bg-white hover:text-[#152C77] transition-all cursor-default group">
                    <span class="block text-3xl font-[1000] italic mb-1">{{ ap.code }}</span>
                    <span class="block text-[8px] font-black uppercase tracking-widest opacity-60 group-hover:opacity-100">{{ ap.city }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="destinoActual.pasoAPaso" class="mb-12">
            <h4 class="text-3xl font-[1000] uppercase italic text-[#152C77] dark:text-white mb-10">
              Ruta de <span class="text-[#DE1F27]">Certificación</span>
            </h4>
            
            <div class="relative space-y-8">
              <div class="absolute left-[27px] top-4 bottom-4 w-[2px] bg-slate-200 dark:bg-white/10 hidden md:block"></div>

              <div v-for="(paso, index) in destinoActual.pasoAPaso" :key="index" 
                class="relative flex flex-col md:flex-row gap-8 group">
                
                <div class="flex-shrink-0 z-10">
                  <span class="w-14 h-14 bg-white dark:bg-[#0A0A0A] border-4 border-[#152C77] text-[#152C77] dark:text-white dark:border-[#DE1F27] rounded-full flex items-center justify-center font-[1000] text-xl shadow-lg group-hover:scale-110 transition-transform italic">
                    {{ index + 1 }}
                  </span>
                </div>
                
                <div class="flex-1 p-6 bg-white dark:bg-[#0A0A0A] rounded-[2rem] border-2 border-slate-100 dark:border-white/5 hover:border-[#152C77] dark:hover:border-[#DE1F27] transition-all shadow-sm group-hover:shadow-xl">
                  <h5 class="text-lg font-[1000] uppercase italic text-[#152C77] dark:text-white mb-3">{{ paso.titulo }}</h5>
                  <p class="text-[11px] font-bold text-slate-500 dark:text-slate-400 leading-relaxed uppercase mb-4">{{ paso.detalle }}</p>
                  
                  <div v-if="paso.tip" class="flex items-center gap-3 bg-slate-50 dark:bg-white/5 p-3 rounded-xl border-l-4 border-[#DE1F27]">
                    <span class="text-lg">💡</span>
                    <p class="text-[9px] font-black text-slate-400 uppercase italic leading-tight">{{ paso.tip }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="grid md:grid-cols-2 gap-4 mb-12">
            <div v-for="req in destinoActual.requisitos" :key="req" 
              class="flex items-start gap-3 p-5 bg-white dark:bg-white/10 rounded-2xl shadow-sm border border-transparent hover:border-[#DE1F27]/10 transition-all">
              <span class="text-[#DE1F27] font-black mt-1">✓</span>
              <p class="text-[10px] font-black uppercase italic dark:text-white leading-snug">{{ req }}</p>
            </div>
          </div>

          <div class="mt-16 flex flex-col md:flex-row gap-8 items-center bg-[#DE1F27] p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
            <div class="absolute inset-0 bg-white opacity-5 mix-blend-overlay" style="background-image: radial-gradient(circle, #fff 1px, transparent 1px); background-size: 20px 20px;"></div>
            
            <div class="flex-1 relative z-10 text-center md:text-left">
              <p class="font-[1000] uppercase italic text-2xl mb-2">¿Listo para el viaje?</p>
              <p class="text-[10px] font-bold uppercase tracking-widest opacity-90 max-w-xl leading-relaxed">
                Nos encargamos de toda la gestión: laboratorio internacional, radicación del permiso CDC, contacto con Broker y trámite ante el ICA.
              </p>
            </div>
            <button @click="router.push('/agendar?servicio=VIAJES')" class="relative z-10 w-full md:w-auto bg-white text-[#DE1F27] px-12 py-5 rounded-2xl font-[1000] uppercase text-[10px] tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl">
              Contactar Experto
            </button>
          </div>

        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.animate-in {
  animation: fadeInSlide 0.8s ease-out;
}
@keyframes fadeInSlide {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>