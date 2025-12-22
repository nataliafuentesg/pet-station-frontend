<template>
  <div class="bg-gray-50 py-16 px-4 min-h-screen">
    <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div v-for="s in services" :key="s.slug" @click="selected = s"
        class="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 hover:shadow-2xl transition-all cursor-pointer group">
        <div class="w-16 h-16 rounded-2xl bg-ps-blue/10 text-ps-blue flex items-center justify-center mb-6 group-hover:bg-ps-blue group-hover:text-white transition-all">
          <i :class="[s.icon, 'text-3xl']"></i>
        </div>
        <h3 class="text-2xl font-black text-ps-dark mb-3">{{ s.title }}</h3>
        <p class="text-gray-500 text-sm leading-relaxed mb-6">{{ s.intro }}</p>
        <span class="text-ps-red font-bold text-xs uppercase tracking-widest">Ver Detalles Completos +</span>
      </div>
    </div>

    <Teleport to="body">
      <Transition name="fade">
        <div v-if="selected" @click.self="selected = null" class="fixed inset-0 z-[100] bg-ps-dark/95 backdrop-blur-md flex items-center justify-center p-4">
          <div @click.stop class="bg-white w-full max-w-6xl max-h-[95vh] rounded-[3.5rem] overflow-hidden flex flex-col lg:flex-row shadow-2xl">
            
            <div class="lg:w-1/3 bg-ps-blue p-10 text-white flex flex-col justify-center relative shrink-0">
              <button @click="selected = null" class="absolute top-6 left-6 text-white/50 hover:text-white lg:hidden"><i class="bi bi-x-lg"></i></button>
              <h2 class="text-5xl font-black mb-6 leading-tight">{{ selected.title }}</h2>
              <div class="h-2 w-16 bg-ps-red mb-8"></div>
              <p class="text-blue-100 text-lg leading-relaxed opacity-90">{{ selected.longDesc }}</p>
            </div>

            <div class="lg:w-2/3 p-8 lg:p-16 overflow-y-auto bg-white relative">
              <button @click="selected = null" class="hidden lg:block absolute top-8 right-10 text-gray-300 hover:text-ps-red text-4xl"><i class="bi bi-x-circle-fill"></i></button>

              <div v-if="selected.slug === 'consulta'" class="space-y-12">
                <div>
                  <h4 class="text-ps-dark font-black text-xs uppercase tracking-[0.2em] mb-6">Motivos frecuentes (Selecciona para WhatsApp)</h4>
                  <div class="flex flex-wrap gap-2">
                    <button v-for="m in selected.motivos" :key="m.id" @click="toggleMotivo(m.label)"
                      :class="[motivosSeleccionados.includes(m.label) ? 'bg-ps-blue text-white' : 'bg-gray-100 text-gray-500']"
                      class="px-5 py-2 rounded-xl text-xs font-bold transition-all border border-transparent">
                      {{ m.label }}
                    </button>
                  </div>
                </div>
                <div class="grid md:grid-cols-2 gap-8">
                  <div v-for="b in selected.bloques" :key="b.titulo">
                    <h5 class="text-ps-blue font-black text-xs uppercase mb-6 tracking-widest">{{ b.titulo }}</h5>
                    <div class="space-y-4">
                      <div v-for="i in b.items" :key="i.t" class="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <p class="font-black text-ps-dark text-sm">{{ i.t }}</p>
                        <p class="text-xs text-gray-500 italic">{{ i.d }}</p>
                      </div>
                      <p v-for="p in b.pasos" :key="p" class="text-xs font-bold text-gray-700 flex gap-2"><i class="bi bi-arrow-right text-ps-red"></i> {{ p }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="selected.slug === 'viajes'">
                <div class="flex gap-2 mb-10 overflow-x-auto pb-2">
                  <button v-for="t in selected.tabs" :key="t.id" @click="activeTab = t.id"
                    :class="[activeTab === t.id ? 'bg-ps-blue text-white shadow-lg' : 'bg-gray-100 text-gray-400']"
                    class="px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shrink-0">
                    {{ t.label }}
                  </button>
                </div>
                <div v-if="currentTab" class="space-y-8">
                  <p class="text-ps-dark text-xl font-bold leading-relaxed border-l-4 border-ps-red pl-6">{{ currentTab.content }}</p>
                  
                  <div v-if="currentTab.guia" class="space-y-4">
                    <div v-for="g in currentTab.guia" :key="g.p" class="p-6 bg-gray-50 rounded-[2rem] border border-gray-100 relative overflow-hidden group">
                      <div class="absolute right-0 top-0 h-full w-1 bg-ps-blue opacity-20 group-hover:opacity-100 transition-all"></div>
                      <h6 class="text-ps-blue font-black text-xs uppercase mb-1">{{ g.p }}</h6>
                      <p class="text-sm text-gray-600 font-medium italic">{{ g.d }}</p>
                    </div>
                  </div>

                  <div v-if="currentTab.items || currentTab.pasos" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div v-for="item in (currentTab.items || currentTab.pasos)" :key="item" class="flex gap-3 items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <i class="bi bi-check-circle-fill text-ps-red"></i>
                      <span class="text-xs font-bold text-gray-700">{{ item }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="selected.slug === 'rx'" class="space-y-10">
                <div class="grid md:grid-cols-3 gap-4">
                  <div v-for="e in selected.especificaciones" :key="e.t" class="p-6 bg-ps-blue/5 rounded-3xl border border-ps-blue/10">
                    <h6 class="font-black text-ps-blue text-sm mb-2 uppercase">{{ e.t }}</h6>
                    <p class="text-xs text-gray-500 italic">{{ e.d }}</p>
                  </div>
                </div>
                <div class="bg-ps-dark p-8 rounded-[2.5rem] text-white">
                  <h6 class="text-ps-red font-black text-xs uppercase tracking-widest mb-4">Requisitos de Toma</h6>
                  <ul class="space-y-3">
                    <li v-for="r in selected.preparacion" :key="r" class="text-xs font-medium text-blue-100 flex gap-2">
                      <i class="bi bi-info-circle text-ps-red"></i> {{ r }}
                    </li>
                  </ul>
                </div>
              </div>

              <div class="mt-16 sticky bottom-0 bg-white/90 backdrop-blur-sm pt-6 border-t border-gray-100">
                <a :href="waUrl" target="_blank" class="w-full bg-green-500 text-white py-6 rounded-3xl font-black text-xl shadow-xl shadow-green-200 flex items-center justify-center gap-4 transition-transform hover:scale-[1.01]">
                  <i class="bi bi-whatsapp"></i> AGENDAR AHORA
                </a>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { services } from '../../data/services';

const selected = ref(null);
const activeTab = ref('usa');
const motivosSeleccionados = ref([]);

const toggleMotivo = (m) => {
  const i = motivosSeleccionados.value.indexOf(m);
  if (i > -1) motivosSeleccionados.value.splice(i, 1);
  else motivosSeleccionados.value.push(m);
};

const currentTab = computed(() => {
  if (!selected.value?.tabs) return null;
  return selected.value.tabs.find(t => t.id === activeTab.value);
});

const waUrl = computed(() => {
  if (!selected.value) return '';
  let text = selected.value.waMsg;
  if (motivosSeleccionados.value.length > 0) text += ` Motivos: ${motivosSeleccionados.value.join(', ')}`;
  return `https://wa.me/573053462413?text=${encodeURIComponent(text)}`;
});
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>