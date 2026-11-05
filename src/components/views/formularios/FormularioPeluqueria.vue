<script setup>
import { ref, reactive, computed } from 'vue'
import api from '@/api/axios'
import FirmaCanvas from './FirmaCanvas.vue'
import InicioFormulario from './InicioFormulario.vue'
import CampoCedula from './CampoCedula.vue'
import { aplicarDatosGuardados } from './datosGuardados'
import TerminosFormulario from './TerminosFormulario.vue'
import ConfirmarCorreo from './ConfirmarCorreo.vue'

const paso = ref(1) // 1: verificar, 2: datos, 3: firma, 4: éxito
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
  servicioSolicitado: '',
  instruccionesCorte: '',
  observaciones: '',
  checklist: {
    vacunacion: false,
    alergias: '',
    braquicefala: false,
    temperamento: '',
  }
})

const servicioOtro = ref('')
const firmaBase64 = ref('')
const sesion = ref('')
const cedulaGuardada = ref('')
const correoVerificado = ref('')
const versionAceptada = ref('')
const terminos = ref({ aceptado: false, version: '' })
const radicado = ref('')
const copiaEnviada = ref(false)
const confirmandoCorreo = ref(false)
const tieneCorreo = computed(() => !!form.email?.trim())
const correoValido = computed(() => !tieneCorreo.value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))

function continuarDatos() {
  // Si el código llegó a este correo, ya sabemos que está bien escrito
  if (tieneCorreo.value && form.email.trim().toLowerCase() !== correoVerificado.value) confirmandoCorreo.value = true
  else paso.value = 3
}

function correoConfirmado() {
  confirmandoCorreo.value = false
  paso.value = 3
}

const servicios = [
  'Baño',
  'Corte',
  'Baño + Corte',
  'Deslanado',
  'Corte higiénico',
  'Corte por nudos',
  'Otro'
]

const paso1Valido = computed(() =>
  (form.cedula || cedulaGuardada.value) && form.nombreCliente && form.telefono &&
  form.nombreMascota && form.servicioSolicitado
)

function onTerminos(valor) {
  terminos.value = valor
  if (!valor.aceptado) firmaBase64.value = ''
}

function onIdentificado(datos) {
  aplicarDatosGuardados(form, datos)
  sesion.value = datos.sesion
  correoVerificado.value = datos.correoVerificado
  cedulaGuardada.value = datos.perfil?.cedulaOculta || ''
  versionAceptada.value = datos.perfil?.terminosAceptados?.PELUQUERIA || ''
  paso.value = 2
}

async function enviar() {
  if (!firmaBase64.value) {
    error.value = 'Por favor firma el formulario'
    return
  }
  enviando.value = true
  error.value = ''
  try {
    const { data } = await api.post('/formularios/guardar', {
      tipo: 'PELUQUERIA',
      ...form,
      servicioSolicitado: form.servicioSolicitado === 'Otro' ? `Otro: ${servicioOtro.value}` : form.servicioSolicitado,
      checklistJson: JSON.stringify(form.checklist),
      firmaBase64: firmaBase64.value,
      aceptaTerminos: terminos.value.aceptado,
      versionTerminos: terminos.value.version,
      emailConfirmado: tieneCorreo.value,
      usarCedulaGuardada: !!cedulaGuardada.value,
      sesion: sesion.value
    })
    radicado.value = data.radicado
    copiaEnviada.value = data.copiaEnviada
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
    <!-- Header -->
    <div class="bg-[#152C77] text-white py-6 px-4 text-center">
      <img src="/images/logo-pet-station.png" alt="Pet Station" class="w-10 h-10 mx-auto mb-2 rounded-lg" />
      <h1 class="text-xl font-black uppercase tracking-wide">Pet Station</h1>
      <p class="text-sm opacity-80 mt-1">Formato Peluquería</p>
    </div>

    <div class="max-w-lg mx-auto px-4 py-6">

      <!-- Progreso -->
      <div class="flex items-center justify-between mb-8 text-xs font-bold uppercase tracking-widest">
        <div v-for="(label, i) in ['Verificar', 'Datos', 'Firma', 'Listo']" :key="i"
          :class="['flex flex-col items-center gap-1', paso > i + 1 ? 'text-green-600' : paso === i + 1 ? 'text-[#152C77]' : 'text-gray-300']">
          <div :class="['w-8 h-8 rounded-full flex items-center justify-center text-sm font-black',
            paso > i + 1 ? 'bg-green-500 text-white' : paso === i + 1 ? 'bg-[#152C77] text-white' : 'bg-gray-200']">
            {{ paso > i + 1 ? '✓' : i + 1 }}
          </div>
          <span class="hidden sm:block">{{ label }}</span>
        </div>
      </div>

      <!-- Paso 1: Verificar -->
      <InicioFormulario v-if="paso === 1" @listo="onIdentificado" />

      <!-- Paso 2: Datos -->
      <ConfirmarCorreo v-if="paso === 2 && confirmandoCorreo" :email="form.email.trim()"
        @confirmar="correoConfirmado" @corregir="confirmandoCorreo = false" />

      <div v-if="paso === 2 && !confirmandoCorreo" class="space-y-5">
        <div class="bg-white rounded-2xl p-5 shadow-sm">
          <h2 class="font-black uppercase text-sm text-[#152C77] mb-4 tracking-wide">Datos del propietario</h2>
          <div class="space-y-3">
            <CampoCedula v-model="form.cedula" v-model:guardada="cedulaGuardada" />
            <div>
              <label class="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Nombre completo *</label>
              <input v-model="form.nombreCliente" type="text" placeholder="Tu nombre"
                class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#152C77]" />
            </div>
            <div>
              <label class="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">WhatsApp</label>
              <p class="border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-50 text-gray-700">{{ form.telefono }}</p>
            </div>
            <div>
              <label class="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Email</label>
              <input v-model="form.email" type="email" placeholder="Para enviarte copia del documento firmado"
                class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#152C77]" />
              <p v-if="!correoValido" class="text-xs text-red-500 mt-1">Revisa el correo, parece incompleto.</p>
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
              <input v-model="form.raza" type="text" placeholder="Ej: Poodle"
                class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#152C77]" />
            </div>
            <div>
              <label class="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Edad</label>
              <input v-model="form.edad" type="text" placeholder="Ej: 2 años"
                class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#152C77]" />
            </div>
            <div>
              <label class="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Color</label>
              <input v-model="form.color" type="text" placeholder="Ej: Blanco"
                class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#152C77]" />
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl p-5 shadow-sm">
          <h2 class="font-black uppercase text-sm text-[#152C77] mb-4 tracking-wide">Servicio solicitado *</h2>
          <div class="grid grid-cols-2 gap-2">
            <label v-for="s in servicios" :key="s"
              :class="['flex items-center gap-2 p-3 rounded-xl border-2 cursor-pointer text-sm font-medium transition-colors',
                form.servicioSolicitado === s ? 'border-[#152C77] bg-[#152C77]/5 text-[#152C77]' : 'border-gray-200 text-gray-600']">
              <input type="radio" :value="s" v-model="form.servicioSolicitado" class="sr-only" />
              {{ s }}
            </label>
          </div>
          <div v-if="form.servicioSolicitado === 'Otro'" class="mt-3">
            <label class="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">¿Cuál servicio?</label>
            <input v-model="servicioOtro" type="text" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#152C77]" />
          </div>
          <div class="mt-3">
            <label class="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Instrucciones de corte (si aplica)</label>
            <textarea v-model="form.instruccionesCorte" rows="2" placeholder="Ej: Corte cachorro, sin cortar orejas..."
              class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#152C77]"></textarea>
          </div>
        </div>

        <div class="bg-white rounded-2xl p-5 shadow-sm">
          <h2 class="font-black uppercase text-sm text-[#152C77] mb-4 tracking-wide">Preguntas de ingreso</h2>
          <div class="space-y-3">
            <label class="flex items-center gap-3 text-sm">
              <input type="checkbox" v-model="form.checklist.vacunacion" class="w-4 h-4 accent-[#152C77]" />
              <span>Tiene el esquema de vacunación completo</span>
            </label>
            <label class="flex items-center gap-3 text-sm">
              <input type="checkbox" v-model="form.checklist.braquicefala" class="w-4 h-4 accent-[#152C77]" />
              <span>Raza braquicéfala (nariz achatada)</span>
            </label>
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
              <label class="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Alergias o condiciones médicas importantes</label>
              <input v-model="form.checklist.alergias" type="text" placeholder="Ej: Ninguna / champú con fragancia"
                class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#152C77]" />
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl p-5 shadow-sm">
          <label class="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Observaciones adicionales</label>
          <textarea v-model="form.observaciones" rows="2" placeholder="Algo más que debamos saber..."
            class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#152C77]"></textarea>
        </div>

        <button @click="continuarDatos" :disabled="!paso1Valido || !correoValido"
          class="w-full py-4 bg-[#152C77] text-white font-black uppercase text-sm tracking-widest rounded-2xl disabled:opacity-40 active:scale-95 transition-transform">
          Continuar → Firmar
        </button>
      </div>

      <!-- Paso 3: Firma -->
      <div v-if="paso === 3" class="space-y-5">
        <TerminosFormulario tipo="PELUQUERIA" :version-aceptada="versionAceptada" @cambio="onTerminos" />

        <div v-if="terminos.aceptado" class="bg-white rounded-2xl p-5 shadow-sm">
          <h2 class="font-black uppercase text-sm text-[#152C77] mb-2 tracking-wide">Firma</h2>
          <p class="text-xs text-gray-500 mb-4 leading-relaxed">
            Esta firma tiene validez legal conforme a la Ley 527 de 1999.
          </p>
          <FirmaCanvas @firmado="v => firmaBase64 = v" />
        </div>

        <p v-if="error" class="text-red-500 text-sm text-center">{{ error }}</p>

        <button @click="enviar" :disabled="enviando || !firmaBase64 || !terminos.aceptado"
          class="w-full py-4 bg-[#DE1F27] text-white font-black uppercase text-sm tracking-widest rounded-2xl disabled:opacity-40 active:scale-95 transition-transform">
          {{ enviando ? 'Enviando...' : 'Enviar formulario' }}
        </button>
      </div>

      <!-- Paso 4: Éxito -->
      <div v-if="paso === 4" class="text-center py-12 space-y-4">
        <div class="text-6xl">🐾</div>
        <h2 class="font-black uppercase text-xl text-[#152C77]">¡Formulario enviado!</h2>
        <p class="text-gray-500 text-sm max-w-xs mx-auto">
          Tu formato de peluquería quedó registrado. Te esperamos con {{ form.nombreMascota }} en Pet Station.
        </p>
        <div class="bg-white rounded-2xl p-4 shadow-sm max-w-xs mx-auto">
          <p class="text-xs font-bold text-gray-500 uppercase tracking-wide">Radicado No.</p>
          <p class="text-xl font-black text-[#152C77]">{{ radicado }}</p>
        </div>
        <p v-if="copiaEnviada" class="text-gray-500 text-sm max-w-xs mx-auto">
          Te enviamos una copia del documento firmado a {{ form.email }}.
        </p>
        <a href="https://wa.me/573053462413" target="_blank"
          class="inline-block mt-4 px-6 py-3 bg-green-500 text-white font-bold rounded-2xl text-sm">
          Contactar por WhatsApp
        </a>
      </div>

    </div>
  </div>
</template>
