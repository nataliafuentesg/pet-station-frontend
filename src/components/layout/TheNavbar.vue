<template>
  <nav class="bg-ps-blue text-white shadow-lg sticky top-0 z-40">
    <div class="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="bg-white p-1 rounded-lg">
          <span class="text-ps-blue font-black text-xl italic tracking-tighter">PET<span class="text-ps-red">STATION</span></span>
        </div>
      </div>

      <div class="flex items-center gap-4">
        <button @click="$emit('openSelector')" class="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-xl hover:bg-white/20 transition-all border border-white/10">
          <span class="text-xl">{{ activePet === 'dog' ? '🐶' : '🐱' }}</span>
          <span class="hidden sm:block text-sm font-bold tracking-wide uppercase">Perfil</span>
        </button>

        <button @click="$emit('openCart')" class="bg-ps-red p-2.5 rounded-full cursor-pointer relative hover:scale-110 active:scale-95 transition-all shadow-lg shadow-ps-red/20">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span v-if="cart.totalItems > 0" class="absolute -top-1 -right-1 bg-white text-ps-red text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full shadow-sm">
            {{ cart.totalItems }}
          </span>
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useCartStore } from '../../stores/cart';
const cart = useCartStore();
defineProps(['activePet']);
defineEmits(['openSelector', 'openCart']);
</script>