<template>
  <div class="space-y-1.5">
    <p class="text-[9px] font-black uppercase tracking-widest text-white/30">¿Cuándo empezó?</p>
    <div class="flex flex-wrap gap-1.5">
      <button v-for="o in OPCIONES" :key="o.min" type="button" @click="$emit('update:modelValue', o.min)"
        class="text-[10px] font-bold rounded-full px-2.5 py-1 border transition-colors"
        :class="modelValue === o.min ? 'bg-white text-black border-white' : 'bg-white/5 border-white/10 text-white/50'">
        {{ o.label }}
      </button>
    </div>
  </div>
</template>

<script setup>
// Para cuando se les olvidó registrar en el momento; el backend acepta hasta 2 horas atrás
defineProps({ modelValue: { type: Number, default: 0 } })
defineEmits(['update:modelValue'])

const OPCIONES = [
  { min: 0, label: 'Ahora' },
  { min: 5, label: 'Hace 5 min' },
  { min: 10, label: '10 min' },
  { min: 15, label: '15 min' },
  { min: 30, label: '30 min' },
  { min: 60, label: '1 hora' },
]
</script>
