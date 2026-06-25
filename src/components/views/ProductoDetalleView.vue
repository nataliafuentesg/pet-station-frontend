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

          <h1 class="text-2xl md:text-4xl font-[1000] uppercase italic tracking-tighter text-ps-blue dark:text-white leading-[0.95] mb-6">
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

          <Transition name="fade-scale">
            <div v-if="product.requiereReceta" 
                 class="mb-8 bg-red-50 dark:bg-[#DE1F27]/10 border-2 border-[#DE1F27] rounded-[2rem] p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6 shadow-xl shadow-[#DE1F27]/10">
              <div class="w-16 h-16 shrink-0 bg-[#DE1F27] text-white rounded-2xl flex items-center justify-center text-3xl shadow-inner">
                👨‍⚕️
              </div>
              <div>
                <h4 class="text-[11px] font-[1000] uppercase tracking-widest text-[#DE1F27] mb-2 italic">
                  Venta Bajo Fórmula Médica
                </h4>
                <p class="text-xs md:text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                  Para despachar este producto, será necesario <strong>adjuntar tu receta médica</strong> al finalizar el pedido por WhatsApp. Nuestro equipo veterinario verificará la dosis y te brindará asesoría personalizada.
                </p>
              </div>
            </div>
          </Transition>

          <div class="bg-ps-blue text-white rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-12 shadow-2xl mt-auto">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-8 mb-10">
              <div>
                <span class="block text-[10px] font-black uppercase tracking-widest opacity-50 mb-2">Inversión Final</span>
                <span class="text-3xl md:text-5xl font-[1000] italic leading-none tracking-tighter">
                  ${{ (product.precio * quantity).toLocaleString() }}
                </span>
              </div>
              
              <div class="flex items-center bg-white/10 rounded-2xl p-2 border border-white/10 shadow-inner">
                <button @click="quantity > 1 ? quantity-- : null" class="w-12 h-12 flex items-center justify-center text-2xl font-black hover:text-ps-red transition-colors">-</button>
                <span class="w-12 text-center font-[1000] text-2xl">{{ quantity }}</span>
                <button @click="quantity < product.stock ? quantity++ : null" class="w-12 h-12 flex items-center justify-center text-2xl font-black hover:text-ps-red transition-colors">+</button>
              </div>
            </div>

            <div class="flex gap-4" v-if="TIENDA_ACTIVA">
              <button @click="handleAddToCart" :disabled="product.stock <= 0"
                class="flex-1 bg-ps-red hover:scale-[1.02] disabled:bg-slate-500 text-white py-6 rounded-2xl font-[1000] uppercase italic transition-all shadow-xl flex items-center justify-center gap-3">
                {{ product.stock > 0 ? 'Añadir a la Bolsa' : 'Agotado' }} 🛍️
              </button>
              <a :href="whatsappUrl" target="_blank" class="w-20 h-20 flex items-center justify-center rounded-2xl bg-white/10 hover:bg-green-500 transition-all border border-white/10 text-2xl">
                💬
              </a>
            </div>
            <div v-else class="space-y-3">
              <div class="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-400/20 rounded-2xl p-4 text-center">
                <p class="text-[11px] font-black uppercase text-amber-700 dark:text-amber-400">🚧 Tienda temporalmente pausada</p>
                <p class="text-[10px] font-bold text-amber-600 dark:text-amber-500 mt-1">Pronto habilitaremos las compras en línea.</p>
              </div>
              <a :href="whatsappUrl" target="_blank"
                class="flex items-center justify-center gap-2 w-full bg-[#25D366] text-white py-5 rounded-2xl font-[1000] uppercase text-[10px] tracking-widest hover:bg-green-600 active:scale-95 transition-all">
                💬 Pedir por WhatsApp
              </a>
            </div>

            <!-- Info rápida de envío y devoluciones -->
            <div class="mt-4 bg-slate-50 dark:bg-white/5 rounded-2xl p-4 border border-slate-100 dark:border-white/10 space-y-2">
              <div class="flex items-center gap-2 text-[9px] font-black uppercase text-slate-500 dark:text-slate-400">
                <span>🚚</span>
                <span>Chía $8.500 · Cajicá/Bogotá $15.000 · <strong class="text-[#152C77] dark:text-white">Gratis desde $200.000</strong></span>
              </div>
              <div class="flex items-center gap-2 text-[9px] font-black uppercase text-slate-500 dark:text-slate-400">
                <span>🔄</span>
                <span>Cambios en accesorios y alimentos sellados ·
                  <router-link to="/politicas" class="text-[#DE1F27] underline underline-offset-2">Ver política completa</router-link>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="suggestedProducts.length" class="mt-24 pt-20 border-t border-slate-100 dark:border-white/10">
        <h2 class="text-3xl font-[1000] uppercase italic text-ps-blue dark:text-white mb-10">
          PRODUCTOS <span class="text-ps-red">SUGERIDOS</span>
        </h2>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <div v-for="sug in suggestedProducts" :key="sug.id" @click="goToSuggested(sug)"
               class="group bg-slate-50 dark:bg-white/5 p-4 rounded-[2.5rem] transition-all cursor-pointer border-2 border-transparent hover:border-[#DE1F27]/20 relative flex flex-col hover:shadow-2xl">
            
            <div class="absolute top-6 left-6 right-6 flex justify-between items-start z-10 pointer-events-none">
              <span v-if="sug.presentacion" class="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm border border-slate-100 text-[7px] font-black text-[#152C77] uppercase tracking-widest">
                {{ sug.presentacion }}
              </span>
              <span v-else></span> <span v-if="sug.requiereReceta" class="bg-[#DE1F27] text-white px-2 py-1 rounded-md shadow-md text-[7px] font-black uppercase tracking-widest animate-pulse">
                📋 Fórmula
              </span>
            </div>

            <div class="aspect-square w-full bg-white dark:bg-white/10 rounded-3xl overflow-hidden mb-4 p-4 shadow-inner relative flex items-center justify-center">
              <img :src="sug.fotosUrls?.[0]" class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700">
            </div>
            
            <p class="text-[8px] font-black text-[#DE1F27] uppercase mb-1 tracking-widest italic">{{ sug.marca }}</p>
            <h3 class="font-[1000] uppercase italic text-xs text-[#152C77] dark:text-white line-clamp-2 leading-tight flex-1">{{ sug.nombre }}</h3>
            <p class="mt-3 text-sm font-black text-[#152C77] dark:text-white italic">${{ sug.precio.toLocaleString() }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCartStore } from '../../stores/cartStore';
import { useProductStore } from '../../stores/productStore';
import { useTracking } from '@/composables/useTracking';
import api from '@/api/axios';
import { TIENDA_ACTIVA } from '@/config';

const { trackAddToCart } = useTracking();

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

  const titulo = `${prod.nombre} | Pet Station Chía`;
  const descripcion = `Compra ${prod.nombre} de ${prod.marca}. ${prod.descripcion?.substring(0, 100) || 'El mejor cuidado para tu mascota.'} Entrega en Chía.`;
  const imagen = prod.fotosUrls?.[0] || '';
  const url = window.location.href;

  document.title = titulo;

  const setMeta = (selector, attr, content) => {
    let el = document.querySelector(selector);
    if (!el) { el = document.createElement('meta'); document.head.appendChild(el); }
    el.setAttribute(attr === 'property' ? 'property' : 'name', selector.match(/["']([^"']+)["']/)?.[1] || '');
    el.setAttribute('content', content);
  };

  // Open Graph
  document.querySelector('meta[name="description"]')?.setAttribute('content', descripcion);
  document.querySelector('meta[property="og:title"]')?.setAttribute('content', titulo);
  document.querySelector('meta[property="og:description"]')?.setAttribute('content', descripcion);
  document.querySelector('meta[property="og:image"]')?.setAttribute('content', imagen);
  document.querySelector('meta[property="og:url"]')?.setAttribute('content', url);
  document.querySelector('meta[property="og:type"]')?.setAttribute('content', 'product');

  // Twitter Cards
  document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', titulo);
  document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', descripcion);
  document.querySelector('meta[name="twitter:image"]')?.setAttribute('content', imagen);

  // Canonical
  document.querySelector('link[rel="canonical"]')?.setAttribute('href', url);

  // JSON-LD Product schema (Rich Snippets — Google muestra precio y stock)
  document.getElementById('schema-producto')?.remove();
  const schema = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: prod.nombre,
    image: prod.fotosUrls || [],
    description: prod.descripcion || descripcion,
    sku: prod.id,
    brand: { '@type': 'Brand', name: prod.marca },
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: 'COP',
      price: prod.precio,
      priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      itemCondition: 'https://schema.org/NewCondition',
      availability: prod.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: { '@type': 'Organization', name: 'Pet Station' }
    }
  };
  const tag = document.createElement('script');
  tag.id = 'schema-producto';
  tag.type = 'application/ld+json';
  tag.text = JSON.stringify(schema);
  document.head.appendChild(tag);
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

    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'view_item',
        ecommerce: {
          currency: 'COP',
          value: data.precio,
          items: [{ item_id: data.id, item_name: data.nombre, item_brand: data.marca, item_category: data.categoria, price: data.precio, quantity: 1 }]
        }
      });
    }
    if (window.fbq) window.fbq('track', 'ViewContent', { content_ids: [data.id], content_name: data.nombre, content_type: 'product', value: data.precio, currency: 'COP' });

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
  trackAddToCart({ id: product.value.id, nombre: product.value.nombre, precio: product.value.precio * quantity.value });
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