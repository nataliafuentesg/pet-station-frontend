<template>
  <div
    class="min-h-screen bg-white dark:bg-[#050505] pt-24 pb-44 transition-colors duration-500 font-sans overflow-x-hidden text-slate-900 dark:text-white">
    <div class="max-w-[1700px] mx-auto px-4 md:px-8">

      <header class="mb-12 flex flex-col lg:flex-row justify-between items-center gap-8">
        <div @click="resetTienda" class="cursor-pointer group text-center lg:text-left">
          <h1
            class="text-6xl md:text-8xl font-[1000] uppercase italic tracking-tighter text-[#152C77] dark:text-white leading-none transition-all">
            PET <span class="text-[#DE1F27]">SHOP.</span>
          </h1>
          <p class="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 mt-2 italic italic">Premium
            Veterinary Inventory</p>
        </div>
        <div class="w-full lg:w-[500px] relative group">
          <div
            class="absolute -inset-1 bg-gradient-to-r from-[#152C77] to-[#DE1F27] rounded-3xl blur opacity-10 transition duration-500">
          </div>
          <div
            class="relative flex items-center bg-slate-50 dark:bg-white/5 rounded-3xl border-2 border-slate-200 dark:border-white/10 px-8 py-4 shadow-sm">
            <input v-model="searchQuery" @input="onSearch" type="text" placeholder="BUSCAR PRODUCTO O MARCA..."
              class="w-full bg-transparent text-[11px] font-[1000] uppercase tracking-widest outline-none dark:text-white" />
            <span class="text-xl ml-4">🔍</span>
          </div>
        </div>
      </header>

      <Transition name="fade-scale" mode="out-in">
        <section v-if="!pasilloSeleccionado && !searchQuery" class="py-10">
          <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6 md:gap-8">
            <div v-for="p in pasillosCards" :key="p.id" @click="setPasillo(p.name)"
              class="group cursor-pointer relative aspect-square bg-slate-50 dark:bg-white/5 rounded-[3.5rem] flex flex-col items-center justify-center p-10 border-2 border-transparent hover:border-[#DE1F27] transition-all duration-500 hover:-translate-y-4 shadow-sm hover:shadow-2xl">
              <div class="text-[100px] mb-6 transform group-hover:scale-110 transition-transform duration-700">{{ p.icon
                }}</div>
              <h3 class="text-2xl font-[1000] uppercase italic text-[#152C77] dark:text-white italic">{{ p.name }}</h3>
              <div v-if="p.isPersonalized && mascotaActiva"
                class="absolute -top-4 bg-[#DE1F27] text-white px-6 py-2 rounded-xl font-black italic text-[9px] shadow-2xl animate-bounce">
                ✨ MODO: {{ mascotaActiva.nombre }}
              </div>
            </div>
            <div @click="setPasillo('TODOS')"
              class="group cursor-pointer aspect-square bg-[#152C77] rounded-[3.5rem] flex flex-col items-center justify-center p-10 hover:bg-[#DE1F27] transition-all duration-500 shadow-xl">
              <div class="text-5xl mb-6">📦</div>
              <h3 class="text-xl font-[1000] uppercase italic text-white text-center leading-none italic italic">
                CATÁLOGO<br />COMPLETO</h3>
            </div>
          </div>
        </section>

        <div v-else class="flex flex-col lg:flex-row gap-16 pt-10">

          <aside class="hidden lg:block w-72 shrink-0 sticky top-40 h-fit space-y-12">
            <div v-if="filterByMascota && mascotaActiva"
              class="p-8 bg-[#152C77] text-white rounded-[3rem] shadow-2xl space-y-4 border-b-8 border-black/20">
              <p class="text-[9px] font-black uppercase opacity-60">Filtro Inteligente:</p>
              <h4 class="text-3xl font-[1000] uppercase italic italic">{{ mascotaActiva.nombre }}</h4>
              <div class="text-[10px] font-bold uppercase tracking-widest space-y-1 opacity-80 italic">
                <p>🧬 {{ mascotaActiva.especie }}</p>
                <p>⚖️ {{ mascotaActiva.pesoActual }}KG | 🕒 {{ autoEtapa }}</p>
              </div>
              <button @click="resetTienda"
                class="w-full py-3 bg-[#DE1F27] text-white rounded-xl font-black uppercase text-[9px] hover:scale-105 transition-transform">Desactivar</button>
            </div>
            <button v-else @click="resetTienda"
              class="w-full flex items-center justify-center gap-3 px-6 py-5 bg-[#DE1F27] text-white rounded-2xl font-[1000] uppercase italic text-[10px] shadow-xl hover:bg-[#152C77] transition-all italic">←
              REGRESAR</button>
            <div class="space-y-10">
              <div v-for="(label, key) in filterGroups" :key="key" class="space-y-4">
                <h4 class="text-[10px] font-black uppercase tracking-[0.3em] text-[#DE1F27] italic italic">{{ label }}
                </h4>
                <div class="flex flex-col gap-2.5">
                  <button v-for="opt in getOptions(key)" :key="opt" @click="setFilter(key, opt)"
                    :class="isFilterActive(key, opt) ? 'bg-[#152C77] text-white shadow-xl translate-x-2' : 'bg-slate-50 dark:bg-white/5 text-slate-400 hover:text-[#152C77]'"
                    class="w-full text-left px-5 py-3.5 rounded-xl text-[10px] font-[1000] uppercase italic transition-all">{{
                    opt }}</button>
                </div>
              </div>
              <div class="space-y-4 pt-6 border-t border-slate-100 dark:border-white/5">
                <h4 class="text-[10px] font-black uppercase tracking-[0.3em] text-[#DE1F27] italic italic">Marca</h4>
                <select v-model="activeMarca" class="clean-select italic italic">
                  <option value="TODOS">Todas las marcas</option>
                  <option v-for="m in uniqueMarcas" :key="m" :value="m">{{ m }}</option>
                </select>
              </div>
            </div>
          </aside>

          <main class="flex-1">
            <div class="mb-12 border-b-4 border-[#152C77] dark:border-white/10 pb-6 flex justify-between items-end">
              <h2
                class="text-4xl md:text-7xl font-[1000] uppercase italic dark:text-white tracking-tighter leading-none italic italic italic italic italic">
                {{ dynamicTitle }}</h2>
              <div class="flex gap-2 lg:hidden">
                <button v-if="filterByMascota || pasilloSeleccionado" @click="resetTienda"
                  class="bg-[#DE1F27] text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase italic">✕
                  Salir</button>
                <button @click="showMobileFilters = true"
                  class="bg-[#152C77] text-white p-4 rounded-xl text-xl shadow-lg">⚙️</button>
              </div>
            </div>

            <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10">
              <div v-for="i in 6" :key="i"
                class="bg-slate-100 dark:bg-white/5 rounded-[3rem] p-6 h-[400px] animate-pulse"></div>
            </div>

            <div v-else-if="paginatedProducts.length > 0" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10">

              <div v-for="p in paginatedProducts" :key="p.id"
                :class="['group relative flex flex-col bg-slate-50 dark:bg-[#0A0A0A] p-6 rounded-[3rem] transition-all border-2 shadow-sm',
                  p.stock <= 0 ? 'opacity-60 grayscale border-slate-200 pointer-events-none' : 'border-transparent hover:border-[#DE1F27]/20 hover:shadow-2xl']">

                <router-link :to="{ name: 'ProductoDetalle', params: { id: crearSlug(p.id, p.nombre) } }" class="block relative w-full">
  
  <div v-if="p.presentacion"
    class="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm border border-slate-100 z-20">
    <span class="text-[8px] font-black text-[#152C77] uppercase tracking-widest">{{ p.presentacion }}</span>
  </div>

  <div class="relative w-full aspect-square overflow-hidden rounded-[2rem] bg-white dark:bg-white/5 p-4 mb-4 flex items-center justify-center">
      <img v-if="p.fotosUrls?.length" :src="p.fotosUrls[0]"
        class="w-full h-full object-contain transition-transform duration-1000 group-hover:scale-110 z-10">
  </div>

  <div v-if="p.stock <= 0" class="absolute inset-0 z-30 bg-white/60 dark:bg-black/60 backdrop-blur-[2px] rounded-[2rem] flex items-center justify-center">
    <span
      class="bg-slate-800 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl">Agotado</span>
  </div>
</router-link>

                <div class="flex-1 px-2 space-y-4">
                  <router-link :to="{ name: 'ProductoDetalle', params: { id: crearSlug(p.id, p.nombre) } }"
                    class="pointer-events-auto">
                    <p
                      class="text-[9px] font-black text-[#DE1F27] uppercase tracking-widest mb-1 italic opacity-70 italic">
                      {{ p.marca }}</p>
                    <h3
                      class="text-xl font-[1000] uppercase italic text-[#152C77] dark:text-white leading-tight mb-4 h-12 line-clamp-2 italic italic italic italic">
                      {{ p.nombre }}</h3>
                  </router-link>

                  <div class="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-white/10">
                    <span
                      class="text-3xl font-[1000] dark:text-white italic text-[#152C77] tracking-tighter italic italic italic italic italic italic">${{
                        p.precio.toLocaleString() }}</span>
                    <button v-if="p.stock > 0" @click="onAddToCart(p)"
                      class="pointer-events-auto w-12 h-12 bg-[#152C77] hover:bg-[#DE1F27] text-white rounded-2xl flex items-center justify-center shadow-xl active:scale-90 transition-all font-bold">🛒</button>
                    <span v-else class="text-2xl opacity-30">🚫</span>
                  </div>
                </div>
              </div>

            </div>

            <div v-else class="text-center py-20 opacity-50">
              <p class="text-xl font-black uppercase text-slate-400">No encontramos productos así 🥺</p>
            </div>

            <div v-if="hasMore" class="mt-20 flex justify-center pb-20">
              <button @click="loadMore"
                class="px-12 py-5 bg-slate-100 dark:bg-white/5 rounded-full font-[1000] uppercase italic text-[9px] tracking-[0.4em] hover:bg-[#DE1F27] hover:text-white transition-all italic italic italic italic">
                Cargar más ↓
              </button>
            </div>
          </main>
        </div>
      </Transition>
    </div>

    <Transition name="slide">
      <div v-if="showMobileFilters" class="fixed inset-0 z-[5000] lg:hidden">
        <div class="absolute inset-0 bg-black/90 backdrop-blur-md" @click="showMobileFilters = false"></div>
        <div class="absolute inset-y-0 right-0 w-[85%] bg-white dark:bg-[#050505] p-10 shadow-2xl flex flex-col">
          <div class="flex justify-between items-center mb-10">
            <h3 class="font-[1000] uppercase italic text-3xl dark:text-white italic italic italic italic">Filtros</h3>
            <button @click="showMobileFilters = false" class="text-4xl text-[#DE1F27]">✕</button>
          </div>
          <div class="flex-1 space-y-10 overflow-y-auto no-scrollbar pb-32">
            <div v-for="(label, key) in filterGroups" :key="key" class="space-y-4">
              <p class="text-xs font-black uppercase text-[#DE1F27] tracking-widest italic italic italic italic">{{
                label }}</p>
              <div class="flex flex-wrap gap-2">
                <button v-for="opt in getOptions(key)" :key="opt" @click="setFilter(key, opt)"
                  :class="isFilterActive(key, opt) ? 'bg-[#152C77] text-white shadow-lg' : 'bg-slate-100 dark:bg-white/5 text-slate-400'"
                  class="px-5 py-3 rounded-xl text-[10px] font-black uppercase italic italic italic italic">{{ opt
                  }}</button>
              </div>
            </div>
          </div>
          <button @click="showMobileFilters = false"
            class="w-full bg-[#152C77] text-white py-6 rounded-2xl font-black uppercase text-xs italic italic shadow-xl">Ver
            Resultados</button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue';
import { useProductStore } from '../../stores/productStore';
import { useCartStore } from '../../stores/cartStore';

const productStore = useProductStore();
const cartStore = useCartStore();
const emit = defineEmits(['notify']);

const pasilloSeleccionado = ref(false);
const showMobileFilters = ref(false);
const searchQuery = ref('');
const activeCategory = ref('TODOS');
const mascotaActiva = ref(null);
const filterByMascota = ref(false);
const isLoading = ref(true);

const activeSpecies = ref('TODOS');
const activeEtapa = ref('TODOS');
const activePeso = ref('TODOS');
const activeMarca = ref('TODOS');
const currentPage = ref(1);
const itemsPerPage = 12;

const crearSlug = (id, nombre) => {
  const cleanName = (nombre || '')
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '');
  return `${cleanName}-${id}`;
};

const isLoggedIn = computed(() => !!localStorage.getItem('ps_token'));

const pasillosCards = computed(() => {
  const cards = [
    { id: 1, name: 'NUTRICIÓN', icon: '🥩' },
    { id: 2, name: 'FARMACIA', icon: '💊' },
    { id: 3, name: 'HIGIENE', icon: '🧼' },
    { id: 4, name: 'ACCESORIOS', icon: '🎾' }
  ];
  if (isLoggedIn.value) {
    cards.push({ id: 5, name: 'PERSONALIZADO', icon: '✨', isPersonalized: true });
  }
  return cards;
});

const filterGroups = { species: 'Especie', etapa: 'Etapa Vida', peso: 'Tamaño/Peso' };
const getOptions = (key) => {
  if (key === 'species') return ['TODOS', 'CANINO', 'FELINO'];
  if (key === 'etapa') return ['TODOS', 'CACHORRO', 'ADULTO', 'SENIOR'];
  if (key === 'peso') return ['TODOS', 'RAZA PEQUEÑA', 'RAZA MEDIANA', 'RAZA GRANDE'];
  return [];
};

const autoEtapa = computed(() => {
  if (!mascotaActiva.value?.fechaNacimiento) return 'ADULTO';
  const naci = new Date(mascotaActiva.value.fechaNacimiento);
  const hoy = new Date();
  const meses = (hoy.getFullYear() - naci.getFullYear()) * 12 + (hoy.getMonth() - naci.getMonth());
  return meses < 12 ? 'CACHORRO' : (meses > 84 ? 'SENIOR' : 'ADULTO');
});

const filteredProducts = computed(() => {
  return productStore.allProducts.filter(p => {
    const searchTerms = searchQuery.value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(' ');
    const targetText = `${p.nombre} ${p.marca} ${p.categoria}`.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const matchesSearch = searchTerms.every(term => targetText.includes(term));
    const normalizeCat = (s) => s.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const cProd = normalizeCat(p.categoria || '');
    const cAct = normalizeCat(activeCategory.value);
    const matchesCat = cAct === 'TODOS' || cProd.includes(cAct) || (cAct === 'NUTRICION' && cProd.includes('ALIMEN'));
    const mEspS = activeSpecies.value === 'TODOS' || p.especie === activeSpecies.value || p.especie === 'TODOS';
    const mEtaS = activeEtapa.value === 'TODOS' || p.etapaVida === activeEtapa.value || p.etapaVida === 'TODOS';
    const mPesS = activePeso.value === 'TODOS' || p.rangoPeso === activePeso.value || p.rangoPeso === 'TODOS';
    const mMarS = activeMarca.value === 'TODOS' || p.marca === activeMarca.value;
    let matchesMascota = true;
    if (filterByMascota.value && mascotaActiva.value && isLoggedIn.value) {
      const pet = mascotaActiva.value;
      const sameSpecies = p.especie === 'TODOS' || p.especie === pet.especie;
      let weightSafety = true;
      if (p.rangoPeso && p.rangoPeso !== 'TODOS' && p.rangoPeso !== '') {
        weightSafety = (pet.pesoActual > 20) ? (p.rangoPeso !== 'RAZA PEQUEÑA') : (p.rangoPeso !== 'RAZA GRANDE');
      }
      const stageSafety = p.etapaVida === 'TODOS' || p.etapaVida === autoEtapa.value || !p.etapaVida;
      matchesMascota = sameSpecies && weightSafety && stageSafety;
    }
    return matchesSearch && matchesCat && mEspS && mEtaS && mPesS && mMarS && matchesMascota;
  });
});

const paginatedProducts = computed(() => filteredProducts.value.slice(0, currentPage.value * itemsPerPage));
const hasMore = computed(() => paginatedProducts.value.length < filteredProducts.value.length);
const loadMore = () => { currentPage.value++; };

const setPasillo = async (cat) => {
  activeSpecies.value = activeEtapa.value = activePeso.value = activeMarca.value = 'TODOS';
  currentPage.value = 1;
  if (cat === 'PERSONALIZADO') {
    if (!isLoggedIn.value) return;
    filterByMascota.value = true;
    activeCategory.value = 'TODOS';
    loadMascota();
    if (mascotaActiva.value) {
      activeSpecies.value = mascotaActiva.value.especie;
      activePeso.value = mascotaActiva.value.pesoActual > 20 ? 'RAZA GRANDE' : 'RAZA PEQUEÑA';
      activeEtapa.value = autoEtapa.value;
    }
  } else {
    activeCategory.value = cat;
    filterByMascota.value = false;
  }
  pasilloSeleccionado.value = true;
  if (cat !== 'PERSONALIZADO') localStorage.setItem('ps_last_pasillo', cat);
  else localStorage.removeItem('ps_last_pasillo');
  await nextTick();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const resetTienda = () => {
  pasilloSeleccionado.value = false;
  activeCategory.value = activeSpecies.value = activeEtapa.value = activePeso.value = activeMarca.value = 'TODOS';
  searchQuery.value = '';
  filterByMascota.value = false;
  localStorage.removeItem('ps_last_pasillo');
};

const loadMascota = () => {
  if (!localStorage.getItem('ps_token')) {
    mascotaActiva.value = null;
    filterByMascota.value = false;
    return;
  }
  const data = localStorage.getItem('ps_active_pet');
  if (data) {
    try {
      const pet = JSON.parse(data);
      if (pet) {
        const esp = (pet.especie || '').toUpperCase();
        pet.especie = (esp.includes('PERRO') || esp.includes('CANIN')) ? 'CANINO' : 'FELINO';
        mascotaActiva.value = pet;
      }
    } catch (e) { localStorage.removeItem('ps_active_pet'); }
  }
};

const isFilterActive = (k, o) => (k === 'species' ? activeSpecies.value : k === 'etapa' ? activeEtapa.value : activePeso.value) === o;
const setFilter = (k, v) => { if (k === 'species') activeSpecies.value = v; if (k === 'etapa') activeEtapa.value = v; if (k === 'peso') activePeso.value = v; currentPage.value = 1; };
const uniqueMarcas = computed(() => [...new Set(productStore.allProducts.map(p => p.marca).filter(Boolean))].sort());
const dynamicTitle = computed(() => filterByMascota.value ? `PARA ${mascotaActiva.value?.nombre || 'TU MASCOTA'}` : `PASILLO ${activeCategory.value}`);
const onAddToCart = (p) => { cartStore.addToCart(p, 1); emit('notify', { msg: `${p.nombre} añadido`, type: 'success' }); };
const onSearch = () => { if (searchQuery.value) pasilloSeleccionado.value = true; };

onMounted(async () => {
  isLoading.value = true;
  try {
    if (productStore.allProducts.length === 0) await productStore.fetchTienda();
    if (isLoggedIn.value) loadMascota();
    const last = localStorage.getItem('ps_last_pasillo');
    if (last && (last !== 'PERSONALIZADO' || isLoggedIn.value)) setPasillo(last);
  } finally {
    isLoading.value = false;
  }
});
watch(filterByMascota, (newVal) => { if (newVal) loadMascota(); });
</script>

<style scoped>
@reference "../../style.css";

.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.clean-select {
  @apply bg-transparent border-b-2 border-slate-200 dark:border-white/10 w-full py-4 text-[10px] font-black uppercase outline-none focus:border-[#DE1F27] transition-all dark:text-white appearance-none italic cursor-pointer;
}
</style>