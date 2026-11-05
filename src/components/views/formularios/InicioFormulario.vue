<script setup>
import { ref, computed } from 'vue'
import api from '@/api/axios'
import OtpVerificacion from './OtpVerificacion.vue'

const emit = defineEmits(['listo'])

const paso = ref('telefono') // telefono | otp | mascota
const telefono = ref('')
const verificacion = ref(null)
const perfil = ref(null)

const telefonoLimpio = computed(() => telefono.value.replace(/\D/g, ''))
const telefonoValido = computed(() => telefonoLimpio.value.length >= 10)
const primerNombre = computed(() => perfil.value?.nombreCliente?.trim().split(/\s+/)[0] || '')

async function onVerificado(datos) {
  verificacion.value = datos
  try {
    const { data } = await api.post('/formularios/perfil', { telefono: telefonoLimpio.value, sesion: datos.sesion })
    if (data.encontrado) {
      perfil.value = data
      if (data.mascotas?.length) {
        paso.value = 'mascota'
        return
      }
    }
  } catch {
    // Sin datos guardados se puede seguir: solo hay que escribirlos
  }
  terminar(null)
}

function terminar(mascota) {
  emit('listo', {
    telefono: telefonoLimpio.value,
    sesion: verificacion.value.sesion,
    correoVerificado: verificacion.value.correo || '',
    perfil: perfil.value,
    mascota
  })
}
</script>

<template>
  <div v-if="paso === 'telefono'" class="bg-white rounded-2xl p-6 shadow-sm space-y-4">
    <div>
      <h2 class="font-black uppercase text-[#152C77] tracking-wide">Empecemos por tu WhatsApp</h2>
      <p class="text-sm text-gray-500 mt-1">Te enviaremos un código. Si ya has venido, tus datos aparecerán listos.</p>
    </div>
    <div>
      <label class="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">WhatsApp *</label>
      <input v-model="telefono" type="tel" autocomplete="tel" placeholder="3001234567" @keyup.enter="telefonoValido && (paso = 'otp')"
        class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#152C77]" />
    </div>
    <button @click="paso = 'otp'" :disabled="!telefonoValido"
      class="w-full py-3.5 bg-[#152C77] text-white font-black uppercase text-sm tracking-widest rounded-2xl disabled:opacity-40">
      Continuar
    </button>
  </div>

  <OtpVerificacion v-else-if="paso === 'otp'" :telefono="telefonoLimpio" @verificado="onVerificado" @volver="paso = 'telefono'" />

  <div v-else class="bg-white rounded-2xl p-6 shadow-sm space-y-3">
    <div>
      <h2 class="font-black uppercase text-[#152C77] tracking-wide">Hola{{ primerNombre ? `, ${primerNombre}` : '' }}</h2>
      <p class="text-sm text-gray-500 mt-1">¿Para quién es el servicio?</p>
    </div>
    <button v-for="m in perfil.mascotas" :key="m.nombreMascota" @click="terminar(m)"
      class="w-full text-left p-3 rounded-xl border-2 border-gray-200 hover:border-[#152C77] transition-colors">
      <span class="font-bold text-sm text-gray-800">{{ m.nombreMascota }}</span>
      <span v-if="m.raza || m.especie" class="block text-xs text-gray-400">{{ [m.especie, m.raza].filter(Boolean).join(' · ') }}</span>
    </button>
    <button @click="terminar(null)" class="w-full p-3 rounded-xl border-2 border-dashed border-gray-300 text-sm font-bold text-gray-500">
      + Otra mascota
    </button>
  </div>
</template>
