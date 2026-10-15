<script setup>
import { ref, onMounted } from 'vue'

const emit = defineEmits(['firmado'])
const canvas = ref(null)
const firmado = ref(false)
let ctx, drawing = false, lastX = 0, lastY = 0

onMounted(() => {
  ctx = canvas.value.getContext('2d')
  ctx.strokeStyle = '#152C77'
  ctx.lineWidth = 2.5
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  canvas.value.addEventListener('mousedown', start)
  canvas.value.addEventListener('mousemove', draw)
  canvas.value.addEventListener('mouseup', stop)
  canvas.value.addEventListener('mouseleave', stop)
  canvas.value.addEventListener('touchstart', startTouch, { passive: false })
  canvas.value.addEventListener('touchmove', drawTouch, { passive: false })
  canvas.value.addEventListener('touchend', stop)
})

function getPos(e) {
  const rect = canvas.value.getBoundingClientRect()
  const scaleX = canvas.value.width / rect.width
  const scaleY = canvas.value.height / rect.height
  return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY }
}

function start(e) {
  drawing = true
  const { x, y } = getPos(e)
  lastX = x; lastY = y
}

function draw(e) {
  if (!drawing) return
  const { x, y } = getPos(e)
  ctx.beginPath()
  ctx.moveTo(lastX, lastY)
  ctx.lineTo(x, y)
  ctx.stroke()
  lastX = x; lastY = y
  firmado.value = true
}

function stop() {
  if (drawing && firmado.value) {
    emit('firmado', canvas.value.toDataURL('image/png'))
  }
  drawing = false
}

function startTouch(e) {
  e.preventDefault()
  const touch = e.touches[0]
  start({ clientX: touch.clientX, clientY: touch.clientY })
}

function drawTouch(e) {
  e.preventDefault()
  const touch = e.touches[0]
  draw({ clientX: touch.clientX, clientY: touch.clientY })
}

function limpiar() {
  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)
  firmado.value = false
  emit('firmado', '')
}
</script>

<template>
  <div class="space-y-3">
    <p class="text-xs text-gray-500">Firma con tu dedo o el mouse en el espacio de abajo:</p>
    <div class="relative border-2 rounded-xl overflow-hidden" :class="firmado ? 'border-[#152C77]' : 'border-gray-200'">
      <canvas ref="canvas" width="600" height="180" class="w-full bg-gray-50 touch-none cursor-crosshair"></canvas>
      <div v-if="!firmado" class="absolute inset-0 flex items-center justify-center pointer-events-none">
        <p class="text-gray-300 text-sm font-bold">Firma aquí</p>
      </div>
    </div>
    <div class="flex justify-between items-center">
      <p v-if="firmado" class="text-xs text-green-600 font-bold">✓ Firma capturada</p>
      <p v-else class="text-xs text-gray-400">Sin firma</p>
      <button @click="limpiar" type="button" class="text-xs text-gray-400 underline">
        Limpiar
      </button>
    </div>
  </div>
</template>
