<template>
  <div class="min-h-screen bg-slate-50 font-sans text-slate-900">
    
    <ProfileSelector 
      v-if="showSelector" 
      @selected="handlePetSelection" 
      @createNew="isOnboardingOpen = true"
    />

    <div v-else class="flex flex-col min-h-screen animate-fade-in">
      <TheNavbar 
        :activePet="activePet" 
        @openSelector="showSelector = true" 
        @openCart="isCartOpen = true" 
      />

      <nav class="bg-white border-b border-slate-200 sticky top-20 z-30">
        <div class="max-w-7xl mx-auto px-6 overflow-x-auto flex gap-8 py-4 no-scrollbar">
          <a href="#servicios" class="text-xs font-black uppercase tracking-widest text-ps-blue hover:text-ps-red transition-colors whitespace-nowrap">🩺 Servicios Médicos</a>
          <a href="#farmacia" class="text-xs font-black uppercase tracking-widest text-ps-blue hover:text-ps-red transition-colors whitespace-nowrap">💊 Farmacia Especializada</a>
          <a href="#bienestar" class="text-xs font-black uppercase tracking-widest text-ps-blue hover:text-ps-red transition-colors whitespace-nowrap">✂️ Peluquería & Spa</a>
          <a href="#guarderia" class="text-xs font-black uppercase tracking-widest text-ps-blue hover:text-ps-red transition-colors whitespace-nowrap">🏡 Guardería</a>
        </div>
      </nav>

      <main class="max-w-7xl mx-auto p-6 flex-grow w-full space-y-16">
        
        <section class="bg-ps-blue rounded-[3rem] p-10 md:p-20 text-white relative overflow-hidden shadow-2xl">
          <div class="relative z-10 max-w-2xl">
            <div class="flex items-center gap-2 bg-ps-red px-3 py-1 rounded-full w-fit mb-6">
              <span class="animate-pulse w-2 h-2 bg-white rounded-full"></span>
              <span class="text-[10px] font-black uppercase">Atención Prioritaria Pet Station</span>
            </div>
            <h1 class="text-5xl md:text-7xl font-black mb-6 leading-tight uppercase tracking-tighter italic">
              Bienestar real para tu <span class="text-ps-red">{{ activePetName }}</span>.
            </h1>
            <p class="text-xl text-white/70 mb-10 leading-relaxed">
              Desde cirugías de alta complejidad hasta sesiones de spa sin estrés. 
              Priorizamos la comodidad de tu mejor amigo.
            </p>
            <div class="flex flex-wrap gap-4">
              <button class="bg-white text-ps-blue font-black px-8 py-4 rounded-2xl hover:bg-ps-red hover:text-white transition-all shadow-xl uppercase tracking-tighter">
                Agendar Cita Médica
              </button>
            </div>
          </div>
          <div class="absolute right-[-5%] bottom-[-10%] opacity-10 text-[25rem] pointer-events-none select-none">
            {{ activePet === 'dog' ? '🐶' : activePet === 'cat' ? '🐱' : '🐾' }}
          </div>
        </section>

        <section id="servicios" class="scroll-mt-40">
          <ServiceGrid :activePet="activePet" />
        </section>

        <section id="prevencion">
          <HealthKit />
        </section>

        <section>
          <PrescriptionUpload />
        </section>

        <section id="farmacia" class="scroll-mt-40">
          <div class="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <h2 class="text-4xl font-black text-ps-blue uppercase tracking-tighter border-l-8 border-ps-red pl-4">
                Farmacia & Productos
              </h2>
              <p class="text-slate-500 mt-2 font-medium">Solo marcas certificadas para tu {{ activePetName }}.</p>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <ProductCard 
              v-for="product in filteredProducts" 
              :key="product.id" 
              :product="product" 
            />
          </div>
        </section>
      </main>

      <footer class="bg-white border-t border-slate-200 py-12 mt-20">
        <div class="max-w-7xl mx-auto px-6 text-center">
          <p class="text-slate-400 text-sm font-bold uppercase tracking-widest italic">Pet Station — Medicina Veterinaria de Alta Gama</p>
        </div>
      </footer>
    </div>

    <CartDrawer :isOpen="isCartOpen" @close="isCartOpen = false" />

    <div v-if="isOnboardingOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ps-dark/90 backdrop-blur-md">
      <div class="relative w-full max-w-lg">
        <button @click="isOnboardingOpen = false" class="absolute -top-12 right-0 text-white text-3xl font-bold">✕</button>
        <PetOnboarding @completed="handleOnboardingComplete" />
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { products } from './mocks/products';

import ProfileSelector from './components/home/ProfileSelector.vue';
import TheNavbar from './components/layout/TheNavbar.vue';
import ProductCard from './components/products/ProductCard.vue';
import CartDrawer from './components/cart/CartDrawer.vue';
import HealthKit from './components/home/HealthKit.vue';
import PrescriptionUpload from './components/home/PrescriptionUpload.vue';
import ServiceGrid from './components/services/ServiceGrid.vue';
import PetOnboarding from './components/auth/PetOnboarding.vue';

const showSelector = ref(true);
const activePet = ref(null);
const isCartOpen = ref(false);
const isOnboardingOpen = ref(false);

const activePetName = computed(() => {
  if (activePet.value === 'dog') return 'Perro';
  if (activePet.value === 'cat') return 'Gato';
  return 'Mascota';
});

const filteredProducts = computed(() => {
  if (!activePet.value) return products;
  return products.filter(p => p.type === activePet.value || p.type === 'both');
});

const handlePetSelection = (petType) => {
  activePet.value = petType;
  showSelector.value = false;
};

const handleOnboardingComplete = (data) => {
  isOnboardingOpen.value = false;
  activePet.value = data.type;
  showSelector.value = false;
};
</script>