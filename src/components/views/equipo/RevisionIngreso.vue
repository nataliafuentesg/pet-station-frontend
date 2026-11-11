<script setup>
// Revisión de ingreso del formato de guardería: la misma que se hace en el panel, pero al recibir la mascota
const revision = defineModel({ type: Object, required: true })

const PUNTOS = { ojos: 'Ojos', orejas: 'Orejas', boca: 'Boca y dientes', piel: 'Piel y pelaje', pulpejos: 'Pulpejos', zonaPerianal: 'Zona perianal' }
const HALLAZGOS = { desenrede: 'Desenrede', ectoparasitos: 'Ectoparásitos' }
</script>

<script>
export const revisionVacia = () => ({
  pesoKg: '', ojos: '', orejas: '', boca: '', piel: '', pulpejos: '', zonaPerianal: '',
  desenrede: '', ectoparasitos: '', observacionesIngreso: ''
})

export const revisionCompleta = r =>
  ['ojos', 'orejas', 'boca', 'piel', 'pulpejos', 'zonaPerianal', 'desenrede', 'ectoparasitos'].every(c => r[c])
</script>

<template>
  <div class="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
    <p class="text-[10px] font-black uppercase tracking-widest text-white/40">🔍 Revisión de ingreso</p>
    <input v-model="revision.pesoKg" type="number" step="0.1" inputmode="decimal" placeholder="Peso (kg)"
      class="w-full bg-white/10 border border-white/10 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-500 placeholder:text-white/30" />
    <div v-for="(label, campo) in PUNTOS" :key="campo" class="flex items-center gap-2">
      <span class="text-[12px] font-bold text-white/70 w-24 shrink-0">{{ label }}</span>
      <button v-for="op in ['Normal', 'Anormal']" :key="op" type="button" @click="revision[campo] = op"
        :class="['flex-1 py-2 rounded-xl text-[9px] font-black uppercase border',
          revision[campo] === op ? (op === 'Normal' ? 'bg-green-500 border-green-500' : 'bg-red-500 border-red-500') : 'border-white/10 text-white/40']">
        {{ op }}
      </button>
    </div>
    <div v-for="(label, campo) in HALLAZGOS" :key="campo" class="flex items-center gap-2">
      <span class="text-[12px] font-bold text-white/70 w-24 shrink-0">{{ label }}</span>
      <button v-for="op in ['No', 'Sí']" :key="op" type="button" @click="revision[campo] = op"
        :class="['flex-1 py-2 rounded-xl text-[9px] font-black uppercase border',
          revision[campo] === op ? (op === 'No' ? 'bg-green-500 border-green-500' : 'bg-red-500 border-red-500') : 'border-white/10 text-white/40']">
        {{ op }}
      </button>
    </div>
    <textarea v-model="revision.observacionesIngreso" rows="2" placeholder="Observaciones del ingreso (opcional)"
      class="w-full bg-white/10 border border-white/10 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-500 placeholder:text-white/30"></textarea>
  </div>
</template>
