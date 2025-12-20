<template>
  <div class="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100 relative overflow-hidden">
    <div class="absolute top-0 right-0 p-8 opacity-10 text-6xl rotate-12">🦴</div>

    <div class="relative z-10">
      <h2 class="text-3xl font-black text-ps-blue mb-2 uppercase tracking-tighter italic">Nueva Mascota</h2>
      <p class="text-slate-400 text-sm font-medium mb-8 uppercase tracking-widest">Paso 1: Información Básica</p>
      
      <div class="space-y-6">
        <div class="group">
          <label class="text-[10px] font-black text-slate-400 uppercase ml-2 mb-1 block group-focus-within:text-ps-red transition-colors">¿Cómo se llama?</label>
          <input type="text" v-model="form.name" class="w-full bg-slate-50 border-2 border-transparent focus:border-ps-red focus:bg-white rounded-2xl p-4 transition-all outline-none font-bold text-ps-blue" placeholder="Ej: Max">
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-[10px] font-black text-slate-400 uppercase ml-2 mb-1 block">Especie</label>
            <div class="flex gap-2 bg-slate-50 p-1.5 rounded-2xl">
              <button @click="form.type = 'dog'" :class="['flex-1 py-3 rounded-xl text-sm font-bold transition-all', form.type === 'dog' ? 'bg-ps-blue text-white shadow-md' : 'text-slate-400']">Perro</button>
              <button @click="form.type = 'cat'" :class="['flex-1 py-3 rounded-xl text-sm font-bold transition-all', form.type === 'cat' ? 'bg-ps-blue text-white shadow-md' : 'text-slate-400']">Gato</button>
            </div>
          </div>
          <div>
            <label class="text-[10px] font-black text-slate-400 uppercase ml-2 mb-1 block">Peso (Kg)</label>
            <input type="number" v-model="form.weight" class="w-full bg-slate-50 border-2 border-transparent focus:border-ps-blue focus:bg-white rounded-2xl p-4 transition-all outline-none font-bold text-ps-blue">
          </div>
        </div>

        <div>
          <label class="text-[10px] font-black text-slate-400 uppercase ml-2 mb-1 block">Nivel de estrés ante extraños</label>
          <div class="flex gap-2">
            <button v-for="lvl in ['Bajo', 'Medio', 'Alto']" :key="lvl"
                    @click="form.stress = lvl"
                    :class="['flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all border-2', 
                             form.stress === lvl ? 'border-ps-red bg-ps-red/5 text-ps-red' : 'border-slate-100 text-slate-400']">
              {{ lvl }}
            </button>
          </div>
        </div>

        <button 
          @click="savePet"
          :disabled="!form.name"
          class="w-full bg-ps-blue text-white font-black py-5 rounded-2xl mt-4 shadow-xl shadow-ps-blue/30 uppercase tracking-widest active:scale-95 transition-all disabled:opacity-30"
        >
          Crear Perfil Médico
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
const emit = defineEmits(['completed']);

const form = reactive({
  name: '',
  type: 'dog',
  weight: '',
  stress: 'Bajo'
});

const savePet = () => {
  emit('completed', { ...form });
};
</script>