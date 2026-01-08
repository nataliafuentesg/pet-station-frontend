<template>
  <div class="min-h-screen bg-white dark:bg-[#050505] pt-32 pb-44 md:pb-20 px-4 md:px-8 transition-colors duration-500">
    <div class="max-w-[1700px] mx-auto">
      
      <header class="flex flex-col lg:flex-row justify-between items-end gap-8 mb-20">
        <div class="space-y-2">
          <h1 class="text-7xl md:text-9xl font-[1000] uppercase italic tracking-tighter text-[#152C77] dark:text-white leading-[0.8]">
            PET <span class="text-[#DE1F27]">SHOP.</span>
          </h1>
          <p class="text-slate-400 font-black uppercase tracking-[0.4em] text-[10px] ml-2">Suministros Médicos y Nutrición</p>
        </div>

        <div class="bg-[#152C77] text-white p-6 rounded-[2.5rem] shadow-2xl min-w-[280px] border-b-4 border-[#DE1F27] flex justify-between items-center group transition-all hover:scale-105">
          <div>
            <p class="text-[10px] font-black uppercase opacity-60 tracking-widest mb-1">Tu Carrito</p>
            <p class="text-3xl font-[1000] italic">${{ cartStore.totalPrice.toLocaleString() }}</p>
          </div>
          <div class="bg-[#DE1F27] w-12 h-12 rounded-full flex items-center justify-center font-[1000] italic shadow-lg">
            {{ cartStore.cartCount }}
          </div>
        </div>
      </header>

      <div class="flex flex-col lg:flex-row gap-16">
        
        <aside class="hidden lg:block w-64 shrink-0 sticky top-40 h-fit space-y-12">
          
          <div v-if="mascotaActiva" @click="toggleRecomendaciones"
            class="cursor-pointer group transition-all">
            <p class="text-[9px] font-black uppercase tracking-[0.3em] text-[#DE1F27] mb-3">Recomendados para</p>
            <div class="flex items-center gap-3">
              <div :class="filterByMascota ? 'bg-[#DE1F27] border-[#DE1F27] scale-110 shadow-lg' : 'bg-slate-100 dark:bg-white/10 border-transparent'"
                class="w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-500">
                <span class="text-xl">{{ mascotaActiva.especie === 'FELINO' ? '🐱' : '🐶' }}</span>
              </div>
              <div>
                <h3 :class="filterByMascota ? 'text-[#DE1F27]' : 'text-[#152C77] dark:text-white'"
                  class="font-[1000] uppercase italic text-xl transition-all">{{ mascotaActiva.nombre }}</h3>
                <p v-if="filterByMascota" class="text-[8px] font-black text-[#DE1F27] animate-pulse">MODO ACTIVO</p>
              </div>
            </div>
          </div>

          <div v-for="(label, key) in filterGroups" :key="key" class="space-y-4">
            <h4 class="text-[10px] font-black uppercase tracking-[0.2em] text-[#DE1F27] opacity-80">{{ label }}</h4>
            <div class="flex flex-col gap-2.5">
              <button v-for="opt in getOptions(key)" :key="opt"
                @click="setFilter(key, opt)"
                :class="isFilterActive(key, opt) ? 'text-[#152C77] dark:text-white font-[1000] translate-x-4 scale-110' : 'text-slate-400 font-bold hover:text-slate-600 dark:hover:text-slate-200'"
                class="text-left text-xs uppercase italic transition-all flex items-center gap-3 group">
                <span v-if="isFilterActive(key, opt)" class="w-3 h-[2px] bg-[#DE1F27]"></span>
                {{ opt }}
              </button>
            </div>
          </div>

          <div class="space-y-4 pt-4">
            <h4 class="text-[10px] font-black uppercase tracking-[0.2em] text-[#DE1F27] opacity-80">Marca</h4>
            <select v-model="activeMarca" class="clean-select">
              <option value="TODOS">Todas las marcas</option>
              <option v-for="m in uniqueMarcas" :key="m" :value="m">{{ m }}</option>
            </select>
          </div>

          <button @click="resetFiltros" class="text-[9px] font-black uppercase text-slate-400 tracking-[0.3em] hover:text-[#DE1F27] transition-all pt-6 flex items-center gap-2">
            <span>✕</span> Limpiar filtros
          </button>
        </aside>

        <main class="flex-1">
          <div class="mb-12 border-b-2 border-[#152C77] dark:border-white/10 pb-8 flex items-end justify-between">
            <h2 class="text-5xl md:text-6xl font-[1000] uppercase italic dark:text-white tracking-tighter leading-none italic">{{ dynamicTitle }}</h2>
            <span class="hidden md:block text-[11px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 dark:bg-white/5 px-4 py-2 rounded-full">
              {{ filteredProducts.length }} Artículos
            </span>
          </div>

          <div v-if="paginatedProducts.length > 0" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10">
            <div v-for="p in paginatedProducts" :key="p.id"
              class="group relative flex flex-col bg-slate-50 dark:bg-white/5 p-6 rounded-[3.5rem] transition-all duration-500 hover:shadow-2xl border border-transparent hover:border-[#DE1F27]/20">
              
              <router-link :to="{ name: 'ProductoDetalle', params: { id: p.id } }"
                class="relative block overflow-hidden rounded-[2.5rem] bg-white p-8 aspect-square mb-6 shadow-inner">
                <img v-if="p.fotosUrls?.length" :src="p.fotosUrls[0]" class="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110">
                
                <div class="absolute top-4 left-4 flex flex-col gap-2 z-10">
                  <span v-if="p.requiereReceta" class="bg-[#DE1F27] text-white text-[7px] font-black px-2 py-1 rounded uppercase">💊 Receta</span>
                </div>

                <div v-if="p.presentacion"
                  class="absolute bottom-4 right-4 bg-[#152C77] text-white text-[9px] font-black px-4 py-2 rounded-2xl italic shadow-lg">
                  {{ p.presentacion }}
                </div>
              </router-link>

              <div class="flex-1 flex flex-col px-2">
                <p class="text-[10px] font-black text-[#DE1F27] uppercase tracking-[0.2em] mb-1 opacity-60">{{ p.marca }}</p>
                <h3 class="text-xl font-[1000] uppercase italic text-[#152C77] dark:text-white leading-tight mb-6 h-12 line-clamp-2 italic">
                  {{ p.nombre }}
                </h3>

                <div class="mt-auto flex items-center justify-between pt-6 border-t border-slate-200 dark:border-white/10">
                  <span class="text-3xl font-[1000] dark:text-white italic text-[#152C77]">${{ p.precio.toLocaleString() }}</span>
                  <button @click="onAddToCart(p)" :disabled="p.stock <= 0"
                    class="w-14 h-14 bg-[#152C77] hover:bg-[#DE1F27] text-white rounded-2xl flex items-center justify-center transition-all shadow-xl active:scale-90">
                    <span class="text-xl font-bold">🛒</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div v-if="hasMore" class="mt-24 flex justify-center">
            <button @click="loadMore" class="group flex flex-col items-center gap-4 hover:scale-105 transition-all">
              <span class="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 group-hover:text-[#DE1F27]">Cargar más</span>
              <div class="w-16 h-16 rounded-full border-2 border-slate-200 dark:border-white/10 flex items-center justify-center text-xl group-hover:bg-[#DE1F27] group-hover:text-white transition-all">↓</div>
            </button>
          </div>
        </main>
      </div>
    </div>

    <div class="lg:hidden fixed bottom-28 left-0 right-0 z-[1500] px-6 flex justify-between pointer-events-none">
      <button @click="showMobileFilters = true" 
        class="pointer-events-auto bg-[#152C77] text-white px-8 py-5 rounded-[2.2rem] shadow-2xl font-[1000] uppercase italic text-xs flex items-center gap-3">
        <span class="text-xl">🔍</span> Filtros
      </button>
      
      <Transition name="fade">
        <button v-show="showScrollTop" @click="scrollToTop"
          class="pointer-events-auto w-14 h-14 bg-[#DE1F27] text-white rounded-2xl shadow-2xl flex items-center justify-center text-2xl transition-all hover:scale-110 active:scale-90">
          ↑
        </button>
      </Transition>
    </div>

    <Transition name="slide">
      <div v-if="showMobileFilters" class="fixed inset-0 z-[6000] lg:hidden">
        <div class="absolute inset-0 bg-black/90 backdrop-blur-xl" @click="showMobileFilters = false"></div>
        <div class="absolute inset-y-0 left-0 w-[85%] bg-white dark:bg-[#080808] p-10 overflow-y-auto no-scrollbar">
          <div class="flex justify-between items-center mb-10">
            <h2 class="font-[1000] uppercase italic text-3xl dark:text-white italic">Filtros</h2>
            <button @click="showMobileFilters = false" class="text-4xl font-light dark:text-white">✕</button>
          </div>

          <div v-if="mascotaActiva" @click="toggleRecomendaciones"
            :class="filterByMascota ? 'bg-[#DE1F27] border-[#DE1F27] shadow-xl' : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10'"
            class="mb-10 p-6 rounded-[2.5rem] border-2 transition-all flex items-center gap-4">
            <span class="text-3xl">{{ mascotaActiva.especie === 'FELINO' ? '🐱' : '🐶' }}</span>
            <div>
              <p :class="filterByMascota ? 'text-white/80' : 'text-slate-400'" class="text-[9px] font-black uppercase">Para tu mascota</p>
              <h3 :class="filterByMascota ? 'text-white' : 'text-[#152C77] dark:text-white'" class="font-[1000] uppercase italic text-xl">{{ mascotaActiva.nombre }}</h3>
              <p v-if="filterByMascota" class="text-white text-[8px] font-black mt-1 uppercase">Sugerencias activas ✓</p>
            </div>
          </div>

          <div class="space-y-10">
            <div v-for="(label, key) in filterGroups" :key="key" class="space-y-4">
              <label class="text-[11px] font-black uppercase tracking-widest text-[#DE1F27]">{{ label }}</label>
              <div class="flex flex-wrap gap-2">
                <button v-for="opt in getOptions(key)" :key="opt" @click="setFilter(key, opt)"
                  :class="isFilterActive(key, opt) ? 'bg-[#152C77] text-white border-[#152C77]' : 'bg-transparent text-slate-400 border-slate-200 dark:border-white/10'"
                  class="px-5 py-3 rounded-2xl text-[10px] font-black uppercase border transition-all">
                  {{ opt }}
                </button>
              </div>
            </div>
            
            <div class="space-y-4">
               <label class="text-[11px] font-black uppercase tracking-widest text-[#DE1F27]">Marca</label>
               <select v-model="activeMarca" class="clean-select text-base py-4">
                 <option value="TODOS">Todas las marcas</option>
                 <option v-for="m in uniqueMarcas" :key="m" :value="m">{{ m }}</option>
               </select>
            </div>
          </div>

          <button @click="showMobileFilters = false" class="w-full mt-12 bg-[#152C77] text-white py-6 rounded-[2.5rem] font-black uppercase italic shadow-2xl">
            Ver {{ filteredProducts.length }} Productos
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useProductStore } from '../../stores/productStore';
import { useCartStore } from '../../stores/cartStore';

const emit = defineEmits(['notify']);
const productStore = useProductStore();
const cartStore = useCartStore();

const activeSpecies = ref('TODOS');
const activeCategory = ref('TODOS');
const activeMarca = ref('TODOS');
const activeEtapa = ref('TODOS');
const activePeso = ref('TODOS');
const filterByMascota = ref(false);
const mascotaActiva = ref(null);
const showMobileFilters = ref(false);
const showScrollTop = ref(false);
const currentPage = ref(1);
const itemsPerPage = 12;

const filterGroups = {
  species: 'Especie',
  category: 'Categoría',
  etapa: 'Etapa de Vida',
  peso: 'Raza / Tamaño'
};

const getOptions = (key) => {
  if (key === 'species') return ['TODOS', 'CANINO', 'FELINO'];
  if (key === 'category') return ['TODOS', ...(productStore.filtros.categorias || [])];
  if (key === 'etapa') return ['TODOS', 'CACHORRO', 'ADULTO', 'SENIOR'];
  if (key === 'peso') return ['TODOS', 'RAZA PEQUEÑA', 'RAZA MEDIANA', 'RAZA GRANDE'];
  return [];
};

const setFilter = (key, val) => {
  if (key === 'species') activeSpecies.value = val;
  if (key === 'category') activeCategory.value = val;
  if (key === 'etapa') activeEtapa.value = val;
  if (key === 'peso') activePeso.value = val;
  filterByMascota.value = false;
  currentPage.value = 1;
};

const isFilterActive = (key, opt) => {
  if (key === 'species') return activeSpecies.value === opt;
  if (key === 'category') return activeCategory.value === opt;
  if (key === 'etapa') return activeEtapa.value === opt;
  if (key === 'peso') return activePeso.value === opt;
  return false;
};

const uniqueMarcas = computed(() => {
  const marcas = productStore.allProducts.map(p => p.marca).filter(Boolean);
  return [...new Set(marcas)].sort();
});

const filteredProducts = computed(() => {
  return productStore.allProducts.filter(p => {
    const mEsp = activeSpecies.value === 'TODOS' || p.especie === activeSpecies.value;
    const mCat = activeCategory.value === 'TODOS' || p.categoria === activeCategory.value;
    const mMar = activeMarca.value === 'TODOS' || p.marca === activeMarca.value;
    const mEta = activeEtapa.value === 'TODOS' || p.etapaVida === activeEtapa.value || p.etapaVida === 'TODOS';
    const mPes = activePeso.value === 'TODOS' || p.rangoPeso === activePeso.value || p.rangoPeso === 'TODOS';
    return mEsp && mCat && mMar && mEta && mPes;
  });
});

const paginatedProducts = computed(() => filteredProducts.value.slice(0, currentPage.value * itemsPerPage));
const hasMore = computed(() => paginatedProducts.value.length < filteredProducts.value.length);
const loadMore = () => currentPage.value++;

const dynamicTitle = computed(() => {
  if (filterByMascota.value && mascotaActiva.value) return `Para ${mascotaActiva.value.nombre}`;
  if (activeCategory.value !== 'TODOS') return activeCategory.value;
  return "Tienda";
});

const toggleRecomendaciones = () => {
  filterByMascota.value = !filterByMascota.value;
  if (filterByMascota.value) aplicarSugerenciasMascota();
  else resetFiltros();
};

const aplicarSugerenciasMascota = () => {
  if (!mascotaActiva.value) return;
  activeSpecies.value = mascotaActiva.value.especie;
  const peso = mascotaActiva.value.pesoActual || 0;
  if (peso > 0) {
    if (peso <= 10) activePeso.value = 'RAZA PEQUEÑA';
    else if (peso <= 25) activePeso.value = 'RAZA MEDIANA';
    else activePeso.value = 'RAZA GRANDE';
  }
  currentPage.value = 1;
};

const resetFiltros = () => {
  activeSpecies.value = activeCategory.value = activeMarca.value = activeEtapa.value = activePeso.value = 'TODOS';
  filterByMascota.value = false;
};

const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

const onAddToCart = (p) => {
  cartStore.addToCart(p, 1);
  emit('notify', { message: `${p.nombre} añadido`, type: 'success' });
};

onMounted(async () => {
  window.addEventListener('scroll', () => {
    showScrollTop.value = window.scrollY > 400;
  });
  if (productStore.allProducts.length === 0) await productStore.fetchTienda();
  const saved = localStorage.getItem('ps_active_pet');
  if (saved) {
    const pet = JSON.parse(saved);
    const esp = (pet.especie || '').toUpperCase();
    mascotaActiva.value = { ...pet, especie: (esp === 'PERRO' || esp === 'CANINO') ? 'CANINO' : 'FELINO' };
  }
});
</script>

<style scoped>
@reference "../../style.css";

.no-scrollbar::-webkit-scrollbar { display: none; }

.clean-select {
  @apply bg-transparent border-b border-slate-200 dark:border-white/10 w-full py-2 text-[10px] font-black uppercase outline-none focus:border-[#DE1F27] transition-all dark:text-white cursor-pointer appearance-none;
}

.slide-enter-active, .slide-leave-active { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
.slide-enter-from, .slide-leave-to { transform: translateX(-100%); opacity: 0; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>