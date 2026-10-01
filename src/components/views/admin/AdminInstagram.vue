<script setup>
import { ref, onMounted, computed } from 'vue';
import api from '@/api/axios';

const posts = ref([]);
const cargando = ref(false);
const guardando = ref(false);
const error = ref(null);
const exito = ref(null);

const modalAbierto = ref(false);
const modoEditar = ref(false);
const form = ref({ postId: '', descripcion: '', keywords: '', mensajeDm: '', activo: true });
const editandoId = ref(null);

const cargar = async () => {
  cargando.value = true;
  try {
    const { data } = await api.get('/admin/ig/posts');
    posts.value = data;
  } catch (e) {
    error.value = 'Error cargando configuraciones';
  } finally {
    cargando.value = false;
  }
};

onMounted(cargar);

const abrirNuevo = () => {
  form.value = { postId: '', descripcion: '', keywords: '', mensajeDm: '', activo: true };
  editandoId.value = null;
  modoEditar.value = false;
  modalAbierto.value = true;
};

const abrirEditar = (p) => {
  form.value = { ...p };
  editandoId.value = p.id;
  modoEditar.value = true;
  modalAbierto.value = true;
};

const cerrarModal = () => { modalAbierto.value = false; error.value = null; };

const guardar = async () => {
  if (!form.value.postId || !form.value.keywords || !form.value.mensajeDm) {
    error.value = 'ID del post, palabras clave y mensaje DM son obligatorios';
    return;
  }
  guardando.value = true;
  error.value = null;
  try {
    if (modoEditar.value) {
      await api.put(`/admin/ig/posts/${editandoId.value}`, form.value);
    } else {
      await api.post('/admin/ig/posts', form.value);
    }
    exito.value = modoEditar.value ? 'Configuración actualizada' : 'Post configurado correctamente';
    setTimeout(() => exito.value = null, 3000);
    cerrarModal();
    await cargar();
  } catch (e) {
    error.value = 'Error guardando configuración';
  } finally {
    guardando.value = false;
  }
};

const toggleActivo = async (p) => {
  try {
    const { data } = await api.patch(`/admin/ig/posts/${p.id}/toggle`);
    p.activo = data.activo;
  } catch (e) {
    error.value = 'Error actualizando estado';
  }
};

const eliminar = async (p) => {
  if (!confirm(`¿Eliminar la configuración para "${p.descripcion || p.postId}"?`)) return;
  try {
    await api.delete(`/admin/ig/posts/${p.id}`);
    await cargar();
  } catch (e) {
    error.value = 'Error eliminando configuración';
  }
};

const keywordsArray = (str) => str ? str.split(',').map(k => k.trim()).filter(Boolean) : [];
</script>

<template>
  <div class="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8">

    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
             style="background: linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)">
          📸
        </div>
        <div>
          <h1 class="text-xl font-bold">Instagram DM Automático</h1>
          <p class="text-xs text-white/40">Responde comentarios con DM según palabras clave</p>
        </div>
      </div>
      <button @click="abrirNuevo"
              class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition"
              style="background: linear-gradient(135deg, #833ab4, #fd1d1d)">
        + Nuevo post
      </button>
    </div>

    <!-- Alerta exito -->
    <div v-if="exito" class="mb-4 px-4 py-3 rounded-xl text-sm font-medium bg-green-500/20 text-green-400 border border-green-500/30">
      ✅ {{ exito }}
    </div>
    <div v-if="error && !modalAbierto" class="mb-4 px-4 py-3 rounded-xl text-sm font-medium bg-red-500/20 text-red-400 border border-red-500/30">
      ⚠️ {{ error }}
    </div>

    <!-- Info cómo obtener el ID -->
    <div class="mb-6 p-4 rounded-xl border border-white/10 bg-white/5 text-sm text-white/60">
      <p class="font-semibold text-white/80 mb-1">💡 ¿Cómo obtener el ID de una publicación?</p>
      <p>Ve a la publicación en Instagram → comparte → copia el link → el número largo al final de la URL es el Media ID. También puedes usar la <span class="text-purple-400">Graph API Explorer</span> para obtenerlo.</p>
    </div>

    <!-- Loading -->
    <div v-if="cargando" class="flex items-center justify-center py-20 text-white/40">
      Cargando...
    </div>

    <!-- Sin configs -->
    <div v-else-if="posts.length === 0"
         class="flex flex-col items-center justify-center py-20 text-white/30 gap-3">
      <span class="text-5xl">📸</span>
      <p class="text-sm">No hay publicaciones configuradas aún</p>
      <button @click="abrirNuevo" class="text-purple-400 text-sm hover:underline">
        Agregar la primera
      </button>
    </div>

    <!-- Lista de posts -->
    <div v-else class="grid gap-4">
      <div v-for="p in posts" :key="p.id"
           class="rounded-2xl border p-5 transition"
           :class="p.activo
             ? 'border-purple-500/30 bg-purple-500/5'
             : 'border-white/10 bg-white/3 opacity-60'">

        <div class="flex items-start justify-between gap-4">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <span class="text-sm font-bold truncate">{{ p.descripcion || 'Sin descripción' }}</span>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-bold"
                    :class="p.activo ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-white/40'">
                {{ p.activo ? 'Activo' : 'Pausado' }}
              </span>
            </div>
            <p class="text-xs text-white/40 font-mono mb-3">Post ID: {{ p.postId }}</p>

            <!-- Keywords -->
            <div class="flex flex-wrap gap-1 mb-3">
              <span v-for="kw in keywordsArray(p.keywords)" :key="kw"
                    class="px-2 py-0.5 rounded-full text-[11px] font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {{ kw }}
              </span>
            </div>

            <!-- Mensaje DM preview -->
            <div class="bg-white/5 rounded-xl p-3 border border-white/10">
              <p class="text-[10px] text-white/40 mb-1 font-semibold uppercase tracking-wider">DM que se envía</p>
              <p class="text-xs text-white/70 whitespace-pre-line line-clamp-3">{{ p.mensajeDm }}</p>
            </div>
          </div>

          <!-- Acciones -->
          <div class="flex flex-col gap-2 shrink-0">
            <button @click="toggleActivo(p)"
                    class="px-3 py-1.5 rounded-lg text-xs font-semibold transition border"
                    :class="p.activo
                      ? 'border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10'
                      : 'border-green-500/30 text-green-400 hover:bg-green-500/10'">
              {{ p.activo ? 'Pausar' : 'Activar' }}
            </button>
            <button @click="abrirEditar(p)"
                    class="px-3 py-1.5 rounded-lg text-xs font-semibold border border-white/20 text-white/60 hover:bg-white/10 transition">
              Editar
            </button>
            <button @click="eliminar(p)"
                    class="px-3 py-1.5 rounded-lg text-xs font-semibold border border-red-500/20 text-red-400 hover:bg-red-500/10 transition">
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal nuevo/editar -->
    <Teleport to="body">
      <div v-if="modalAbierto"
           class="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4"
           style="background: rgba(0,0,0,0.7); backdrop-filter: blur(4px)"
           @click.self="cerrarModal">
        <div class="w-full max-w-lg rounded-2xl bg-[#111] border border-white/10 p-6 space-y-4">
          <h2 class="text-base font-bold">
            {{ modoEditar ? 'Editar configuración' : 'Nueva configuración de post' }}
          </h2>

          <div v-if="error" class="px-3 py-2 rounded-lg text-xs bg-red-500/20 text-red-400">
            ⚠️ {{ error }}
          </div>

          <div class="space-y-3">
            <div>
              <label class="text-xs text-white/50 block mb-1">ID de la publicación *</label>
              <input v-model="form.postId" placeholder="ej: 17846368219941196"
                     class="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500 font-mono" />
            </div>
            <div>
              <label class="text-xs text-white/50 block mb-1">Descripción (para identificarla)</label>
              <input v-model="form.descripcion" placeholder="ej: Post del Kit Royal Canin Sept"
                     class="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500" />
            </div>
            <div>
              <label class="text-xs text-white/50 block mb-1">
                Palabras clave separadas por coma *
                <span class="text-white/30">(solo responde si el comentario contiene alguna)</span>
              </label>
              <input v-model="form.keywords" placeholder="precio, cuanto, info, quiero, disponible"
                     class="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500" />
              <div class="flex flex-wrap gap-1 mt-2">
                <span v-for="kw in keywordsArray(form.keywords)" :key="kw"
                      class="px-2 py-0.5 rounded-full text-[11px] bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {{ kw }}
                </span>
              </div>
            </div>
            <div>
              <label class="text-xs text-white/50 block mb-1">Mensaje DM que se envía *</label>
              <textarea v-model="form.mensajeDm" rows="5"
                        placeholder="Hola! Gracias por tu interés en este producto 🐾 Puedes comprarlo aquí: https://petstationvet.com/tienda/..."
                        class="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500 resize-none" />
              <p class="text-[10px] text-white/30 mt-1">{{ form.mensajeDm?.length || 0 }}/1000 caracteres</p>
            </div>
            <label class="flex items-center gap-2 cursor-pointer">
              <div class="relative">
                <input type="checkbox" v-model="form.activo" class="sr-only" />
                <div class="w-9 h-5 rounded-full transition"
                     :class="form.activo ? 'bg-purple-500' : 'bg-white/20'">
                  <div class="w-4 h-4 rounded-full bg-white shadow absolute top-0.5 transition-all"
                       :class="form.activo ? 'left-4' : 'left-0.5'" />
                </div>
              </div>
              <span class="text-sm text-white/70">Activo al guardar</span>
            </label>
          </div>

          <div class="flex gap-3 pt-2">
            <button @click="cerrarModal"
                    class="flex-1 py-2 rounded-xl text-sm border border-white/10 text-white/50 hover:bg-white/5 transition">
              Cancelar
            </button>
            <button @click="guardar" :disabled="guardando"
                    class="flex-1 py-2 rounded-xl text-sm font-bold text-white transition disabled:opacity-50"
                    style="background: linear-gradient(135deg, #833ab4, #fd1d1d)">
              {{ guardando ? 'Guardando...' : (modoEditar ? 'Actualizar' : 'Guardar') }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
