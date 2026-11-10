<script>
// Las fotos se piden con la sesión (no sirven como <img src> directo) y se guardan para no bajarlas en cada actualización
const fotos = new Map()
</script>

<script setup>
import { ref, computed, watch } from 'vue'
import api from '@/api/axios'

// formato: la ficha que arma el backend con lo que el dueño llenó en el formato de guardería
const props = defineProps({
  formato: { type: Object, required: true },
  completa: { type: Boolean, default: false },
  // Solo la foto, para la lista de las que están adentro
  miniatura: { type: Boolean, default: false },
})

const foto = ref(null)

watch(() => props.formato.formularioId, async id => {
  foto.value = null
  if (!props.formato.conFoto) return
  if (!fotos.has(id)) {
    fotos.set(id, api.get(`/jornada/guarderia/formato/${id}/foto`, { responseType: 'blob' })
      .then(r => URL.createObjectURL(r.data))
      .catch(() => { fotos.delete(id); return null }))
  }
  foto.value = await fotos.get(id)
}, { immediate: true })

const avisos = computed(() => {
  const f = props.formato
  const a = []
  if (f.medicamentos || f.tratamiento) a.push({ t: '💊 Medicamentos', c: 'bg-amber-500/20 text-amber-300' })
  if (f.braquicefala) a.push({ t: '😮‍💨 Braquicéfalo', c: 'bg-red-500/20 text-red-300' })
  if (f.alergias) a.push({ t: '⚠️ Alergias', c: 'bg-red-500/20 text-red-300' })
  if (f.adaptacion) a.push({ t: '🆕 Necesita adaptación', c: 'bg-blue-500/20 text-blue-300' })
  if (f.agresividad) a.push({ t: '⚠️ Agresividad', c: 'bg-red-500/20 text-red-300' })
  if (f.temperamento && f.temperamento !== 'Dócil') a.push({ t: f.temperamento, c: 'bg-white/10 text-white/60' })
  return a
})

// El formato arma "Tipo: - · Horario: -" aunque no hayan escrito nada
const comida = computed(() => /[^-·\s]/.test((props.formato.alimentacion || '').replace(/Tipo:|Horario:/g, '')) ? props.formato.alimentacion : '')

function fechaCorta(f) {
  return f ? new Date(f + 'T12:00:00').toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric', month: 'short' }) : ''
}
</script>

<template>
  <img v-if="miniatura && foto" :src="foto" alt="" class="w-9 h-9 object-cover rounded-lg shrink-0 -mr-1" />
  <div v-else-if="!miniatura" class="space-y-3">
    <div class="flex gap-3 items-start">
      <img v-if="foto" :src="foto" alt="" :class="['object-cover rounded-2xl shrink-0 bg-white/5', completa ? 'w-24 h-24' : 'w-16 h-16']" />
      <div v-else :class="['rounded-2xl shrink-0 bg-white/5 flex items-center justify-center', completa ? 'w-24 h-24 text-4xl' : 'w-16 h-16 text-2xl']">
        {{ formato.especie === 'GATO' ? '🐈' : '🐕' }}
      </div>
      <div class="min-w-0 flex-1">
        <p class="text-[15px] font-bold truncate">{{ formato.perro }}</p>
        <p class="text-[10px] text-white/40 truncate">
          {{ [formato.raza, formato.dueno && 'de ' + formato.dueno].filter(Boolean).join(' · ') }}
        </p>
        <p class="text-[10px] font-bold text-purple-300/80">
          {{ formato.tipo === 'HOTEL' ? `🌙 Hotel hasta el ${fechaCorta(formato.fechaSalida)}` : '☀️ Guardería' }}
        </p>
        <div v-if="avisos.length" class="flex flex-wrap gap-1 mt-1">
          <span v-for="a in avisos" :key="a.t" :class="['text-[9px] font-black uppercase px-2 py-0.5 rounded-full', a.c]">{{ a.t }}</span>
        </div>
      </div>
    </div>

    <div v-if="completa" class="space-y-2 text-[12px]">
      <div v-if="formato.tratamiento || formato.medicamentos" class="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-3">
        <p class="text-[9px] font-black uppercase tracking-widest text-amber-300 mb-1">💊 Tratamiento{{ formato.tratamiento ? ': ' + formato.tratamiento : '' }}</p>
        <p v-for="m in (formato.medicamentos || '').split('\n').filter(Boolean)" :key="m" class="text-white/80">{{ m }}</p>
      </div>
      <p v-if="formato.alergias" class="text-red-300"><b>Alergias:</b> {{ formato.alergias }}</p>
      <p v-if="comida" class="text-white/60"><b class="text-white/80">Comida:</b> {{ comida }}</p>
      <p v-if="formato.sociable" class="text-white/60"><b class="text-white/80">Con otros {{ formato.especie === 'GATO' ? 'gatos' : 'perros' }}:</b> {{ formato.sociable }}</p>
      <p v-if="formato.observaciones" class="text-white/60"><b class="text-white/80">Notas del dueño:</b> {{ formato.observaciones }}</p>
      <p class="text-[10px] text-white/30">Formato {{ formato.radicado }}</p>
    </div>
  </div>
</template>
