<script setup>
import { ref, onMounted, computed, reactive } from 'vue'
import QRCode from 'qrcode'
import api from '@/api/axios'
import FirmaCanvas from '@/components/views/formularios/FirmaCanvas.vue'

const TIPOS = {
  PELUQUERIA: { etiqueta: '✂️ Pelu', clase: 'bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-300' },
  GUARDERIA: { etiqueta: '🏡 Guard', clase: 'bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-300' },
  CONSENTIMIENTO: { etiqueta: '🩺 Consent', clase: 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300' },
  EUTANASIA: { etiqueta: '🕊️ Eutan', clase: 'bg-slate-200 text-slate-700 dark:bg-white/10 dark:text-slate-200' },
  DECLINACION: { etiqueta: '🚫 Declin', clase: 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-300' },
}
const CLINICOS = [
  { valor: 'CONSENTIMIENTO', nombre: 'Consentimiento (hospitalización, cirugía, vacunas, medicamentos, exámenes)' },
  { valor: 'EUTANASIA', nombre: 'Eutanasia' },
  { valor: 'DECLINACION', nombre: 'Declinación de tratamiento / alta voluntaria' },
]

const formularios = ref([])
const cargando = ref(true)
const filtroTipo = ref('')
const busqueda = ref('')
const seleccionado = ref(null)
const modalRevision = ref(null)
const enviandoRevision = ref(false)
// Nada marcado de entrada: lo que quede en el PDF debe ser lo que alguien revisó
const revisionVacia = () => ({
  ojos: '', orejas: '', boca: '', piel: '', pulpejos: '', zonaPerianal: '',
  desenrede: '', ectoparasitos: '', valorServicio: '', pesoKg: '', observacionesIngreso: ''
})
const revision = reactive(revisionVacia())
const empleadoRevision = ref('')
const revisionCompleta = computed(() =>
  ['ojos', 'orejas', 'boca', 'piel', 'pulpejos', 'zonaPerianal', 'desenrede', 'ectoparasitos'].every(c => revision[c]) &&
  !!empleadoRevision.value.trim()
)

const nuevoVacio = () => ({
  tipo: 'CONSENTIMIENTO', nombreCliente: '', cedula: '', telefono: '', email: '', nombreMascota: '',
  especie: '', raza: '', edad: '', sexo: '', historiaClinica: '', ciudad: 'Chía', tratamientoRechazado: ''
})
const modalNuevo = ref(false)
const nuevo = reactive(nuevoVacio())
const creando = ref(false)
const errorNuevo = ref('')
const linkGenerado = ref(null)
const nuevoValido = computed(() =>
  nuevo.nombreCliente.trim() && nuevo.cedula.toString().trim() && nuevo.telefono.trim() && nuevo.nombreMascota.trim() &&
  (nuevo.tipo !== 'DECLINACION' || nuevo.tratamientoRechazado.trim())
)

const modalVeterinario = ref(null)
const firmaVet = reactive({ nombre: '', matricula: '', firmaBase64: '' })
const firmandoVet = ref(false)
const errorVet = ref('')

onMounted(cargar)

async function cargar() {
  cargando.value = true
  try {
    const params = filtroTipo.value ? { tipo: filtroTipo.value } : {}
    const { data } = await api.get('/admin/formularios', { params })
    formularios.value = data
  } finally {
    cargando.value = false
  }
}

const lista = computed(() => {
  const q = busqueda.value.toLowerCase()
  if (!q) return formularios.value
  return formularios.value.filter(f =>
    f.radicado?.toLowerCase().includes(q) ||
    f.nombreCliente?.toLowerCase().includes(q) ||
    f.cedula?.includes(q) ||
    f.nombreMascota?.toLowerCase().includes(q)
  )
})

async function descargarPdf(f, original = false) {
  try {
    const resp = await api.get(`/admin/formularios/${f.id}/pdf`, {
      responseType: 'blob',
      params: original ? { version: 'original' } : undefined
    })
    const url = URL.createObjectURL(resp.data)
    const a = document.createElement('a')
    a.href = url
    a.download = `${f.radicado || `${f.tipo.toLowerCase()}_${f.id}`}${original ? '_original' : ''}.pdf`
    a.click()
    URL.revokeObjectURL(url)
  } catch (e) {
    alert('Error descargando PDF')
  }
}

// La pestaña se abre antes de pedir el archivo: después de esperar, Safari la bloquearía
async function verAdjunto(f, cual) {
  const ventana = window.open('', '_blank')
  try {
    const resp = await api.get(`/admin/formularios/${f.id}/adjunto/${cual}`, { responseType: 'blob' })
    const url = URL.createObjectURL(resp.data)
    if (ventana) ventana.location = url
    else window.location = url
  } catch {
    ventana?.close()
    alert('No se pudo abrir el archivo')
  }
}

const evidencias = ref({})

const NOMBRE_EVENTO = {
  LINK_CREADO: 'Link creado',
  CODIGO_VERIFICADO: 'Código verificado',
  TERMINOS_ACEPTADOS: 'Términos aceptados',
  CORREO_CONFIRMADO: 'Correo confirmado en pantalla',
  FIRMA_TUTOR: 'Firma del tutor',
  FIRMA_VETERINARIO: 'Firma del veterinario',
  PDF_ORIGINAL: 'PDF original guardado',
  REVISION_INGRESO: 'Revisión de ingreso',
  COPIA_ENVIADA: 'Copia enviada por correo',
  COPIA_FALLIDA: 'No se pudo enviar la copia'
}

async function alternarEvidencia(f) {
  if (evidencias.value[f.id]) {
    delete evidencias.value[f.id]
    return
  }
  try {
    const { data } = await api.get(`/admin/formularios/${f.id}/evidencia`)
    evidencias.value[f.id] = data
  } catch (e) {
    alert('No se pudo cargar el historial')
  }
}

function abrirNuevo() {
  Object.assign(nuevo, nuevoVacio())
  errorNuevo.value = ''
  modalNuevo.value = true
}

async function mostrarLink(data, f) {
  const url = `${window.location.origin}/formularios/firmar#${data.token}`
  linkGenerado.value = {
    url,
    tipo: data.tipo,
    expira: data.expira,
    nombre: f.nombreCliente,
    telefono: f.telefono,
    qr: await QRCode.toDataURL(url, { width: 260, margin: 1 })
  }
}

async function crearFormato() {
  creando.value = true
  errorNuevo.value = ''
  try {
    const { data } = await api.post('/admin/formularios/clinicos', { ...nuevo, cedula: nuevo.cedula.toString() })
    modalNuevo.value = false
    await mostrarLink(data, nuevo)
    await cargar()
  } catch (e) {
    errorNuevo.value = e.response?.data?.message || e.response?.data?.error || 'No se pudo crear el formato'
  } finally {
    creando.value = false
  }
}

async function generarOtroLink(f) {
  try {
    const { data } = await api.post(`/admin/formularios/${f.id}/nuevo-link`)
    await mostrarLink(data, f)
    await cargar()
  } catch (e) {
    alert(e.response?.data?.error || 'No se pudo generar el link')
  }
}

function copiarLinkGenerado() {
  navigator.clipboard?.writeText(linkGenerado.value.url)
    .then(() => alert('Link copiado'))
    .catch(() => alert(linkGenerado.value.url))
}

// El mensaje no dice qué documento es: WhatsApp lo muestra en notificaciones y en pantalla bloqueada
function whatsappLink(l) {
  const numero = l.telefono.replace(/\D/g, '').replace(/^(?!57)/, '57')
  const texto = `Hola ${l.nombre}, te escribimos de Pet Station. Te enviamos un documento para leer y firmar: ${l.url}\nPara abrirlo te llegará un código a este WhatsApp.`
  return `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`
}

function linkVencido(f) {
  return f.tokenExpira && new Date(f.tokenExpira) < new Date()
}

function abrirFirmaVeterinario(f) {
  Object.assign(firmaVet, { nombre: '', matricula: '', firmaBase64: '' })
  errorVet.value = ''
  modalVeterinario.value = f
}

async function firmarVeterinario() {
  firmandoVet.value = true
  errorVet.value = ''
  try {
    await api.patch(`/admin/formularios/${modalVeterinario.value.id}/firma-veterinario`, firmaVet)
    modalVeterinario.value = null
    await cargar()
  } catch (e) {
    errorVet.value = e.response?.data?.message || e.response?.data?.error || 'No se pudo guardar la firma'
  } finally {
    firmandoVet.value = false
  }
}

function copiarLink(tipo) {
  const base = window.location.origin
  const path = tipo === 'PELUQUERIA' ? '/formularios/peluqueria' : '/formularios/guarderia'
  navigator.clipboard?.writeText(base + path)
    .then(() => alert('Link copiado al portapapeles'))
    .catch(() => alert(base + path))
}

function formatFecha(ts) {
  return new Date(ts).toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' })
}

function checklist(f) {
  try { return JSON.parse(f.checklistJson || '{}') } catch { return {} }
}

function abrirRevision(f) {
  modalRevision.value = f
  Object.assign(revision, revisionVacia())
  empleadoRevision.value = ''
}

async function guardarRevision() {
  if (!modalRevision.value) return
  enviandoRevision.value = true
  try {
    await api.patch(`/admin/formularios/${modalRevision.value.id}/revision`, {
      revisionJson: JSON.stringify(revision),
      empleado: empleadoRevision.value
    })
    await cargar()
    modalRevision.value = null
  } finally {
    enviandoRevision.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div>
        <p class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Formularios digitales</p>
        <h1 class="text-2xl font-[1000] uppercase italic text-slate-800 dark:text-white">Formularios</h1>
      </div>
      <div class="flex flex-wrap gap-2">
        <button @click="abrirNuevo"
          class="px-4 py-2 text-[9px] font-black uppercase tracking-widest bg-[#152C77] text-white rounded-xl hover:bg-[#DE1F27] transition-colors">
          ＋ Formato clínico
        </button>
        <button @click="copiarLink('PELUQUERIA')"
          class="px-4 py-2 text-[9px] font-black uppercase tracking-widest bg-[#152C77]/10 text-[#152C77] dark:text-blue-300 rounded-xl hover:bg-[#152C77]/20 transition-colors">
          📋 Link Peluquería
        </button>
        <button @click="copiarLink('GUARDERIA')"
          class="px-4 py-2 text-[9px] font-black uppercase tracking-widest bg-[#152C77]/10 text-[#152C77] dark:text-blue-300 rounded-xl hover:bg-[#152C77]/20 transition-colors">
          📋 Link Guardería
        </button>
      </div>
    </div>

    <!-- Filtros -->
    <div class="flex flex-col sm:flex-row gap-3">
      <input v-model="busqueda" type="text" placeholder="Buscar por radicado, nombre, cédula o mascota..."
        class="flex-1 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#152C77] dark:text-white" />
      <select v-model="filtroTipo" @change="cargar"
        class="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#152C77] dark:text-white">
        <option value="">Todos los tipos</option>
        <option value="PELUQUERIA">Peluquería</option>
        <option value="GUARDERIA">Guardería</option>
        <option value="CONSENTIMIENTO">Consentimiento</option>
        <option value="EUTANASIA">Eutanasia</option>
        <option value="DECLINACION">Declinación</option>
      </select>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-3 gap-3">
      <div class="bg-white dark:bg-white/5 rounded-2xl p-4 text-center border border-slate-100 dark:border-white/10">
        <p class="text-2xl font-[1000]">{{ formularios.length }}</p>
        <p class="text-[9px] font-black uppercase text-slate-400 tracking-widest">Total</p>
      </div>
      <div class="bg-white dark:bg-white/5 rounded-2xl p-4 text-center border border-slate-100 dark:border-white/10">
        <p class="text-2xl font-[1000]">{{ formularios.filter(f => f.tipo === 'PELUQUERIA').length }}</p>
        <p class="text-[9px] font-black uppercase text-slate-400 tracking-widest">Peluquería</p>
      </div>
      <div class="bg-white dark:bg-white/5 rounded-2xl p-4 text-center border border-slate-100 dark:border-white/10">
        <p class="text-2xl font-[1000]">{{ formularios.filter(f => f.tipo === 'GUARDERIA').length }}</p>
        <p class="text-[9px] font-black uppercase text-slate-400 tracking-widest">Guardería</p>
      </div>
    </div>

    <!-- Lista -->
    <div v-if="cargando" class="space-y-3">
      <div v-for="i in 5" :key="i" class="h-20 bg-slate-100 dark:bg-white/5 rounded-2xl animate-pulse"></div>
    </div>

    <div v-else-if="lista.length === 0" class="text-center py-12 text-slate-400">
      <p class="text-4xl mb-3">📋</p>
      <p class="font-bold text-sm uppercase tracking-widest">Sin formularios</p>
    </div>

    <div v-else class="space-y-3">
      <div v-for="f in lista" :key="f.id"
        class="bg-white dark:bg-white/5 rounded-2xl p-4 border border-slate-100 dark:border-white/10 cursor-pointer hover:border-[#152C77]/30 transition-colors"
        @click="seleccionado = seleccionado?.id === f.id ? null : f">

        <div class="flex items-start justify-between gap-3">
          <div class="flex items-center gap-3 min-w-0">
            <span :class="['text-[8px] font-black uppercase px-2 py-1 rounded-lg whitespace-nowrap', TIPOS[f.tipo]?.clase]">
              {{ TIPOS[f.tipo]?.etiqueta }}
            </span>
            <div class="min-w-0">
              <p v-if="f.radicado" class="text-[10px] font-black text-[#152C77] dark:text-blue-300">{{ f.radicado }}</p>
              <p class="font-black text-sm text-slate-800 dark:text-white truncate">{{ f.nombreCliente }}</p>
              <p class="text-[10px] text-slate-400">CC {{ f.cedula }} · 🐾 {{ f.nombreMascota }}</p>
            </div>
          </div>
          <div class="text-right shrink-0">
            <p class="text-[9px] text-slate-400">{{ formatFecha(f.timestamp) }}</p>
            <span v-if="f.estado === 'PENDIENTE_TUTOR'" class="text-[8px] text-amber-600 font-bold block">
              {{ linkVencido(f) ? 'Link vencido' : 'Falta firma del tutor' }}
            </span>
            <span v-else-if="f.estado === 'PENDIENTE_VETERINARIO'" class="text-[8px] text-amber-600 font-bold block">Falta firma del veterinario</span>
            <span v-else-if="f.otpVerificado" class="text-[8px] text-green-600 font-bold">✓ Verificado</span>
          </div>
        </div>

        <!-- Detalle expandible -->
        <div v-if="seleccionado?.id === f.id" class="mt-4 pt-4 border-t border-slate-100 dark:border-white/10 space-y-3 text-sm">
          <div class="grid grid-cols-2 gap-2 text-xs">
            <div v-if="f.telefono">
              <span class="text-slate-400 font-bold uppercase text-[9px]">Teléfono</span>
              <p>{{ f.telefono }}</p>
            </div>
            <div v-if="f.email">
              <span class="text-slate-400 font-bold uppercase text-[9px]">Email</span>
              <p>{{ f.email }}</p>
            </div>
            <div v-if="f.especie">
              <span class="text-slate-400 font-bold uppercase text-[9px]">Mascota</span>
              <p>{{ f.especie }} · {{ f.raza }} · {{ f.sexo }}</p>
            </div>
            <div v-if="f.servicioSolicitado">
              <span class="text-slate-400 font-bold uppercase text-[9px]">Servicio</span>
              <p>{{ f.servicioSolicitado }}</p>
            </div>
            <div v-if="f.fechaIngreso">
              <span class="text-slate-400 font-bold uppercase text-[9px]">Ingreso</span>
              <p>{{ f.fechaIngreso }}</p>
            </div>
            <div v-if="f.fechaSalida">
              <span class="text-slate-400 font-bold uppercase text-[9px]">Salida</span>
              <p>{{ f.fechaSalida }}</p>
            </div>
          </div>

          <div v-if="f.observaciones" class="text-xs">
            <span class="text-slate-400 font-bold uppercase text-[9px]">Observaciones</span>
            <p class="text-slate-600 dark:text-slate-300">{{ f.observaciones }}</p>
          </div>

          <div v-if="f.carnetVacunasPath || f.formulaMedicaPath" class="flex gap-2">
            <button v-if="f.carnetVacunasPath" @click.stop="verAdjunto(f, 'carnet')"
              class="flex-1 py-2 border border-slate-300 dark:border-white/20 text-slate-600 dark:text-slate-300 font-black uppercase text-[9px] tracking-widest rounded-xl">
              💉 Carnet de vacunas
            </button>
            <button v-if="f.formulaMedicaPath" @click.stop="verAdjunto(f, 'formula')"
              class="flex-1 py-2 border border-slate-300 dark:border-white/20 text-slate-600 dark:text-slate-300 font-black uppercase text-[9px] tracking-widest rounded-xl">
              💊 Fórmula médica
            </button>
          </div>

          <!-- Firma preview -->
          <div v-if="f.firmaBase64" class="text-xs">
            <span class="text-slate-400 font-bold uppercase text-[9px] block mb-1">Firma</span>
            <img :src="f.firmaBase64" alt="Firma" class="h-16 border border-slate-200 dark:border-white/10 rounded-lg bg-white" />
          </div>

          <div v-if="f.estado" class="flex gap-2">
            <button v-if="f.estado === 'PENDIENTE_TUTOR'" @click.stop="generarOtroLink(f)"
              class="flex-1 py-2 bg-amber-500 text-white font-black uppercase text-[9px] tracking-widest rounded-xl hover:bg-amber-600 transition-colors">
              🔗 Generar link nuevo
            </button>
            <button v-if="f.estado === 'PENDIENTE_VETERINARIO'" @click.stop="abrirFirmaVeterinario(f)"
              class="flex-1 py-2 bg-amber-500 text-white font-black uppercase text-[9px] tracking-widest rounded-xl hover:bg-amber-600 transition-colors">
              ✍️ Firmar como veterinario
            </button>
            <button v-if="f.estado !== 'PENDIENTE_TUTOR'" @click.stop="descargarPdf(f)"
              class="flex-1 py-2 bg-[#152C77] text-white font-black uppercase text-[9px] tracking-widest rounded-xl hover:bg-[#DE1F27] transition-colors">
              ⬇ PDF
            </button>
          </div>

          <div v-else class="flex gap-2">
            <button v-if="!f.revisionCompletada" @click.stop="abrirRevision(f)"
              class="flex-1 py-2 bg-amber-500 text-white font-black uppercase text-[9px] tracking-widest rounded-xl hover:bg-amber-600 transition-colors">
              🔍 Completar revisión
            </button>
            <span v-else class="flex-1 py-2 text-center text-[9px] font-black uppercase text-green-600 bg-green-50 rounded-xl">
              ✓ Revisión completada
            </span>
            <button @click.stop="descargarPdf(f)"
              class="flex-1 py-2 bg-[#152C77] text-white font-black uppercase text-[9px] tracking-widest rounded-xl hover:bg-[#DE1F27] transition-colors">
              ⬇ PDF
            </button>
          </div>

          <div class="flex gap-2">
            <button v-if="f.pdfOriginalPath && f.pdfOriginalPath !== f.pdfPath" @click.stop="descargarPdf(f, true)"
              class="flex-1 py-2 border border-[#152C77] text-[#152C77] dark:text-white dark:border-white/30 font-black uppercase text-[9px] tracking-widest rounded-xl">
              ⬇ PDF original firmado
            </button>
            <button @click.stop="alternarEvidencia(f)"
              class="flex-1 py-2 border border-slate-300 dark:border-white/20 text-slate-600 dark:text-slate-300 font-black uppercase text-[9px] tracking-widest rounded-xl">
              🧾 {{ evidencias[f.id] ? 'Ocultar historial' : 'Historial' }}
            </button>
          </div>

          <div v-if="evidencias[f.id]" class="text-xs space-y-2 border-t border-slate-100 dark:border-white/10 pt-3" @click.stop>
            <p v-if="evidencias[f.id].originalIntacto === true" class="font-bold text-green-600">✓ El PDF original está intacto</p>
            <p v-else-if="evidencias[f.id].originalIntacto === false" class="font-bold text-red-600">⚠ El PDF original no coincide con su huella o no se encuentra</p>
            <p v-else class="text-slate-400">Este documento se firmó antes de que se guardara el PDF original.</p>
            <p v-if="evidencias[f.id].huellaOriginal" class="text-[10px] text-slate-400 break-all">Huella SHA-256: {{ evidencias[f.id].huellaOriginal }}</p>
            <ul class="space-y-1.5">
              <li v-for="e in evidencias[f.id].eventos" :key="e.id">
                <p class="font-bold text-slate-700 dark:text-slate-200">
                  {{ NOMBRE_EVENTO[e.tipo] || e.tipo }}<template v-if="e.tipo === 'CODIGO_VERIFICADO'"> por {{ e.canal === 'CORREO' ? 'correo' : 'WhatsApp' }}</template>
                </p>
                <p class="text-[10px] text-slate-400 break-all">
                  {{ formatFecha(e.momento) }}<template v-if="e.destino"> · {{ e.destino }}</template><template v-if="e.ip"> · IP {{ e.ip }}</template>
                </p>
                <p v-if="e.detalle" class="text-[10px] text-slate-400 break-all">{{ e.detalle }}</p>
              </li>
              <li v-if="!evidencias[f.id].eventos.length" class="text-slate-400">Sin eventos registrados.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal revisión de ingreso -->
  <Teleport to="body">
    <div v-if="modalRevision" class="fixed inset-0 z-[9000] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div class="absolute inset-0 bg-black/50" @click="modalRevision = null"></div>
      <div class="relative bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        <div class="p-5 border-b border-slate-100 dark:border-white/10 flex items-center justify-between">
          <div>
            <p class="text-[9px] font-black uppercase tracking-widest text-slate-400">Revisión de ingreso</p>
            <h3 class="font-black text-slate-800 dark:text-white">{{ modalRevision.nombreMascota }}</h3>
            <p class="text-xs text-slate-400">{{ modalRevision.nombreCliente }} · {{ modalRevision.tipo }}</p>
          </div>
          <button @click="modalRevision = null" class="text-slate-400 hover:text-slate-600 text-xl">✕</button>
        </div>

        <div class="p-5 space-y-4">
          <!-- Peso -->
          <div>
            <label class="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1">Peso (kg)</label>
            <input v-model="revision.pesoKg" type="number" step="0.1" placeholder="Ej: 4.5"
              class="w-full border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-sm bg-white dark:bg-white/5 dark:text-white focus:outline-none focus:border-[#152C77]" />
          </div>

          <!-- Estado físico -->
          <div>
            <p class="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Estado físico al ingreso</p>
            <div class="space-y-2">
              <div v-for="(label, campo) in { ojos: 'Ojos', orejas: 'Orejas', boca: 'Boca y dientes', piel: 'Piel y pelaje', pulpejos: 'Pulpejos', zonaPerianal: 'Zona perianal' }"
                :key="campo" class="flex items-center justify-between gap-3">
                <span class="text-sm font-medium text-slate-700 dark:text-slate-200 w-28 shrink-0">{{ label }}</span>
                <div class="flex gap-2 flex-1">
                  <button v-for="op in ['Normal', 'Anormal']" :key="op"
                    @click="revision[campo] = op"
                    :class="['flex-1 py-1.5 text-[9px] font-black uppercase rounded-xl border transition-colors',
                      revision[campo] === op
                        ? op === 'Normal' ? 'bg-green-500 text-white border-green-500' : 'bg-red-500 text-white border-red-500'
                        : 'border-slate-200 dark:border-white/10 text-slate-400 hover:border-slate-300']">
                    {{ op }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="space-y-2">
            <div v-for="(label, campo) in { desenrede: 'Desenrede', ectoparasitos: 'Ectoparásitos' }"
              :key="campo" class="flex items-center justify-between gap-3">
              <span class="text-sm font-medium text-slate-700 dark:text-slate-200 w-28 shrink-0">{{ label }}</span>
              <div class="flex gap-2 flex-1">
                <button v-for="op in ['No', 'Sí']" :key="op"
                  @click="revision[campo] = op"
                  :class="['flex-1 py-1.5 text-[9px] font-black uppercase rounded-xl border transition-colors',
                    revision[campo] === op
                      ? op === 'No' ? 'bg-green-500 text-white border-green-500' : 'bg-red-500 text-white border-red-500'
                      : 'border-slate-200 dark:border-white/10 text-slate-400 hover:border-slate-300']">
                  {{ op }}
                </button>
              </div>
            </div>
          </div>

          <div>
            <label class="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1">Valor del servicio desde</label>
            <input v-model="revision.valorServicio" type="text" placeholder="Ej: $60.000"
              class="w-full border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-sm bg-white dark:bg-white/5 dark:text-white focus:outline-none focus:border-[#152C77]" />
          </div>

          <!-- Observaciones -->
          <div>
            <label class="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1">Observaciones del ingreso</label>
            <textarea v-model="revision.observacionesIngreso" rows="3" placeholder="Estado general, comportamiento, notas de quien recibe..."
              class="w-full border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-sm bg-white dark:bg-white/5 dark:text-white focus:outline-none focus:border-[#152C77]"></textarea>
          </div>

          <!-- Quien recibe -->
          <div>
            <label class="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1">Persona que recibe *</label>
            <input v-model="empleadoRevision" type="text" placeholder="Tu nombre"
              class="w-full border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-sm bg-white dark:bg-white/5 dark:text-white focus:outline-none focus:border-[#152C77]" />
          </div>

          <p v-if="!revisionCompleta" class="text-xs text-center text-slate-500">Marca cada punto y escribe quién recibe para guardar.</p>

          <button @click="guardarRevision" :disabled="enviandoRevision || !revisionCompleta"
            class="w-full py-3.5 bg-[#152C77] text-white font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-[#DE1F27] transition-colors disabled:opacity-50">
            {{ enviandoRevision ? 'Guardando...' : '✓ Guardar revisión y regenerar PDF' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>

  <!-- Modal nuevo formato clínico -->
  <Teleport to="body">
    <div v-if="modalNuevo" class="fixed inset-0 z-[9000] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div class="absolute inset-0 bg-black/50" @click="modalNuevo = false"></div>
      <div class="relative bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        <div class="p-5 border-b border-slate-100 dark:border-white/10 flex items-center justify-between">
          <h3 class="font-black text-slate-800 dark:text-white">Nuevo formato clínico</h3>
          <button @click="modalNuevo = false" class="text-slate-400 hover:text-slate-600 text-xl">✕</button>
        </div>
        <div class="p-5 space-y-3">
          <div>
            <label class="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1">Formato</label>
            <select v-model="nuevo.tipo" class="w-full border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-sm bg-white dark:bg-white/5 dark:text-white focus:outline-none focus:border-[#152C77]">
              <option v-for="t in CLINICOS" :key="t.valor" :value="t.valor">{{ t.nombre }}</option>
            </select>
          </div>
          <div v-for="c in [
            { campo: 'nombreCliente', label: 'Nombre del tutor *' },
            { campo: 'cedula', label: 'Cédula *', tipo: 'number' },
            { campo: 'telefono', label: 'Celular con WhatsApp *', tipo: 'tel', ayuda: 'El código para abrir el documento llega a este número.' },
            { campo: 'email', label: 'Correo (respaldo si el WhatsApp no llega)', tipo: 'email' },
            { campo: 'nombreMascota', label: 'Nombre de la mascota *' },
          ]" :key="c.campo">
            <label class="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1">{{ c.label }}</label>
            <input v-model="nuevo[c.campo]" :type="c.tipo || 'text'"
              class="w-full border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-sm bg-white dark:bg-white/5 dark:text-white focus:outline-none focus:border-[#152C77]" />
            <p v-if="c.ayuda" class="text-[10px] text-slate-400 mt-1">{{ c.ayuda }}</p>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div v-for="c in [
              { campo: 'especie', label: 'Especie' }, { campo: 'raza', label: 'Raza' },
              { campo: 'edad', label: 'Edad' }, { campo: 'sexo', label: 'Sexo' },
              { campo: 'historiaClinica', label: 'Historia clínica No.' }, { campo: 'ciudad', label: 'Ciudad' },
            ]" :key="c.campo">
              <label class="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1">{{ c.label }}</label>
              <input v-model="nuevo[c.campo]" type="text"
                class="w-full border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-sm bg-white dark:bg-white/5 dark:text-white focus:outline-none focus:border-[#152C77]" />
            </div>
          </div>
          <div v-if="nuevo.tipo === 'DECLINACION'">
            <label class="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1">Tratamiento o procedimiento rechazado *</label>
            <textarea v-model="nuevo.tratamientoRechazado" rows="2"
              class="w-full border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-sm bg-white dark:bg-white/5 dark:text-white focus:outline-none focus:border-[#152C77]"></textarea>
          </div>
          <p v-if="errorNuevo" class="text-red-500 text-sm">{{ errorNuevo }}</p>
          <button @click="crearFormato" :disabled="creando || !nuevoValido"
            class="w-full py-3.5 bg-[#152C77] text-white font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-[#DE1F27] transition-colors disabled:opacity-50">
            {{ creando ? 'Creando...' : 'Crear y generar link' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>

  <!-- Modal link generado: el link no se puede volver a ver, solo generar uno nuevo -->
  <Teleport to="body">
    <div v-if="linkGenerado" class="fixed inset-0 z-[9000] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div class="absolute inset-0 bg-black/50" @click="linkGenerado = null"></div>
      <div class="relative bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md max-h-[90vh] overflow-y-auto shadow-2xl p-5 space-y-4 text-center">
        <button @click="linkGenerado = null" class="absolute right-5 top-5 text-slate-400 hover:text-slate-600 text-xl">✕</button>
        <h3 class="font-black text-slate-800 dark:text-white">Link listo para {{ linkGenerado.nombre }}</h3>
        <img :src="linkGenerado.qr" alt="Código QR del documento" class="mx-auto w-56 h-56 rounded-xl bg-white p-2" />
        <p class="text-xs text-slate-500 dark:text-slate-400">
          Vence: {{ formatFecha(linkGenerado.expira) }}. Solo se puede usar una vez y pedirá un código al WhatsApp del tutor.
        </p>
        <p v-if="linkGenerado.tipo === 'EUTANASIA'" class="text-xs font-bold text-amber-700 bg-amber-50 rounded-xl p-3">
          Este documento se firma en la clínica: pide al tutor que escanee el QR, después de hablar con el veterinario.
        </p>
        <a v-else :href="whatsappLink(linkGenerado)" target="_blank"
          class="block py-3 bg-green-500 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl">
          Enviar por WhatsApp
        </a>
        <button @click="copiarLinkGenerado"
          class="w-full py-3 bg-[#152C77]/10 text-[#152C77] dark:text-blue-300 font-black uppercase text-[10px] tracking-widest rounded-2xl">
          Copiar link
        </button>
      </div>
    </div>
  </Teleport>

  <!-- Modal firma del veterinario -->
  <Teleport to="body">
    <div v-if="modalVeterinario" class="fixed inset-0 z-[9000] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div class="absolute inset-0 bg-black/50" @click="modalVeterinario = null"></div>
      <div class="relative bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl p-5 space-y-3">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[9px] font-black uppercase tracking-widest text-slate-400">{{ modalVeterinario.radicado }}</p>
            <h3 class="font-black text-slate-800 dark:text-white">Firma del médico veterinario</h3>
            <p class="text-xs text-slate-400">{{ modalVeterinario.nombreCliente }} · 🐾 {{ modalVeterinario.nombreMascota }}</p>
          </div>
          <button @click="modalVeterinario = null" class="text-slate-400 hover:text-slate-600 text-xl">✕</button>
        </div>
        <div>
          <label class="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1">Nombre del médico veterinario *</label>
          <input v-model="firmaVet.nombre" type="text"
            class="w-full border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-sm bg-white dark:bg-white/5 dark:text-white focus:outline-none focus:border-[#152C77]" />
        </div>
        <div>
          <label class="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1">Matrícula profesional (MP) *</label>
          <input v-model="firmaVet.matricula" type="text"
            class="w-full border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-sm bg-white dark:bg-white/5 dark:text-white focus:outline-none focus:border-[#152C77]" />
        </div>
        <div class="bg-white rounded-xl">
          <FirmaCanvas @firmado="v => firmaVet.firmaBase64 = v" />
        </div>
        <p v-if="errorVet" class="text-red-500 text-sm">{{ errorVet }}</p>
        <button @click="firmarVeterinario" :disabled="firmandoVet || !firmaVet.nombre.trim() || !firmaVet.matricula.trim() || !firmaVet.firmaBase64"
          class="w-full py-3.5 bg-[#152C77] text-white font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-[#DE1F27] transition-colors disabled:opacity-50">
          {{ firmandoVet ? 'Guardando...' : 'Firmar y enviar copia al tutor' }}
        </button>
      </div>
    </div>
  </Teleport>
</template>
