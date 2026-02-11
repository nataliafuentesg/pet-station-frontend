<template>
  <div v-if="isLoading" class="min-h-screen bg-white dark:bg-[#050505] pt-5 md:pt-32 pb-20 px-4">
    <div class="max-w-[1400px] mx-auto animate-pulse">
      <div class="h-4 w-24 bg-slate-200 dark:bg-white/10 rounded mb-8"></div>
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div class="lg:col-span-5 aspect-square bg-slate-200 dark:bg-white/10 rounded-[3rem]"></div>
        <div class="lg:col-span-7 space-y-6">
          <div class="h-4 w-32 bg-slate-200 dark:bg-white/10 rounded"></div>
          <div class="h-16 w-full bg-slate-200 dark:bg-white/10 rounded"></div>
          <div class="grid grid-cols-4 gap-4">
            <div v-for="i in 4" :key="i" class="h-16 bg-slate-200 dark:bg-white/10 rounded-2xl"></div>
          </div>
          <div class="h-40 w-full bg-slate-200 dark:bg-white/10 rounded-[2.5rem]"></div>
        </div>
      </div>
    </div>
  </div>

  <div v-else-if="product && product.id" class="min-h-screen bg-white dark:bg-[#050505] pt-20 md:pt-32 pb-20 px-4 transition-colors duration-500">
    <div class="max-w-[1400px] mx-auto">
      
      <button @click="router.push('/tienda')" class="group flex items-center gap-2 text-[9px] md:text-[10px] font-[1000] uppercase tracking-[0.3em] text-slate-400 hover:text-ps-red mb-6 transition-all">
        <span class="group-hover:-translate-x-1 transition-transform">←</span> Volver a la Tienda
      </button>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
        
        <div class="lg:col-span-5 space-y-4 md:space-y-6">
          <div class="aspect-square bg-slate-50 dark:bg-white/5 rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden flex items-center justify-center border border-slate-100 dark:border-white/10 relative p-6 md:p-12 shadow-inner">
            <img 
              :src="currentImage || (product.fotosUrls?.length ? product.fotosUrls[0] : '')" 
              class="w-full h-full object-contain transition-transform duration-700 hover:scale-110" 
            />
            
            <div v-if="product.presentacion" class="absolute top-4 left-4 md:top-8 md:left-8">
              <div class="bg-ps-blue text-white px-4 py-2 rounded-xl shadow-2xl flex flex-col items-center border-b-2 border-ps-red">
                <span class="text-[7px] font-black uppercase tracking-widest opacity-60">Contenido</span>
                <span class="text-xs md:text-sm font-[1000] uppercase italic leading-none">{{ product.presentacion }}</span>
              </div>
            </div>
          </div>

          <div v-if="product.fotosUrls?.length > 1" class="flex gap-3 overflow-x-auto pb-2 no-scrollbar justify-start md:justify-center">
            <div v-for="(img, idx) in product.fotosUrls" :key="idx" @click="currentImage = img"
              :class="[(currentImage === img || (!currentImage && idx === 0)) ? 'border-ps-red scale-105 shadow-md' : 'border-transparent opacity-50',
              'w-16 h-16 rounded-xl overflow-hidden cursor-pointer transition-all border-2 shrink-0 p-1.5 bg-slate-50 dark:bg-white/5']">
              <img :src="img" class="w-full h-full object-contain">
            </div>
          </div>
        </div>

        <div class="lg:col-span-7 flex flex-col">
          <div class="mb-4 flex items-center gap-3">
            <span class="bg-ps-red text-white text-[8px] font-black px-3 py-1 rounded-full uppercase italic tracking-widest shadow-lg shadow-ps-red/20">
              {{ product.categoria }}
            </span>
            <span class="text-ps-blue dark:text-white/60 text-[9px] font-[1000] uppercase tracking-[0.2em]">
              {{ product.marca }}
            </span>
          </div>

          <h1 class="text-4xl md:text-6xl font-[1000] uppercase italic tracking-tighter text-ps-blue dark:text-white leading-[0.9] mb-8 italic">
            {{ product.nombre }}
          </h1>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-3 mb-8">
            <div class="spec-card"><span class="spec-label">Especie</span><span class="spec-value">{{ product.especie }}</span></div>
            <div class="spec-card"><span class="spec-label">Etapa</span><span class="spec-value">{{ product.etapaVida || 'General' }}</span></div>
            <div class="spec-card"><span class="spec-label">Talla</span><span class="spec-value">{{ product.rangoPeso || 'General' }}</span></div>
            <div class="spec-card" :class="{'bg-ps-red/5 border-ps-red/20': product.requiereReceta}">
              <span class="spec-label">Venta</span>
              <span :class="['spec-value', product.requiereReceta ? 'text-ps-red' : 'text-green-500']">
                {{ product.requiereReceta ? 'RECETA' : 'LIBRE' }}
              </span>
            </div>
          </div>

          <div class="bg-slate-50 dark:bg-white/5 rounded-[2rem] p-6 md:p-8 mb-8 border border-slate-100 dark:border-white/5 relative">
            <h3 class="text-[9px] font-black text-ps-red uppercase tracking-[0.3em] mb-4">Información Médica</h3>
            <div :class="['relative transition-all duration-500 overflow-hidden', isExpanded ? 'max-h-[1000px]' : 'max-h-20']">
              <p class="text-sm md:text-base text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                {{ product.descripcion }}
              </p>
              <div v-if="!isExpanded" class="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-slate-50 dark:from-black/40 to-transparent"></div>
            </div>
            <button @click="isExpanded = !isExpanded" class="mt-4 text-[9px] font-black text-ps-blue dark:text-white uppercase border-b-2 border-ps-red pb-1">
              {{ isExpanded ? 'Contraer ↑' : 'Leer más ↓' }}
            </button>
          </div>

          <div class="bg-ps-blue text-white rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-12 shadow-2xl mt-auto">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-8 mb-10">
              <div>
                <span class="block text-[10px] font-black uppercase tracking-widest opacity-50 mb-2">Inversión Final</span>
                <span class="text-5xl md:text-7xl font-[1000] italic leading-none tracking-tighter">
                  ${{ (product.precio * quantity).toLocaleString() }}
                </span>
              </div>
              
              <div class="flex items-center bg-white/10 rounded-2xl p-2 border border-white/10 shadow-inner">
                <button @click="quantity > 1 ? quantity-- : null" class="w-12 h-12 flex items-center justify-center text-2xl font-black hover:text-ps-red transition-colors">-</button>
                <span class="w-12 text-center font-[1000] text-2xl">{{ quantity }}</span>
                <button @click="quantity < product.stock ? quantity++ : null" class="w-12 h-12 flex items-center justify-center text-2xl font-black hover:text-ps-red transition-colors">+</button>
              </div>
            </div>

            <div class="flex gap-4">
              <button @click="handleAddToCart" :disabled="product.stock <= 0"
                class="flex-1 bg-ps-red hover:scale-[1.02] disabled:bg-slate-500 text-white py-6 rounded-2xl font-[1000] uppercase italic transition-all shadow-xl flex items-center justify-center gap-3">
                {{ product.stock > 0 ? 'Añadir a la Bolsa' : 'Agotado' }} 🛍️
              </button>
              <a :href="whatsappUrl" target="_blank" class="w-20 h-20 flex items-center justify-center rounded-2xl bg-white/10 hover:bg-green-500 transition-all border border-white/10 text-2xl">
                💬
              </a>
            </div>
          </div>
        </div>
      </div>

      <div v-if="suggestedProducts.length" class="mt-24 pt-20 border-t border-slate-100 dark:border-white/10">
        <h2 class="text-3xl font-[1000] uppercase italic text-ps-blue dark:text-white mb-10">
          PRODUCTOS <span class="text-ps-red">SUGERIDOS</span>
        </h2>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="sug in suggestedProducts" :key="sug.id" @click="goToSuggested(sug)"
               class="group bg-slate-50 dark:bg-white/5 p-4 rounded-[2.5rem] transition-all cursor-pointer border border-transparent hover:border-ps-red/20">
            <div class="aspect-square bg-white dark:bg-white/10 rounded-3xl overflow-hidden mb-4 p-4 shadow-inner">
              <img :src="sug.fotosUrls?.[0]" class="w-full h-full object-contain group-hover:scale-110 transition-transform">
            </div>
            <p class="text-[8px] font-black text-ps-red uppercase mb-1">{{ sug.marca }}</p>
            <h3 class="font-[1000] uppercase italic text-xs text-ps-blue dark:text-white truncate">{{ sug.nombre }}</h3>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onUnmounted } from 'vue'; // <-- Añade onUnmounted
import { useRoute, useRouter } from 'vue-router';
import { useCartStore } from '../../stores/cartStore';
import { useProductStore } from '../../stores/productStore';
import api from '@/api/axios';

const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();
const productStore = useProductStore();

const product = ref(null);
const quantity = ref(1);
const currentImage = ref(null);
const suggestedProducts = ref([]);
const isExpanded = ref(false);
const isLoading = ref(true);
const emit = defineEmits(['notify']);

const whatsappUrl = computed(() => {
  if (!product.value) return '#';
  return `https://wa.me/573053462413?text=${encodeURIComponent('Me interesa el producto: ' + product.value.nombre)}`;
});

// --- FUNCIONES DE UUID Y SLUG (Déjalas tal cual las tienes) ---
const getRealId = (param) => {
  if (!param) return null;
  const strParam = String(param);
  if (strParam.length >= 36) {
    return strParam.slice(-36); 
  }
  return null;
};

const crearSlug = (id, nombre) => {
  const cleanName = (nombre || '').toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
  return `${cleanName}-${id}`;
};

// ------------------------------------------------------------------------
// 🚀 MAGIA SEO Y RICH SNIPPETS PARA GOOGLE (NUEVO)
// ------------------------------------------------------------------------
const actualizarSEO = (prod) => {
  if (!prod) return;

  // 1. Título de la pestaña
  document.title = `${prod.nombre} | Pet Station Chía`;

  // 2. Descripción Corta para Google
  const descripcionSEO = `Compra ${prod.nombre} de la marca ${prod.marca}. ${prod.descripcion?.substring(0, 100) || 'El mejor cuidado para tu mascota.'} ¡Pídelo online en Chía!`;

  // Función ayudante para crear/actualizar metas
  const setMeta = (name, content, isProperty = false) => {
    const attr = isProperty ? 'property' : 'name';
    let meta = document.querySelector(`meta[${attr}="${name}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute(attr, name);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  };

  // Metas Básicas
  setMeta('description', descripcionSEO);
  
  // Metas para Redes Sociales / WhatsApp (Open Graph)
  setMeta('og:title', `${prod.nombre} | Pet Station`, true);
  setMeta('og:description', descripcionSEO, true);
  setMeta('og:image', prod.fotosUrls?.[0] || '', true);
  setMeta('og:url', window.location.href, true);
  setMeta('og:type', 'product', true);

  // 3. JSON-LD (Rich Snippets para que Google muestre el Precio y Stock)
  // Primero limpiamos si ya había uno anterior (por si el usuario navega entre sugeridos)
  const existingScript = document.getElementById('schema-producto');
  if (existingScript) existingScript.remove();

  // Construimos el objeto que Google lee
  const schemaData = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": prod.nombre,
    "image": prod.fotosUrls || [],
    "description": prod.descripcion || descripcionSEO,
    "sku": prod.id,
    "brand": {
      "@type": "Brand",
      "name": prod.marca
    },
    "offers": {
      "@type": "Offer",
      "url": window.location.href,
      "priceCurrency": "COP",
      "price": prod.precio,
      "priceValidUntil": new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0], // Válido por 1 año
      "itemCondition": "https://schema.org/NewCondition",
      "availability": prod.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "Pet Station"
      }
    }
  };

  // Inyectamos el JSON en el head
  const scriptTag = document.createElement('script');
  scriptTag.id = 'schema-producto';
  scriptTag.type = 'application/ld+json';
  scriptTag.text = JSON.stringify(schemaData);
  document.head.appendChild(scriptTag);
};

// Limpieza cuando el usuario sale del producto
onUnmounted(() => {
  const existingScript = document.getElementById('schema-producto');
  if (existingScript) existingScript.remove();
});
// ------------------------------------------------------------------------


const fetchData = async (id) => {
  if (!id) return;
  isLoading.value = true;

  try {
    const { data } = await api.get(`/tienda/productos/${id}`);
    
    product.value = data;
    isExpanded.value = false;
    currentImage.value = null;

    // --- LLAMADA AL SEO ---
    actualizarSEO(data);

    if (productStore.allProducts.length === 0) await productStore.fetchTienda();
    
    suggestedProducts.value = productStore.allProducts
      .filter(p => p.categoria === data.categoria && p.id !== data.id)
      .sort(() => 0.5 - Math.random()).slice(0, 4);
      
    setTimeout(() => isLoading.value = false, 600);

  } catch (e) {
    console.error("Error al cargar producto:", e);
    document.title = 'Producto no encontrado | Pet Station'; // SEO de Error
    router.push('/tienda');
  }
};

const handleAddToCart = () => {
  cartStore.addToCart(product.value, quantity.value);
  emit('notify', { msg: `¡Añadido: ${product.value.nombre}!`, type: 'success' });
};

const goToSuggested = (sug) => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  const slug = crearSlug(sug.id, sug.nombre);
  router.push({ name: 'ProductoDetalle', params: { id: slug } });
};

watch(() => route.params.id, (newVal) => {
  if (newVal) {
    const realUuid = getRealId(newVal);
    if (realUuid) {
      fetchData(realUuid);
    } else {
      console.warn("UUID no encontrado en URL");
      router.push('/tienda');
    }
  }
}, { immediate: true });
</script>

<style scoped>
@reference "../../style.css";
.spec-card { @apply bg-white dark:bg-white/5 p-4 rounded-2xl border border-slate-100 dark:border-white/10 flex flex-col justify-center; }
.spec-label { @apply text-[7px] font-[1000] text-slate-400 uppercase tracking-widest mb-1; }
.spec-value { @apply text-[9px] font-black uppercase italic text-ps-blue dark:text-white truncate; }
.no-scrollbar::-webkit-scrollbar { display: none; }
</style>