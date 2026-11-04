<script setup>
defineProps({ email: { type: String, required: true } })
defineEmits(['confirmar', 'corregir'])
</script>

<template>
  <div class="bg-white rounded-2xl p-6 shadow-sm text-center space-y-5">
    <div class="text-4xl">📧</div>
    <div>
      <h2 class="font-black uppercase text-[#152C77] tracking-wide">Confirma tu correo</h2>
      <p class="text-sm text-gray-500 mt-2">Enviaremos tu copia firmada a:</p>
      <p class="text-lg font-black text-gray-800 mt-1 break-all">{{ email }}</p>
      <p class="text-sm text-gray-500 mt-2">¿Está bien escrito?</p>
    </div>
    <button @click="$emit('confirmar')"
      class="w-full py-3.5 bg-[#152C77] text-white font-black uppercase text-sm tracking-widest rounded-2xl active:scale-95 transition-transform">
      Sí, es correcto
    </button>
    <button @click="$emit('corregir')" class="text-sm font-bold text-gray-500 underline">Corregir</button>
  </div>
</template>
