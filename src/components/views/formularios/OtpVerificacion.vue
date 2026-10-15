<script setup>
import { ref } from 'vue'
import api from '@/api/axios'

const props = defineProps({ telefono: String })
const emit = defineEmits(['verificado', 'volver'])

const enviado = ref(false)
const codigo = ref('')
const cargando = ref(false)
const error = ref('')
const reenviando = ref(false)

async function enviarCodigo() {
  cargando.value = true
  error.value = ''
  try {
    await api.post('/formularios/otp/solicitar', { telefono: props.telefono })
    enviado.value = true
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
    error.value = 'Código incorrecto o expirado'
  } finally {
    cargando.value = false
  }
}

async function reenviar() {
  reenviando.value = true
  codigo.value = ''
  error.value = ''
  try {
    await api.post('/formularios/otp/solicitar', { telefono: props.telefono })
  } catch (e) {
    error.value = 'No se pudo reenviar el código'
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

      <input v-model="codigo" type="number" maxlength="6" placeholder="_ _ _ _ _ _"
        class="w-full text-center text-3xl font-black tracking-[1rem] border-2 border-gray-200 rounded-2xl py-4 focus:outline-none focus:border-[#152C77]"
        @keyup.enter="verificar" />

      <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>

      <button @click="verificar" :disabled="cargando || codigo.length < 4"
        class="w-full py-3.5 bg-[#152C77] text-white font-black uppercase text-sm tracking-widest rounded-2xl disabled:opacity-50">
        {{ cargando ? 'Verificando...' : 'Verificar código' }}
      </button>

      <button @click="reenviar" :disabled="reenviando" class="text-xs text-gray-400 underline">
        {{ reenviando ? 'Reenviando...' : 'Reenviar código' }}
      </button>
    </div>

    <button @click="emit('volver')" class="text-xs text-gray-400 underline block w-full">
      ← Volver
    </button>
  </div>
</template>
