<template>
  <div class="min-h-[calc(100dvh-12rem)] md:min-h-screen flex flex-col justify-center items-center bg-white dark:bg-[#050505] px-6 py-4 md:py-12 transition-colors duration-500 overflow-x-hidden relative w-full">
    
    <div class="w-full max-w-[400px] bg-slate-50 dark:bg-[#0A0A0A] rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden relative z-[10]">
      
      <div class="h-2 w-full bg-gradient-to-r from-[#152C77] to-[#DE1F27]"></div>

      <div class="p-8 flex flex-col items-center text-center">
        
        <div class="text-2xl md:text-3xl font-[1000] italic uppercase tracking-tighter mb-6">
          <span class="text-[#DE1F27]">PET</span><span class="dark:text-white text-[#152C77]"> STATION</span>
        </div>

        <div class="space-y-2 mb-6">
          <h1 class="text-[12px] md:text-sm font-[1000] uppercase italic tracking-widest text-[#152C77] dark:text-white leading-tight">
            ¡BIENVENIDA COMUNIDAD <br><span class="text-[#DE1F27] text-lg">@LAGAITA!</span>
          </h1>
          <p class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tighter">
            Tu beneficio exclusivo está listo
          </p>
        </div>

        <div class="w-full bg-[#152C77] dark:bg-white/5 p-6 rounded-[2rem] border border-white/10 shadow-inner mb-8 relative overflow-hidden">
          <div class="absolute -right-4 -top-4 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
          <span class="text-[8px] font-[1000] uppercase tracking-widest text-white/60 mb-2 block relative z-10">Código Promocional</span>
          <div class="text-3xl md:text-4xl font-[1000] text-white tracking-[0.15em] italic uppercase leading-none relative z-10" :class="{ 'opacity-50 line-through': isExpired }">
            GAITAPETS
          </div>
        </div>

        <button v-if="!isExpired" @click="showTermsModal = true" class="w-full bg-[#DE1F27] text-white py-4 rounded-2xl font-black uppercase text-[11px] tracking-widest italic shadow-xl shadow-red-500/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 mb-4">
          <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          Agendar por WhatsApp
        </button>

        <button v-else disabled class="w-full bg-slate-200 dark:bg-white/5 text-slate-400 py-4 rounded-2xl font-black uppercase text-[11px] tracking-widest italic flex items-center justify-center gap-2 mb-4 cursor-not-allowed">
          <span>🚫</span> Promoción Expirada
        </button>

        <div class="w-full text-left bg-slate-100 dark:bg-white/5 p-4 rounded-xl border border-slate-200 dark:border-white/5">
          <p class="text-[9px] font-black uppercase text-[#152C77] dark:text-slate-300 mb-2 italic">Resumen del beneficio:</p>
          <ul class="text-[8px] text-slate-500 dark:text-slate-400 list-disc pl-4 space-y-1.5 leading-relaxed font-bold">
            <li><strong>20% dto.</strong> (1ra mascota) y <strong>30% dto.</strong> (2da mascota). Máx 2.</li>
            <li>Válido para <strong>todos los clientes</strong> (1 vez).</li>
            <li :class="{'text-[#DE1F27]': isExpired}">Válido hasta el <strong>15 de Abril de 2026</strong>.</li>
          </ul>
        </div>

      </div>
    </div>
    
    <Transition name="fade">
      <div v-if="showTermsModal" class="fixed inset-0 z-[5000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <div class="bg-white dark:bg-[#0A0A0A] w-full max-w-[450px] rounded-[2rem] p-6 md:p-8 shadow-2xl border border-slate-200 dark:border-white/10 flex flex-col max-h-[90vh]">
          
          <div class="flex justify-between items-center mb-4 shrink-0">
            <h3 class="text-xl font-[1000] uppercase italic text-[#152C77] dark:text-white">Condiciones del beneficio</h3>
            <button @click="showTermsModal = false" class="text-3xl text-slate-400 hover:text-[#DE1F27] leading-none">&times;</button>
          </div>

          <p class="text-[9px] font-black text-[#DE1F27] mb-4 uppercase tracking-widest border-b border-slate-100 dark:border-white/5 pb-2 shrink-0">Lee esto antes de continuar:</p>
          
          <div class="overflow-y-auto custom-scrollbar pr-2 mb-6">
            <ul class="text-[11px] text-slate-600 dark:text-slate-300 list-disc pl-4 space-y-3 font-medium">
              <li>Recibe un <strong>20% de descuento</strong> en la primera mascota y un <strong>30% de descuento</strong> en la segunda. Válido para un máximo de dos (2) mascotas por familia.</li>
              <li>Válido para <strong>todos los clientes</strong> (nuevos y actuales), redimible por una (1) sola vez.</li>
              <li>Promoción válida únicamente hasta el <strong>15 de Abril de 2026</strong>.</li>
              <li><strong>Precios variables:</strong> El valor base del servicio se cotiza dependiendo del estado del manto, presencia de nudos, largo del pelo y frecuencia de baño previa.</li>
              <li><strong>Para Gatos:</strong> El servicio en felinos es <strong>únicamente de baño</strong>. No realizamos cortes de pelo en gatitos.</li>
              <li><strong>Bienestar Primero:</strong> La mascota debe estar acostumbrada al proceso de peluquería. Si presenta niveles altos de estrés o agresividad, no se realizará el servicio para garantizar su integridad y bienestar.</li>
              <li>Sujeto a disponibilidad de agenda. Se exigirá carné de vacunas al día.</li>
            </ul>
          </div>

          <label class="flex items-start gap-3 cursor-pointer mb-6 border-2 border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/5 p-4 rounded-xl hover:border-[#DE1F27]/30 transition-colors shrink-0">
            <div class="relative flex items-start">
              <input type="checkbox" v-model="acceptedTerms" class="peer appearance-none w-5 h-5 border-2 border-slate-300 dark:border-slate-600 rounded mt-0.5 checked:bg-[#DE1F27] checked:border-[#DE1F27] transition-all cursor-pointer">
              <svg class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none opacity-0 peer-checked:opacity-100 text-white transition-opacity mt-0.5" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <span class="text-[10px] font-bold text-slate-500 dark:text-slate-400 leading-snug pt-0.5">
              He leído y acepto las condiciones del servicio. Entiendo que el valor final dependerá de la evaluación clínica y del manto en la sede.
            </span>
          </label>

          <div class="flex gap-3 shrink-0">
            <button @click="showTermsModal = false" class="flex-1 py-3.5 rounded-xl border border-slate-300 dark:border-white/10 text-slate-500 dark:text-slate-400 font-black uppercase text-[9px] tracking-widest hover:bg-slate-100 dark:hover:bg-white/5 transition-all">
              Cancelar
            </button>
            <button 
              @click="aceptarYRedimir" 
              :disabled="!acceptedTerms"
              class="flex-[1.5] py-3.5 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all flex items-center justify-center gap-2"
              :class="acceptedTerms ? 'bg-[#25D366] text-white shadow-lg hover:bg-green-600 active:scale-95' : 'bg-slate-200 dark:bg-white/5 text-slate-400 cursor-not-allowed'">
              <span v-if="acceptedTerms">✓</span> Agendar Cita
            </button>
          </div>

        </div>
      </div>
    </Transition>

    <div class="fixed inset-0 pointer-events-none opacity-20 dark:opacity-10 z-[0] flex items-center justify-center">
      <span class="text-[200px] font-[1000] italic text-slate-200 dark:text-slate-800 -rotate-12 select-none">LA GAITA</span>
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

.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #334155; }
</style>