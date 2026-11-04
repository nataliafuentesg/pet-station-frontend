<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api/axios'

const props = defineProps({
  tipo: { type: String, required: true },
  terminos: { type: Object, default: null }
})
const emit = defineEmits(['cambio'])

const texto = ref(props.terminos)
const cargando = ref(!props.terminos)
const fallo = ref(false)
const aceptado = ref(false)

onMounted(() => {
  if (!props.terminos) cargar()
})

async function cargar() {
  cargando.value = true
  fallo.value = false
  try {
    const { data } = await api.get(`/formularios/terminos/${props.tipo}`)
    texto.value = data
  } catch {
    fallo.value = true
  } finally {
    cargando.value = false
  }
}

function alCambiar() {
  emit('cambio', { aceptado: aceptado.value, version: texto.value.version })
}
</script>

<template>
  <div class="bg-white rounded-2xl p-5 shadow-sm">
    <h2 class="font-black uppercase text-sm text-[#152C77] mb-3 tracking-wide">Autorización y términos</h2>

    <p v-if="cargando" class="text-sm text-gray-400">Cargando términos...</p>

    <div v-else-if="fallo" class="text-sm text-center space-y-2">
      <p class="text-red-500">No pudimos cargar los términos. No es posible firmar sin leerlos.</p>
      <button @click="cargar" class="font-bold text-[#152C77] underline">Reintentar</button>
    </div>

    <template v-else>
      <div v-for="bloque in texto.bloques" :key="bloque.texto" class="mb-4">
        <p class="text-sm text-gray-700 leading-relaxed mb-3">{{ bloque.texto }}</p>
        <component :is="bloque.numerado ? 'ol' : 'ul'"
          :class="['pl-5 space-y-2 text-sm text-gray-700 leading-relaxed', bloque.numerado ? 'list-decimal' : 'list-disc']">
          <li v-for="item in bloque.items" :key="item">{{ item }}</li>
        </component>
      </div>
      <label class="flex items-start gap-3 mt-5 p-3 rounded-xl border-2 border-[#152C77]/20 bg-[#152C77]/5 cursor-pointer">
        <input v-model="aceptado" @change="alCambiar" type="checkbox" class="w-5 h-5 mt-0.5 shrink-0 accent-[#152C77]" />
        <span class="text-sm font-bold text-[#152C77]">He leído y acepto la autorización y los términos anteriores.</span>
      </label>
    </template>
  </div>
</template>
