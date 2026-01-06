<template>
    <div class="min-h-screen bg-white dark:bg-[#050505] pt-32 pb-20 px-4 transition-colors duration-500">
        <div class="max-w-[1600px] mx-auto">

            <div class="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
                <div class="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                    <div>
                        <h1 class="text-6xl md:text-8xl font-[1000] uppercase italic tracking-tighter text-[#152C77] dark:text-white leading-none">
                            PET <span class="text-[#DE1F27]">SHOP.</span>
                        </h1>
                        <p class="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px] mt-4 ml-2">
                            Suministros Médicos y Nutrición</p>
                    </div>

                    <div v-if="mascotaActiva"
                        class="group relative bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-4 rounded-[2.5rem] flex items-center gap-4 transition-all hover:border-[#DE1F27]/40 shadow-sm">
                        <div class="w-14 h-14 bg-[#152C77] dark:bg-white/10 rounded-full flex items-center justify-center text-2xl shadow-inner border border-white/10">
                            {{ mascotaActiva.especie === 'FELINO' ? '🐱' : '🐶' }}
                        </div>
                        <div>
                            <p class="text-[8px] font-[1000] text-[#DE1F27] uppercase tracking-widest">Sugerencias para</p>
                            <h3 class="text-xl font-[1000] uppercase italic text-[#152C77] dark:text-white leading-tight">
                                {{ mascotaActiva.nombre }}</h3>
                            <button @click="toggleRecomendaciones"
                                class="text-[9px] font-black uppercase underline decoration-[#DE1F27] decoration-2 underline-offset-4 hover:text-[#DE1F27] transition-colors">
                                {{ filterByMascota ? 'Ver catálogo completo' : 'Activar mi perfil' }}
                            </button>
                        </div>
                        <div v-if="filterByMascota" class="absolute top-4 right-6 flex items-center gap-2">
                            <span class="flex h-2 w-2">
                                <span class="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-[#DE1F27] opacity-75"></span>
                                <span class="relative inline-flex rounded-full h-2 w-2 bg-[#DE1F27]"></span>
                            </span>
                        </div>
                    </div>
                </div>

                <div class="bg-[#152C77] text-white p-6 rounded-[2.5rem] shadow-2xl min-w-[300px] border-b-4 border-[#DE1F27]">
                    <div class="flex justify-between items-center mb-2">
                        <span class="text-[10px] font-black uppercase opacity-60 tracking-widest">Carrito</span>
                        <span class="bg-[#DE1F27] px-3 py-1 rounded-full text-[10px] font-[1000] italic">
                            {{ cartStore.cartCount }} ITEMS
                        </span>
                    </div>
                    <p class="text-3xl font-[1000] italic">${{ cartStore.totalPrice.toLocaleString() }}</p>
                </div>
            </div>

            <div v-if="!filterByMascota"
                class="flex gap-4 mb-6 border-b border-slate-100 dark:border-white/10 pb-6 overflow-x-auto no-scrollbar">
                <button @click="resetFiltros"
                    :class="[activeSpecies === 'TODOS' ? 'bg-[#DE1F27] text-white scale-105 shadow-xl' : 'text-slate-400 bg-slate-50 dark:bg-white/5']"
                    class="px-8 py-4 rounded-2xl text-[11px] font-black uppercase transition-all shrink-0 border border-transparent shadow-sm">
                    🐾 Todo
                </button>
                <button v-for="esp in ['CANINO', 'FELINO']" :key="esp" @click="activeSpecies = esp"
                    :class="[activeSpecies === esp ? 'bg-[#DE1F27] text-white scale-105 shadow-xl' : 'text-slate-400 border-slate-200 dark:border-white/10 bg-white dark:bg-transparent']"
                    class="px-8 py-4 rounded-2xl text-[11px] font-black uppercase transition-all shrink-0 border flex items-center gap-2">
                    <span>{{ esp === 'CANINO' ? '🐶' : '🐱' }}</span> {{ esp }}
                </button>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                <div class="flex flex-col gap-2">
                    <label class="text-[8px] font-black uppercase ml-2 opacity-50">Marca</label>
                    <select v-model="activeMarca" class="filter-select">
                        <option value="TODOS">Todas las marcas</option>
                        <option v-for="m in uniqueMarcas" :key="m" :value="m">{{ m }}</option>
                    </select>
                </div>
                <div class="flex flex-col gap-2">
                    <label class="text-[8px] font-black uppercase ml-2 opacity-50">Etapa de Vida</label>
                    <select v-model="activeEtapa" class="filter-select">
                        <option value="TODOS">Todas las etapas</option>
                        <option value="CACHORRO">Cachorro</option>
                        <option value="ADULTO">Adulto</option>
                        <option value="SENIOR">Senior</option>
                    </select>
                </div>
                <div class="flex flex-col gap-2">
                    <label class="text-[8px] font-black uppercase ml-2 opacity-50">Tamaño</label>
                    <select v-model="activePeso" class="filter-select">
                        <option value="TODOS">Cualquier tamaño</option>
                        <option value="RAZA PEQUEÑA">Raza Pequeña</option>
                        <option value="RAZA MEDIANA">Raza Mediana</option>
                        <option value="RAZA GRANDE">Raza Grande</option>
                    </select>
                </div>
                <div class="flex flex-col gap-2">
                    <label class="text-[8px] font-black uppercase ml-2 opacity-50">Categoría</label>
                    <select v-model="activeCategory" class="filter-select">
                        <option value="TODOS">Todas las categorías</option>
                        <option v-for="cat in productStore.filtros.categorias" :key="cat" :value="cat">{{ cat }}</option>
                    </select>
                </div>
            </div>

            <div v-if="filteredProducts.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <div v-for="p in filteredProducts" :key="p.id"
                    class="group bg-slate-50 dark:bg-white/5 p-5 rounded-[3rem] border border-transparent hover:border-[#DE1F27]/30 transition-all hover:shadow-2xl flex flex-col relative">

                    <router-link :to="{ name: 'ProductoDetalle', params: { id: p.id } }"
                        class="relative block overflow-hidden rounded-[2.5rem] bg-white p-6 mb-6 aspect-square shadow-inner group/img">
                        <img v-if="p.fotosUrls?.length" :src="p.fotosUrls[0]"
                            :class="{ 'group-hover/img:opacity-0': p.fotosUrls.length > 1 }"
                            class="w-full h-full object-contain transition-all duration-500 group-hover/img:scale-110">
                        <img v-if="p.fotosUrls?.length > 1" :src="p.fotosUrls[1]"
                            class="absolute inset-0 w-full h-full object-contain p-6 opacity-0 group-hover/img:opacity-100 group-hover/img:scale-110 transition-all duration-500 scale-105">
                        
                        <div class="absolute top-4 left-4 flex flex-col gap-2 z-20">
                            <span v-if="p.requiereReceta" class="bg-[#DE1F27] text-white text-[7px] font-black px-2 py-1 rounded uppercase">💊 Receta</span>
                            <span v-if="p.stock <= 0" class="bg-black text-white text-[7px] font-black px-2 py-1 rounded uppercase">Agotado</span>
                        </div>

                        <div v-if="p.presentacion"
                            class="absolute bottom-4 right-4 bg-[#152C77] text-white text-[8px] font-black px-3 py-1.5 rounded-lg italic z-20">
                            {{ p.presentacion }}
                        </div>
                    </router-link>

                    <div class="space-y-4 flex-1 flex flex-col px-2">
                        <div>
                            <div class="flex justify-between items-start mb-1">
                                <button @click.stop="activeMarca = p.marca"
                                    class="text-[9px] font-black text-[#DE1F27] uppercase tracking-widest hover:underline hover:opacity-100 opacity-60 transition-all">
                                    {{ p.marca || 'GENÉRICO' }}
                                </button>
                            </div>
                            <h3 class="text-lg font-[1000] uppercase italic text-[#152C77] dark:text-white leading-tight h-12 line-clamp-2">
                                {{ p.nombre }}
                            </h3>
                        </div>

                        <div class="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-white/5">
                            <span class="text-2xl font-[1000] dark:text-white italic text-[#152C77]">
                                ${{ (p.precio || 0).toLocaleString() }}
                            </span>
                            <div class="flex items-center bg-white dark:bg-black rounded-xl border border-slate-200 dark:border-white/10 p-1">
                                <button @click="p.tempQty = Math.max(1, (p.tempQty || 1) - 1)" class="w-7 h-7 text-[#DE1F27] font-black">-</button>
                                <span class="px-2 text-[10px] font-[1000] dark:text-white">{{ p.tempQty || 1 }}</span>
                                <button @click="p.tempQty = (p.tempQty || 1) + 1" class="w-7 h-7 text-[#DE1F27] font-black">+</button>
                            </div>
                        </div>

                        <button @click="onAddToCart(p)" :disabled="p.stock <= 0"
                            class="w-full bg-[#152C77] text-white py-4 rounded-[1.5rem] font-black uppercase text-[10px] tracking-[0.2em] hover:bg-[#DE1F27] transition-all shadow-lg flex items-center justify-center gap-2 group">
                            {{ p.stock > 0 ? 'Añadir al Pedido' : 'Agotado' }}
                        </button>
                    </div>
                </div>
            </div>

            <div v-else class="py-40 text-center opacity-20">
                <span class="text-8xl">🔎</span>
                <p class="font-[1000] uppercase italic text-2xl mt-4">No hay productos con esos filtros</p>
                <button @click="resetFiltros" class="mt-6 text-[#DE1F27] font-black uppercase underline text-xs">Limpiar Filtros</button>
            </div>
        </div>
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

const mascotaActiva = ref(null);
const filterByMascota = ref(false);

const loadUserMascota = () => {
    const activePetRaw = localStorage.getItem('ps_active_pet');
    if (activePetRaw) {
        try {
            const petData = JSON.parse(activePetRaw);
            const rawSpecies = (petData.especie || '').toUpperCase();
            const especieMapeada = (rawSpecies === 'PERRO' || rawSpecies === 'CANINO') ? 'CANINO' :
                                   (rawSpecies === 'GATO' || rawSpecies === 'FELINO') ? 'FELINO' : 'TODOS';

            mascotaActiva.value = { ...petData, especie: especieMapeada };
            if (filterByMascota.value) aplicarSugerenciasMascota();
        } catch (e) {
            console.error("Error al procesar datos de mascota:", e);
        }
    }
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
    // Etapa simplificada
    if (mascotaActiva.value.fechaNacimiento) {
        const nacimiento = new Date(mascotaActiva.value.fechaNacimiento);
        const hoy = new Date();
        const edadMeses = (hoy.getFullYear() - nacimiento.getFullYear()) * 12 + (hoy.getMonth() - nacimiento.getMonth());
        if (edadMeses < 12) activeEtapa.value = 'CACHORRO';
        else if (edadMeses < 84) activeEtapa.value = 'ADULTO';
        else activeEtapa.value = 'SENIOR';
    }
};

watch(() => localStorage.getItem('ps_active_pet'), () => loadUserMascota());

const toggleRecomendaciones = () => {
    filterByMascota.value = !filterByMascota.value;
    if (filterByMascota.value) aplicarSugerenciasMascota();
    else resetFiltros();
};

const uniqueMarcas = computed(() => {
    const marcas = productStore.allProducts.map(p => p.marca).filter(Boolean);
    return [...new Set(marcas)].sort();
});

const filteredProducts = computed(() => {
    const products = productStore.allProducts || [];
    return products.filter(p => {
        // Normalización para que coincida el texto (Freyja es GRANDE)
        const pEspecie = (p.especie || 'TODOS').toUpperCase();
        const pEtapa = (p.etapaVida || 'TODOS').toUpperCase();
        const pPeso = (p.rangoPeso || 'TODOS').toUpperCase();

        const matchEspecie = activeSpecies.value === 'TODOS' || pEspecie === activeSpecies.value;
        const matchCat = activeCategory.value === 'TODOS' || p.categoria === activeCategory.value;
        const matchMarca = activeMarca.value === 'TODOS' || p.marca === activeMarca.value;
        const matchEtapa = activeEtapa.value === 'TODOS' || pEtapa === activeEtapa.value || pEtapa === 'TODOS';
        const matchPeso = activePeso.value === 'TODOS' || pPeso === activePeso.value || pPeso === 'TODOS';

        return matchEspecie && matchCat && matchMarca && matchEtapa && matchPeso;
    });
});

const resetFiltros = () => {
    activeSpecies.value = 'TODOS';
    activeCategory.value = 'TODOS';
    activeMarca.value = 'TODOS';
    activeEtapa.value = 'TODOS';
    activePeso.value = 'TODOS';
    filterByMascota.value = false;
};

const onAddToCart = (p) => {
    const qty = p.tempQty || 1;
    cartStore.addToCart(p, qty);
    emit('notify', `${qty}x ${p.nombre} agregado`, 'success');
    p.tempQty = 1;
};

onMounted(async () => {
    if (productStore.allProducts.length === 0) await productStore.fetchTienda();
    loadUserMascota();
});
</script>

<style scoped>
@reference "../../style.css";
.filter-select {
    @apply bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:border-[#DE1F27] transition-all cursor-pointer dark:text-white w-full;
}
.no-scrollbar::-webkit-scrollbar { display: none; }
</style>