<script setup>
defineProps({
  pregunta: { type: String, required: true },
  // [texto, valor] de cada botón; por defecto Sí/No
  opciones: { type: Array, default: () => [['Sí', true], ['No', false]] }
})
// Empieza en null: "sin responder" no es lo mismo que "No"
const respuesta = defineModel({ default: null })
</script>

<template>
  <div>
    <p class="text-sm text-gray-700 mb-1.5">{{ pregunta }} <span class="text-red-500">*</span></p>
    <div class="grid grid-cols-2 gap-2">
      <button v-for="[texto, valor] in opciones" :key="texto" type="button"
        :aria-pressed="respuesta === valor" @click="respuesta = valor"
        :class="['py-2 rounded-xl border-2 text-sm font-bold transition-colors',
          respuesta === valor ? 'border-[#152C77] bg-[#152C77] text-white' : 'border-gray-200 text-gray-500']">
        {{ texto }}
      </button>
    </div>
    <slot v-if="respuesta === true" />
  </div>
</template>
