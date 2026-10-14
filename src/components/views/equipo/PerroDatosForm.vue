<template>
  <div class="space-y-4">
    <div class="grid grid-cols-3 gap-2">
      <button v-for="t in TIPOS" :key="t.id" type="button" @click="modelValue.tipo = t.id"
        class="py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] border transition-colors"
        :class="modelValue.tipo === t.id ? 'bg-blue-500 border-blue-500 text-white' : 'bg-white/5 border-white/10 text-white/60'">
        {{ t.label }}
      </button>
    </div>

    <div v-if="modelValue.tipo === 'HOTEL'" class="space-y-2">
      <p class="text-[10px] font-black uppercase tracking-widest text-white/40">¿Hasta cuándo se queda?</p>
      <input type="date" v-model="modelValue.salidaEsperada" :min="minFecha"
        class="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 text-base font-bold outline-none focus:border-blue-500 [color-scheme:dark]" />
      <div class="flex flex-wrap gap-2">
        <button v-for="n in [1, 2, 3, 5, 7, 15]" :key="n" type="button" @click="sumarDias(n)"
          class="text-[11px] font-bold bg-white/5 border border-white/10 rounded-full px-3 py-1.5 text-white/70 active:bg-white/20">
          {{ n }} {{ n === 1 ? 'noche' : 'noches' }}
        </button>
      </div>
    </div>

    <div v-if="modelValue.tipo !== 'BANO'" class="space-y-2">
      <p class="text-[10px] font-black uppercase tracking-widest text-white/40">Comida que trajo (opcional)</p>
      <div class="grid grid-cols-2 gap-2">
        <button v-for="u in UNIDADES" :key="u.id" type="button" @click="modelValue.comidaUnidad = u.id"
          class="py-2 rounded-xl font-black uppercase tracking-widest text-[9px] border transition-colors"
          :class="unidad === u.id ? 'bg-amber-500 border-amber-500 text-black' : 'bg-white/5 border-white/10 text-white/50'">
          {{ u.label }}
        </button>
      </div>
      <div class="grid grid-cols-2 gap-2">
        <label class="space-y-1">
          <span class="text-[9px] font-bold text-white/40">{{ cantidadLabel }}</span>
          <input v-model="modelValue.comidaCantidad" inputmode="decimal" :placeholder="unidad === 'GRAMOS' ? 'Ej: 3000' : 'Ej: 14'"
            class="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 text-base font-bold outline-none focus:border-amber-500 placeholder:text-white/20" />
        </label>
        <label class="space-y-1">
          <span class="text-[9px] font-bold text-white/40">Come al día</span>
          <input v-model="modelValue.comidaPorDia" inputmode="decimal" :placeholder="unidad === 'GRAMOS' ? 'Ej: 300' : 'Ej: 2'"
            class="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 text-base font-bold outline-none focus:border-amber-500 placeholder:text-white/20" />
        </label>
      </div>
      <p v-if="calculo" class="text-[12px] font-bold" :class="calculo.alcanza ? 'text-green-300' : 'text-red-300'">{{ calculo.texto }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

// Edita en sitio el objeto que recibe (tipo, salidaEsperada, comidaCantidad, comidaUnidad, comidaPorDia)
const props = defineProps({
  modelValue: { type: Object, required: true },
  // Cuando se edita un perro que ya está adentro, el cálculo parte de lo que le queda, no de lo que trajo
  diasTranscurridos: { type: Number, default: 0 },
  // Fecha de entrada (ISO) al corregir un perro que ya está adentro; las noches se cuentan desde ahí
  entrada: { type: String, default: null },
})

const TIPOS = [{ id: 'DIA', label: '☀️ Guardería' }, { id: 'HOTEL', label: '🌙 Hotel' }, { id: 'BANO', label: '🛁 Baño' }]
const UNIDADES = [{ id: 'PORCIONES', label: 'Porciones / bolsitas' }, { id: 'GRAMOS', label: 'Gramos' }]

const unidad = computed(() => props.modelValue.comidaUnidad || 'PORCIONES')
const cantidadLabel = computed(() => unidad.value === 'GRAMOS' ? 'Gramos en total' : 'Porciones en total')

function hoyLocal(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
const fechaBase = () => props.entrada ? new Date(props.entrada) : new Date()
const minFecha = hoyLocal(fechaBase())

function sumarDias(n) {
  const d = fechaBase()
  d.setDate(d.getDate() + n)
  props.modelValue.salidaEsperada = hoyLocal(d)
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
  if (!salida) return { alcanza: dias >= 1, texto: `🍖 Alcanza para ${diasTxt}` }
  const noches = Math.round((new Date(salida + 'T12:00:00') - new Date(hoyLocal() + 'T12:00:00')) / 86400000)
  return dias >= noches
    ? { alcanza: true, texto: `🍖 Alcanza para ${diasTxt}: suficiente hasta la salida` }
    : { alcanza: false, texto: `⚠️ Alcanza para ${diasTxt} y se queda ${noches} noche(s): hay que avisarle al dueño` }
})
</script>
