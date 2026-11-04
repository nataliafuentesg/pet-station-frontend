<script setup>
import { ref, computed, onUnmounted } from 'vue'
import api from '@/api/axios'

const props = defineProps({ telefono: String })
const emit = defineEmits(['verificado', 'volver'])

const enviado = ref(false)
const codigo = ref('')
const cargando = ref(false)
const error = ref('')
const reenviando = ref(false)
const aviso = ref('')
const segundos = ref(0)
const ESPERA_REENVIO_SEGUNDOS = 60
let intervalo = null

const cuentaRegresiva = computed(() => `${Math.floor(segundos.value / 60)}:${String(segundos.value % 60).padStart(2, '0')}`)

// Con la hora real y no contando ticks: el celular pausa los timers con la pantalla bloqueada
function iniciarEspera() {
  const hasta = Date.now() + ESPERA_REENVIO_SEGUNDOS * 1000
  clearInterval(intervalo)
  const tick = () => {
    segundos.value = Math.max(0, Math.ceil((hasta - Date.now()) / 1000))
    if (segundos.value === 0) clearInterval(intervalo)
  }
  tick()
  intervalo = setInterval(tick, 1000)
}

onUnmounted(() => clearInterval(intervalo))

async function enviarCodigo() {
  cargando.value = true
  error.value = ''
  try {
    await api.post('/formularios/otp/solicitar', { telefono: props.telefono })
    enviado.value = true
    iniciarEspera()
  } catch (e) {
    error.value = e.response?.data?.error || 'No se pudo enviar el código'
  } finally {
    cargando.value = false
  }
}

async function verificar() {
  cargando.value = true
  error.value = ''
  try {
    await api.post('/formularios/otp/verificar', { telefono: props.telefono, codigo: codigo.value })
    emit('verificado')
  } catch (e) {
    error.value = e.response?.status === 429 ? e.response.data.error : 'Código incorrecto o expirado'
  } finally {
    cargando.value = false
  }
}

async function reenviar() {
  reenviando.value = true
  codigo.value = ''
  error.value = ''
  aviso.value = ''
  try {
    await api.post('/formularios/otp/solicitar', { telefono: props.telefono })
    aviso.value = 'Te enviamos un código nuevo; el anterior ya no sirve.'
    iniciarEspera()
  } catch (e) {
    error.value = e.response?.data?.error || 'No se pudo reenviar el código'
  } finally {
    reenviando.value = false
  }
}
</script>

<template>
  <div class="bg-white rounded-2xl p-6 shadow-sm text-center space-y-5">
    <div class="text-4xl">📱</div>
    <div>
      <h2 class="font-black uppercase text-[#152C77] tracking-wide">Verifica tu identidad</h2>
      <p class="text-sm text-gray-500 mt-1">
        Enviaremos un código de 6 dígitos al WhatsApp
        <span class="font-bold text-gray-700">{{ telefono }}</span>
      </p>
    </div>

    <div v-if="!enviado">
      <button @click="enviarCodigo" :disabled="cargando"
        class="w-full py-3.5 bg-[#152C77] text-white font-black uppercase text-sm tracking-widest rounded-2xl disabled:opacity-50">
        {{ cargando ? 'Enviando...' : 'Enviar código por WhatsApp' }}
      </button>
    </div>

    <div v-else class="space-y-4">
      <p class="text-xs text-green-600 font-bold">✓ Código enviado por WhatsApp</p>

      <input v-model.trim="codigo" type="text" inputmode="numeric" autocomplete="one-time-code" maxlength="6" placeholder="_ _ _ _ _ _"
        class="w-full text-center text-3xl font-black tracking-[1rem] border-2 border-gray-200 rounded-2xl py-4 focus:outline-none focus:border-[#152C77]"
        @keyup.enter="verificar" />

      <p v-if="aviso && !error" class="text-green-600 text-sm">{{ aviso }}</p>
      <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>

      <button @click="verificar" :disabled="cargando || codigo.length < 4"
        class="w-full py-3.5 bg-[#152C77] text-white font-black uppercase text-sm tracking-widest rounded-2xl disabled:opacity-50">
        {{ cargando ? 'Verificando...' : 'Verificar código' }}
      </button>

      <p v-if="segundos > 0" class="text-xs text-gray-400">Reenviar en {{ cuentaRegresiva }}</p>
      <button v-else @click="reenviar" :disabled="reenviando" class="text-xs text-gray-400 underline">
        {{ reenviando ? 'Reenviando...' : 'Reenviar código' }}
      </button>
    </div>

    <button @click="emit('volver')" class="text-xs text-gray-400 underline block w-full">
      ← Volver
    </button>
  </div>
</template>
