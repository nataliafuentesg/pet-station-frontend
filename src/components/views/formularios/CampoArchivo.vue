<script setup>
import { ref } from 'vue'

defineProps({
  etiqueta: { type: String, required: true },
  obligatorio: { type: Boolean, default: false }
})
// { dataUrl, nombre, esPdf } o null
const archivo = defineModel({ default: null })
const procesando = ref(false)
const error = ref('')
const MAX_PDF = 8 * 1024 * 1024

// Las fotos del celular pesan varios MB: se reducen a 1600 px, que alcanza para leer el carnet o la fórmula
function reducirFoto(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      const escala = Math.min(1, 1600 / Math.max(img.width, img.height))
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(img.width * escala)
      canvas.height = Math.round(img.height * escala)
      const ctx = canvas.getContext('2d')
      ctx.fillStyle = '#fff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(url)
      resolve(canvas.toDataURL('image/jpeg', 0.82))
    }
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('foto')) }
    img.src = url
  })
}

function leerPdf(file) {
  return new Promise((resolve, reject) => {
    const lector = new FileReader()
    lector.onload = () => resolve(lector.result)
    lector.onerror = reject
    lector.readAsDataURL(file)
  })
}

async function alElegir(e) {
  const file = e.target.files?.[0]
  e.target.value = ''
  if (!file) return
  error.value = ''
  const esPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
  if (esPdf && file.size > MAX_PDF) {
    error.value = 'El PDF pesa demasiado (máximo 8 MB). Puedes tomarle una foto en su lugar.'
    return
  }
  procesando.value = true
  try {
    archivo.value = { dataUrl: esPdf ? await leerPdf(file) : await reducirFoto(file), nombre: file.name, esPdf }
  } catch {
    error.value = 'No pudimos abrir ese archivo. Intenta con una foto (JPG o PNG) o un PDF.'
  } finally {
    procesando.value = false
  }
}
</script>

<template>
  <div class="mt-2">
    <p class="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
      {{ etiqueta }} <span v-if="obligatorio" class="text-red-500">*</span>
    </p>
    <div v-if="archivo" class="flex items-center gap-3 p-2 rounded-xl border border-gray-200 bg-gray-50">
      <img v-if="!archivo.esPdf" :src="archivo.dataUrl" alt="" class="w-14 h-14 object-cover rounded-lg shrink-0" />
      <span v-else class="w-14 h-14 rounded-lg bg-red-50 text-red-600 font-black text-xs flex items-center justify-center shrink-0">PDF</span>
      <span class="text-sm text-gray-700 truncate flex-1">{{ archivo.nombre }}</span>
      <button type="button" @click="archivo = null" class="text-xs font-bold text-red-500 px-2 shrink-0">Quitar</button>
    </div>
    <label v-else :class="['flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed text-sm font-bold cursor-pointer',
      procesando ? 'border-gray-200 text-gray-400' : 'border-[#152C77]/30 text-[#152C77] bg-[#152C77]/5']">
      <input type="file" accept="image/*,application/pdf" class="sr-only" :disabled="procesando" @change="alElegir" />
      {{ procesando ? 'Cargando...' : '📷 Tomar foto o subir archivo' }}
    </label>
    <p v-if="error" class="text-xs text-red-500 mt-1">{{ error }}</p>
  </div>
</template>
