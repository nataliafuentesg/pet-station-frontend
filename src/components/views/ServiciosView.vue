<template>
  <div class="min-h-screen bg-white dark:bg-[#050505] pt-5 md:pt-32 pb-20 px-4 md:px-6 transition-colors duration-500">
    <div class="max-w-7xl mx-auto space-y-6">

      <!-- Header -->
      <div class="mb-8">
        <span class="text-[#DE1F27] font-black uppercase tracking-[0.3em] text-[9px] md:text-[10px]">Pet Station · Chía</span>
        <h1 class="text-3xl md:text-5xl font-[1000] uppercase italic tracking-tighter leading-[0.95] text-[#152C77] dark:text-white mt-2">
          NUESTROS <br /><span class="text-[#DE1F27]">SERVICIOS.</span>
        </h1>
      </div>

      <!-- Medicina y Peluquería — cards grandes -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

        <!-- Medicina -->
        <div class="group relative overflow-hidden rounded-[2.5rem] border-2 border-slate-100 dark:border-white/10 bg-white dark:bg-white/5 p-8 md:p-10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div class="space-y-4">
            <div class="w-14 h-14 bg-[#152C77] rounded-2xl flex items-center justify-center text-2xl shadow-md">🩺</div>
            <div>
              <span class="text-[9px] font-black uppercase text-[#DE1F27] tracking-widest">Clínica veterinaria</span>
              <h2 class="text-2xl md:text-3xl font-[1000] uppercase italic text-[#152C77] dark:text-white leading-tight mt-1">
                Consulta &<br />Medicina
              </h2>
            </div>
            <p class="text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] leading-relaxed">
              Medicina preventiva, cirugía programada, laboratorio clínico, odontología y diagnóstico por imagen.
            </p>
          </div>
          <div class="flex flex-col gap-3 mt-8">
            <button @click="router.push('/agendar?servicio=CONSULTA')"
              class="w-full py-4 bg-[#152C77] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-[#DE1F27] active:scale-95 transition-all">
              Reservar Consulta
            </button>
            <router-link to="/servicios/medicina"
              class="text-center py-3 text-[#152C77] dark:text-white font-black uppercase text-[9px] tracking-widest border-2 border-slate-100 dark:border-white/10 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
              Ver detalles →
            </router-link>
          </div>
        </div>

        <!-- Peluquería -->
        <div class="group relative overflow-hidden rounded-[2.5rem] bg-[#152C77] p-8 md:p-10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div class="space-y-4 text-white">
            <div class="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-2xl">✂️</div>
            <div>
              <span class="text-[9px] font-black uppercase text-[#DE1F27] tracking-widest">Estética animal</span>
              <h2 class="text-2xl md:text-3xl font-[1000] uppercase italic leading-tight mt-1">
                Peluquería<br />& Spa
              </h2>
            </div>
            <p class="text-white/60 font-bold uppercase text-[10px] leading-relaxed">
              Baño medicado, corte de pelo, limpieza de oídos y perfume premium. Bienestar animal garantizado.
            </p>
          </div>
          <div class="flex flex-col gap-3 mt-8">
            <button @click="router.push('/agendar?servicio=PELUQUERIA')"
              class="w-full py-4 bg-[#DE1F27] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white hover:text-[#DE1F27] active:scale-95 transition-all">
              Agendar Turno
            </button>
            <router-link to="/servicios/peluqueria"
              class="text-center py-3 text-white font-black uppercase text-[9px] tracking-widest border-2 border-white/20 rounded-2xl hover:bg-white/10 transition-all">
              Ver precios →
            </router-link>
          </div>
          <div class="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
        </div>
      </div>

      <!-- Viajes y Guardería -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

        <!-- Viajes -->
        <router-link to="/servicios/viajes"
          class="group flex items-center justify-between gap-6 bg-slate-50 dark:bg-white/5 rounded-[2rem] p-7 border border-slate-100 dark:border-white/10 hover:border-[#152C77] dark:hover:border-[#DE1F27] hover:shadow-lg transition-all duration-300">
          <div class="space-y-2">
            <span class="text-[8px] font-black uppercase text-[#DE1F27] tracking-widest">ICA · CDC · UE</span>
            <h3 class="text-xl md:text-2xl font-[1000] uppercase italic text-[#152C77] dark:text-white leading-tight">
              Viajes<br />Internacionales
            </h3>
            <p class="text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] leading-relaxed max-w-xs">
              Serologías, microchip y trámites ICA para viaje a USA, Europa y Latinoamérica.
            </p>
            <span class="inline-flex items-center gap-1 text-[9px] font-black uppercase text-[#152C77] dark:text-white mt-2 group-hover:gap-3 transition-all">
              Ver checklist →
            </span>
          </div>
          <div class="text-5xl shrink-0 group-hover:scale-110 transition-transform duration-300">✈️</div>
        </router-link>

        <!-- Guardería -->
        <router-link to="/servicios/guarderia"
          class="group flex items-center justify-between gap-6 bg-green-50 dark:bg-green-900/10 rounded-[2rem] p-7 border border-green-100 dark:border-green-800/20 hover:border-green-500 hover:shadow-lg transition-all duration-300">
          <div class="space-y-2">
            <span class="text-[8px] font-black uppercase text-green-600 tracking-widest">Hotel & Fun</span>
            <h3 class="text-xl md:text-2xl font-[1000] uppercase italic text-green-800 dark:text-green-400 leading-tight">
              Guardería<br />& Hotel
            </h3>
            <p class="text-green-700/60 dark:text-green-400/60 font-bold uppercase text-[10px] leading-relaxed max-w-xs">
              Pasa día, pernoctación y cuidado médico. Zonas verdes, cámaras y sin jaulas.
            </p>
            <span class="inline-flex items-center gap-1 text-[9px] font-black uppercase text-green-700 dark:text-green-400 mt-2 group-hover:gap-3 transition-all">
              Ver instalaciones →
            </span>
          </div>
          <div class="text-5xl shrink-0 group-hover:scale-110 transition-transform duration-300">🏡</div>
        </router-link>
      </div>

      <!-- CTA WhatsApp -->
      <div class="bg-[#DE1F27] rounded-[2.5rem] p-8 md:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-red-200/40 dark:shadow-red-900/20">
        <div>
          <h3 class="text-xl md:text-2xl font-[1000] uppercase italic leading-tight mb-1">
            ¿Tienes dudas sobre<br class="hidden md:block" /> qué servicio necesitas?
          </h3>
          <p class="text-white/70 font-bold uppercase text-[10px]">
            Escríbenos y te orientamos sin compromiso.
          </p>
        </div>
        <a href="https://wa.me/573053462413?text=Hola%20Pet%20Station!%20Quiero%20información%20sobre%20sus%20servicios."
          target="_blank"
          class="shrink-0 w-full md:w-auto bg-white text-[#DE1F27] px-10 py-5 rounded-2xl font-[1000] uppercase text-[10px] tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl text-center">
          💬 Hablar con un Asesor
        </a>
      </div>

    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useTracking } from '@/composables/useTracking';

const router = useRouter();
const { trackViewService } = useTracking();

onMounted(() => trackViewService('Servicios'));
</script>
