<template>
  <div class="space-y-6">

    <!-- Encabezado -->
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div>
        <p class="text-[10px] font-black uppercase tracking-widest text-slate-400">Armadas con los formatos que llenan los tutores</p>
        <p class="text-2xl font-[1000] uppercase italic dark:text-white">
          Fichas <span class="text-[#DE1F27]">mascotas</span>
        </p>
      </div>
      <button @click="recargar" :disabled="cargando"
        class="self-start sm:self-auto px-4 py-2 bg-[#152C77] text-white text-[10px] font-black uppercase tracking-widest rounded-2xl disabled:opacity-40">
        {{ cargando ? '...' : '↻ Actualizar' }}
      </button>
    </div>

    <!-- Pestañas -->
    <div class="flex flex-wrap gap-2">
      <button @click="vista = 'recordar'"
        :class="vista === 'recordar' ? 'bg-[#152C77] text-white' : 'bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500'"
        class="px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all">
        📲 Por recordar <span v-if="pendientes.length" class="ml-1 opacity-70">({{ pendientes.length }})</span>
      </button>
      <button @click="vista = 'fichas'"
        :class="vista === 'fichas' ? 'bg-[#152C77] text-white' : 'bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500'"
        class="px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all">
        🐾 Fichas <span v-if="fichas.length" class="ml-1 opacity-70">({{ fichas.length }})</span>
      </button>
    </div>

    <p v-if="error" class="text-[11px] font-bold text-[#DE1F27]">{{ error }}</p>

    <!-- ── POR RECORDAR ── -->
    <div v-if="vista === 'recordar'" class="space-y-3">
      <p class="text-[11px] font-bold text-slate-500 dark:text-slate-400 leading-relaxed">
        Peluquería: un mes después del último servicio. Vacunas: las que vencen en los próximos 15 días (o ya vencieron) según lo anotado en la ficha.
        Las mascotas cuyo tutor respondió BAJA no aparecen.
      </p>

      <div v-if="!cargando && !pendientes.length" class="py-16 text-center text-slate-400 font-bold text-sm">
        No hay recordatorios pendientes hoy 🎉
      </div>

      <div v-for="r in pendientes" :key="r.tipo + r.fichaId + r.referencia"
        class="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[2rem] p-5">
        <div class="flex flex-col md:flex-row md:items-start gap-4">
          <div class="flex-1 min-w-0">
            <div class="flex flex-wrap items-center gap-2 mb-1">
              <span class="text-sm font-[1000] uppercase italic dark:text-white">{{ r.mascota }}</span>
              <span class="text-[9px] font-black px-2 py-1 rounded-xl"
                :class="r.tipo === 'VACUNA' ? (r.dias < 0 ? 'bg-red-100 text-[#DE1F27]' : 'bg-green-100 text-green-700') : 'bg-blue-100 text-blue-700'">
                {{ r.tipo === 'VACUNA' ? '💉' : '🛁' }} {{ r.detalle }}
              </span>
            </div>
            <p class="text-[11px] font-bold text-slate-500 dark:text-slate-400">
              {{ r.tutor || 'Sin nombre' }} · {{ telefonoBonito(r.telefono) }}
              <span v-if="r.raza"> · {{ r.raza }}</span>
            </p>
            <p class="mt-3 text-[11px] text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-white/5 rounded-2xl p-3 whitespace-pre-wrap leading-relaxed">{{ r.texto }}</p>
          </div>

          <div class="flex flex-row flex-wrap md:flex-col gap-2 md:w-44 shrink-0">
            <button v-if="r.plantillaLista" @click="enviarPlantilla(r)" :disabled="ocupado"
              class="flex-1 px-3 py-2.5 rounded-xl bg-[#152C77] text-white text-[9px] font-black uppercase tracking-widest disabled:opacity-40">
              📤 Enviar automático
            </button>
            <a :href="r.linkManual" target="_blank" rel="noopener" @click="marcarManual(r)"
              class="flex-1 text-center px-3 py-2.5 rounded-xl bg-[#25D366] text-white text-[9px] font-black uppercase tracking-widest">
              💬 Escribir por WhatsApp
            </a>
            <button @click="omitir(r)" :disabled="ocupado"
              class="flex-1 px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-300 text-[9px] font-black uppercase tracking-widest disabled:opacity-40">
              Omitir
            </button>
            <button @click="abrirFicha(r.fichaId)"
              class="flex-1 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-[#152C77] dark:text-blue-300 text-[9px] font-black uppercase tracking-widest">
              Ver ficha
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ── FICHAS ── -->
    <div v-else class="space-y-3">
      <div class="relative">
        <span class="absolute left-4 top-1/2 -translate-y-1/2 opacity-40">🔍</span>
        <input v-model="q" @input="buscarConPausa" placeholder="Buscar por mascota, tutor o teléfono..."
          class="w-full pl-10 pr-4 py-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-sm font-bold dark:text-white focus:outline-none focus:ring-2 focus:ring-[#152C77]/30" />
      </div>

      <div v-if="!cargando && !fichas.length" class="py-16 text-center text-slate-400 font-bold text-sm">
        No hay fichas con esa búsqueda
      </div>

      <button v-for="f in fichas" :key="f.id" @click="abrirFicha(f.id)"
        class="w-full text-left bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[2rem] p-4 hover:border-[#152C77]/40 transition-colors">
        <div class="flex items-start gap-3">
          <div class="w-10 h-10 rounded-2xl bg-[#152C77]/10 dark:bg-white/10 flex items-center justify-center text-lg shrink-0">
            {{ emojiEspecie(f.especie) }}
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex flex-wrap items-center gap-2">
              <span class="text-sm font-[1000] uppercase italic dark:text-white">{{ f.mascota }}</span>
              <span v-if="!f.recibeRecordatorios" class="text-[9px] font-black px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-500">🔕 Sin recordatorios</span>
              <span v-if="f.proximaVacuna" class="text-[9px] font-black px-2 py-0.5 rounded-full bg-green-100 text-green-700">💉 {{ fechaBonita(f.proximaVacuna) }}</span>
            </div>
            <p class="text-[11px] font-bold text-slate-500 dark:text-slate-400 truncate">
              {{ f.tutor || 'Sin nombre' }} · {{ telefonoBonito(f.telefono) }}<span v-if="f.raza"> · {{ f.raza }}</span>
            </p>
            <p class="text-[10px] font-bold text-slate-400 mt-1">
              {{ f.formatos }} formato{{ f.formatos === 1 ? '' : 's' }}
              <span v-if="f.tipos?.length"> ({{ f.tipos.map(nombreTipo).join(', ') }})</span>
              <span v-if="f.ultimaVisita"> · última visita {{ fechaBonita(f.ultimaVisita) }}</span>
            </p>
          </div>
        </div>
      </button>
    </div>

    <!-- ── DETALLE DE LA FICHA ── -->
    <div v-if="ficha" class="fixed inset-0 z-[5000] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-4" @click.self="ficha = null">
      <div class="bg-white dark:bg-[#0A0A0A] w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto rounded-t-[2rem] sm:rounded-[2rem] p-6 space-y-6">

        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-[10px] font-black uppercase tracking-widest text-slate-400">{{ emojiEspecie(ficha.especie) }} {{ ficha.especie || 'Mascota' }}<span v-if="ficha.raza"> · {{ ficha.raza }}</span></p>
            <p class="text-2xl font-[1000] uppercase italic dark:text-white">{{ ficha.mascota }}</p>
            <p class="text-[12px] font-bold text-slate-500 dark:text-slate-400">{{ ficha.tutor }} · {{ telefonoBonito(ficha.telefono) }}</p>
          </div>
          <button @click="ficha = null" class="text-3xl text-slate-400 leading-none">×</button>
        </div>

        <!-- Datos -->
        <div class="grid grid-cols-2 gap-3 text-[11px]">
          <div v-for="d in datosFicha" :key="d.label" class="bg-slate-50 dark:bg-white/5 rounded-2xl p-3">
            <p class="text-[9px] font-black uppercase tracking-widest text-slate-400">{{ d.label }}</p>
            <p class="font-bold text-slate-700 dark:text-white break-words">{{ d.valor }}</p>
          </div>
        </div>
        <p class="text-[10px] font-bold text-slate-400 -mt-3">Los datos se actualizan solos con el formato más nuevo que llene el tutor.</p>

        <!-- Recordatorios sí / no -->
        <div class="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 dark:border-white/10 p-4">
          <div>
            <p class="text-[12px] font-black dark:text-white">{{ ficha.recibeRecordatorios ? '🔔 Recibe recordatorios' : '🔕 No recibe recordatorios' }}</p>
            <p v-if="!ficha.recibeRecordatorios && ficha.sinRecordatoriosPor" class="text-[10px] font-bold text-slate-400">{{ ficha.sinRecordatoriosPor }} · {{ fechaHora(ficha.sinRecordatoriosEn) }}</p>
          </div>
          <button @click="cambiarRecordatorios" :disabled="ocupado"
            class="px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest disabled:opacity-40"
            :class="ficha.recibeRecordatorios ? 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300' : 'bg-[#152C77] text-white'">
            {{ ficha.recibeRecordatorios ? 'Apagar' : 'Volver a activar' }}
          </button>
        </div>

        <!-- Vacunas -->
        <div class="space-y-3">
          <div class="flex items-center justify-between gap-2">
            <p class="text-[11px] font-black uppercase tracking-widest text-[#152C77] dark:text-blue-300">💉 Vacunas</p>
            <button v-for="c in carnets" :key="c.id" @click="verCarnet(c)"
              class="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300">
              📄 Ver carnet {{ c.radicado }}
            </button>
          </div>

          <div v-if="!ficha.vacunas.length" class="text-[11px] font-bold text-slate-400">Todavía no hay vacunas anotadas.</div>
          <div v-for="v in ficha.vacunas" :key="v.id" class="flex items-center justify-between gap-3 bg-slate-50 dark:bg-white/5 rounded-2xl px-4 py-3">
            <div class="text-[11px]">
              <p class="font-black dark:text-white">{{ v.vacuna }}</p>
              <p class="font-bold text-slate-500 dark:text-slate-400">
                <span v-if="v.aplicada">Aplicada {{ fechaBonita(v.aplicada) }} · </span>
                <span :class="vencida(v.vence) ? 'text-[#DE1F27]' : ''">Vence {{ fechaBonita(v.vence) }}</span>
              </p>
              <p v-if="v.registradaPor" class="text-[9px] font-bold text-slate-400">Anotó: {{ v.registradaPor }}</p>
            </div>
            <button @click="borrarVacuna(v)" :disabled="ocupado" class="text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-[#DE1F27]">Quitar</button>
          </div>

          <!-- Agregar vacuna -->
          <div class="rounded-2xl border-2 border-dashed border-slate-200 dark:border-white/10 p-4 space-y-3">
            <p class="text-[10px] font-black uppercase tracking-widest text-slate-500">Anotar vacunas (mirando el carnet)</p>
            <div>
              <p class="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">¿Cuáles se aplicaron? (opcional)</p>
              <div class="flex flex-wrap gap-2">
                <label v-for="o in opcionesVacuna" :key="o"
                  class="flex items-center gap-2 px-3 py-2 rounded-xl border-2 text-[11px] font-bold cursor-pointer select-none"
                  :class="nueva.cuales.includes(o) ? 'border-[#152C77] bg-[#152C77]/5 text-[#152C77] dark:text-blue-300' : 'border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300'">
                  <input type="checkbox" :value="o" v-model="nueva.cuales" class="accent-[#152C77]" /> {{ o }}
                </label>
              </div>
              <input v-model="nueva.otra" placeholder="Otra (opcional)" maxlength="60"
                class="mt-2 w-full sm:w-1/2 px-3 py-2.5 rounded-xl border-2 border-slate-200 dark:border-white/10 bg-white dark:bg-[#050505] text-[12px] font-bold dark:text-white" />
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label class="block">
                <span class="text-[9px] font-black uppercase tracking-widest text-slate-400">Aplicada (opcional)</span>
                <input v-model="nueva.aplicada" type="date" :max="hoy"
                  class="mt-1 w-full px-3 py-2.5 rounded-xl border-2 border-slate-200 dark:border-white/10 bg-white dark:bg-[#050505] text-[12px] font-bold dark:text-white" />
              </label>
              <label class="block">
                <span class="text-[9px] font-black uppercase tracking-widest text-slate-400">Vence / próximo refuerzo</span>
                <input v-model="nueva.vence" type="date"
                  class="mt-1 w-full px-3 py-2.5 rounded-xl border-2 border-slate-200 dark:border-white/10 bg-white dark:bg-[#050505] text-[12px] font-bold dark:text-white" />
              </label>
            </div>
            <button v-if="nueva.aplicada && !nueva.vence" @click="unAnio" type="button"
              class="text-[10px] font-black text-[#152C77] dark:text-blue-300 underline">Poner vencimiento a un año de la aplicación</button>
            <button @click="guardarVacuna" :disabled="ocupado || !nueva.vence"
              class="w-full py-3 rounded-xl bg-[#152C77] text-white text-[10px] font-black uppercase tracking-widest disabled:opacity-40">
              Guardar vacunas
            </button>
          </div>
        </div>

        <!-- Historial -->
        <div class="space-y-2">
          <p class="text-[11px] font-black uppercase tracking-widest text-[#152C77] dark:text-blue-300">📋 Formatos</p>
          <div v-for="x in ficha.formatos" :key="x.id" class="flex flex-wrap items-center justify-between gap-2 text-[11px] bg-slate-50 dark:bg-white/5 rounded-2xl px-4 py-2.5">
            <span class="font-black dark:text-white">{{ nombreTipo(x.tipo) }} <span class="font-bold text-slate-400">{{ x.radicado }}</span></span>
            <span class="font-bold text-slate-500 dark:text-slate-400">
              {{ fechaBonita(x.fecha) }}<span v-if="x.servicio"> · {{ x.servicio }}</span>
              <span v-if="x.noVino" class="text-[#DE1F27]"> · 🚫 No vino</span>
            </span>
          </div>
        </div>

        <!-- Recordatorios enviados -->
        <div v-if="ficha.recordatorios.length" class="space-y-2">
          <p class="text-[11px] font-black uppercase tracking-widest text-[#152C77] dark:text-blue-300">📲 Recordatorios</p>
          <div v-for="r in ficha.recordatorios" :key="r.id" class="text-[11px] font-bold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-white/5 rounded-2xl px-4 py-2.5">
            {{ r.tipo === 'VACUNA' ? '💉 Vacuna' : '🛁 Peluquería' }} · {{ COMO[r.como] || r.como }} · {{ fechaHora(r.en) }}<span v-if="r.porQuien"> · {{ r.porQuien }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import api from '@/api/axios';

const vista = ref('recordar');
const pendientes = ref([]);
const fichas = ref([]);
const ficha = ref(null);
const q = ref('');
const cargando = ref(false);
const ocupado = ref(false);
const error = ref('');

const hoy = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);

const TIPOS = {
  PELUQUERIA: 'Peluquería', GUARDERIA: 'Guardería', VACUNACION: 'Vacunación', HOSPITALIZACION: 'Hospitalización',
  MEDICACION: 'Medicación', CONSENTIMIENTO: 'Consentimiento', EUTANASIA: 'Eutanasia', DECLINACION: 'Declinación',
};
const COMO = { PLANTILLA: 'Enviado automático', MANUAL: 'Escrito desde WhatsApp', OMITIDO: 'Omitido' };
const nombreTipo = t => TIPOS[t] || t;

const quien = () => {
  try { return JSON.parse(localStorage.getItem('ps_session'))?.tutor?.nombre || null; } catch { return null; }
};
const mensajeError = e => e?.response?.data?.message || 'No se pudo completar. Inténtalo de nuevo.';

const telefonoBonito = t => (t && t.length === 10 ? `${t.slice(0, 3)} ${t.slice(3, 6)} ${t.slice(6)}` : t || '');
const fechaBonita = d => {
  if (!d) return '';
  const [y, m, dd] = String(d).slice(0, 10).split('-');
  return `${dd}/${m}/${y}`;
};
const fechaHora = i => (i ? new Date(i).toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' }) : '');
const vencida = d => d && d < hoy;
const emojiEspecie = e => (/gat|felin/i.test(e || '') ? '🐱' : /perr|can/i.test(e || '') ? '🐶' : '🐾');

// ── Cargar ──
async function cargarPendientes() {
  const { data } = await api.get('/admin/fichas/recordatorios/pendientes');
  pendientes.value = data;
}
async function cargarFichas() {
  const { data } = await api.get('/admin/fichas', { params: { q: q.value } });
  fichas.value = data;
}
async function recargar() {
  cargando.value = true;
  error.value = '';
  try {
    await Promise.all([cargarPendientes(), cargarFichas()]);
  } catch (e) {
    error.value = mensajeError(e);
  } finally {
    cargando.value = false;
  }
}
let pausa = null;
function buscarConPausa() {
  clearTimeout(pausa);
  pausa = setTimeout(() => cargarFichas().catch(e => (error.value = mensajeError(e))), 300);
}
onMounted(recargar);

// ── Recordatorios ──
async function registrar(r, como) {
  ocupado.value = true;
  error.value = '';
  try {
    await api.post('/admin/fichas/recordatorios', { fichaId: r.fichaId, tipo: r.tipo, referencia: r.referencia, como, quien: quien() });
    pendientes.value = pendientes.value.filter(x => x !== r);
    return true;
  } catch (e) {
    alert(mensajeError(e));
    return false;
  } finally {
    ocupado.value = false;
  }
}
function enviarPlantilla(r) {
  if (confirm(`¿Enviar el recordatorio a ${r.tutor || 'el tutor'} (${telefonoBonito(r.telefono)}) por WhatsApp?\n\nSale el mensaje que ves en la tarjeta.`))
    registrar(r, 'PLANTILLA');
}
function marcarManual(r) {
  // Primero se abre WhatsApp; al volver se pregunta si sí se envió para sacarlo de la lista
  setTimeout(() => {
    if (confirm(`¿Le enviaste el mensaje a ${r.tutor || 'el tutor'}?\n\nSi dices que sí, sale de la lista.`)) registrar(r, 'MANUAL');
  }, 400);
}
function omitir(r) {
  if (confirm(`¿Omitir este recordatorio de ${r.mascota}? No se le envía y sale de la lista.`)) registrar(r, 'OMITIDO');
}

// ── Ficha ──
async function abrirFicha(id) {
  error.value = '';
  try {
    const { data } = await api.get(`/admin/fichas/${id}`);
    ficha.value = data;
    Object.assign(nueva, { cuales: [], otra: '', aplicada: '', vence: '' });
  } catch (e) {
    alert(mensajeError(e));
  }
}

const datosFicha = computed(() => {
  const f = ficha.value;
  if (!f) return [];
  return [
    { label: 'Sexo', valor: f.sexo },
    { label: 'Nacimiento', valor: f.fechaNacimiento ? fechaBonita(f.fechaNacimiento) : f.edad },
    { label: 'Color', valor: f.color },
    { label: 'Correo', valor: f.email },
    { label: 'Comida', valor: f.alimentacion },
  ].filter(d => d.valor);
});

const carnets = computed(() => (ficha.value?.formatos || []).filter(x => x.tieneCarnet).slice(0, 2));

async function verCarnet(c) {
  const ventana = window.open('', '_blank');
  try {
    const resp = await api.get(`/admin/formularios/${c.id}/adjunto/carnet`, { responseType: 'blob' });
    const url = URL.createObjectURL(resp.data);
    if (ventana) ventana.location = url;
    else window.location = url;
  } catch {
    ventana?.close();
    alert('No se pudo abrir el carnet');
  }
}

async function cambiarRecordatorios() {
  const f = ficha.value;
  const recibe = !f.recibeRecordatorios;
  const pregunta = recibe
    ? `¿Volver a enviarle recordatorios a ${f.tutor || 'este tutor'} sobre ${f.mascota}?`
    : `¿Dejar de enviarle recordatorios sobre ${f.mascota}?`;
  if (!confirm(pregunta)) return;
  ocupado.value = true;
  try {
    await api.patch(`/admin/fichas/${f.id}/recordatorios`, { recibe, quien: quien() });
    await abrirFicha(f.id);
    recargar();
  } catch (e) {
    alert(mensajeError(e));
  } finally {
    ocupado.value = false;
  }
}

// ── Vacunas ──
const nueva = reactive({ cuales: [], otra: '', aplicada: '', vence: '' });
const opcionesVacuna = computed(() => {
  const esGato = /gat|felin/i.test(ficha.value?.especie || '');
  return esGato
    ? ['Rabia', 'Triple felina', 'Leucemia felina']
    : ['Rabia', 'Múltiple (polivalente)', 'Tos de las perreras (Bordetella)', 'Leptospirosis'];
});
// Normalmente se aplican todas juntas: se guardan en un solo registro con una fecha de vencimiento
const vacunaElegida = computed(() => [...nueva.cuales, nueva.otra.trim()].filter(Boolean).join(', ') || 'Vacunas');

function unAnio() {
  const d = new Date(nueva.aplicada + 'T12:00:00');
  d.setFullYear(d.getFullYear() + 1);
  nueva.vence = d.toISOString().slice(0, 10);
}

async function guardarVacuna() {
  const f = ficha.value;
  const resumen = `${vacunaElegida.value}\n${nueva.aplicada ? 'Aplicada: ' + fechaBonita(nueva.aplicada) + '\n' : ''}Vence: ${fechaBonita(nueva.vence)}`;
  if (!confirm(`¿Seguro que quieres guardar las vacunas de ${f.mascota}?\n\n${resumen}`)) return;
  ocupado.value = true;
  try {
    await api.post(`/admin/fichas/${f.id}/vacunas`, {
      vacuna: vacunaElegida.value, aplicada: nueva.aplicada || null, vence: nueva.vence, quien: quien(),
    });
    await abrirFicha(f.id);
    recargar();
  } catch (e) {
    alert(mensajeError(e));
  } finally {
    ocupado.value = false;
  }
}

async function borrarVacuna(v) {
  if (!confirm(`¿Quitar la vacuna ${v.vacuna} (vence ${fechaBonita(v.vence)}) de ${ficha.value.mascota}?`)) return;
  ocupado.value = true;
  try {
    await api.delete(`/admin/fichas/${ficha.value.id}/vacunas/${v.id}`);
    await abrirFicha(ficha.value.id);
    recargar();
  } catch (e) {
    alert(mensajeError(e));
  } finally {
    ocupado.value = false;
  }
}
</script>
