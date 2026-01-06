<template>
  <div v-if="product && product.id" class="min-h-screen bg-white dark:bg-[#050505] pt-32 pb-20 px-4 transition-colors">
    <div class="max-w-[1400px] mx-auto">
      
      <button @click="router.push('/tienda')" class="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-[#DE1F27] mb-8 transition-colors">
        <span class="group-hover:-translate-x-1 transition-transform">←</span> Volver a la tienda
      </button>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-24">
        
        <div class="space-y-6">
          <div class="aspect-[4/5] bg-slate-50 dark:bg-white/5 rounded-[3rem] overflow-hidden flex items-center justify-center border border-slate-100 dark:border-white/10 shadow-inner relative group p-12">
            <img 
              :src="currentImage || (product.fotosUrls?.length ? product.fotosUrls[0] : '')" 
              class="w-full h-full object-contain transition-all duration-700 group-hover:scale-105" 
            />
            
            <div v-if="product.presentacion" class="absolute top-8 left-8">
              <div class="bg-[#152C77] text-white px-6 py-3 rounded-2xl shadow-2xl flex flex-col items-center border-b-4 border-[#DE1F27]">
                <span class="text-[8px] font-black uppercase tracking-widest opacity-70">Contenido</span>
                <span class="text-lg font-[1000] uppercase italic leading-none">{{ product.presentacion }}</span>
              </div>
            </div>
            <div v-if="!product.fotosUrls?.length" class="text-9xl opacity-10">📦</div>
          </div>

          <div v-if="product.fotosUrls?.length > 1" class="flex gap-4 overflow-x-auto pb-4 no-scrollbar justify-center">
            <div 
              v-for="(img, idx) in product.fotosUrls" 
              :key="idx" 
              @click="currentImage = img"
              :class="[
                'w-20 h-20 rounded-2xl overflow-hidden cursor-pointer transition-all border-2 shrink-0 p-2 bg-slate-50 dark:bg-white/5',
                (currentImage === img || (!currentImage && idx === 0)) 
                  ? 'border-[#DE1F27] scale-105 shadow-lg' 
                  : 'border-transparent opacity-60 hover:opacity-100'
              ]"
            >
              <img :src="img" class="w-full h-full object-contain">
            </div>
          </div>
        </div>

        <div class="flex flex-col justify-center">
          <div class="mb-6 flex items-center gap-3">
            <span class="bg-[#DE1F27] text-white text-[9px] font-black px-4 py-1.5 rounded-full uppercase italic tracking-widest">
              {{ product.categoria }}
            </span>
            <span class="text-[#152C77] dark:text-white text-[10px] font-[1000] uppercase tracking-[0.2em]">
              {{ product.marca }}
            </span>
          </div>

          <h1 class="text-4xl md:text-6xl font-[1000] uppercase italic tracking-tighter text-[#152C77] dark:text-white leading-[0.9] mb-8">
            {{ product.nombre }}
          </h1>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            <div class="spec-card">
              <span class="spec-label">Especie</span>
              <span class="spec-value">{{ product.especie }}</span>
            </div>
            <div class="spec-card">
              <span class="spec-label">Etapa</span>
              <span class="spec-value">{{ product.etapaVida || 'General' }}</span>
            </div>
            <div class="spec-card">
              <span class="spec-label">Tamaño</span>
              <span class="spec-value">{{ product.rangoPeso || 'General' }}</span>
            </div>
            <div class="spec-card" :class="{'bg-[#DE1F27]/10': product.requiereReceta}">
              <span class="spec-label">Venta</span>
              <span :class="['spec-value', product.requiereReceta ? 'text-[#DE1F27]' : 'text-green-500']">
                {{ product.requiereReceta ? 'CON RECETA' : 'LIBRE' }}
              </span>
            </div>
          </div>

          <div class="max-h-48 overflow-y-auto pr-4 mb-10 custom-scrollbar">
            <p class="text-base text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              {{ product.descripcion }}
            </p>
          </div>

          <div class="bg-slate-50 dark:bg-white/5 rounded-[3rem] p-10 mb-6 border border-slate-100 dark:border-white/5">
            <div class="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
              <div>
                <span class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Precio Total</span>
                <span class="text-6xl font-[1000] dark:text-white italic text-[#152C77] leading-none">
                  ${{ (product.precio * quantity).toLocaleString() }}
                </span>
              </div>
              <div class="text-left md:text-right">
                <span class="block text-[10px] font-black text-slate-400 uppercase mb-2">Stock</span>
                <span :class="[
                  'text-xs font-black px-4 py-2 rounded-xl uppercase italic tracking-widest',
                  product.stock > 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                ]">
                  {{ product.stock > 0 ? `${product.stock} DISPONIBLES` : 'SIN STOCK' }}
                </span>
              </div>
            </div>

            <div class="flex items-center gap-6 pt-8 border-t border-slate-200 dark:border-white/10">
              <span class="text-[10px] font-black uppercase text-slate-400 tracking-widest">Cantidad:</span>
              <div class="flex items-center bg-white dark:bg-black rounded-2xl border border-slate-200 dark:border-white/10 p-2 shadow-sm">
                <button @click="quantity > 1 ? quantity-- : null" class="w-10 h-10 flex items-center justify-center text-xl font-black text-[#DE1F27]">-</button>
                <span class="w-12 text-center font-[1000] text-xl dark:text-white">{{ quantity }}</span>
                <button @click="quantity < product.stock ? quantity++ : null" class="w-10 h-10 flex items-center justify-center text-xl font-black text-[#DE1F27]">+</button>
              </div>
            </div>
          </div>

          <div class="flex gap-4">
            <button 
              @click="handleAddToCart" 
              :disabled="product.stock <= 0"
              class="flex-1 bg-[#152C77] hover:bg-[#DE1F27] disabled:bg-slate-300 text-white py-6 rounded-[2rem] font-[1000] uppercase italic transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-3 group"
            >
              <span>{{ product.stock > 0 ? 'AÑADIR AL CARRITO' : 'AGOTADO' }}</span>
              <span v-if="product.stock > 0" class="group-hover:rotate-12 transition-transform">🛒</span>
            </button>

            <a 
              :href="whatsappUrl"
              target="_blank"
              class="w-20 h-20 shrink-0 flex items-center justify-center rounded-[2rem] border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white transition-all shadow-lg text-2xl"
            >
              <span class="mb-1">💬</span>
            </a>
          </div>
        </div>
      </div>

      <div v-if="suggestedProducts.length" class="mt-32 pt-20 border-t border-slate-100 dark:border-white/10">
        <h2 class="text-4xl font-[1000] uppercase italic text-[#152C77] dark:text-white mb-12">
          PRODUCTOS QUE <span class="text-[#DE1F27]">TE PODRÍAN INTERESAR.</span>
        </h2>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div v-for="sug in suggestedProducts" :key="sug.id" 
               class="group bg-slate-50 dark:bg-white/5 p-6 rounded-[2.5rem] border border-transparent hover:border-[#DE1F27]/30 transition-all cursor-pointer flex flex-col"
               @click="goToSuggested(sug.id)">
            <div class="aspect-square bg-white dark:bg-white/10 rounded-[2rem] overflow-hidden mb-6 relative p-6">
              <img v-if="sug.fotosUrls?.length" :src="sug.fotosUrls[0]" class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700">
              <div v-else class="w-full h-full flex items-center justify-center text-3xl">📦</div>
            </div>
            <p class="text-[8px] font-black text-[#DE1F27] uppercase tracking-widest mb-1">{{ sug.marca }}</p>
            <h3 class="font-[1000] uppercase italic text-sm text-[#152C77] dark:text-white truncate mb-4">{{ sug.nombre }}</h3>
            <p class="text-lg font-[1000] italic text-[#152C77] dark:text-white mt-auto">${{ (sug.precio || 0).toLocaleString() }}</p>
          </div>
        </div>
      </div>

    </div>
  </div>

  <div v-else class="min-h-screen flex items-center justify-center bg-white dark:bg-[#050505]">
    <div class="flex flex-col items-center gap-4">
      <div class="w-12 h-12 border-4 border-[#DE1F27] border-t-transparent rounded-full animate-spin"></div>
      <p class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Cargando Producto...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCartStore } from '../../stores/cartStore';
import { useProductStore } from '../../stores/productStore';

const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();
const productStore = useProductStore();

const product = ref(null);
const quantity = ref(1);
const currentImage = ref(null);
const suggestedProducts = ref([]);
const emit = defineEmits(['notify']);

// Computada para WhatsApp (Evita errores de window en el template)
const whatsappUrl = computed(() => {
  if (!product.value) return '#';
  const message = encodeURIComponent(`¡Hola! Estoy interesado en el producto: ${product.value.nombre}.`);
  return `https://wa.me/573000000000?text=${message}`; // Cambia el número
});

const fetchData = async (productId) => {
  try {
    const res = await fetch(`https://api.petstationvet.com/api/tienda/productos/${productId}`);
    if (res.ok) {
      const data = await res.json();
      product.value = data;
      quantity.value = 1;
      currentImage.value = null;
      
      // Cargar sugeridos
      if (productStore.allProducts.length === 0) {
        await productStore.fetchTienda();
      }
      
      suggestedProducts.value = productStore.allProducts
        .filter(p => p.categoria === data.categoria && p.id !== data.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 4);
    } else {
      console.error("Producto no encontrado");
      router.push('/tienda');
    }
  } catch (e) {
    console.error("Error cargando producto:", e);
  }
};

const handleAddToCart = () => {
  if (!product.value) return;
  cartStore.addToCart(product.value, quantity.value);
  emit('notify', `${quantity.value}x ${product.value.nombre} añadido`, 'success');
};

const goToSuggested = (id) => {
  router.push({ name: 'ProductoDetalle', params: { id } });
};

watch(() => route.params.id, (newId) => {
  if (newId) fetchData(newId);
}, { immediate: true });

onMounted(() => {
  if (route.params.id) fetchData(route.params.id);
});
</script>

<style scoped>
@reference "../../style.css";

.spec-card { @apply bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-slate-100 dark:border-white/10 flex flex-col justify-center; }
.spec-label { @apply text-[7px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1; }
.spec-value { @apply text-[9px] font-black uppercase italic text-[#152C77] dark:text-ps-blue; }
.no-scrollbar::-webkit-scrollbar { display: none; }
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { @apply bg-slate-200 dark:bg-white/10 rounded-full; }
</style>