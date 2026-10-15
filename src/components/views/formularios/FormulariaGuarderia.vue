<script setup>
import { ref, reactive, computed } from 'vue'
import api from '@/api/axios'
import FirmaCanvas from './FirmaCanvas.vue'
import OtpVerificacion from './OtpVerificacion.vue'

const paso = ref(1)
const enviando = ref(false)
const error = ref('')

const form = reactive({
  cedula: '',
  nombreCliente: '',
  telefono: '',
  email: '',
  direccion: '',
  nombreMascota: '',
  especie: '',
  raza: '',
  color: '',
  edad: '',
  sexo: '',
  fechaIngreso: '',
  fechaSalida: '',
  alimentacion: '',
  observaciones: '',
  checklist: {
    vacunacion: false,
    desparasitado: false,
    esterilizado: false,
    braquicefala: false,
    temperamento: '',
    sociable: '',
    antecedentesAgresividad: false,
    tratamientoActual: '',
    alergias: '',
    estadoFisico: {
      ojos: 'normal',
      orejas: 'normal',
      boca: 'normal',
      piel: 'normal',
      pulpejos: 'normal',
      zonaPerianal: 'normal',
    }
  }
})

const firmaBase64 = ref('')
const otpVerificado = ref(false)

const paso1Valido = computed(() =>
  form.cedula && form.nombreCliente && form.telefono &&
  form.nombreMascota && form.fechaIngreso && form.fechaSalida
)

function onOtpVerificado() {
  otpVerificado.value = true
  paso.value = 3
}

async function enviar() {
  if (!firmaBase64.value) {
    error.value = 'Por favor firma el formulario'
    return
  }
  enviando.value = true
  error.value = ''
  try {
    await api.post('/formularios/guardar', {
      tipo: 'GUARDERIA',
      ...form,
      checklistJson: JSON.stringify(form.checklist),
      firmaBase64: firmaBase64.value,
      otpVerificado: true
    })
    paso.value = 4
  } catch (e) {
    error.value = e.response?.data?.error || 'Error al enviar el formulario'
  } finally {
    enviando.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="bg-[#152C77] text-white py-6 px-4 text-center">
      <img src="https://petstationvet.com/favicon.ico" alt="Pet Station" class="w-10 h-10 mx-auto mb-2 rounded-lg" />
      <h1 class="text-xl font-black uppercase tracking-wide">Pet Station</h1>
      <p class="text-sm opacity-80 mt-1">Registro de Guardería</p>
    </div>

    <div class="max-w-lg mx-auto px-4 py-6">

      <!-- Progreso -->
      <div class="flex items-center justify-between mb-8 text-xs font-bold uppercase tracking-widest">
        <div v-for="(label, i) in ['Datos', 'Verificar', 'Firma', 'Listo']" :key="i"
          :class="['flex flex-col items-center gap-1', paso > i + 1 ? 'text-green-600' : paso === i + 1 ? 'text-[#152C77]' : 'text-gray-300']">
          <div :class="['w-8 h-8 rounded-full flex items-center justify-center text-sm font-black',
            paso > i + 1 ? 'bg-green-500 text-white' : paso === i + 1 ? 'bg-[#152C77] text-white' : 'bg-gray-200']">
            {{ paso > i + 1 ? '✓' : i + 1 }}
          </div>
          <span class="hidden sm:block">{{ label }}</span>
        </div>
      </div>

      <!-- Paso 1: Datos -->
      <div v-if="paso === 1" class="space-y-5">
        <div class="bg-white rounded-2xl p-5 shadow-sm">
          <h2 class="font-black uppercase text-sm text-[#152C77] mb-4 tracking-wide">Datos del propietario</h2>
          <div class="space-y-3">
            <div>
              <label class="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Cédula *</label>
              <input v-model="form.cedula" type="number" placeholder="Número de cédula"
                class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#152C77]" />
            </div>
            <div>
              <label class="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Nombre completo *</label>
              <input v-model="form.nombreCliente" type="text" placeholder="Tu nombre"
                class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#152C77]" />
            </div>
            <div>
              <label class="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">WhatsApp *</label>
              <input v-model="form.telefono" type="tel" placeholder="3001234567"
                class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#152C77]" />
              <p class="text-xs text-gray-400 mt-1">Recibirás un código de verificación aquí</p>
            </div>
            <div>
              <label class="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Email</label>
              <input v-model="form.email" type="email" placeholder="opcional"
                class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#152C77]" />
            </div>
            <div>
              <label class="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Dirección</label>
              <input v-model="form.direccion" type="text" placeholder="opcional"
                class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#152C77]" />
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl p-5 shadow-sm">
          <h2 class="font-black uppercase text-sm text-[#152C77] mb-4 tracking-wide">Datos de la mascota</h2>
          <div class="grid grid-cols-2 gap-3">
            <div class="col-span-2">
              <label class="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Nombre *</label>
              <input v-model="form.nombreMascota" type="text" placeholder="Nombre de tu mascota"
                class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#152C77]" />
            </div>
            <div>
              <label class="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Especie</label>
              <select v-model="form.especie" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#152C77]">
                <option value="">Selecciona</option>
                <option>Perro</option>
                <option>Gato</option>
                <option>Otro</option>
              </select>
            </div>
            <div>
              <label class="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Sexo</label>
              <select v-model="form.sexo" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#152C77]">
                <option value="">Selecciona</option>
                <option>Macho</option>
                <option>Hembra</option>
              </select>
            </div>
            <div>
              <label class="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Raza</label>
              <input v-model="form.raza" type="text"
                class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#152C77]" />
            </div>
            <div>
              <label class="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Edad</label>
              <input v-model="form.edad" type="text" placeholder="Ej: 3 años"
                class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#152C77]" />
            </div>
            <div>
              <label class="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Color</label>
              <input v-model="form.color" type="text"
                class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#152C77]" />
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl p-5 shadow-sm">
          <h2 class="font-black uppercase text-sm text-[#152C77] mb-4 tracking-wide">Fechas de estadía *</h2>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Ingreso</label>
              <input v-model="form.fechaIngreso" type="date"
                class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#152C77]" />
            </div>
            <div>
              <label class="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Salida</label>
              <input v-model="form.fechaSalida" type="date"
                class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#152C77]" />
            </div>
          </div>
          <div class="mt-3">
            <label class="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Alimentación y rutina</label>
            <textarea v-model="form.alimentacion" rows="2"
              placeholder="Ej: 1 taza de croquetas dos veces al día, paseo en la mañana..."
              class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#152C77]"></textarea>
          </div>
        </div>

        <div class="bg-white rounded-2xl p-5 shadow-sm">
          <h2 class="font-black uppercase text-sm text-[#152C77] mb-4 tracking-wide">Condiciones de salud</h2>
          <div class="grid grid-cols-2 gap-3 mb-3">
            <label class="flex items-center gap-2 text-sm">
              <input type="checkbox" v-model="form.checklist.vacunacion" class="w-4 h-4 accent-[#152C77]" />
              Vacunas al día
            </label>
            <label class="flex items-center gap-2 text-sm">
              <input type="checkbox" v-model="form.checklist.desparasitado" class="w-4 h-4 accent-[#152C77]" />
              Desparasitado
            </label>
            <label class="flex items-center gap-2 text-sm">
              <input type="checkbox" v-model="form.checklist.esterilizado" class="w-4 h-4 accent-[#152C77]" />
              Esterilizado/a
            </label>
            <label class="flex items-center gap-2 text-sm">
              <input type="checkbox" v-model="form.checklist.braquicefala" class="w-4 h-4 accent-[#152C77]" />
              Raza braquicéfala
            </label>
            <label class="flex items-center gap-2 text-sm col-span-2">
              <input type="checkbox" v-model="form.checklist.antecedentesAgresividad" class="w-4 h-4 accent-[#152C77]" />
              Antecedentes de agresividad
            </label>
          </div>
          <div class="space-y-3">
            <div>
              <label class="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Temperamento</label>
              <select v-model="form.checklist.temperamento" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#152C77]">
                <option value="">Selecciona</option>
                <option>Dócil</option>
                <option>Ansioso</option>
                <option>Agresivo</option>
              </select>
            </div>
            <div>
              <label class="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Sociabilidad</label>
              <select v-model="form.checklist.sociable" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#152C77]">
                <option value="">Selecciona</option>
                <option>Muy sociable</option>
                <option>Sociable</option>
                <option>Poco sociable</option>
                <option>No sociable</option>
              </select>
            </div>
            <div>
              <label class="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Tratamiento médico actual</label>
              <input v-model="form.checklist.tratamientoActual" type="text" placeholder="Ej: Ninguno / antibióticos por 5 días"
                class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#152C77]" />
            </div>
            <div>
              <label class="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Alergias conocidas</label>
              <input v-model="form.checklist.alergias" type="text" placeholder="Ej: Ninguna"
                class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#152C77]" />
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl p-5 shadow-sm">
          <label class="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Observaciones adicionales</label>
          <textarea v-model="form.observaciones" rows="2" placeholder="Algo más que debamos saber..."
            class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#152C77]"></textarea>
        </div>

        <button @click="paso = 2" :disabled="!paso1Valido"
          class="w-full py-4 bg-[#152C77] text-white font-black uppercase text-sm tracking-widest rounded-2xl disabled:opacity-40 active:scale-95 transition-transform">
          Continuar → Verificar identidad
        </button>
      </div>

      <!-- Paso 2: OTP -->
      <OtpVerificacion v-if="paso === 2"
        :telefono="form.telefono"
        @verificado="onOtpVerificado"
        @volver="paso = 1" />

      <!-- Paso 3: Firma -->
      <div v-if="paso === 3" class="space-y-5">
        <div class="bg-white rounded-2xl p-5 shadow-sm">
          <h2 class="font-black uppercase text-sm text-[#152C77] mb-2 tracking-wide">Autorización y firma</h2>
          <p class="text-xs text-gray-500 mb-4 leading-relaxed">
            Al firmar confirmas que la información es verídica y autorizas a Pet Station para el cuidado de tu mascota. Esta firma tiene validez legal conforme a la Ley 527 de 1999.
          </p>
          <FirmaCanvas @firmado="v => firmaBase64 = v" />
        </div>

        <p v-if="error" class="text-red-500 text-sm text-center">{{ error }}</p>

        <button @click="enviar" :disabled="enviando || !firmaBase64"
          class="w-full py-4 bg-[#DE1F27] text-white font-black uppercase text-sm tracking-widest rounded-2xl disabled:opacity-40 active:scale-95 transition-transform">
          {{ enviando ? 'Enviando...' : 'Enviar formulario' }}
        </button>
      </div>

      <!-- Paso 4: Éxito -->
      <div v-if="paso === 4" class="text-center py-12 space-y-4">
        <div class="text-6xl">🏡</div>
        <h2 class="font-black uppercase text-xl text-[#152C77]">¡Registro enviado!</h2>
        <p class="text-gray-500 text-sm max-w-xs mx-auto">
          El registro de guardería de {{ form.nombreMascota }} quedó guardado. Te esperamos en Pet Station.
        </p>
        <a href="https://wa.me/573053462413" target="_blank"
          class="inline-block mt-4 px-6 py-3 bg-green-500 text-white font-bold rounded-2xl text-sm">
          Contactar por WhatsApp
        </a>
      </div>

    </div>
  </div>
</template>
