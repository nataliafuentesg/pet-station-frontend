<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();

const herramientas = [
  {
    nombre: 'WhatsApp',
    descripcion: 'Panel de conversaciones, bot, respuestas manuales y plantillas',
    emoji: '💬',
    color: '#152c77',
    ruta: '/admin/whatsapp',
    metaUrl: 'https://business.facebook.com/wa/manage/phone-numbers/',
  },
  {
    nombre: 'Instagram DMs',
    descripcion: 'Lee y responde mensajes directos de Instagram desde el panel',
    emoji: '📩',
    gradiente: 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)',
    ruta: '/admin/instagram/dms',
    metaUrl: 'https://developers.facebook.com/apps/1886972599131708/use_cases/customize/API-Setup/?product_route=instagram-business',
  },
  {
    nombre: 'Instagram Auto-DM',
    descripcion: 'Responde comentarios automáticamente con DM según palabras clave por publicación',
    emoji: '📸',
    gradiente: 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)',
    ruta: '/admin/instagram',
    metaUrl: 'https://developers.facebook.com/apps/1886972599131708/use_cases/customize/API-Setup/?product_route=instagram-business',
  },
];
</script>

<template>
  <div class="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8">
    <div class="max-w-2xl mx-auto">

      <!-- Header -->
      <div class="mb-10">
        <h1 class="text-2xl font-bold mb-1">Herramientas sociales</h1>
        <p class="text-sm text-white/40">Gestiona las automatizaciones de WhatsApp e Instagram desde aquí</p>
      </div>

      <!-- Cards -->
      <div class="grid gap-4">
        <div v-for="h in herramientas" :key="h.nombre"
             class="rounded-2xl border border-white/10 bg-white/3 p-6 hover:border-white/20 transition">

          <div class="flex items-start justify-between gap-4">
            <div class="flex items-center gap-4">
              <div class="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                   :style="h.gradiente ? `background: ${h.gradiente}` : `background: ${h.color}`">
                {{ h.emoji }}
              </div>
              <div>
                <h2 class="text-base font-bold mb-0.5">{{ h.nombre }}</h2>
                <p class="text-sm text-white/50">{{ h.descripcion }}</p>
              </div>
            </div>
          </div>

          <div class="flex gap-3 mt-5">
            <!-- Entrar al panel -->
            <button @click="router.push(h.ruta)"
                    class="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition"
                    :style="h.gradiente ? `background: ${h.gradiente}` : `background: ${h.color}`">
              Abrir panel
            </button>
            <!-- Ir a Meta -->
            <a :href="h.metaUrl" target="_blank"
               class="px-4 py-2.5 rounded-xl text-sm font-semibold border border-white/15 text-white/60 hover:bg-white/8 hover:text-white transition flex items-center gap-2">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04Z"/>
              </svg>
              Meta
            </a>
          </div>
        </div>
      </div>

      <!-- Info útil -->
      <div class="mt-8 p-4 rounded-2xl border border-white/8 bg-white/3 text-sm text-white/40 space-y-1">
        <p class="font-semibold text-white/60 mb-2">Accesos directos</p>
        <p>📊 Meta Business Suite → <a href="https://business.facebook.com" target="_blank" class="text-blue-400 hover:underline">business.facebook.com</a></p>
        <p>🔧 Meta for Developers → <a href="https://developers.facebook.com/apps" target="_blank" class="text-blue-400 hover:underline">developers.facebook.com/apps</a></p>
        <p>💬 WhatsApp Manager → <a href="https://business.facebook.com/wa/manage" target="_blank" class="text-blue-400 hover:underline">business.facebook.com/wa/manage</a></p>
      </div>
    </div>
  </div>
</template>
