<template>
  <Teleport to="body">
    <transition name="slide">
      <div v-if="isOpen" class="fixed inset-0 z-[300]">
        <div class="absolute inset-0 bg-ps-dark/80 backdrop-blur-sm" @click="$emit('close')"></div>
        <div class="absolute inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl flex flex-col h-full z-[310]">
          <div class="p-8 border-b flex justify-between items-center bg-white sticky top-0">
            <h2 class="text-2xl font-black text-ps-blue uppercase italic">Tu Carrito</h2>
            <button @click="$emit('close')" class="text-2xl">✕</button>
          </div>
          <div class="flex-grow p-8 overflow-y-auto">
            <div class="text-center py-20 opacity-20">
              <span class="text-6xl">🛒</span>
              <p class="font-black mt-4 text-xs uppercase">Carrito Vacío</p>
            </div>
          </div>
          <div class="p-8 border-t bg-slate-50 sticky bottom-0">
            <div class="flex justify-between mb-6">
              <span class="font-bold text-slate-400 uppercase text-[10px]">Total</span>
              <span class="text-3xl font-black text-ps-blue">$0</span>
            </div>
            <button class="w-full bg-ps-blue text-white py-5 rounded-[2rem] font-black uppercase tracking-widest shadow-xl">
              Pagar Ahora
            </button>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { watch } from 'vue';
const props = defineProps(['isOpen']);
const emit = defineEmits(['close']);

watch(() => props.isOpen, (newVal) => {
  document.body.style.overflow = newVal ? 'hidden' : '';
});
</script>

<style scoped>
.slide-enter-active, .slide-leave-active { transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-enter-from, .slide-leave-to { transform: translateX(100%); }
</style>