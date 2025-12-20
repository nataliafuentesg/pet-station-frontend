<template>
  <div class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group flex flex-col h-full">
    <div class="relative">
      <span v-if="product.category === 'medicine'" 
            class="absolute top-3 left-3 bg-ps-red text-white text-[10px] font-bold px-2 py-1 rounded-md z-10 shadow-lg uppercase">
        Farmacia
      </span>
      <div class="aspect-square bg-slate-50 flex items-center justify-center p-6 overflow-hidden">
        <img :src="product.image" :alt="product.name" class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
      </div>
    </div>

    <div class="p-5 flex flex-col flex-grow">
      <div class="flex justify-between items-start mb-1">
        <p class="text-[10px] text-slate-400 font-black uppercase tracking-widest">{{ product.brand }}</p>
        <span class="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold uppercase">{{ product.tag }}</span>
      </div>
      
      <h3 class="text-ps-blue font-bold text-lg leading-tight mb-2 flex-grow">{{ product.name }}</h3>
      
      <div class="mt-4 flex items-center justify-between">
        <div class="flex flex-col">
          <span class="text-[10px] text-slate-400 font-bold">VALOR</span>
          <span class="text-2xl font-black text-ps-blue">${{ product.price.toLocaleString() }}</span>
        </div>
        
        <button 
          @click="cart.addToCart(product)"
          class="bg-ps-blue hover:bg-ps-red text-white p-3 rounded-xl transition-all active:scale-90 shadow-md shadow-ps-blue/10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '../../stores/cart';
const cart = useCartStore();
defineProps(['product']);
</script>