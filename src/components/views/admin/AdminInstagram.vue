<script setup>
import { ref, onMounted } from 'vue';
import api from '@/api/axios';

const posts = ref([]);
const feed = ref([]);
const cargando = ref(false);
const cargandoFeed = ref(false);
const guardando = ref(false);
const error = ref(null);
const exito = ref(null);

const modalAbierto = ref(false);
const modoEditar = ref(false);
const form = ref({ postId: '', descripcion: '', keywords: '', mensajeDm: '', activo: true });
const editandoId = ref(null);
const postSeleccionado = ref(null);

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

const cargarFeed = async () => {
  cargandoFeed.value = true;
  try {
    const { data } = await api.get('/admin/ig/feed');
    feed.value = data.data || [];
  } catch (e) {
    // feed opcional, no bloqueante
  } finally {
    cargandoFeed.value = false;
  }
};

onMounted(() => { cargar(); cargarFeed(); });

const yaConfigurado = (postId) => posts.value.some(p => p.postId === postId);

const abrirNuevo = (postFeed = null) => {
  postSeleccionado.value = postFeed;
  form.value = {
    postId: postFeed?.id || '',
    descripcion: postFeed?.caption ? postFeed.caption.substring(0, 60) : '',
    keywords: '',
    mensajeDm: '',
    activo: true
  };
  editandoId.value = null;
  modoEditar.value = false;
  error.value = null;
  modalAbierto.value = true;
};

const abrirEditar = (p) => {
  postSeleccionado.value = null;
  form.value = { ...p };
  editandoId.value = p.id;
  modoEditar.value = true;
  error.value = null;
  modalAbierto.value = true;
};

const cerrarModal = () => { modalAbierto.value = false; postSeleccionado.value = null; };

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
    exito.value = modoEditar.value ? 'Configuración actualizada' : '¡Post configurado!';
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
  } catch { error.value = 'Error actualizando estado'; }
};

const eliminar = async (p) => {
  if (!confirm(`¿Eliminar configuración para "${p.descripcion || p.postId}"?`)) return;
  try {
    await api.delete(`/admin/ig/posts/${p.id}`);
    await cargar();
  } catch { error.value = 'Error eliminando'; }
};

const keywordsArray = (str) => str ? str.split(',').map(k => k.trim()).filter(Boolean) : [];

const miniatura = (p) => p.thumbnail_url || p.media_url || '';
const esVideo = (p) => p.media_type === 'VIDEO' || p.media_type === 'REEL';
</script>

<template>
  <div class="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8">

    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
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
      <button @click="abrirNuevo()"
              class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition"
              style="background: linear-gradient(135deg, #833ab4, #fd1d1d)">
        + Manual
      </button>
    </div>

    <div v-if="exito" class="mb-4 px-4 py-3 rounded-xl text-sm font-medium bg-green-500/20 text-green-400 border border-green-500/30">
      ✅ {{ exito }}
    </div>
    <div v-if="error && !modalAbierto" class="mb-4 px-4 py-3 rounded-xl text-sm bg-red-500/20 text-red-400 border border-red-500/30">
      ⚠️ {{ error }}
    </div>

    <!-- Feed de Instagram -->
    <div class="mb-8">
      <p class="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">
        Publicaciones recientes — toca una para configurarla
      </p>

      <div v-if="cargandoFeed" class="grid grid-cols-3 md:grid-cols-6 gap-2">
        <div v-for="i in 12" :key="i" class="aspect-square rounded-xl bg-white/5 animate-pulse" />
      </div>

      <div v-else-if="feed.length === 0" class="text-center py-8 text-white/30 text-sm border border-white/10 rounded-2xl">
        No se pudo cargar el feed. Verifica el token de Instagram.
      </div>

      <div v-else class="grid grid-cols-3 md:grid-cols-6 gap-2">
        <div v-for="p in feed" :key="p.id"
             @click="!yaConfigurado(p.id) && abrirNuevo(p)"
             class="relative aspect-square rounded-xl overflow-hidden group"
             :class="yaConfigurado(p.id) ? 'cursor-default' : 'cursor-pointer'">

          <!-- Miniatura -->
          <img :src="miniatura(p)" :alt="p.caption"
               class="w-full h-full object-cover transition group-hover:scale-105" />

          <!-- Overlay video -->
          <div v-if="esVideo(p)" class="absolute top-2 right-2 text-white text-xs">▶</div>

          <!-- Ya configurado -->
          <div v-if="yaConfigurado(p.id)"
               class="absolute inset-0 flex items-center justify-center text-xs font-bold"
               style="background: rgba(131,58,180,0.7)">
            ✅ Config
          </div>

          <!-- Hover: configurar -->
          <div v-else
               class="absolute inset-0 flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition"
               style="background: rgba(0,0,0,0.6)">
            + Configurar
          </div>
        </div>
      </div>
    </div>

    <!-- Configs activas -->
    <div>
      <p class="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">
        Posts configurados ({{ posts.length }})
      </p>

      <div v-if="cargando" class="text-center py-10 text-white/30 text-sm">Cargando...</div>

      <div v-else-if="posts.length === 0" class="text-center py-10 text-white/30 text-sm border border-white/10 rounded-2xl">
        Aún no hay posts configurados. Toca uno del feed de arriba para empezar.
      </div>

      <div v-else class="grid gap-3">
        <div v-for="p in posts" :key="p.id"
             class="rounded-2xl border p-4 transition"
             :class="p.activo ? 'border-purple-500/30 bg-purple-500/5' : 'border-white/10 bg-white/3 opacity-60'">
          <div class="flex items-start gap-4">

            <!-- Miniatura del feed si existe -->
            <div class="shrink-0">
              <div v-if="feed.find(f => f.id === p.postId)"
                   class="w-14 h-14 rounded-xl overflow-hidden">
                <img :src="miniatura(feed.find(f => f.id === p.postId))"
                     class="w-full h-full object-cover" />
              </div>
              <div v-else class="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center text-2xl">📸</div>
            </div>

            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-sm font-bold truncate">{{ p.descripcion || 'Sin descripción' }}</span>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0"
                      :class="p.activo ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-white/40'">
                  {{ p.activo ? 'Activo' : 'Pausado' }}
                </span>
              </div>
              <p class="text-[10px] text-white/30 font-mono mb-2">{{ p.postId }}</p>
              <div class="flex flex-wrap gap-1 mb-2">
                <span v-for="kw in keywordsArray(p.keywords)" :key="kw"
                      class="px-2 py-0.5 rounded-full text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {{ kw }}
                </span>
              </div>
              <p class="text-xs text-white/50 line-clamp-2">{{ p.mensajeDm }}</p>
            </div>

            <div class="flex flex-col gap-1 shrink-0">
              <button @click="toggleActivo(p)"
                      class="px-2 py-1 rounded-lg text-[11px] font-semibold border transition"
                      :class="p.activo ? 'border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10' : 'border-green-500/30 text-green-400 hover:bg-green-500/10'">
                {{ p.activo ? 'Pausar' : 'Activar' }}
              </button>
              <button @click="abrirEditar(p)"
                      class="px-2 py-1 rounded-lg text-[11px] border border-white/20 text-white/60 hover:bg-white/10 transition">
                Editar
              </button>
              <button @click="eliminar(p)"
                      class="px-2 py-1 rounded-lg text-[11px] border border-red-500/20 text-red-400 hover:bg-red-500/10 transition">
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <Teleport to="body">
      <div v-if="modalAbierto"
           class="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4"
           style="background: rgba(0,0,0,0.75); backdrop-filter: blur(4px)"
           @click.self="cerrarModal">
        <div class="w-full max-w-lg rounded-2xl bg-[#111] border border-white/10 p-6 space-y-4 max-h-[90vh] overflow-y-auto">

          <!-- Preview del post seleccionado -->
          <div v-if="postSeleccionado" class="flex gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
            <img :src="miniatura(postSeleccionado)" class="w-16 h-16 rounded-xl object-cover shrink-0" />
            <p class="text-xs text-white/60 line-clamp-3">{{ postSeleccionado.caption || 'Sin caption' }}</p>
          </div>

          <h2 class="text-base font-bold">
            {{ modoEditar ? 'Editar configuración' : 'Configurar DM automático' }}
          </h2>

          <div v-if="error" class="px-3 py-2 rounded-lg text-xs bg-red-500/20 text-red-400">⚠️ {{ error }}</div>

          <div class="space-y-3">
            <div>
              <label class="text-xs text-white/50 block mb-1">ID de la publicación *</label>
              <input v-model="form.postId" placeholder="17846368219941196"
                     class="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500 font-mono" />
            </div>
            <div>
              <label class="text-xs text-white/50 block mb-1">Descripción</label>
              <input v-model="form.descripcion" placeholder="ej: Post kit Royal Canin septiembre"
                     class="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500" />
            </div>
            <div>
              <label class="text-xs text-white/50 block mb-1">
                Palabras clave separadas por coma *
                <span class="text-white/30 ml-1">solo responde si el comentario las contiene</span>
              </label>
              <input v-model="form.keywords" placeholder="precio, cuanto, info, quiero, link"
                     class="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500" />
              <div class="flex flex-wrap gap-1 mt-2">
                <span v-for="kw in keywordsArray(form.keywords)" :key="kw"
                      class="px-2 py-0.5 rounded-full text-[11px] bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {{ kw }}
                </span>
              </div>
            </div>
            <div>
              <label class="text-xs text-white/50 block mb-1">Mensaje DM *</label>
              <textarea v-model="form.mensajeDm" rows="5"
                        placeholder="Hola! Gracias por tu interés 🐾 Aquí puedes ver y comprar este producto: https://petstationvet.com/tienda/..."
                        class="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500 resize-none" />
              <p class="text-[10px] text-white/30 mt-1">{{ form.mensajeDm?.length || 0 }}/1000</p>
            </div>
            <label class="flex items-center gap-3 cursor-pointer">
              <div class="relative w-9 h-5 shrink-0">
                <input type="checkbox" v-model="form.activo" class="sr-only" />
                <div class="absolute inset-0 rounded-full transition" :class="form.activo ? 'bg-purple-500' : 'bg-white/20'" />
                <div class="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all"
                     :class="form.activo ? 'left-4' : 'left-0.5'" />
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
