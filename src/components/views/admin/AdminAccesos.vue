<template>
  <div class="space-y-6">

    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h2 class="text-lg font-[1000] uppercase italic dark:text-white">Administradores limitados</h2>
        <p class="text-[10px] text-slate-500 dark:text-white/30 uppercase tracking-widest">Entran al panel y solo ven las pestañas que les marques</p>
      </div>
      <div class="flex flex-wrap gap-2">
        <button @click="abrirExistente"
          class="flex items-center gap-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[#152C77] dark:text-blue-300 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest">
          👤 Dar acceso a una cuenta existente
        </button>
        <button @click="abrirForm()"
          class="flex items-center gap-2 bg-[#152C77] hover:bg-[#DE1F27] text-white px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-colors">
          🔐 Nuevo administrador
        </button>
      </div>
    </div>

    <div class="bg-white dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10 overflow-x-auto">
      <div v-if="loading" class="py-20 text-center">
        <div class="w-8 h-8 border-4 border-[#DE1F27] border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
      <div v-else-if="error" class="py-16 text-center text-red-500 text-[12px] font-bold">{{ error }}</div>
      <div v-else-if="!gestores.length" class="py-16 text-center text-slate-400 dark:text-white/30 text-[11px] uppercase tracking-widest">
        Aún no hay administradores limitados
      </div>
      <table v-else class="w-full text-left min-w-[640px]">
        <thead class="bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-white/10">
          <tr>
            <th v-for="h in ['Nombre', 'Usuario', 'Puede ver', 'Estado', '']" :key="h"
              class="px-5 py-3 text-[8px] font-black uppercase opacity-40 tracking-widest dark:text-white">{{ h }}</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 dark:divide-white/5">
          <tr v-for="g in gestores" :key="g.tutorId">
            <td class="px-5 py-3 font-[1000] uppercase italic text-[12px] dark:text-white">
              {{ g.nombre }}
              <span v-if="g.cuentaExistente" class="block not-italic normal-case text-[9px] font-black text-[#152C77] dark:text-blue-300">
                {{ g.rol === 'ROLE_VET' ? '🩺 También veterinario (clínica)' : 'Cuenta existente' }}
              </span>
            </td>
            <td class="px-5 py-3 text-[11px] font-bold text-slate-500 dark:text-slate-400">{{ g.usuario }}</td>
            <td class="px-5 py-3">
              <div class="flex flex-wrap gap-1">
                <span v-for="s in g.secciones" :key="s"
                  class="text-[9px] px-2 py-0.5 rounded-full bg-[#152C77]/10 text-[#152C77] dark:text-blue-300 font-black uppercase">{{ secciones[s] || s }}</span>
                <span v-if="!g.secciones.length" class="text-[10px] text-amber-500 font-bold">Ninguna</span>
              </div>
            </td>
            <td class="px-5 py-3">
              <span class="text-[9px] px-2.5 py-1 rounded-full font-black uppercase"
                :class="g.activo ? 'bg-green-100 dark:bg-green-500/15 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-500/15 text-red-700 dark:text-red-400'">
                {{ g.activo ? 'Activo' : 'Inactivo' }}
              </span>
            </td>
            <td class="px-5 py-3 text-right whitespace-nowrap space-x-3">
              <button @click="abrirForm(g)" class="text-[9px] font-black uppercase text-[#152C77] dark:text-blue-300 hover:text-[#DE1F27]">Editar</button>
              <button @click="toggleActivo(g)" class="text-[9px] font-black uppercase"
                :class="g.activo ? 'text-red-400 hover:text-red-600' : 'text-green-500 hover:text-green-700'">
                {{ g.activo ? 'Desactivar' : 'Reactivar' }}
              </button>
              <button @click="eliminar(g)" class="text-[9px] font-black uppercase text-slate-400 hover:text-red-600">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <p class="text-[10px] text-slate-400 dark:text-white/30">
      Entran por el mismo inicio de sesión del sitio y llegan directo al panel. El servidor les bloquea cualquier sección que no tengan marcada.
      No pueden ver esta pestaña de Accesos ni los paneles de WhatsApp, Instagram o redes.
    </p>

    <Teleport to="body">
      <div v-if="existente" class="fixed inset-0 z-[9000] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="existente = null"></div>
        <div class="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-white dark:bg-[#0D1425] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl p-6 space-y-4">
          <h3 class="font-[1000] uppercase italic text-sm dark:text-white">Dar acceso a una cuenta existente</h3>
          <p class="text-[11px] text-slate-500 dark:text-white/50">
            La persona sigue entrando con su mismo usuario y conserva lo que ya tenía (por ejemplo, la clínica). Además verá en el panel las pestañas que marques.
          </p>
          <div class="space-y-1">
            <label :class="labelClass">Cuenta *</label>
            <select v-model="existente.tutorId" :class="inputClass">
              <option :value="null" disabled>Elige una persona</option>
              <option v-for="c in candidatos" :key="c.tutorId" :value="c.tutorId">
                {{ c.nombre }} · {{ c.rol === 'ROLE_VET' ? 'Veterinario' : 'Empleado' }} ({{ c.usuario }})
              </option>
            </select>
          </div>
          <div class="space-y-2">
            <label :class="labelClass">Pestañas que puede ver *</label>
            <div class="grid grid-cols-2 gap-2">
              <label v-for="(nombre, id) in secciones" :key="id"
                class="flex items-center gap-2 rounded-xl px-3 py-2 border cursor-pointer text-[12px] font-bold transition-colors"
                :class="existente.secciones.includes(id) ? 'bg-[#152C77]/10 border-[#152C77]/40 text-[#152C77] dark:text-blue-300' : 'border-slate-200 dark:border-white/10 text-slate-500 dark:text-white/50'">
                <input type="checkbox" :value="id" v-model="existente.secciones" class="accent-[#152C77]" />
                {{ nombre }}
              </label>
            </div>
          </div>
          <div v-if="errorForm" class="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl px-4 py-3 text-[11px] text-red-600 dark:text-red-400">{{ errorForm }}</div>
          <div class="flex gap-3">
            <button @click="existente = null" class="flex-1 bg-slate-100 dark:bg-white/5 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest dark:text-white">Cancelar</button>
            <button @click="guardarExistente" :disabled="!existente.tutorId || !existente.secciones.length || guardando"
              class="flex-1 bg-[#152C77] hover:bg-[#DE1F27] text-white py-3 rounded-xl font-black uppercase text-[10px] tracking-widest disabled:opacity-30">
              {{ guardando ? 'Guardando...' : 'Dar acceso' }}
            </button>
          </div>
        </div>
      </div>

      <div v-if="form" class="fixed inset-0 z-[9000] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="form = null"></div>
        <div class="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-white dark:bg-[#0D1425] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl">
          <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-white/5">
            <h3 class="font-[1000] uppercase italic text-sm dark:text-white">{{ form.tutorId ? 'Editar administrador' : 'Nuevo administrador' }}</h3>
            <button @click="form = null" class="w-8 h-8 flex items-center justify-center bg-slate-100 dark:bg-white/5 rounded-lg text-slate-400 dark:text-white/50">✕</button>
          </div>
          <div class="p-6 space-y-4">
            <div class="grid grid-cols-2 gap-3">
              <div class="space-y-1">
                <label :class="labelClass">Nombre *</label>
                <input v-model="form.nombre" :class="inputClass" />
              </div>
              <div class="space-y-1">
                <label :class="labelClass">Apellido</label>
                <input v-model="form.apellido" :class="inputClass" />
              </div>
            </div>
            <div class="space-y-1">
              <label :class="labelClass">Usuario (correo) *</label>
              <input v-model="form.usuario" :disabled="!!form.tutorId" autocapitalize="none" placeholder="ej: administracion@petstationvet.com"
                :class="inputClass" class="disabled:opacity-50" />
            </div>
            <div v-if="!form.cuentaExistente" class="space-y-1">
              <label :class="labelClass">{{ form.tutorId ? 'Nueva contraseña (opcional)' : 'Contraseña *' }}</label>
              <input v-model="form.password" type="text" placeholder="Mínimo 6 caracteres" :class="inputClass" />
            </div>
            <div class="space-y-2">
              <label :class="labelClass">Pestañas que puede ver *</label>
              <div class="grid grid-cols-2 gap-2">
                <label v-for="(nombre, id) in secciones" :key="id"
                  class="flex items-center gap-2 rounded-xl px-3 py-2 border cursor-pointer text-[12px] font-bold transition-colors"
                  :class="form.secciones.includes(id) ? 'bg-[#152C77]/10 border-[#152C77]/40 text-[#152C77] dark:text-blue-300' : 'border-slate-200 dark:border-white/10 text-slate-500 dark:text-white/50'">
                  <input type="checkbox" :value="id" v-model="form.secciones" class="accent-[#152C77]" />
                  {{ nombre }}
                </label>
              </div>
            </div>

            <div v-if="errorForm" class="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl px-4 py-3 text-[11px] text-red-600 dark:text-red-400">{{ errorForm }}</div>

            <div class="flex gap-3 pt-2">
              <button @click="form = null" class="flex-1 bg-slate-100 dark:bg-white/5 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest dark:text-white">Cancelar</button>
              <button @click="guardar" :disabled="!formValido || guardando"
                class="flex-1 bg-[#152C77] hover:bg-[#DE1F27] text-white py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-colors disabled:opacity-30">
                {{ guardando ? 'Guardando...' : 'Guardar' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/api/axios'

const inputClass = 'w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold dark:text-white outline-none focus:ring-2 focus:ring-[#152C77]'
const labelClass = 'text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-white/40'

const gestores = ref([])
const secciones = ref({})
const loading = ref(false)
const error = ref('')
const form = ref(null)
const errorForm = ref('')
const guardando = ref(false)
const existente = ref(null)
const candidatos = ref([])

async function abrirExistente() {
  errorForm.value = ''
  existente.value = { tutorId: null, secciones: ['jornada', 'citas', 'formularios'] }
  try {
    const { data } = await api.get('/admin/accesos/candidatos')
    candidatos.value = data
  } catch {
    candidatos.value = []
  }
}

async function guardarExistente() {
  guardando.value = true
  errorForm.value = ''
  try {
    await api.post('/admin/accesos/existente', existente.value)
    existente.value = null
    cargar()
  } catch (e) {
    errorForm.value = e.response?.data?.message || 'No se pudo dar el acceso'
  } finally {
    guardando.value = false
  }
}

const formValido = computed(() => form.value?.nombre?.trim() && form.value.secciones.length &&
  (form.value.tutorId || (form.value.usuario?.trim() && form.value.password?.length >= 6)))

async function cargar() {
  loading.value = true
  error.value = ''
  try {
    const { data } = await api.get('/admin/accesos')
    gestores.value = data.gestores
    secciones.value = data.secciones
  } catch (e) {
    error.value = e.response?.status === 404 ? 'El servidor todavía no tiene esta función (falta desplegar el backend).' : 'No se pudo cargar'
  } finally {
    loading.value = false
  }
}

function abrirForm(g) {
  errorForm.value = ''
  form.value = g
    ? { tutorId: g.tutorId, nombre: g.nombreCorto, apellido: g.apellido, usuario: g.usuario, password: '', secciones: [...g.secciones], cuentaExistente: g.cuentaExistente }
    : { nombre: '', apellido: '', usuario: '', password: '', secciones: ['jornada', 'citas', 'formularios'] }
}

async function guardar() {
  guardando.value = true
  errorForm.value = ''
  try {
    const f = form.value
    if (f.tutorId) {
      const body = { nombre: f.nombre, apellido: f.apellido, secciones: f.secciones }
      if (f.password) body.password = f.password
      await api.patch(`/admin/accesos/${f.tutorId}`, body)
    } else {
      await api.post('/admin/accesos', f)
    }
    form.value = null
    cargar()
  } catch (e) {
    errorForm.value = e.response?.data?.message || 'No se pudo guardar'
  } finally {
    guardando.value = false
  }
}

async function toggleActivo(g) {
  if (g.activo && !confirm(`¿Desactivar a ${g.nombre}? No podrá entrar al panel.`)) return
  await api.patch(`/admin/accesos/${g.tutorId}`, { activo: String(!g.activo) })
  cargar()
}

async function eliminar(g) {
  if (g.cuentaExistente) {
    if (!confirm(`¿Quitarle a ${g.nombre} el acceso al panel? Su cuenta y su acceso a la clínica se conservan.`)) return
  } else if (prompt(`Esto borra la cuenta de ${g.nombre}. Escribe ELIMINAR para confirmar:`) !== 'ELIMINAR') return
  await api.delete(`/admin/accesos/${g.tutorId}`)
  cargar()
}

onMounted(cargar)
</script>
