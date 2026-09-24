<template>
  <div class="space-y-6">

    <!-- Header con botón crear -->
    <div class="flex items-center justify-between gap-4">
      <div>
        <h2 class="text-lg font-[1000] uppercase italic dark:text-white">Veterinarios</h2>
        <p class="text-[10px] text-slate-500 dark:text-white/30 uppercase tracking-widest">Cuentas con acceso al panel clínico</p>
      </div>
      <button @click="mostrarFormCrear = true"
        class="flex items-center gap-2 bg-[#152C77] hover:bg-[#DE1F27] text-white px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-colors">
        👨‍⚕️ Nuevo veterinario
      </button>
    </div>

    <!-- Lista -->
    <div class="bg-white dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10 overflow-hidden">
      <div v-if="loading" class="py-20 text-center">
        <div class="w-8 h-8 border-4 border-[#DE1F27] border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
      <div v-else-if="vets.length === 0" class="py-16 text-center text-slate-400 dark:text-white/30 text-[11px] uppercase tracking-widest">
        Sin veterinarios registrados
      </div>
      <table v-else class="w-full text-left">
        <thead class="bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-white/10">
          <tr>
            <th class="px-5 py-3 text-[8px] font-black uppercase opacity-40 tracking-widest">Veterinario</th>
            <th class="px-5 py-3 text-[8px] font-black uppercase opacity-40 tracking-widest">Email</th>
            <th class="px-5 py-3 text-[8px] font-black uppercase opacity-40 tracking-widest">Teléfono</th>
            <th class="px-5 py-3 text-[8px] font-black uppercase opacity-40 tracking-widest">Estado</th>
            <th class="px-5 py-3 text-[8px] font-black uppercase opacity-40 tracking-widest">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 dark:divide-white/5">
          <tr v-for="v in vets" :key="v.id" class="hover:bg-slate-50 dark:hover:bg-white/3 transition-colors">
            <td class="px-5 py-4">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-[#152C77]/10 flex items-center justify-center text-sm">👨‍⚕️</div>
                <div>
                  <p class="font-[1000] uppercase italic text-sm dark:text-white">{{ v.nombre }} {{ v.apellido }}</p>
                  <p class="text-[9px] text-slate-400 dark:text-white/25 uppercase">{{ v.role }}</p>
                </div>
              </div>
            </td>
            <td class="px-5 py-4 text-[11px] font-bold text-slate-500 dark:text-slate-400">{{ v.email }}</td>
            <td class="px-5 py-4 text-[11px] font-bold text-slate-500 dark:text-slate-400">
              <span v-if="v.telefono">{{ v.telefono }}</span>
              <span v-else class="opacity-30">—</span>
            </td>
            <td class="px-5 py-4">
              <span class="text-[9px] px-2.5 py-1 rounded-full font-black uppercase"
                :class="v.role === 'ROLE_VET' ? 'bg-green-100 dark:bg-green-500/15 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-500/15 text-red-700 dark:text-red-400'">
                {{ v.role === 'ROLE_VET' ? 'Activo' : 'Inactivo' }}
              </span>
            </td>
            <td class="px-5 py-4">
              <button v-if="v.role === 'ROLE_VET'"
                @click="desactivar(v)"
                class="text-[9px] font-black uppercase text-red-400 hover:text-red-600 transition-colors">
                Desactivar
              </button>
              <button v-else
                @click="reactivar(v)"
                class="text-[9px] font-black uppercase text-green-500 hover:text-green-700 transition-colors">
                Reactivar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal crear veterinario -->
    <Teleport to="body">
      <div v-if="mostrarFormCrear" class="fixed inset-0 z-[9000] flex items-center justify-center p-4" style="animation:fadeIn 0.15s ease">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="cerrarForm"></div>
        <div class="relative w-full max-w-md bg-white dark:bg-[#0D1425] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden"
          style="animation:slideInUp 0.2s cubic-bezier(0.32,0.72,0,1)">
          <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-white/5">
            <h3 class="font-[1000] uppercase italic text-sm dark:text-white">Nuevo Veterinario</h3>
            <button @click="cerrarForm" class="w-8 h-8 flex items-center justify-center bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-lg text-slate-400 dark:text-white/50 transition-colors">✕</button>
          </div>
          <div class="p-6 space-y-4">
            <div class="grid grid-cols-2 gap-3">
              <div class="space-y-1">
                <label class="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-white/40">Nombre *</label>
                <input v-model="form.nombre" type="text" placeholder="Laura"
                  class="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold dark:text-white outline-none focus:ring-2 focus:ring-[#152C77] dark:focus:border-[#152C77] transition-colors placeholder:text-slate-300 dark:placeholder:text-white/20" />
              </div>
              <div class="space-y-1">
                <label class="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-white/40">Apellido</label>
                <input v-model="form.apellido" type="text" placeholder="García"
                  class="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold dark:text-white outline-none focus:ring-2 focus:ring-[#152C77] dark:focus:border-[#152C77] transition-colors placeholder:text-slate-300 dark:placeholder:text-white/20" />
              </div>
            </div>
            <div class="space-y-1">
              <label class="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-white/40">Email *</label>
              <input v-model="form.email" type="email" placeholder="laura@petstationvet.com"
                class="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold dark:text-white outline-none focus:ring-2 focus:ring-[#152C77] dark:focus:border-[#152C77] transition-colors placeholder:text-slate-300 dark:placeholder:text-white/20" />
            </div>
            <div class="space-y-1">
              <label class="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-white/40">Teléfono</label>
              <input v-model="form.telefono" type="tel" placeholder="3001234567"
                class="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold dark:text-white outline-none focus:ring-2 focus:ring-[#152C77] dark:focus:border-[#152C77] transition-colors placeholder:text-slate-300 dark:placeholder:text-white/20" />
            </div>
            <div class="space-y-1">
              <label class="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-white/40">Contraseña temporal *</label>
              <input v-model="form.password" type="text" placeholder="Contraseña inicial (el vet la puede cambiar)"
                class="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold dark:text-white outline-none focus:ring-2 focus:ring-[#152C77] dark:focus:border-[#152C77] transition-colors placeholder:text-slate-300 dark:placeholder:text-white/20" />
            </div>

            <div v-if="errorForm" class="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl px-4 py-3 text-[11px] text-red-600 dark:text-red-400">{{ errorForm }}</div>
            <div v-if="exitoForm" class="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-xl px-4 py-3 text-[11px] text-green-700 dark:text-green-400 font-bold">✅ Veterinario creado. Comparte el email y contraseña.</div>

            <div class="flex gap-3 pt-2">
              <button @click="cerrarForm" class="flex-1 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest dark:text-white transition-colors">
                Cancelar
              </button>
              <button @click="crearVet" :disabled="!form.nombre || !form.email || !form.password || creando"
                class="flex-1 bg-[#152C77] hover:bg-[#DE1F27] text-white py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-colors disabled:opacity-30">
                {{ creando ? 'Creando...' : '👨‍⚕️ Crear cuenta' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'https://api.petstationvet.com'

const vets           = ref([])
const loading        = ref(false)
const mostrarFormCrear = ref(false)
const creando        = ref(false)
const errorForm      = ref('')
const exitoForm      = ref(false)
const form           = ref({ nombre: '', apellido: '', email: '', telefono: '', password: '' })

onMounted(cargar)

async function cargar() {
  loading.value = true
  try {
    const { data } = await axios.get(`${API}/api/admin/veterinarios`)
    vets.value = data
  } catch (e) {
    vets.value = []
  } finally {
    loading.value = false
  }
}

async function crearVet() {
  if (!form.value.nombre || !form.value.email || !form.value.password) return
  creando.value = true
  errorForm.value = ''
  exitoForm.value = false
  try {
    const { data } = await axios.post(`${API}/api/admin/veterinarios`, form.value)
    vets.value.unshift(data)
    exitoForm.value = true
    form.value = { nombre: '', apellido: '', email: '', telefono: '', password: '' }
  } catch (e) {
    errorForm.value = e.response?.data?.message || 'Error al crear veterinario'
  } finally {
    creando.value = false
  }
}

async function desactivar(v) {
  if (!confirm(`¿Desactivar cuenta de ${v.nombre}? Podrás reactivarla después.`)) return
  try {
    await axios.delete(`${API}/api/admin/veterinarios/${v.id}`)
    v.role = 'ROLE_VET_INACTIVO'
  } catch (e) {
    alert('Error al desactivar: ' + (e.response?.data?.message || e.message))
  }
}

async function reactivar(v) {
  try {
    await axios.patch(`${API}/api/admin/veterinarios/${v.id}/reactivar`)
    v.role = 'ROLE_VET'
  } catch (e) {
    alert('Error al reactivar: ' + (e.response?.data?.message || e.message))
  }
}

function cerrarForm() {
  mostrarFormCrear.value = false
  errorForm.value = ''
  exitoForm.value = false
  form.value = { nombre: '', apellido: '', email: '', telefono: '', password: '' }
}
</script>

<style scoped>
@keyframes slideInUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
@keyframes fadeIn    { from { opacity: 0; } to { opacity: 1; } }
</style>
