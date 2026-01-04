<template>
  <div class="min-h-screen bg-white dark:bg-[#050505] pt-32 pb-20 px-4 transition-colors duration-500">
    <div class="max-w-[1600px] mx-auto">
      
      <div class="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
        <div>
          <h1 class="text-6xl md:text-8xl font-[1000] uppercase italic tracking-tighter text-[#152C77] dark:text-white leading-none">
            PET <span class="text-[#DE1F27]">SHOP.</span>
          </h1>
        </div>
        <div class="bg-[#152C77] text-white p-6 rounded-[2rem] shadow-2xl min-w-[280px]">
          <div class="flex justify-between items-center mb-2">
            <span class="text-[10px] font-black uppercase opacity-60">Tu Carrito</span>
            <span class="bg-[#DE1F27] px-2 py-0.5 rounded text-[10px] font-black">{{ cartStore.count }}</span>
          </div>
          <p class="text-2xl font-[1000] italic">${{ cartStore.total.toLocaleString() }}</p>
        </div>
      </div>

      <div class="flex gap-4 mb-6 border-b border-slate-100 dark:border-white/10 pb-6 overflow-x-auto no-scrollbar">
        <button 
          @click="activeSpecies = 'TODOS'" 
          :class="[activeSpecies === 'TODOS' ? 'bg-[#DE1F27] text-white scale-105' : 'text-slate-400']"
          class="px-6 py-3 rounded-xl text-[11px] font-black uppercase transition-all shrink-0 border border-transparent">
          🐾 Todos
        </button>
        
        <template v-for="esp in productStore.filtros.especies" :key="esp">
          <button 
            v-if="esp !== 'TODOS'"
            @click="activeSpecies = esp"
            :class="[activeSpecies === esp ? 'bg-[#DE1F27] text-white scale-105 shadow-lg' : 'text-slate-400 border-slate-200 dark:border-white/10']"
            class="px-6 py-3 rounded-xl text-[11px] font-black uppercase transition-all shrink-0 border">
            {{ esp === 'CANINO' ? '🐶' : '🐱' }} {{ esp }}
          </button>
        </template>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div v-for="p in filteredProducts" :key="p.id" 
          class="group bg-slate-50 dark:bg-white/5 p-6 rounded-[2.5rem] border border-transparent hover:border-[#DE1F27]/30 transition-all">
          
          <router-link :to="{ name: 'ProductoDetalle', params: { id: p.id } }">
            <div class="aspect-square bg-white dark:bg-white/10 rounded-[2rem] overflow-hidden mb-6">
              <img v-if="p.fotosUrls?.length" :src="p.fotosUrls[0]" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
              <div v-else class="w-full h-full flex items-center justify-center text-5xl">📦</div>
            </div>
          </router-link>

          <div class="space-y-4">
            <h3 class="text-lg font-[1000] uppercase italic text-[#152C77] dark:text-white truncate">{{ p.nombre }}</h3>
            
            <div class="flex items-center justify-between">
              <span class="text-xl font-[1000] dark:text-white">${{ p.precio.toLocaleString() }}</span>
              
              <div class="flex items-center bg-white dark:bg-black rounded-xl border border-slate-200 dark:border-white/10 p-1">
                <button @click="p.tempQty = Math.max(1, (p.tempQty || 1) - 1)" class="w-6 h-6 text-[#DE1F27] font-bold">-</button>
                <span class="px-2 text-xs font-black dark:text-white">{{ p.tempQty || 1 }}</span>
                <button @click="p.tempQty = (p.tempQty || 1) + 1" class="w-6 h-6 text-[#DE1F27] font-bold">+</button>
              </div>
            </div>

            <button @click="onAddToCart(p)" 
              class="w-full bg-[#152C77] text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-[#DE1F27] transition-all shadow-lg active:scale-95">
              Añadir al Carrito
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useProductStore } from '../../stores/productStore';
import { useCartStore } from '../../stores/cartStore';
const emit = defineEmits(['notify']);

const productStore = useProductStore();
const cartStore = useCartStore();
const activeSpecies = ref('TODOS');
const activeCategory = ref('TODOS');

const filteredProducts = computed(() => {
  return productStore.allProducts.filter(p => {
    const speciesMatch = activeSpecies.value === 'TODOS' || p.especie === activeSpecies.value;
    const categoryMatch = activeCategory.value === 'TODOS' || p.categoria === activeCategory.value;
    return speciesMatch && categoryMatch;
  });
});

const onAddToCart = (p) => {
  if (!p) return;
  
  const qty = p.tempQty || 1;
  
  cartStore.addToCart(p, qty);
    emit('notify', `${qty}x ${p.nombre} agregado al carrito`, 'success');
    p.tempQty = 1;
};
onMounted(() => productStore.fetchTienda());
</script>