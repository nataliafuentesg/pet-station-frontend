<script setup>
import { ref, computed } from 'vue';

const trackWhatsApp = (posicion) => {
  if (window.dataLayer) {
    window.dataLayer.push({
      event: 'contacto_whatsapp',
      posicion: posicion
    });
  }
};

const destinos = [
  { 
    nombre: 'ESTADOS UNIDOS', 
    bandera: '🇺🇸', 
    tiempo: '3 Meses',
    aviso: 'PAÍS DE ALTO RIESGO (CDC)',
    // INFO DEL PDF USA
    aeropuertos: [
      { code: 'MIA', city: 'Miami' },
      { code: 'JFK', city: 'New York' },
      { code: 'LAX', city: 'Los Angeles' },
      { code: 'ATL', city: 'Atlanta' },
      { code: 'IAD', city: 'Washington' },
      { code: 'PHL', city: 'Philadelphia' },
    ],
    pasoAPaso: [
      { 
        titulo: '1. Microchip y Vacuna (Orden Estricto)', 
        detalle: 'Primero implantamos el Microchip ISO de 15 dígitos. LUEGO aplicamos la vacuna antirrábica vigente. Si se vacuna antes del chip, el proceso es nulo ante la CDC.',
        alert: 'La mascota debe tener mínimo 6 meses para viajar.'
      },
      { 
        titulo: '2. Periodo de Inmunización', 
        detalle: 'Debemos esperar obligatoriamente 30 días calendario después de la vacuna para que el sistema inmune genere anticuerpos.',
        tip: 'No se puede tomar la muestra antes del día 31.'
      },
      { 
        titulo: '3. Serología de Rabia (El Filtro)', 
        detalle: 'Tomamos la muestra de suero y la enviamos al laboratorio certificado en Kansas/Missouri. El resultado debe ser ≥ 0.5 UI/ml.',
        tip: 'Este resultado es válido de por vida si se revacuna puntualmente.'
      },
      { 
        titulo: '4. Permiso CDC & Fotos Dentales', 
        detalle: 'Con la serología aprobada, tomamos fotos dentales para validar edad y radicamos la solicitud del Permiso de Importación ante el gobierno de EE.UU.',
      },
      { 
        titulo: '5. Logística ACF y Broker', 
        detalle: 'Obligatorio: Debes tener reserva confirmada en la Estación de Cuidado Animal (ACF) del aeropuerto de llegada y contratar un Agente Aduanal (Broker).',
        tip: 'Sin reserva ACF no te dejarán abordar el avión.'
      },
      { 
        titulo: '6. Carga SISPAP y CIS (ICA)', 
        detalle: '5 días antes del vuelo, cargamos vacunas y serología al sistema SISPAP. Luego vamos a la oficina del ICA (Puerto/Aeropuerto) para la inspección física y emisión del CIS.',
      },
      { 
        titulo: '7. CDC Form (Paso Final)', 
        detalle: 'Entre 2 y 10 días antes del vuelo, llenamos el formulario digital CDC con los datos del vuelo y foto reciente para generar el QR de ingreso.',
      }
    ]
  },
  { 
    nombre: 'UNIÓN EUROPEA', 
    bandera: '🇪🇺', 
    tiempo: '4 Meses', 
    aviso: 'REGLAMENTO UE 576/2013',
    pasoAPaso: [
      { 
        titulo: '1. Identificación y Vacunación', 
        detalle: 'Implantación de Microchip ISO compatible y vacunación antirrábica posterior. Todo debe estar registrado en el carnet oficial.',
      },
      { 
        titulo: '2. Test de Serología (Títulos)', 
        detalle: 'Toma de muestra sanguínea 30 días después de la vacuna. Se envía a laboratorio autorizado por la Unión Europea. Resultado requerido: > 0.5 UI/ml.',
      },
      { 
        titulo: '3. La Espera de 90 Días', 
        detalle: 'UNA VEZ TOMADA LA MUESTRA DE SANGRE, la mascota NO puede entrar a Europa hasta que pasen 3 meses exactos (Cuarentena en origen).',
        alert: 'No compres tiquetes antes de cumplir este tiempo.',
        esCritico: true // ALERTA ROJA
      },
      { 
        titulo: '4. Tratamiento Tenia (Echinococcus)', 
        detalle: 'Solo si viajas a: Finlandia, Irlanda, Malta, Noruega o Irlanda del Norte. Se debe desparasitar entre 24 y 120 horas (1-5 días) antes de llegar.',
        tip: 'Países como España o Francia no exigen este paso específico.'
      },
      { 
        titulo: '5. Certificado Zoosanitario UE', 
        detalle: 'El veterinario oficial del ICA debe diligenciar y sellar el Certificado de Salud (Anexo IV) máximo 10 días antes del viaje.',
      },
      { 
        titulo: '6. Inspección ICA Salida', 
        detalle: '5 días antes del viaje: Revisión física en oficina ICA Aeropuerto, revisión de microchip y entrega del CIS (Certificado de Inspección Sanitaria).',
      }
    ]
  },
  { 
    nombre: 'SURAMÉRICA / LATAM', 
    bandera: '🇧🇷', 
    tiempo: '10-15 Días', 
    aviso: 'NORMATIVA MERCOSUR / CAN',
    requisitos: [
      'Certificado de Salud Profesional (Vigencia corta)', 
      'Vacunación completa (Triple/Parvo/Rabia) y Desparasitación', 
      'Inspección ICA CIS en Aeropuerto (SISPAP)',
      'Apostilla de documentos (Requerido para ARGENTINA)',
      'Certificado de vacunación original y copia'
    ]
  },
  { 
    nombre: 'NACIONAL (COLOMBIA)', 
    bandera: '🇨🇴', 
    tiempo: '1-3 Días', 
    aviso: 'AERONÁUTICA CIVIL',
    requisitos: [
      'Carnet de Vacunación al día (Físico o Digital)', 
      'Vacuna de Rabia vigente (> 15 días de aplicada)', 
      'Certificado de Salud de Veterinario (Vigencia 5 días)', 
      'Guacal reglamentario (Altura: La mascota debe poder pararse sin tocar el techo)',
      'Edad mínima: 4 meses (Restricción de mayoría de aerolíneas)'
    ]
  }
];

const destinoActual = ref(destinos[0]);

// --- WHATSAPP ESPECÍFICO PARA VIAJES ---
const whatsappLink = computed(() => {
  const telefono = '573208221778'; // Número exclusivo de viajes
  const mensaje = `Hola Pet Station! ✈️\nEstuve revisando la guía de viaje para *${destinoActual.value.nombre}*.\nMe gustaría iniciar el proceso o recibir asesoría personalizada.`;
  return `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
});
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
            Expertos en normativa CDC (USA) y Unión Europea. Gestionamos serologías, permisos de importación y logística de viaje para tu mascota.
          </p>
        </div>

        <div class="grid grid-cols-2 gap-3 md:gap-4">
          <div v-for="d in destinos" :key="d.nombre" 
            @click="destinoActual = d"
            :class="[
              'cursor-pointer p-4 md:p-6 rounded-[2rem] border-2 transition-all duration-500 text-center flex flex-col items-center justify-center gap-2 group',
              destinoActual.nombre === d.nombre 
                ? 'border-[#152C77] bg-[#152C77] text-white shadow-xl scale-105' 
                : 'border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-[#152C77] dark:text-white hover:border-[#DE1F27]/30'
            ]">
            <span class="text-3xl md:text-5xl drop-shadow-md group-hover:scale-110 transition-transform">{{ d.bandera }}</span>
            <p class="text-[9px] md:text-[10px] font-[1000] uppercase italic leading-tight">{{ d.nombre }}</p>
          </div>
        </div>
      </div>

      <div v-if="destinoActual" class="animate-in fade-in slide-in-from-bottom-10 duration-700">
        <div class="bg-slate-50 dark:bg-white/5 rounded-[2.5rem] md:rounded-[4rem] p-6 md:p-12 border border-slate-200 dark:border-white/10 shadow-lg">
          
          <div class="flex flex-col md:flex-row gap-8 items-start justify-between mb-12 border-b border-slate-200 dark:border-white/10 pb-12">
            <div class="space-y-2">
              <span class="inline-block bg-[#DE1F27] text-white text-[8px] font-black uppercase px-3 py-1 rounded-lg tracking-widest italic mb-2">
                {{ destinoActual.aviso }}
              </span>
              <h3 class="text-4xl md:text-6xl font-[1000] uppercase italic text-[#152C77] dark:text-white leading-none">
                {{ destinoActual.nombre }}
              </h3>
            </div>
            <div class="bg-white dark:bg-white/10 p-6 rounded-3xl border border-slate-100 dark:border-white/5 text-center min-w-[140px] shadow-sm">
              <p class="text-[8px] font-black text-slate-400 uppercase mb-2 tracking-widest">Tiempo Estimado</p>
              <p class="text-2xl font-[1000] text-[#DE1F27] uppercase italic leading-none">{{ destinoActual.tiempo }}</p>
            </div>
          </div>

          <div v-if="destinoActual.aeropuertos" class="mb-16">
            <div class="p-8 md:p-10 bg-[#152C77] rounded-[2.5rem] text-white relative overflow-hidden shadow-2xl border-4 border-[#152C77]">
              <div class="absolute -top-32 -right-32 w-80 h-80 bg-[#DE1F27] blur-[100px] opacity-40 rounded-full"></div>
              
              <div class="relative z-10">
                <div class="flex flex-col md:flex-row items-start md:items-center gap-4 mb-8">
                  <div class="bg-white text-[#152C77] p-3 rounded-full text-2xl shadow-lg">✈️</div>
                  <div>
                    <h4 class="text-xl md:text-3xl font-[1000] uppercase italic">Puntos de Ingreso Autorizados</h4>
                    <p class="text-[9px] font-bold uppercase tracking-widest opacity-60">Solo aeropuertos con Animal Care Facility (ACF)</p>
                  </div>
                </div>
                
                <p class="text-[11px] md:text-xs font-medium opacity-90 mb-8 max-w-3xl leading-relaxed">
                  ⚠️ <span class="font-black text-[#DE1F27] bg-white px-1 rounded">IMPORTANTE:</span> Tu mascota NO puede ingresar por ningún otro aeropuerto (ej. Orlando, Houston, Fort Lauderdale) ya que no cuentan con instalaciones aprobadas por la CDC para la inspección veterinaria obligatoria.
                </p>
                
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  <div v-for="ap in destinoActual.aeropuertos" :key="ap.code" 
                    class="bg-white/10 border border-white/20 p-4 rounded-2xl text-center hover:bg-white hover:text-[#152C77] transition-all cursor-default group backdrop-blur-sm">
                    <span class="block text-3xl font-[1000] italic mb-1">{{ ap.code }}</span>
                    <span class="block text-[7px] font-black uppercase tracking-widest opacity-60 group-hover:opacity-100">{{ ap.city }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="destinoActual.pasoAPaso" class="mb-12">
            <h4 class="text-3xl font-[1000] uppercase italic text-[#152C77] dark:text-white mb-10 flex items-center gap-3">
              Ruta de <span class="text-[#DE1F27]">Certificación</span>
              <span class="text-sm bg-slate-100 dark:bg-white/10 text-slate-400 px-3 py-1 rounded-full not-italic font-bold tracking-normal">Oficial</span>
            </h4>
            
            <div class="relative space-y-6">
              <div class="absolute left-[27px] top-6 bottom-6 w-[3px] bg-slate-200 dark:bg-white/10 hidden md:block rounded-full"></div>

              <div v-for="(paso, index) in destinoActual.pasoAPaso" :key="index" 
                class="relative flex flex-col md:flex-row gap-6 md:gap-10 group">
                
                <div class="flex-shrink-0 z-10">
                  <span class="w-14 h-14 bg-white dark:bg-[#0A0A0A] border-[4px] border-[#152C77] text-[#152C77] dark:text-white dark:border-[#DE1F27] rounded-full flex items-center justify-center font-[1000] text-2xl shadow-lg group-hover:scale-110 transition-transform italic relative">
                    {{ index + 1 }}
                    <span v-if="paso.esCritico" class="absolute -top-1 -right-1 w-4 h-4 bg-[#DE1F27] rounded-full animate-ping"></span>
                  </span>
                </div>
                
                <div :class="['flex-1 p-6 md:p-8 rounded-[2.5rem] border-2 transition-all shadow-sm group-hover:shadow-2xl', 
                  paso.esCritico ? 'bg-red-50 dark:bg-[#DE1F27]/5 border-[#DE1F27] dark:border-[#DE1F27]/50' : 'bg-white dark:bg-[#0A0A0A] border-slate-100 dark:border-white/5 hover:border-[#152C77] dark:hover:border-[#DE1F27]']">
                  
                  <h5 :class="['text-lg md:text-xl font-[1000] uppercase italic mb-3', paso.esCritico ? 'text-[#DE1F27]' : 'text-[#152C77] dark:text-white']">
                    {{ paso.titulo }}
                  </h5>
                  <p class="text-xs font-bold text-slate-500 dark:text-slate-400 leading-relaxed uppercase mb-4 text-justify">
                    {{ paso.detalle }}
                  </p>
                  
                  <div class="flex flex-col gap-2">
                    <div v-if="paso.alert" class="flex items-start gap-3 bg-[#DE1F27]/10 p-3 rounded-xl border-l-4 border-[#DE1F27]">
                      <span class="text-sm">⚠️</span>
                      <p class="text-[9px] font-black text-[#DE1F27] uppercase italic leading-tight">{{ paso.alert }}</p>
                    </div>
                    
                    <div v-if="paso.tip" class="flex items-start gap-3 bg-slate-50 dark:bg-white/5 p-3 rounded-xl border-l-4 border-slate-300 dark:border-slate-600">
                      <span class="text-sm">💡</span>
                      <p class="text-[9px] font-black text-slate-400 uppercase italic leading-tight">{{ paso.tip }}</p>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>

          <div v-else class="grid md:grid-cols-2 gap-4 mb-12">
            <div v-for="req in destinoActual.requisitos" :key="req" 
              class="flex items-start gap-3 p-6 bg-white dark:bg-white/10 rounded-[2rem] shadow-sm border border-transparent hover:border-[#DE1F27]/20 transition-all hover:scale-[1.02]">
              <div class="w-6 h-6 rounded-full bg-[#DE1F27]/10 flex items-center justify-center shrink-0 mt-0.5">
                <span class="text-[#DE1F27] font-black text-[10px]">✓</span>
              </div>
              <p class="text-[10px] font-black uppercase italic dark:text-white leading-relaxed">{{ req }}</p>
            </div>
          </div>

          <div class="mt-16 flex flex-col md:flex-row gap-8 items-center bg-[#DE1F27] p-10 md:p-14 rounded-[3rem] text-white shadow-2xl shadow-[#DE1F27]/30 relative overflow-hidden group">
            <div class="absolute inset-0 bg-white opacity-10 mix-blend-overlay" style="background-image: radial-gradient(circle, #fff 1px, transparent 1px); background-size: 20px 20px;"></div>
            <div class="absolute -right-20 -bottom-40 w-96 h-96 bg-black/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
            
            <div class="flex-1 relative z-10 text-center md:text-left">
              <p class="font-[1000] uppercase italic text-3xl mb-2">¿Listo para volar?</p>
              <p class="text-[10px] font-bold uppercase tracking-widest opacity-90 max-w-xl leading-relaxed">
                Evita errores que impidan el viaje. Nosotros nos encargamos de la parte médica, laboratorios internacionales y trámites ICA.
              </p>
            </div>
            
            <a :href="whatsappLink" @click="trackWhatsApp('viajes_asesoria_footer')" target="_blank" 
               class="relative z-10 w-full md:w-auto bg-white text-[#DE1F27] px-12 py-5 rounded-2xl font-[1000] uppercase text-[11px] tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center justify-center gap-3">
              <span>💬</span> Agendar Asesoría
            </a>
          </div>

        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.animate-in { animation: fadeInSlide 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes fadeInSlide {
  from { opacity: 0; transform: translateY(40px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
</style>