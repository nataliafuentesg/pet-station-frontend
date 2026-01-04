<template>
  <div v-if="product" class="min-h-screen bg-white dark:bg-[#050505] pt-32 pb-20 px-4 transition-colors">
    <div class="max-w-[1400px] mx-auto">
      
      <button @click="router.back()" class="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-[#DE1F27] mb-8 transition-colors">
        <span class="group-hover:-translate-x-1 transition-transform">←</span> Volver a la tienda
      </button>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
        
        <div class="space-y-6">
          <div class="aspect-square bg-slate-50 dark:bg-white/5 rounded-[3rem] overflow-hidden flex items-center justify-center border border-slate-100 dark:border-white/10 shadow-inner relative group">
            <img 
              :src="currentImage || (product.fotosUrls?.length ? product.fotosUrls[0] : '')" 
              class="w-full h-full object-cover transition-all duration-700 group-hover:scale-110" 
            />
            <div v-if="!product.fotosUrls?.length" class="text-9xl">📦</div>
          </div>

          <div v-if="product.fotosUrls?.length > 1" class="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
            <div 
              v-for="(img, idx) in product.fotosUrls" 
              :key="idx" 
              @click="currentImage = img"
              :class="[
                'w-24 h-24 rounded-2xl overflow-hidden cursor-pointer transition-all border-2 shrink-0',
                (currentImage === img || (!currentImage && idx === 0)) 
                  ? 'border-[#DE1F27] scale-105 shadow-lg' 
                  : 'border-transparent opacity-60 hover:opacity-100'
              ]"
            >
              <img :src="img" class="w-full h-full object-cover">
            </div>
          </div>
        </div>

        <div class="flex flex-col">
          <div class="mb-4 flex items-center gap-3">
            <span class="bg-[#DE1F27] text-white text-[9px] font-black px-4 py-1.5 rounded-full uppercase italic tracking-widest">
              {{ product.categoria }}
            </span>
            <span class="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
              {{ product.marca }}
            </span>
          </div>

          <h1 class="text-5xl md:text-7xl font-[1000] uppercase italic tracking-tighter text-[#152C77] dark:text-white leading-[0.9] mb-8">
            {{ product.nombre }}
          </h1>

          <p class="text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-10 max-w-xl">
            {{ product.descripcion }}
          </p>

          <div class="bg-slate-50 dark:bg-white/5 rounded-[2.5rem] p-8 mb-10 border border-slate-100 dark:border-white/5">
            <div class="flex justify-between items-end mb-8">
              <div>
                <span class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Precio Total</span>
                <span class="text-5xl font-[1000] dark:text-white italic text-[#152C77] leading-none">
                  ${{ (product.precio * quantity).toLocaleString() }}
                </span>
              </div>
              <div class="text-right">
                <span class="block text-[10px] font-black text-slate-400 uppercase mb-2">Disponibilidad</span>
                <span class="text-sm font-black dark:text-white bg-green-500/10 text-green-500 px-3 py-1 rounded-lg">
                  {{ product.stock }} EN STOCK
                </span>
              </div>
            </div>

            <div class="flex items-center gap-6 pt-6 border-t border-slate-200 dark:border-white/10">
              <span class="text-[10px] font-black uppercase text-slate-400 tracking-widest">Cantidad:</span>
              <div class="flex items-center bg-white dark:bg-black rounded-2xl border border-slate-200 dark:border-white/10 p-2 shadow-sm">
                <button @click="quantity > 1 ? quantity-- : null" class="w-10 h-10 flex items-center justify-center text-xl font-black text-[#DE1F27] hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl transition-colors">-</button>
                <span class="w-12 text-center font-[1000] text-xl dark:text-white italic">{{ quantity }}</span>
                <button @click="quantity < product.stock ? quantity++ : null" class="w-10 h-10 flex items-center justify-center text-xl font-black text-[#DE1F27] hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl transition-colors">+</button>
              </div>
            </div>
          </div>

          <div class="flex gap-4">
            <button @click="handleAddToCart" class="flex-1 bg-[#152C77] hover:bg-[#DE1F27] text-white py-6 rounded-[2rem] font-[1000] uppercase italic tracking-tighter transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-3 group">
              <span>AÑADIR AL CARRITO</span>
              <span class="text-xl group-hover:rotate-12 transition-transform duration-300">🛒</span>
            </button>
            <button class="w-20 h-20 flex items-center justify-center rounded-[2rem] border-2 border-slate-100 dark:border-white/10 text-2xl hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition-all">
              ♥
            </button>
          </div>
        </div>
      </div>

      <div class="mt-32 pt-20 border-t border-slate-100 dark:border-white/10">
        <h2 class="text-4xl font-[1000] uppercase italic text-[#152C77] dark:text-white mb-12">
          TAMBIÉN TE <span class="text-[#DE1F27]">PODRÍA GUSTAR.</span>
        </h2>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div v-for="sug in suggestedProducts" :key="sug.id" 
               class="group bg-slate-50 dark:bg-white/5 p-6 rounded-[2.5rem] border border-transparent hover:border-[#DE1F27]/30 transition-all cursor-pointer"
               @click="goToSuggested(sug.id)">
            <div class="aspect-square bg-white dark:bg-white/10 rounded-[2rem] overflow-hidden mb-6 relative">
              <img v-if="sug.fotosUrls?.length" :src="sug.fotosUrls[0]" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
              <div v-else class="w-full h-full flex items-center justify-center text-3xl grayscale group-hover:grayscale-0">📦</div>
            </div>
            <h3 class="font-[1000] uppercase italic text-sm text-[#152C77] dark:text-white truncate">{{ sug.nombre }}</h3>
            <p class="text-[10px] font-black text-[#DE1F27] mt-1">${{ sug.precio.toLocaleString() }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="min-h-screen flex items-center justify-center bg-white dark:bg-[#050505]">
    <div class="flex flex-col items-center gap-4">
      <div class="w-12 h-12 border-4 border-[#DE1F27] border-t-transparent rounded-full animate-spin"></div>
      <p class="animate-pulse font-[1000] italic text-2xl text-slate-400 uppercase tracking-tighter">Cargando Producto...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCartStore } from '../../stores/cartStore';
import { useProductStore } from '../../stores/productStore';

const props = defineProps(['id']);
const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();
const productStore = useProductStore();

const product = ref(null);
const quantity = ref(1);
const currentImage = ref(null);
const suggestedProducts = ref([]);

const emit = defineEmits(['notify']);

const fetchData = async (productId) => {
  try {
    const res = await fetch(`http://localhost:8080/api/tienda/productos/${productId}`);
    if (res.ok) {
      product.value = await res.json();
      quantity.value = 1;
      currentImage.value = null; // Reiniciar imagen al cambiar de producto

      // Lógica de sugeridos: Filtramos por categoría y que no sea el mismo producto
      if (productStore.allProducts.length === 0) {
        await productStore.fetchTienda();
      }
      
      suggestedProducts.value = productStore.allProducts
        .filter(p => p.categoria === product.value.categoria && p.id !== product.value.id)
        .sort(() => 0.5 - Math.random()) // Mezclar para variedad
        .slice(0, 4);
    }
  } catch (e) {
    console.error("Error cargando producto", e);
  }
};

const handleAddToCart = () => {
  if (!product.value) return;
  
  cartStore.addToCart(product.value, quantity.value);
  
  // Usar el sistema de notificaciones heredado de App.vue
  emit('notify', `${quantity.value}x ${product.value.nombre} añadido al carrito`, 'success');
};

const goToSuggested = (id) => {
  router.push({ name: 'ProductoDetalle', params: { id } });
};

// Escuchar cambios en la URL para cuando el usuario hace clic en un producto sugerido
watch(() => route.params.id, (newId) => {
  if (newId) fetchData(newId);
});

onMounted(() => {
  fetchData(route.params.id);
});
</script>

<style scoped>
/* Ocultar scrollbar pero mantener funcionalidad */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>