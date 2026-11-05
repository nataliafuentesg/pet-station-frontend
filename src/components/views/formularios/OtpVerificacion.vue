<script setup>
import { ref, computed, onUnmounted } from 'vue'
import api from '@/api/axios'

const props = defineProps({ telefono: String, token: String, correoRegistrado: String })
const emit = defineEmits(['verificado', 'volver'])

const enviado = ref(false)
const codigo = ref('')
const cargando = ref(false)
const error = ref('')
const reenviando = ref(false)
const aviso = ref('')
const canal = ref('WHATSAPP')
const pidiendoCorreo = ref(false)
const correo = ref('')
const correoConfirmado = ref('')
const enviandoCorreo = ref(false)
const correoValido = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.value.trim()))
// El link clínico solo admite el correo que registró el equipo
const hayRespaldo = computed(() => !props.token || !!props.correoRegistrado)
const intentoFallido = ref(false)
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

// Con token, el número lo pone el servidor: quien abre el link no puede escoger a dónde llega el código
const base = props.token ? '/formularios/firmar/otp' : '/formularios/otp'
const destino = props.token ? { token: props.token } : { telefono: props.telefono }

async function enviarCodigo() {
  cargando.value = true
  error.value = ''
  try {
    await api.post(`${base}/solicitar`, destino)
    enviado.value = true
    iniciarEspera()
  } catch (e) {
    error.value = e.response?.data?.error || 'No se pudo enviar el código'
    intentoFallido.value = true
  } finally {
    cargando.value = false
  }
}

async function verificar() {
  cargando.value = true
  error.value = ''
  try {
    const { data } = await api.post(`${base}/verificar`, { ...destino, codigo: codigo.value })
    emit('verificado', data)
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
    if (canal.value === 'CORREO') await pedirCodigoCorreo()
    else await api.post(`${base}/solicitar`, destino)
    aviso.value = 'Te enviamos un código nuevo; el anterior ya no sirve.'
    iniciarEspera()
  } catch (e) {
    error.value = e.response?.data?.error || 'No se pudo reenviar el código'
  } finally {
    reenviando.value = false
  }
}

function pedirCodigoCorreo() {
  return props.token
    ? api.post(`${base}/solicitar-correo`, destino)
    : api.post(`${base}/solicitar-correo`, { ...destino, email: correoConfirmado.value })
}

async function usarCorreo() {
  enviandoCorreo.value = true
  error.value = ''
  aviso.value = ''
  if (!props.token) correoConfirmado.value = correo.value.trim()
  try {
    await pedirCodigoCorreo()
    canal.value = 'CORREO'
    enviado.value = true
    pidiendoCorreo.value = false
    codigo.value = ''
    iniciarEspera()
  } catch (e) {
    error.value = e.response?.data?.error || 'No se pudo enviar el código al correo'
  } finally {
    enviandoCorreo.value = false
  }
}
</script>

<template>
  <div class="bg-white rounded-2xl p-6 shadow-sm text-center space-y-5">
    <div class="text-4xl">📱</div>
    <div>
      <h2 class="font-black uppercase text-[#152C77] tracking-wide">Verifica tu identidad</h2>
      <p v-if="canal === 'CORREO'" class="text-sm text-gray-500 mt-1">
        Enviamos un código de 6 dígitos a
        <span class="font-bold text-gray-700 break-all">{{ token ? correoRegistrado : correoConfirmado }}</span>.
        Revisa también la carpeta de spam.
      </p>
      <p v-else class="text-sm text-gray-500 mt-1">
        Enviaremos un código de 6 dígitos al WhatsApp
        <span class="font-bold text-gray-700">{{ telefono }}</span>
      </p>
    </div>

    <div v-if="!enviado" class="space-y-3">
      <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>
      <button @click="enviarCodigo" :disabled="cargando"
        class="w-full py-3.5 bg-[#152C77] text-white font-black uppercase text-sm tracking-widest rounded-2xl disabled:opacity-50">
        {{ cargando ? 'Enviando...' : 'Enviar código por WhatsApp' }}
      </button>
    </div>

    <div v-else class="space-y-4">
      <p class="text-xs text-green-600 font-bold">✓ Código enviado {{ canal === 'CORREO' ? 'a tu correo' : 'por WhatsApp' }}</p>

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

    <!-- Respaldo: aparece si el envío falla o pasada la espera, cuando el WhatsApp no llegó -->
    <div v-if="canal === 'WHATSAPP' && (intentoFallido || (enviado && segundos === 0))" class="border-t border-gray-100 pt-4 space-y-3">
      <template v-if="hayRespaldo">
        <button v-if="!pidiendoCorreo && token" @click="usarCorreo" :disabled="enviandoCorreo" class="text-sm font-bold text-[#152C77] underline">
          {{ enviandoCorreo ? 'Enviando...' : `¿No te llegó? Enviar el código a ${correoRegistrado}` }}
        </button>
        <button v-else-if="!pidiendoCorreo" @click="pidiendoCorreo = true" class="text-sm font-bold text-[#152C77] underline">
          ¿No te llegó? Enviar el código a mi correo
        </button>
        <template v-else>
          <input v-model="correo" type="email" autocomplete="email" placeholder="tucorreo@ejemplo.com"
            class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#152C77]" />
          <p class="text-xs text-gray-400">Revisa que esté bien escrito. Si firmas por correo, en el documento quedará que el número no se verificó.</p>
          <button @click="usarCorreo" :disabled="enviandoCorreo || !correoValido"
            class="w-full py-3 border-2 border-[#152C77] text-[#152C77] font-black uppercase text-xs tracking-widest rounded-2xl disabled:opacity-40">
            {{ enviandoCorreo ? 'Enviando...' : 'Enviar código al correo' }}
          </button>
        </template>
      </template>
      <p v-else class="text-sm text-gray-500">Si el código no te llega, avísale al equipo de Pet Station para firmar de otra forma.</p>
    </div>

    <button v-if="!token" @click="emit('volver')" class="text-xs text-gray-400 underline block w-full">
      ← Volver
    </button>
  </div>
</template>
