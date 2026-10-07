<script setup>
import { ref, onMounted } from 'vue'

const visible = ref(false)

onMounted(() => {
  try {
    if (!localStorage.getItem('ps_cookies_ok')) visible.value = true
  } catch { visible.value = true }
})

const accept = () => {
  try { localStorage.setItem('ps_cookies_ok', '1') } catch {}
  visible.value = false
}
</script>

<template>
  <Transition name="slide-up-cookie">
    <div v-if="visible"
      class="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:max-w-sm z-[9999] bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl p-5">
      <p class="text-[10px] font-black uppercase tracking-widest text-[#DE1F27] mb-2">Aviso de cookies</p>
      <p class="text-[13px] text-slate-600 dark:text-slate-300 font-medium leading-relaxed mb-4">
        Usamos cookies técnicas necesarias para el funcionamiento del sitio (sesión, carrito).
        No usamos cookies publicitarias de terceros.
        <router-link to="/privacy" class="text-[#152C77] dark:text-blue-400 underline ml-1" @click="accept">
          Más info
        </router-link>
      </p>
      <button @click="accept"
        class="w-full py-3 bg-[#152C77] text-white font-black uppercase italic tracking-widest text-[11px] rounded-xl hover:bg-[#1a3590] transition-colors active:scale-95">
        Entendido
      </button>
    </div>
  </Transition>
</template>

<style scoped>
.slide-up-cookie-enter-active,
.slide-up-cookie-leave-active {
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s;
}
.slide-up-cookie-enter-from,
.slide-up-cookie-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
</style>
