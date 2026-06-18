<template>
  <div class="min-h-screen bg-white dark:bg-[#050505] pt-5 md:pt-32 pb-20 transition-colors duration-500">
    <div class="max-w-7xl mx-auto px-4 md:px-6 space-y-10">

      <!-- HERO -->
      <div class="flex flex-col lg:grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
        <div class="space-y-4 md:space-y-6 text-center lg:text-left">
          <router-link to="/servicios"
            class="text-[#DE1F27] font-[1000] uppercase text-[10px] tracking-[0.3em] inline-flex items-center gap-2 hover:gap-4 transition-all">
            ← Volver a servicios
          </router-link>

          <h1 class="text-3xl md:text-5xl font-[1000] uppercase italic text-[#152C77] dark:text-white leading-[0.95] tracking-tighter">
            ESTÉTICA <br /><span class="text-[#DE1F27]">PROFESIONAL.</span>
          </h1>

          <p class="text-slate-500 dark:text-slate-400 font-bold text-xs md:text-sm leading-relaxed max-w-md mx-auto lg:mx-0">
            Selecciona el tamaño de tu mascota para ver el precio base. El valor final se ajusta según
            <span class="text-[#152C77] dark:text-white font-black">el estado del manto, el largo del pelo y el temperamento</span>
            de cada paciente.
          </p>

          <!-- Banner promo certificado electoral 22-27 jun -->
          <div v-if="promoActiva" class="flex items-start gap-3 bg-[#152C77] text-white rounded-2xl p-4 max-w-md mx-auto lg:mx-0">
            <span class="text-2xl shrink-0">🗳️</span>
            <div>
              <p class="text-[10px] font-black uppercase tracking-widest mb-1">¡Promo semana electoral!</p>
              <p class="text-[11px] font-bold leading-relaxed opacity-90">
                <strong>30% de descuento</strong> en peluquería del 22 al 27 de junio. Muéstranos tu certificado de votación al llegar y aplicamos el descuento.
              </p>
              <router-link to="/agendar?servicio=PELUQUERIA" class="inline-block mt-2 bg-[#DE1F27] text-white px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-transform">
                Agendar con descuento →
              </router-link>
            </div>
          </div>

          <!-- Aviso política de bienestar — destacado en el hero -->
          <div class="flex items-start gap-3 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-400/20 rounded-2xl p-4 max-w-md mx-auto lg:mx-0">
            <span class="text-xl shrink-0 mt-0.5">🛑</span>
            <div>
              <p class="text-[10px] font-black uppercase text-amber-700 dark:text-amber-400 tracking-widest mb-1">
                Política de bienestar animal
              </p>
              <p class="text-[11px] text-amber-800 dark:text-amber-300 font-bold leading-relaxed">
                Si detectamos <strong>estrés excesivo</strong> durante el servicio, lo detenemos de inmediato.
                La seguridad de tu mascota siempre es primero — esto puede afectar el tiempo y el costo final.
              </p>
            </div>
          </div>
        </div>

        <!-- Selector de talla -->
        <div class="grid grid-cols-2 md:grid-cols-3 gap-3 w-full">
          <div v-for="p in preciosPeluqueria" :key="p.talla"
            @click="seleccionarTalla(p)"
            :class="[
              'cursor-pointer p-4 md:p-5 rounded-[2rem] border-2 transition-all duration-300 flex flex-col items-center gap-2 text-center',
              seleccionada.talla === p.talla
                ? 'border-[#DE1F27] bg-[#DE1F27] text-white shadow-lg scale-105'
                : 'border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-[#152C77] dark:text-white hover:border-[#DE1F27]/40'
            ]">
            <span class="text-2xl md:text-3xl">{{ p.icono }}</span>
            <div>
              <p class="text-[10px] md:text-[11px] font-[1000] uppercase italic leading-none">{{ p.talla }}</p>
              <p :class="['text-[8px] font-bold uppercase mt-1', seleccionada.talla === p.talla ? 'text-white/70' : 'text-slate-400']">
                {{ p.ejemplo }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Panel de precio seleccionado -->
      <Transition name="fade-up">
        <div v-if="seleccionada" class="bg-[#152C77] dark:bg-white/5 rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-12 text-white">
          <div class="flex flex-col md:grid md:grid-cols-3 gap-8 items-center">

            <div class="space-y-2 text-center md:text-left">
              <span class="text-[#DE1F27] font-black uppercase text-[9px] italic tracking-widest">Talla seleccionada</span>
              <h3 class="text-3xl md:text-5xl font-[1000] uppercase italic leading-none">{{ seleccionada.talla }}</h3>
              <p class="text-white/60 text-[9px] font-bold uppercase tracking-wide leading-relaxed">
                Baño profundo · Corte de uñas · Limpieza de oídos · Perfume premium
              </p>
            </div>

            <!-- Precios "Desde" -->
            <div class="flex justify-center gap-8 border-y md:border-y-0 md:border-x border-white/10 py-6 md:py-0 w-full">
              <div class="text-center">
                <p class="text-[8px] font-black uppercase text-[#DE1F27] tracking-widest mb-1">Baño · Desde</p>
                <p class="text-2xl md:text-4xl font-[1000] tracking-tighter">${{ seleccionada.bano }}</p>
                <p class="text-[7px] text-white/40 font-bold uppercase mt-1">precio base</p>
              </div>
              <div v-if="seleccionada.corte !== 'N/A'" class="text-center">
                <p class="text-[8px] font-black uppercase text-[#DE1F27] tracking-widest mb-1">+ Corte · Desde</p>
                <p class="text-2xl md:text-4xl font-[1000] tracking-tighter">${{ seleccionada.corte }}</p>
                <p class="text-[7px] text-white/40 font-bold uppercase mt-1">precio base</p>
              </div>
              <div v-if="seleccionada.corte === 'N/A'" class="text-center opacity-40">
                <p class="text-[8px] font-black uppercase tracking-widest mb-1">Corte</p>
                <p class="text-sm font-bold uppercase">No aplica</p>
              </div>
            </div>

            <div class="w-full space-y-3">
              <button @click="irAAgendar"
                class="w-full bg-[#DE1F27] text-white py-5 rounded-2xl font-[1000] uppercase text-[10px] tracking-widest shadow-xl active:scale-95 hover:bg-red-600 transition-all">
                Solicitar Cita
              </button>
              <p class="text-[8px] text-white/40 font-bold uppercase tracking-wide text-center leading-relaxed">
                El precio final lo confirma nuestro estilista al recibir a tu mascota
              </p>
            </div>
          </div>
        </div>
      </Transition>

      <!-- ¿Por qué varía el precio? -->
      <div class="space-y-4">
        <h2 class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-white/30 text-center">
          ¿Por qué el precio es "desde"?
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">

          <div class="bg-slate-50 dark:bg-white/5 rounded-[2rem] p-6 border border-slate-100 dark:border-white/5">
            <div class="flex items-center gap-3 mb-3">
              <span class="text-2xl">🧶</span>
              <h4 class="text-[#152C77] dark:text-white font-black uppercase italic text-xs">Estado del Manto</h4>
            </div>
            <p class="text-[10px] text-slate-500 dark:text-slate-400 font-bold leading-relaxed">
              Un pelaje enredado, con nudos o muy sucio requiere más tiempo de trabajo y productos especiales. Cuanto mejor mantenido esté en casa, más cercano al precio base.
            </p>
          </div>

          <div class="bg-slate-50 dark:bg-white/5 rounded-[2rem] p-6 border border-slate-100 dark:border-white/5">
            <div class="flex items-center gap-3 mb-3">
              <span class="text-2xl">✂️</span>
              <h4 class="text-[#152C77] dark:text-white font-black uppercase italic text-xs">Tipo y Largo de Pelo</h4>
            </div>
            <p class="text-[10px] text-slate-500 dark:text-slate-400 font-bold leading-relaxed">
              Razas con pelo muy largo, doble manto o de crecimiento rápido necesitan más tiempo. El precio base aplica para un largo y densidad estándar.
            </p>
          </div>

          <div class="bg-amber-50 dark:bg-amber-500/10 rounded-[2rem] p-6 border border-amber-100 dark:border-amber-400/20">
            <div class="flex items-center gap-3 mb-3">
              <span class="text-2xl">🛑</span>
              <h4 class="text-amber-700 dark:text-amber-400 font-black uppercase italic text-xs">Temperamento y Estrés</h4>
            </div>
            <p class="text-[10px] text-amber-800 dark:text-amber-300 font-bold leading-relaxed">
              Si la mascota muestra estrés extremo, detenemos el servicio por su bienestar. En esos casos solo se cobra lo realizado. Nunca forzamos el proceso.
            </p>
          </div>

        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useTracking } from '@/composables/useTracking';

const router = useRouter();
const { trackViewService, trackSelectTalla, trackClickAgendarCita } = useTracking();

const preciosPeluqueria = [
  { talla: 'Gatos',   icono: '🐱', ejemplo: 'Persa, Criollo',       bano: '90.500',  corte: 'N/A'     },
  { talla: 'Mini',    icono: '🐶', ejemplo: 'Yorkie, Maltés',       bano: '90.500',  corte: '147.700' },
  { talla: 'Mediano', icono: '🐕', ejemplo: 'Beagle, Cocker',       bano: '119.700', corte: '147.700' },
  { talla: 'Grande',  icono: '🐩', ejemplo: 'Golden, Husky',        bano: '188.500', corte: 'N/A'     },
  { talla: 'Gigante', icono: '🦁', ejemplo: 'Gran Danés, Bernés',   bano: '188.500', corte: 'N/A'     },
];

const seleccionada = ref(preciosPeluqueria[1]);

const promoActiva = (() => {
  const hoy = new Date();
  const inicio = new Date('2026-06-22');
  const fin    = new Date('2026-06-27T23:59:59');
  return hoy >= inicio && hoy <= fin;
})();

const seleccionarTalla = (p) => {
  seleccionada.value = p;
  trackSelectTalla(p.talla, p.bano);
};

const irAAgendar = () => {
  trackClickAgendarCita('PELUQUERIA', 'pagina_peluqueria');
  router.push({ path: '/agendar', query: { servicio: 'PELUQUERIA', talla: seleccionada.value.talla } });
};

onMounted(() => {
  trackViewService('Peluquería Canina');
});
</script>

<style scoped>
.fade-up-enter-active { transition: all 0.5s ease; }
.fade-up-enter-from  { opacity: 0; transform: translateY(16px); }
</style>
