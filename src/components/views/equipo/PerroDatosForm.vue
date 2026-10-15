<template>
  <div class="space-y-4">
    <div class="grid grid-cols-2 gap-2">
      <button v-for="e in ESPECIES" :key="e.id" type="button" @click="modelValue.especie = e.id"
        class="py-3 rounded-2xl font-black uppercase tracking-widest text-[11px] border transition-colors"
        :class="(modelValue.especie || 'PERRO') === e.id ? 'bg-white text-black border-white' : 'bg-white/5 border-white/10 text-white/60'">
        {{ e.label }}
      </button>
    </div>

    <div class="grid grid-cols-3 gap-2">
      <button v-for="t in TIPOS" :key="t.id" type="button" @click="modelValue.tipo = t.id"
        class="py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] border transition-colors"
        :class="modelValue.tipo === t.id ? 'bg-blue-500 border-blue-500 text-white' : 'bg-white/5 border-white/10 text-white/60'">
        {{ t.label }}
      </button>
    </div>

    <div v-if="modelValue.tipo === 'HOTEL'" class="space-y-2">
      <p class="text-[10px] font-black uppercase tracking-widest text-white/40">¿Cuántas noches se queda?</p>
      <div class="flex items-center gap-3">
        <button type="button" @click="noches = Math.max(1, (noches || 1) - 1)"
          class="w-12 h-12 rounded-2xl bg-white/10 text-2xl font-black active:scale-95">−</button>
        <p class="flex-1 text-center">
          <span class="text-3xl font-[1000] tabular-nums">{{ noches || '—' }}</span>
          <span class="block text-[10px] text-white/40">{{ noches ? 'sale el ' + fechaCorta(modelValue.salidaEsperada) : 'sin definir' }}</span>
        </p>
        <button type="button" @click="noches = (noches || 0) + 1"
          class="w-12 h-12 rounded-2xl bg-white/10 text-2xl font-black active:scale-95">+</button>
      </div>
    </div>

    <!-- Comida: solo al corregir, opcional -->
    <details v-if="conComida && modelValue.tipo !== 'BANO'" class="space-y-2" :open="!!modelValue.comidaCantidad">
      <summary class="text-[10px] font-black uppercase tracking-widest text-white/40 cursor-pointer">🍖 Comida que trajo (opcional)</summary>
      <div class="grid grid-cols-2 gap-2 pt-2">
        <button v-for="u in UNIDADES" :key="u.id" type="button" @click="modelValue.comidaUnidad = u.id"
          class="py-2 rounded-xl font-black uppercase tracking-widest text-[9px] border transition-colors"
          :class="unidad === u.id ? 'bg-amber-500 border-amber-500 text-black' : 'bg-white/5 border-white/10 text-white/50'">
          {{ u.label }}
        </button>
      </div>
      <div class="grid grid-cols-2 gap-2">
        <label class="space-y-1">
          <span class="text-[9px] font-bold text-white/40">{{ unidad === 'GRAMOS' ? 'Gramos en total' : 'Porciones en total' }}</span>
          <input v-model="modelValue.comidaCantidad" inputmode="decimal"
            class="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 text-base font-bold outline-none focus:border-amber-500" />
        </label>
        <label class="space-y-1">
          <span class="text-[9px] font-bold text-white/40">Come al día</span>
          <input v-model="modelValue.comidaPorDia" inputmode="decimal"
            class="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 text-base font-bold outline-none focus:border-amber-500" />
        </label>
      </div>
      <p v-if="calculo" class="text-[12px] font-bold" :class="calculo.alcanza ? 'text-green-300' : 'text-red-300'">{{ calculo.texto }}</p>
    </details>
  </div>
</template>

<script setup>
import { computed } from 'vue'

// Edita en sitio el objeto que recibe (especie, tipo, salidaEsperada y, si conComida, la comida)
const props = defineProps({
  modelValue: { type: Object, required: true },
  conComida: { type: Boolean, default: false },
  diasTranscurridos: { type: Number, default: 0 },
  // Fecha de entrada (ISO) al corregir una mascota que ya está adentro; las noches se cuentan desde ahí
  entrada: { type: String, default: null },
})

const ESPECIES = [{ id: 'PERRO', label: '🐕 Perro' }, { id: 'GATO', label: '🐈 Gato' }]
const TIPOS = [{ id: 'DIA', label: '☀️ Guardería' }, { id: 'HOTEL', label: '🌙 Hotel' }, { id: 'BANO', label: '🛁 Baño' }]
const UNIDADES = [{ id: 'PORCIONES', label: 'Porciones' }, { id: 'GRAMOS', label: 'Gramos' }]

const unidad = computed(() => props.modelValue.comidaUnidad || 'PORCIONES')

function fechaLocal(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
const base = () => {
  const d = props.entrada ? new Date(props.entrada) : new Date()
  d.setHours(12, 0, 0, 0)
  return d
}

const noches = computed({
  get() {
    const f = props.modelValue.salidaEsperada
    if (!f) return null
    return Math.max(1, Math.round((new Date(f + 'T12:00:00') - base()) / 86400000))
  },
  set(n) {
    const d = base()
    d.setDate(d.getDate() + n)
    props.modelValue.salidaEsperada = fechaLocal(d)
  },
})

function fechaCorta(f) {
  return f ? new Date(f + 'T12:00:00').toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric', month: 'short' }) : ''
}

const num = v => {
  const n = parseFloat(String(v ?? '').replace(',', '.'))
  return Number.isFinite(n) && n > 0 ? n : null
}

const calculo = computed(() => {
  const cant = num(props.modelValue.comidaCantidad)
  const porDia = num(props.modelValue.comidaPorDia)
  if (!cant || !porDia) return null
  const dias = Math.max(0, cant / porDia - props.diasTranscurridos)
  const diasTxt = dias < 1 ? 'menos de un día' : `${Math.floor(dias * 10) / 10} días`
  const salida = props.modelValue.tipo === 'HOTEL' && props.modelValue.salidaEsperada
  if (!salida) return { alcanza: dias >= 1, texto: `Alcanza para ${diasTxt}` }
  const hoy = new Date(); hoy.setHours(12, 0, 0, 0)
  const restantes = Math.round((new Date(salida + 'T12:00:00') - hoy) / 86400000)
  return dias >= restantes
    ? { alcanza: true, texto: `Alcanza para ${diasTxt}: suficiente hasta la salida` }
    : { alcanza: false, texto: `⚠️ Alcanza para ${diasTxt} y faltan ${restantes} noche(s): avisarle al dueño` }
})
</script>
