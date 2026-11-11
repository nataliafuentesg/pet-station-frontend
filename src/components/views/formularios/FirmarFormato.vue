<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/api/axios'
import FirmaCanvas from './FirmaCanvas.vue'
import OtpVerificacion from './OtpVerificacion.vue'
import TerminosFormulario from './TerminosFormulario.vue'
import ConfirmarCorreo from './ConfirmarCorreo.vue'
import CampoCedula from './CampoCedula.vue'

const route = useRoute()
// El token viaja después del # para que no llegue a logs ni a herramientas de analítica
const token = route.hash.slice(1)

const paso = ref('cargando') // cargando | invalido | otp | datos | documento | correo | firma | listo
const telefono = ref('')
const correoRegistrado = ref('')
const documento = ref(null)
const mensaje = ref('')
const email = ref('')
const motivo = ref('')
const firmaBase64 = ref('')
const terminos = ref({ aceptado: false, version: '' })
const enviando = ref(false)
const error = ref('')
const radicado = ref('')
const copiaPendiente = ref(false)

// El tutor escribe sus datos y los de la mascota; vienen llenos con lo que puso el equipo o con formatos anteriores
const tutor = reactive({
  cedula: '', nombreCliente: '', direccion: '',
  nombreMascota: '', especie: '', raza: '', color: '', fechaNacimiento: '', sexo: ''
})
const cedulaGuardada = ref('')
const mascotasGuardadas = ref([])
const hoy = new Date().toLocaleDateString('en-CA')
const datosValidos = computed(() =>
  (tutor.cedula.toString().trim() || cedulaGuardada.value) && tutor.nombreCliente.trim() && tutor.nombreMascota.trim()
)

function elegirMascota(m) {
  for (const campo of ['nombreMascota', 'especie', 'raza', 'color', 'fechaNacimiento', 'sexo']) tutor[campo] = m[campo] || ''
}

const esDeclinacion = computed(() => documento.value?.terminos.tipo === 'DECLINACION')
const correoValido = computed(() => !email.value.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()))
const puedeContinuar = computed(() =>
  terminos.value.aceptado && correoValido.value && (!esDeclinacion.value || motivo.value.trim())
)
const preambulo = computed(() => {
  const cedula = tutor.cedula.toString().trim() || `terminada en ${cedulaGuardada.value}`
  return `Yo, ${tutor.nombreCliente.trim()}, mayor de edad, identificado con C.C. No. ${cedula}, en calidad de propietario(a) y/o responsable de la mascota: ${tutor.nombreMascota.trim()}.`
})
const datosMascota = computed(() => {
  const d = documento.value
  return [['Mascota', tutor.nombreMascota], ['Especie', tutor.especie], ['Raza', tutor.raza],
    ['Sexo', tutor.sexo], ['Historia clínica No.', d.historiaClinica]].filter(([, v]) => v)
})

onMounted(async () => {
  try {
    const { data } = await api.post('/formularios/firmar/estado', { token })
    telefono.value = data.telefono
    correoRegistrado.value = data.correo || ''
    paso.value = 'otp'
  } catch (e) {
    mensaje.value = e.response?.data?.error || 'No pudimos abrir este link. Intenta de nuevo en unos minutos.'
    paso.value = 'invalido'
  }
})

async function onVerificado() {
  try {
    const { data } = await api.post('/formularios/firmar/documento', { token })
    documento.value = data
    const perfil = data.perfil?.encontrado ? data.perfil : {}
    email.value = data.email || perfil.email || ''
    tutor.nombreCliente = data.nombreCliente || perfil.nombreCliente || ''
    tutor.direccion = data.direccion || perfil.direccion || ''
    cedulaGuardada.value = data.cedulaOculta || ''
    mascotasGuardadas.value = perfil.mascotas || []
    const guardada = mascotasGuardadas.value.find(m => m.nombreMascota?.trim().toLowerCase() === data.nombreMascota?.trim().toLowerCase())
    if (guardada) elegirMascota(guardada)
    for (const campo of ['nombreMascota', 'especie', 'raza', 'color', 'fechaNacimiento', 'sexo']) {
      if (data[campo]) tutor[campo] = data[campo]
    }
    paso.value = 'datos'
  } catch (e) {
    mensaje.value = e.response?.data?.error || 'No pudimos abrir el documento.'
    paso.value = 'invalido'
  }
}

function onTerminos(valor) {
  terminos.value = valor
}

function continuar() {
  paso.value = email.value.trim() ? 'correo' : 'firma'
}

async function enviar() {
  enviando.value = true
  error.value = ''
  try {
    const { data } = await api.post('/formularios/firmar/enviar', {
      token,
      firmaBase64: firmaBase64.value,
      aceptaTerminos: terminos.value.aceptado,
      versionTerminos: terminos.value.version,
      email: email.value.trim(),
      emailConfirmado: !!email.value.trim(),
      motivoDeclinacion: motivo.value.trim() || null,
      tutor: {
        ...tutor,
        cedula: tutor.cedula.toString().trim() || null,
        usarCedulaGuardada: !!cedulaGuardada.value
      }
    })
    radicado.value = data.radicado
    copiaPendiente.value = data.copiaPendiente
    paso.value = 'listo'
  } catch (e) {
    error.value = e.response?.data?.message || e.response?.data?.error || 'No se pudo enviar el documento'
  } finally {
    enviando.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="bg-[#152C77] text-white py-6 px-4 text-center">
      <img src="/images/logo-pet-station.png" alt="Pet Station" class="w-10 h-10 mx-auto mb-2 rounded-lg" />
      <h1 class="text-xl font-black uppercase tracking-wide">Pet Station</h1>
      <p class="text-sm opacity-80 mt-1">Documento para firmar</p>
    </div>

    <div class="max-w-lg mx-auto px-4 py-6 space-y-5">
      <p v-if="paso === 'cargando'" class="text-center text-sm text-gray-400 py-12">Abriendo...</p>

      <div v-else-if="paso === 'invalido'" class="bg-white rounded-2xl p-6 shadow-sm text-center space-y-4">
        <div class="text-4xl">🔒</div>
        <p class="text-sm text-gray-600">{{ mensaje }}</p>
        <a href="https://wa.me/573053462413" target="_blank"
          class="inline-block px-6 py-3 bg-green-500 text-white font-bold rounded-2xl text-sm">
          Contactar por WhatsApp
        </a>
      </div>

      <OtpVerificacion v-else-if="paso === 'otp'" :telefono="`terminado en ${telefono}`" :token="token" :correo-registrado="correoRegistrado" @verificado="onVerificado" />

      <div v-if="documento" v-show="paso === 'datos'" class="space-y-5">
        <div class="bg-white rounded-2xl p-5 shadow-sm">
          <h2 class="font-black uppercase text-sm text-[#152C77] tracking-wide">{{ documento.terminos.subtitulo || documento.terminos.titulo }}</h2>
          <p class="text-sm text-gray-500 mt-1">Revisa o completa tus datos antes de leer el documento.</p>
        </div>

        <div class="bg-white rounded-2xl p-5 shadow-sm">
          <h2 class="font-black uppercase text-sm text-[#152C77] mb-4 tracking-wide">Datos del propietario</h2>
          <div class="space-y-3">
            <CampoCedula v-model="tutor.cedula" v-model:guardada="cedulaGuardada" />
            <div>
              <label class="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Nombre completo *</label>
              <input v-model="tutor.nombreCliente" type="text" placeholder="Tu nombre"
                class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#152C77]" />
            </div>
            <div>
              <label class="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Dirección</label>
              <input v-model="tutor.direccion" type="text" placeholder="opcional"
                class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#152C77]" />
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl p-5 shadow-sm">
          <h2 class="font-black uppercase text-sm text-[#152C77] mb-4 tracking-wide">Datos de la mascota</h2>
          <div v-if="mascotasGuardadas.length > 1 || (mascotasGuardadas.length && !tutor.nombreMascota)" class="flex flex-wrap gap-2 mb-3">
            <button v-for="m in mascotasGuardadas" :key="m.nombreMascota" type="button" @click="elegirMascota(m)"
              :class="['px-3 py-1.5 rounded-full border-2 text-xs font-bold',
                tutor.nombreMascota === m.nombreMascota ? 'border-[#152C77] bg-[#152C77] text-white' : 'border-gray-200 text-gray-500']">
              {{ m.nombreMascota }}
            </button>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div class="col-span-2">
              <label class="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Nombre *</label>
              <input v-model="tutor.nombreMascota" type="text" placeholder="Nombre de tu mascota"
                class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#152C77]" />
            </div>
            <div>
              <label class="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Especie</label>
              <select v-model="tutor.especie" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#152C77]">
                <option value="">Selecciona</option>
                <option>Perro</option>
                <option>Gato</option>
                <option>Otro</option>
              </select>
            </div>
            <div>
              <label class="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Sexo</label>
              <select v-model="tutor.sexo" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#152C77]">
                <option value="">Selecciona</option>
                <option>Macho</option>
                <option>Hembra</option>
              </select>
            </div>
            <div>
              <label class="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Raza</label>
              <input v-model="tutor.raza" type="text" placeholder="Ej: Criollo"
                class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#152C77]" />
            </div>
            <div>
              <label class="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Fecha de nacimiento</label>
              <input v-model="tutor.fechaNacimiento" type="date" :max="hoy"
                class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#152C77]" />
            </div>
            <div class="col-span-2">
              <label class="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Color</label>
              <input v-model="tutor.color" type="text" placeholder="Ej: Blanco"
                class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#152C77]" />
            </div>
          </div>
        </div>

        <button @click="paso = 'documento'" :disabled="!datosValidos"
          class="w-full py-4 bg-[#152C77] text-white font-black uppercase text-sm tracking-widest rounded-2xl disabled:opacity-40 active:scale-95 transition-transform">
          Continuar → Leer documento
        </button>
      </div>

      <!-- v-show: al corregir el correo no se pierde la casilla marcada ni el motivo -->
      <div v-if="documento" v-show="paso === 'documento'" class="space-y-5">
        <div class="bg-white rounded-2xl p-5 shadow-sm">
          <h2 class="font-black uppercase text-sm text-[#152C77] tracking-wide">{{ documento.terminos.titulo }}</h2>
          <p v-if="documento.terminos.subtitulo" class="text-xs font-bold text-[#DE1F27] mt-1">{{ documento.terminos.subtitulo }}</p>
          <p class="text-sm text-gray-700 leading-relaxed mt-4">{{ preambulo }}</p>
          <dl class="grid grid-cols-2 gap-3 mt-4 text-sm">
            <div v-for="[label, valor] in datosMascota" :key="label">
              <dt class="text-xs font-bold text-gray-500 uppercase tracking-wide">{{ label }}</dt>
              <dd class="text-gray-800">{{ valor }}</dd>
            </div>
          </dl>
          <button type="button" @click="paso = 'datos'" class="text-xs font-bold text-[#152C77] underline mt-4">Corregir mis datos</button>
        </div>

        <div v-if="documento.detalle?.length" class="bg-white rounded-2xl p-5 shadow-sm">
          <p class="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Indicación del médico veterinario</p>
          <div class="space-y-1.5 text-sm">
            <p v-for="linea in documento.detalle" :key="linea" class="text-gray-800 font-medium">
              <span class="text-gray-500 font-normal">{{ linea.split(': ')[0] }}:&nbsp;</span>{{ linea.split(': ').slice(1).join(': ') }}
            </p>
          </div>
          <p class="text-xs text-gray-400 mt-3">Si algo de esto no es lo que hablaste con el veterinario, no firmes y avísale al equipo.</p>
        </div>

        <div v-if="esDeclinacion" class="bg-white rounded-2xl p-5 shadow-sm space-y-3">
          <div>
            <p class="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Tratamiento o procedimiento rechazado</p>
            <p class="text-sm text-gray-800 whitespace-pre-line">{{ documento.tratamientoRechazado }}</p>
          </div>
          <div>
            <label class="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Motivo de la declinación *</label>
            <textarea v-model="motivo" rows="3"
              class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#152C77]"></textarea>
          </div>
        </div>

        <TerminosFormulario :tipo="documento.terminos.tipo" :terminos="documento.terminos" @cambio="onTerminos" />

        <div class="bg-white rounded-2xl p-5 shadow-sm">
          <label class="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Correo para tu copia firmada</label>
          <input v-model="email" type="email" placeholder="opcional"
            class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#152C77]" />
          <p v-if="!correoValido" class="text-xs text-red-500 mt-1">Revisa el correo, parece incompleto.</p>
        </div>

        <button @click="continuar" :disabled="!puedeContinuar"
          class="w-full py-4 bg-[#152C77] text-white font-black uppercase text-sm tracking-widest rounded-2xl disabled:opacity-40 active:scale-95 transition-transform">
          Continuar → Firmar
        </button>
      </div>

      <ConfirmarCorreo v-if="paso === 'correo'" :email="email.trim()" @confirmar="paso = 'firma'" @corregir="paso = 'documento'" />

      <template v-else-if="paso === 'firma'">
        <div class="bg-white rounded-2xl p-5 shadow-sm">
          <h2 class="font-black uppercase text-sm text-[#152C77] mb-2 tracking-wide">Firma del propietario</h2>
          <p class="text-xs text-gray-500 mb-4 leading-relaxed">Esta firma tiene validez legal conforme a la Ley 527 de 1999.</p>
          <FirmaCanvas @firmado="v => firmaBase64 = v" />
        </div>
        <p v-if="error" class="text-red-500 text-sm text-center">{{ error }}</p>
        <button @click="enviar" :disabled="enviando || !firmaBase64"
          class="w-full py-4 bg-[#DE1F27] text-white font-black uppercase text-sm tracking-widest rounded-2xl disabled:opacity-40 active:scale-95 transition-transform">
          {{ enviando ? 'Enviando...' : 'Firmar documento' }}
        </button>
      </template>

      <div v-else-if="paso === 'listo'" class="text-center py-12 space-y-4">
        <h2 class="font-black uppercase text-xl text-[#152C77]">Documento firmado</h2>
        <div class="bg-white rounded-2xl p-4 shadow-sm max-w-xs mx-auto">
          <p class="text-xs font-bold text-gray-500 uppercase tracking-wide">Radicado No.</p>
          <p class="text-xl font-black text-[#152C77]">{{ radicado }}</p>
        </div>
        <p class="text-gray-500 text-sm max-w-xs mx-auto">
          Falta la firma del médico veterinario.
          <template v-if="copiaPendiente"> Cuando firme, te enviaremos la copia a {{ email.trim() }}.</template>
        </p>
      </div>
    </div>
  </div>
</template>
