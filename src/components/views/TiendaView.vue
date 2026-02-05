<template>
  <div class="min-h-screen bg-white dark:bg-[#050505] pt-24 md:pt-32 pb-44 md:pb-20 px-4 md:px-8 transition-colors duration-500">
    <div class="max-w-[1700px] mx-auto">
      
      <header class="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-12 md:mb-20">
        <div class="space-y-2 w-full lg:w-auto">
          <h1 class="text-5xl md:text-9xl font-[1000] uppercase italic tracking-tighter text-[#152C77] dark:text-white leading-[0.8]">
            PET <span class="text-[#DE1F27]">SHOP.</span>
          </h1>
          
          <div class="relative w-full max-w-md mt-4 md:mt-8 group">
            <div class="absolute left-5 top-1/2 -translate-y-1/2 text-ps-blue dark:text-white/40 z-10">🔍</div>
            <input 
              v-model="searchQuery" 
              @focus="showResults = true"
              placeholder="¿Qué buscas para tu mascota?" 
              class="w-full bg-slate-100 dark:bg-white/5 border-2 border-transparent focus:border-[#DE1F27] rounded-2xl md:rounded-3xl py-4 md:py-5 pl-12 md:pl-14 pr-6 text-[10px] md:text-[11px] font-black uppercase italic tracking-widest outline-none transition-all dark:text-white"
            />
            
            <transition name="fade">
              <div v-if="showResults && searchQuery.length > 2" class="absolute top-full left-0 w-full bg-white dark:bg-[#0a0a0a] mt-2 rounded-2xl shadow-2xl border border-slate-100 dark:border-white/10 z-[2000] overflow-hidden">
                <div v-if="suggestedProducts.length" class="p-2">
                  <div v-for="p in suggestedProducts" :key="p.id" @click="selectSearch(p)"
                       class="flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer rounded-xl transition-all">
                    <img :src="p.fotosUrls?.[0]" class="w-10 h-10 object-contain bg-white rounded p-1" />
                    <div class="flex-1">
                      <p class="text-[9px] font-black dark:text-white uppercase italic leading-tight">{{ p.nombre }}</p>
                      <p class="text-[7px] font-bold text-[#DE1F27] uppercase">{{ p.marca }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </transition>
          </div>
        </div>

        <div class="hidden md:flex bg-[#152C77] text-white p-6 rounded-[2.5rem] shadow-2xl min-w-[280px] border-b-4 border-[#DE1F27] justify-between items-center group transition-all hover:scale-105 shrink-0">
          <div>
            <p class="text-[10px] font-black uppercase opacity-60 tracking-widest mb-1">Tu Carrito</p>
            <p class="text-3xl font-[1000] italic">${{ cartStore.totalPrice.toLocaleString() }}</p>
          </div>
          <div class="bg-[#DE1F27] w-12 h-12 rounded-full flex items-center justify-center font-[1000] italic">
            {{ cartStore.cartCount }}
          </div>
        </div>
      </header>

      <div class="flex flex-col lg:flex-row gap-16">
        
        <aside class="hidden lg:block w-64 shrink-0 sticky top-40 h-fit space-y-10">
          <div v-if="mascotaActiva" @click="toggleRecomendaciones" class="cursor-pointer group">
            <p class="text-[9px] font-black uppercase tracking-[0.3em] text-[#DE1F27] mb-3">Recomendados para</p>
            <div class="flex items-center gap-3">
              <div :class="filterByMascota ? 'bg-[#DE1F27] scale-110 shadow-lg' : 'bg-slate-100 dark:bg-white/10'"
                class="w-12 h-12 rounded-full flex items-center justify-center transition-all">
                <span class="text-xl">{{ mascotaActiva.especie === 'FELINO' ? '🐱' : '🐶' }}</span>
              </div>
              <h3 class="font-[1000] uppercase italic text-xl dark:text-white">{{ mascotaActiva.nombre }}</h3>
            </div>
          </div>

          <div v-for="(label, key) in filterGroups" :key="key" class="space-y-4">
            <h4 class="text-[10px] font-black uppercase tracking-[0.2em] text-[#DE1F27] opacity-80">{{ label }}</h4>
            <div class="flex flex-col gap-2">
              <button v-for="opt in getOptions(key)" :key="opt" @click="setFilter(key, opt)"
                :class="isFilterActive(key, opt) ? 'text-[#152C77] dark:text-white font-[1000] translate-x-4' : 'text-slate-400 font-bold'"
                class="text-left text-[11px] uppercase italic transition-all flex items-center gap-2">
                <span v-if="isFilterActive(key, opt)" class="w-3 h-[2px] bg-[#DE1F27]"></span>
                {{ opt }}
              </button>
            </div>
          </div>
          <button @click="resetFiltros" class="text-[9px] font-black uppercase text-slate-400 pt-6">✕ Limpiar filtros</button>
        </aside>

        <main class="flex-1">
          <div class="mb-8 border-b-2 border-[#152C77] dark:border-white/10 pb-6 flex items-end justify-between">
            <h2 class="text-3xl md:text-6xl font-[1000] uppercase italic dark:text-white tracking-tighter">{{ dynamicTitle }}</h2>
          </div>

          <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-10">
            <div v-for="n in 3" :key="n" class="bg-slate-50 dark:bg-white/5 p-6 rounded-[2.5rem] animate-pulse">
              <div class="aspect-square bg-slate-200 dark:bg-white/10 rounded-[2rem] mb-6"></div>
              <div class="h-4 w-20 bg-slate-200 dark:bg-white/10 rounded mb-4"></div>
              <div class="h-8 w-full bg-slate-200 dark:bg-white/10 rounded mb-10"></div>
            </div>
          </div>

          <div v-else-if="paginatedProducts.length > 0" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-10">
            <div v-for="p in paginatedProducts" :key="p.id"
              class="group flex flex-col bg-slate-50 dark:bg-white/5 p-5 md:p-6 rounded-[2.5rem] md:rounded-[3.5rem] transition-all border border-transparent hover:border-[#DE1F27]/20">
              
              <router-link :to="{ name: 'ProductoDetalle', params: { id: p.id } }" 
                class="relative block overflow-hidden rounded-[2rem] bg-white p-6 md:p-8 aspect-square mb-4 md:mb-6 shadow-inner">
                <img :src="p.fotosUrls?.[0]" class="w-full h-full object-contain">
              </router-link>

              <div class="flex-1 flex flex-col">
                <p class="text-[9px] font-black text-[#DE1F27] uppercase opacity-60">{{ p.marca }}</p>
                <h3 class="text-sm md:text-xl font-[1000] uppercase italic text-[#152C77] dark:text-white leading-tight mb-4 line-clamp-2 italic">
                  {{ p.nombre }}
                </h3>
                <div class="mt-auto flex items-center justify-between pt-4 border-t border-slate-200 dark:border-white/10">
                  <span class="text-xl md:text-3xl font-[1000] dark:text-white italic text-[#152C77]">${{ p.precio.toLocaleString() }}</span>
                  <button @click="onAddToCart(p)" :disabled="p.stock <= 0" class="w-12 h-12 md:w-14 md:h-14 bg-[#152C77] text-white rounded-2xl flex items-center justify-center shadow-xl">
                    <span class="text-lg">🛒</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div v-if="hasMore" class="mt-20 flex justify-center">
            <button @click="loadMore" class="group flex flex-col items-center gap-4">
              <span class="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">Cargar más</span>
              <div class="w-16 h-16 rounded-full border-2 border-slate-200 dark:border-white/10 flex items-center justify-center text-xl">↓</div>
            </button>
          </div>
        </main>
      </div>
    </div>

    <div class="lg:hidden fixed bottom-28 left-0 right-0 z-[1500] px-6 flex justify-center pointer-events-none">
      <button @click="showMobileFilters = true" 
        class="pointer-events-auto bg-[#152C77] text-white px-8 py-4 rounded-full shadow-2xl font-[1000] uppercase italic text-[10px] flex items-center gap-3">
        🔍 Filtrar Productos
      </button>
    </div>

    <transition name="slide">
      <div v-if="showMobileFilters" class="fixed inset-0 z-[9000] lg:hidden">
        <div class="absolute inset-0 bg-black/95 backdrop-blur-md" @click="showMobileFilters = false"></div>
        <div class="absolute inset-y-0 left-0 w-[85%] bg-white dark:bg-[#080808] p-8 overflow-y-auto no-scrollbar">
          
          <div class="flex justify-between items-center mb-10">
            <h2 class="font-[1000] uppercase italic text-2xl dark:text-white italic">Filtros</h2>
            <button @click="showMobileFilters = false" class="text-2xl dark:text-white">✕</button>
          </div>

          <div v-if="mascotaActiva" @click="toggleRecomendaciones"
            :class="filterByMascota ? 'bg-[#DE1F27] border-[#DE1F27]' : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10'"
            class="mb-10 p-6 rounded-[2.5rem] border-2 transition-all flex items-center gap-4 cursor-pointer">
            <span class="text-3xl">{{ mascotaActiva.especie === 'FELINO' ? '🐱' : '🐶' }}</span>
            <div>
              <p :class="filterByMascota ? 'text-white/70' : 'text-slate-400'" class="text-[9px] font-black uppercase">Para tu mascota</p>
              <h3 :class="filterByMascota ? 'text-white' : 'text-[#152C77] dark:text-white'" class="font-[1000] uppercase italic text-xl">{{ mascotaActiva.nombre }}</h3>
              <p v-if="filterByMascota" class="text-white text-[8px] font-black mt-1 uppercase">✓ ACTIVADO</p>
            </div>
          </div>

          <div class="space-y-8">
            <div v-for="(label, key) in filterGroups" :key="key" class="space-y-4">
              <label class="text-[10px] font-black uppercase text-[#DE1F27] tracking-widest">{{ label }}</label>
              <div class="flex flex-wrap gap-2">
                <button v-for="opt in getOptions(key)" :key="opt" @click="setFilter(key, opt)"
                  :class="isFilterActive(key, opt) ? 'bg-[#152C77] text-white' : 'bg-slate-100 dark:bg-white/5 text-slate-400'"
                  class="px-4 py-2 rounded-xl text-[9px] font-black uppercase">
                  {{ opt }}
                </button>
              </div>
            </div>
            <div class="space-y-4">
               <label class="text-[10px] font-black uppercase text-[#DE1F27] tracking-widest">Marca</label>
               <select v-model="activeMarca" class="clean-select !text-xs !py-3">
                 <option value="TODOS">Todas las marcas</option>
                 <option v-for="m in uniqueMarcas" :key="m" :value="m">{{ m }}</option>
               </select>
            </div>
          </div>
          
          <button @click="showMobileFilters = false" class="w-full mt-10 bg-[#152C77] text-white py-4 rounded-2xl font-black uppercase italic shadow-xl">
            Ver {{ filteredProducts.length }} Productos
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useProductStore } from '../../stores/productStore';
import { useCartStore } from '../../stores/cartStore';

const router = useRouter();
const productStore = useProductStore();
const cartStore = useCartStore();
const emit = defineEmits(['notify']);

const isLoading = ref(true);
const searchQuery = ref('');
const showResults = ref(false);
const showMobileFilters = ref(false);

const activeSpecies = ref('TODOS');
const activeCategory = ref('TODOS');
const activeMarca = ref('TODOS');
const activeEtapa = ref('TODOS');
const activePeso = ref('TODOS');
const filterByMascota = ref(false);
const mascotaActiva = ref(null);
const currentPage = ref(1);
const itemsPerPage = 12;

const filterGroups = { species: 'Especie', category: 'Categoría', etapa: 'Etapa', peso: 'Raza' };

const suggestedProducts = computed(() => {
  if (searchQuery.value.length < 3) return [];
  return productStore.allProducts.filter(p => p.nombre.toLowerCase().includes(searchQuery.value.toLowerCase())).slice(0, 5);
});

const selectSearch = (p) => {
  searchQuery.value = '';
  showResults.value = false;
  router.push({ name: 'ProductoDetalle', params: { id: p.id } });
};

const uniqueMarcas = computed(() => [...new Set(productStore.allProducts.map(p => p.marca).filter(Boolean))].sort());

const filteredProducts = computed(() => {
  return productStore.allProducts.filter(p => {
    const query = searchQuery.value.toLowerCase().trim();
    let mSearch = true;

    if (query !== '') {
        const words = query.split(/\s+/); 
        const productName = (p.nombre + " " + (p.marca || "")).toLowerCase();
        mSearch = words.every(word => productName.includes(word));
    }

    const mEsp = activeSpecies.value === 'TODOS' || p.especie === activeSpecies.value;
    const mCat = activeCategory.value === 'TODOS' || p.categoria === activeCategory.value;
    const mMar = activeMarca.value === 'TODOS' || p.marca === activeMarca.value;
    const mEta = activeEtapa.value === 'TODOS' || p.etapaVida === activeEtapa.value || p.etapaVida === 'TODOS';
    const mPes = activePeso.value === 'TODOS' || p.rangoPeso === activePeso.value || p.rangoPeso === 'TODOS';
    
    return mSearch && mEsp && mCat && mMar && mEta && mPes;
  });
});

const paginatedProducts = computed(() => filteredProducts.value.slice(0, currentPage.value * itemsPerPage));
const hasMore = computed(() => paginatedProducts.value.length < filteredProducts.value.length);
const loadMore = () => currentPage.value++;

const getOptions = (k) => {
  if (k === 'species') return ['TODOS', 'CANINO', 'FELINO'];
  if (k === 'category') return ['TODOS', ...productStore.filtros.categorias];
  if (k === 'etapa') return ['TODOS', 'CACHORRO', 'ADULTO', 'SENIOR'];
  if (k === 'peso') return ['TODOS', 'RAZA PEQUEÑA', 'RAZA MEDIANA', 'RAZA GRANDE'];
  return [];
};

const setFilter = (k, v) => {
  if (k === 'species') activeSpecies.value = v;
  if (k === 'category') activeCategory.value = v;
  if (k === 'etapa') activeEtapa.value = v;
  if (k === 'peso') activePeso.value = v;
  filterByMascota.value = false;
  currentPage.value = 1;
};

const isFilterActive = (k, o) => {
  if (k === 'species') return activeSpecies.value === o;
  if (k === 'category') return activeCategory.value === o;
  if (k === 'etapa') return activeEtapa.value === o;
  return activePeso.value === o;
};

const resetFiltros = () => {
  activeSpecies.value = activeCategory.value = activeMarca.value = activeEtapa.value = activePeso.value = 'TODOS';
  searchQuery.value = '';
  filterByMascota.value = false;
};

const dynamicTitle = computed(() => {
  if (searchQuery.value) return "Resultados";
  if (filterByMascota.value && mascotaActiva.value) return `Para ${mascotaActiva.value.nombre}`;
  return activeCategory.value !== 'TODOS' ? activeCategory.value : 'Tienda';
});

const toggleRecomendaciones = () => {
  filterByMascota.value = !filterByMascota.value;
  if (filterByMascota.value && mascotaActiva.value) {
    activeSpecies.value = mascotaActiva.value.especie;
    const peso = mascotaActiva.value.pesoActual || 0;
    if (peso > 0) {
      if (peso <= 10) activePeso.value = 'RAZA PEQUEÑA';
      else if (peso <= 25) activePeso.value = 'RAZA MEDIANA';
      else activePeso.value = 'RAZA GRANDE';
    }
  } else {
    resetFiltros();
  }
};

const onAddToCart = (p) => {
  cartStore.addToCart(p, 1);
  emit('notify', { msg: `${p.nombre} añadido`, type: 'success' });
};

onMounted(async () => {
  if (productStore.allProducts.length === 0) await productStore.fetchTienda();
  const saved = localStorage.getItem('ps_active_pet');
  if (saved) {
    const pet = JSON.parse(saved);
    const esp = (pet.especie || '').toUpperCase();
    mascotaActiva.value = { ...pet, especie: (esp === 'PERRO' || esp === 'CANINO') ? 'CANINO' : 'FELINO' };
  }
  setTimeout(() => isLoading.value = false, 800);
});
</script>

<style scoped>
@reference "../../style.css";
.no-scrollbar::-webkit-scrollbar { display: none; }
.slide-enter-active, .slide-leave-active { transition: transform 0.4s ease; }
.slide-enter-from, .slide-leave-to { transform: translateX(-100%); }
.clean-select { @apply bg-transparent border-b border-slate-200 dark:border-white/10 w-full py-2 text-[10px] font-black uppercase outline-none focus:border-[#DE1F27] transition-all dark:text-white cursor-pointer appearance-none; }
</style>