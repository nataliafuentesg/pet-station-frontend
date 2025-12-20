<template>
  <Transition name="fade">
    <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-6 overflow-hidden">
      <div class="absolute inset-0 bg-ps-blue/95 backdrop-blur-md" @click="$emit('close')"></div>
      
      <div class="relative bg-white w-full max-w-6xl rounded-t-[3rem] md:rounded-[4rem] h-[90vh] md:h-auto md:max-h-[95vh] overflow-hidden shadow-2xl flex flex-col">
        
        <div class="relative h-48 md:h-64 flex-shrink-0">
          <img :src="data.heroImg" class="w-full h-full object-cover" :alt="data.title">
          <div class="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
          <button @click="$emit('close')" class="absolute top-6 right-6 w-12 h-12 bg-white/90 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center text-ps-blue hover:text-ps-red transition-all z-20">✕</button>
        </div>

        <div class="p-8 md:p-14 overflow-y-auto custom-scroll">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            <div class="lg:col-span-2 space-y-8">
              <div>
                <span class="text-ps-red font-black text-[10px] uppercase tracking-[0.3em]">{{ data.category }}</span>
                <h2 class="text-4xl font-black text-ps-blue italic uppercase tracking-tighter mb-2">{{ data.title }}</h2>
                <div class="h-1 w-20 bg-ps-red"></div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div v-for="size in data.pricing" :key="size.key" class="bg-slate-50 border border-slate-100 p-6 rounded-[2.5rem] hover:shadow-xl hover:shadow-ps-blue/5 transition-all group">
                  <div class="flex justify-between items-start mb-3">
                    <div>
                      <h4 class="font-black text-ps-blue italic leading-none text-lg">{{ size.title }}</h4>
                      <p v-if="size.weight" class="text-[9px] font-bold text-slate-400 mt-1 uppercase">{{ size.weight }}</p>
                    </div>
                  </div>
                  <div v-for="p in size.prices" :key="p.n" class="flex justify-between py-2 border-b border-slate-200/50 last:border-0">
                    <span class="text-[11px] text-slate-500 font-medium italic">{{ p.n }}</span>
                    <span class="font-black text-ps-red">{{ formatMoney(p.p) }}</span>
                  </div>
                  <p v-if="size.razas" class="mt-4 text-[10px] text-slate-400 leading-tight italic border-t border-slate-100 pt-3">
                    <strong>Ejemplos:</strong> {{ size.razas }}
                  </p>
                </div>
              </div>
            </div>

            <div class="space-y-8">
              <div class="bg-ps-blue p-8 rounded-[3rem] text-white shadow-xl shadow-ps-blue/20">
                <h3 class="text-[10px] font-black uppercase tracking-widest mb-4 opacity-60">¿Qué incluye el servicio?</h3>
                <ul class="space-y-4">
                  <li v-for="item in data.details" :key="item" class="flex items-start gap-3 text-xs leading-relaxed italic font-medium">
                    <i class="bi bi-check2-circle text-ps-red text-base"></i> {{ item }}
                  </li>
                </ul>
              </div>

              <div class="bg-ps-red/5 border-2 border-dashed border-ps-red/20 p-6 rounded-[2.5rem]">
                <p class="text-[11px] text-ps-blue font-bold italic leading-relaxed">
                  <span class="text-ps-red font-black uppercase">Nota:</span> {{ data.disclaimer }}
                </p>
              </div>

              <a :href="generateWA(data.title)" target="_blank" class="w-full bg-[#25D366] text-white py-6 rounded-[2rem] font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl hover:scale-[1.02] active:scale-95 transition-all">
                <i class="bi bi-whatsapp text-xl"></i> Solicitar Cita
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
const props = defineProps({ isOpen: Boolean, data: Object });
defineEmits(['close']);

const formatMoney = (v) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(v);

const generateWA = (title) => {
  const msg = `Hola Pet Station! 👋 Me gustaría agendar un servicio de ${title}. Entiendo que los precios dependen del estado de mi mascota.`;
  return `https://wa.me/573053462413?text=${encodeURIComponent(msg)}`;
};
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.4s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.custom-scroll::-webkit-scrollbar { width: 4px; }
.custom-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
</style>