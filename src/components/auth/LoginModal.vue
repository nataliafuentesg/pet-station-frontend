<template>
  <div class="relative w-full max-w-md bg-white dark:bg-ps-black rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 shadow-2xl border border-slate-200 dark:border-white/5 animate-in zoom-in duration-300 mx-4">
    
    <button @click="$emit('close')"
      class="absolute top-4 right-4 md:top-6 md:right-6 z-[120] w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-ps-red text-white rounded-lg md:rounded-xl shadow-lg hover:rotate-90 transition-all cursor-pointer">✕</button>

    <div class="text-center mb-6 md:mb-10">
      <h2 class="text-3xl md:text-4xl font-black uppercase italic tracking-tighter text-ps-black dark:text-white leading-none">
        PET <span class="text-ps-red">STATION.</span>
      </h2>
      <p class="text-[9px] md:text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] mt-2 md:mt-3 italic">Acceso Clientes</p>
    </div>

    <form @submit.prevent="handleLogin" class="space-y-4 md:space-y-6">
      <div class="space-y-1">
        <label class="text-[9px] md:text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 ml-4 tracking-widest">Correo Electrónico</label>
        <input v-model="form.email" type="email" required placeholder="tu@email.com" class="input-adaptive" />
      </div>
      <div class="space-y-1 relative">
        <label class="text-[9px] md:text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 ml-4 tracking-widest">Contraseña</label>
        <div class="relative">
          <input v-model="form.password" :type="showPassword ? 'text' : 'password'" required placeholder="••••••••"
            class="input-adaptive pr-12" />
          <button type="button" @click="showPassword = !showPassword"
            class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-ps-black dark:hover:text-white transition-colors">
            <span v-if="showPassword">👁️‍🗨️</span>
            <span v-else>👁️</span>
          </button>
        </div>
      </div>

      <button :disabled="loading" type="submit"
        class="w-full bg-ps-black dark:bg-white text-white dark:text-ps-black py-4 md:py-5 rounded-xl md:rounded-2xl font-black uppercase tracking-widest hover:bg-ps-red dark:hover:bg-ps-red hover:text-white active:scale-95 transition-all italic shadow-xl text-sm md:text-base">
        {{ loading ? 'Iniciando...' : 'Entrar ahora' }}
      </button>
    </form>

    <div class="relative my-6 md:my-8">
      <div class="absolute inset-0 flex items-center"><span class="w-full border-t border-slate-200 dark:border-white/5"></span></div>
      <div class="relative flex justify-center text-[9px] md:text-[10px] uppercase font-black italic">
        <span class="bg-white dark:bg-ps-black px-4 text-slate-400 dark:text-slate-500 tracking-[0.2em]">O continúa con</span>
      </div>
    </div>

    <div class="flex justify-center overflow-hidden">
      <GoogleLogin :callback="handleGoogleLogin" :theme="isDark ? 'dark' : 'outline'" shape="pill" />
    </div>

    <div class="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-slate-200 dark:border-white/5 text-center">
      <button @click="$emit('goRegister')"
        class="text-[9px] md:text-[10px] font-black uppercase text-slate-400 dark:text-white/30 hover:text-ps-red tracking-widest transition-all italic cursor-pointer">
        ¿Eres nuevo? <span class="text-ps-red ml-1">Crea tu cuenta aquí</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue';
import api from '@/api/axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const showPassword = ref(false);
const loading = ref(false);
const form = reactive({ email: '', password: '' });
const emit = defineEmits(['success', 'close', 'goRegister', 'notify']);

// Detectamos si el modo oscuro está activo en el HTML
const isDark = computed(() => document.documentElement.classList.contains('dark'));

const handleLogin = async () => {
  loading.value = true;
  try {
    const { data } = await api.post('/tutores/login', form);
    localStorage.setItem('ps_token', data.token);
    emit('success', data.tutor);
  } catch (e) {
    emit('notify', { msg: "Credenciales inválidas", type: 'error' });
  } finally {
    loading.value = false;
  }
};

const handleGoogleLogin = async (response) => {
  try {
    const { data } = await api.post('/auth/google', { token: response.credential });
    localStorage.setItem('ps_token', data.token);
    localStorage.setItem('ps_tutor', JSON.stringify(data.tutor));

    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

    if (data.nuevo) {
      emit('success', { ...data.tutor, esNuevoDeGoogle: true });
    } else {
      emit('success', data.tutor);
    }
  } catch (e) {
    emit('notify', { msg: "Error con Google", type: 'error' });
  }
};
</script>

<style scoped>
@reference "../../style.css";

/* Clase adaptativa para los inputs */
.input-adaptive {
  @apply w-full bg-slate-100 dark:bg-white/5 p-4 rounded-2xl border-2 border-transparent focus:border-ps-red outline-none font-bold text-ps-black dark:text-white text-sm transition-all;
}
</style>