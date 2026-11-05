<script setup>
const cedula = defineModel({ default: '' })
// Últimos 4 dígitos de la cédula guardada. El servidor no entrega el número completo.
const guardada = defineModel('guardada', { default: '' })
</script>

<template>
  <div>
    <label class="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Cédula *</label>
    <div v-if="guardada" class="flex items-center justify-between border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-50">
      <span class="text-gray-700">Terminada en {{ guardada }}</span>
      <button type="button" @click="guardada = ''" class="text-xs font-bold text-[#152C77] underline">Cambiar</button>
    </div>
    <input v-else v-model="cedula" type="number" placeholder="Número de cédula"
      class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#152C77]" />
  </div>
</template>
