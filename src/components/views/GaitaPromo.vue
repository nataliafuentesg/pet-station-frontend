<template>
  <div
    class="min-h-[calc(100dvh-12rem)] md:min-h-screen flex flex-col justify-start md:justify-center items-center bg-white dark:bg-[#050505] px-6 pt-10 md:pt-20 pb-12 transition-colors duration-500 overflow-x-hidden relative w-full font-sans">
    <div
      class="w-full max-w-[400px] bg-slate-50 dark:bg-[#0A0A0A] rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-visible relative z-[10]">

      <div v-if="!isExpired"
        class="absolute -top-6 -right-4 z-20 bg-[#DE1F27] text-white w-24 h-24 rounded-full flex flex-col items-center justify-center rotate-12 shadow-xl border-4 border-white dark:border-[#0A0A0A] animate-pulse">
        <span class="text-[10px] font-black uppercase leading-none">Hasta</span>
        <span class="text-3xl font-[1000] leading-none">30%</span>
        <span class="text-[12px] font-black uppercase leading-none italic text-yellow-300 tracking-tighter">OFF</span>
      </div>

      <div class="h-2 w-full bg-gradient-to-r from-[#152C77] to-[#DE1F27] rounded-t-[2.5rem]"></div>

      <div class="p-8 flex flex-col items-center text-center">

        <div class="text-2xl md:text-3xl font-[1000] italic uppercase tracking-tighter mb-4">
          <span class="text-[#DE1F27]">PET</span><span class="dark:text-white text-[#152C77]"> STATION</span>
        </div>

        <div class="space-y-1 mb-6">
          <h1 class="text-[14px] font-[1000] uppercase italic tracking-widest text-slate-400 dark:text-slate-500">
            PROMO <span class="text-[#DE1F27]">SPA & PELUQUERÍA</span>
          </h1>
          <p class="text-[10px] font-black text-[#152C77] dark:text-white uppercase">
            Exclusivo Comunidad @LAGAITA
          </p>
        </div>

        <div class="mb-8 w-full">
          <p class="text-[10px] font-black text-[#152C77] dark:text-white uppercase tracking-[0.2em] mb-1">Tu beneficio
            exclusivo:</p>
          <div
            class="flex flex-col items-center justify-center bg-white dark:bg-white/5 py-6 rounded-3xl border-2 border-dashed border-[#DE1F27]/30 group hover:border-[#DE1F27] transition-colors">
            <div class="flex items-baseline gap-1">
              <span class="text-6xl md:text-7xl font-[1000] text-[#DE1F27] italic tracking-tighter">20%</span>
              <span class="text-2xl font-black text-[#152C77] dark:text-white uppercase italic">dto</span>
            </div>
            <p class="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mt-2">
              + <span class="text-[#152C77] dark:text-white font-black italic">30% EN TU 2da MASCOTA</span>
            </p>
          </div>
        </div>

        <div
          class="w-full bg-[#152C77] dark:bg-white/10 p-5 rounded-2xl border border-white/10 shadow-lg mb-6 relative overflow-hidden group">
          <div
            class="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full duration-1000 transition-transform">
          </div>
          <span class="text-[9px] font-[1000] uppercase tracking-widest text-white/50 mb-1 block">Código en el
            chat:</span>
          <div class="text-2xl md:text-3xl font-[1000] text-white tracking-[0.2em] italic uppercase"
            :class="{ 'opacity-50 line-through': isExpired }">
            GAITAPETS
          </div>
        </div>

        <button v-if="!isExpired" @click="showTermsModal = true"
          class="w-full bg-[#DE1F27] hover:bg-[#b51920] text-white py-5 rounded-2xl font-[1000] uppercase text-[13px] tracking-widest italic shadow-2xl shadow-red-500/40 active:scale-95 transition-all flex items-center justify-center gap-3 mb-6">
          <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path
              d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          RECLAMAR DESCUENTO
        </button>

        <button v-else disabled
          class="w-full bg-slate-200 dark:bg-white/5 text-slate-400 py-4 rounded-2xl font-black uppercase text-[11px] tracking-widest italic flex items-center justify-center gap-2 mb-6 cursor-not-allowed">
          Promoción Expirada
        </button>

        <p class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase italic">
          *Válido hasta el 15 de Abril de 2026.
        </p>

      </div>
    </div>

    <Transition name="fade">
      <div v-if="showTermsModal"
        class="fixed inset-0 z-[5000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <div
          class="bg-white dark:bg-[#0A0A0A] w-full max-w-[450px] rounded-[2rem] p-6 md:p-8 shadow-2xl border border-slate-200 dark:border-white/10 flex flex-col max-h-[90vh]">

          <div class="flex justify-between items-center mb-4 shrink-0">
            <h3 class="text-xl font-[1000] uppercase italic text-[#152C77] dark:text-white">Condiciones</h3>
            <button @click="showTermsModal = false"
              class="text-3xl text-slate-400 hover:text-[#DE1F27] leading-none">&times;</button>
          </div>

          <div class="overflow-y-auto custom-scrollbar pr-2 mb-6">
            <ul class="text-[11px] text-slate-600 dark:text-slate-300 list-disc pl-4 space-y-3 font-medium">
              <li>Recibe un <strong>20% de descuento</strong> en la primera mascota y un <strong>30% de
                  descuento</strong> en la segunda.</li>
              <li>Válido para <strong>todos los clientes</strong>, redimible por una (1) sola vez.</li>
              <li>Promoción válida únicamente hasta el <strong>15 de Abril de 2026</strong>.</li>
              <li><strong>Para Gatos:</strong> El servicio en felinos es únicamente de baño.</li>
              <li>Sujeto a disponibilidad de agenda.</li>
            </ul>
          </div>

          <label
            class="flex items-start gap-3 cursor-pointer mb-6 border-2 border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/5 p-4 rounded-xl hover:border-[#DE1F27]/30 transition-colors shrink-0">
            <div class="relative flex items-start">
              <input type="checkbox" v-model="acceptedTerms"
                class="peer appearance-none w-5 h-5 border-2 border-slate-300 dark:border-slate-600 rounded mt-0.5 checked:bg-[#DE1F27] checked:border-[#DE1F27] transition-all cursor-pointer">
              <svg
                class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none opacity-0 peer-checked:opacity-100 text-white transition-opacity mt-0.5"
                viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"
                stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <span class="text-[10px] font-bold text-slate-500 dark:text-slate-400 leading-snug pt-0.5">
              Acepto las condiciones. Entiendo que el valor final dependerá de la evaluación del manto.
            </span>
          </label>

          <div class="flex gap-3 shrink-0">
            <button @click="showTermsModal = false"
              class="flex-1 py-3.5 rounded-xl border border-slate-300 dark:border-white/10 text-slate-500 dark:text-slate-400 font-black uppercase text-[9px] tracking-widest hover:bg-slate-100 dark:hover:bg-white/5 transition-all">
              Cancelar
            </button>
            <button @click="aceptarYRedimir" :disabled="!acceptedTerms"
              class="flex-[1.5] py-3.5 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all flex items-center justify-center gap-2"
              :class="acceptedTerms ? 'bg-[#25D366] text-white shadow-lg hover:bg-green-600 active:scale-95' : 'bg-slate-200 dark:bg-white/5 text-slate-400 cursor-not-allowed'">
              <span v-if="acceptedTerms">✓</span> Agendar Cita
            </button>
          </div>

        </div>
      </div>
    </Transition>

    <div class="fixed inset-0 pointer-events-none opacity-10 dark:opacity-5 z-[0] flex items-center justify-center">
      <span
        class="text-[150px] md:text-[200px] font-[1000] italic text-slate-200 dark:text-slate-800 -rotate-12 select-none uppercase tracking-tighter">LA
        GAITA</span>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';

const showTermsModal = ref(false);
const acceptedTerms = ref(false);

const limitDate = new Date('2026-04-16T00:00:00');
const isExpired = computed(() => new Date() > limitDate);

watch(showTermsModal, (newVal) => {
  if (!newVal) {
    setTimeout(() => {
      acceptedTerms.value = false;
    }, 300);
  }
});

const aceptarYRedimir = () => {
  if (!acceptedTerms.value) return;

  showTermsModal.value = false;
  const phone = "573208221778";
  const msg = encodeURIComponent("¡Hola Pet Station! 🐾 Soy de la comunidad de @lagaita. Ya leí las condiciones y quiero usar mi código GAITAPETS para agendar y aprovechar mi beneficio.");

  if (window.dataLayer) {
    window.dataLayer.push({ event: 'promo_lagaita_aceptada' });
  }

  window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 10px;
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #334155;
}
</style>