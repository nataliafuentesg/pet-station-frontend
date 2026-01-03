<template>
  <div class="fixed inset-0 z-[90] bg-ps-dark flex flex-col items-center p-6 overflow-y-auto">
    <div class="w-full max-w-6xl text-center pt-24 pb-32">
      <h2 class="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-12 italic text-white leading-tight">
        Bienvenido de nuevo. <br/>
        ¿Con quién vamos a <span class="text-ps-red">trabajar</span> hoy?
      </h2>
      
      <ProfileSelector 
        :availablePets="tutorData?.mascotas || []" 
        :tutorLogueado="!!tutorData"
        @selected="onPetSelected" 
        @createNew="$emit('open-onboarding')"
      />

      <div class="mt-12">
        <p class="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 italic">
          Gestión de expedientes • Viajes • Estética • Salud
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import ProfileSelector from '../components/home/ProfileSelector.vue';
import { useRouter } from 'vue-router';

const props = defineProps(['tutorData']);
const emit = defineEmits(['selected', 'open-onboarding']);
const router = useRouter();

const onPetSelected = (pet) => {
  emit('selected', pet);
  // Al seleccionar, lo llevamos al Panel General (Dashboard)
  router.push('/panel'); 
};
</script>