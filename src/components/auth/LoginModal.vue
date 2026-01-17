<template>
  <div
    class="relative w-full max-w-md bg-ps-black rounded-[3rem] p-10 shadow-2xl border border-white/5 animate-in zoom-in duration-300">
    <button @click="$emit('close')"
      class="absolute top-6 right-6 z-[120] w-10 h-10 flex items-center justify-center bg-ps-red text-white rounded-xl shadow-lg hover:rotate-90 transition-all cursor-pointer">✕</button>

    <div class="text-center mb-10">
      <h2 class="text-4xl font-black uppercase italic tracking-tighter text-white">
        PET <span class="text-ps-red">STATION.</span>
      </h2>
      <p class="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-3 italic">Acceso Clientes</p>
    </div>

    <form @submit.prevent="handleLogin" class="space-y-6">
      <div class="space-y-1">
        <label class="text-[10px] font-black uppercase text-slate-500 ml-4 tracking-widest">Correo Electrónico</label>
        <input v-model="form.email" type="email" required placeholder="tu@email.com" class="input-dark" />
      </div>
      <div class="space-y-1 relative">
        <label class="text-[10px] font-black uppercase text-slate-500 ml-4 tracking-widest">Contraseña</label>
        <div class="relative">
          <input v-model="form.password" :type="showPassword ? 'text' : 'password'" required placeholder="••••••••"
            class="input-dark pr-12" />
          <button type="button" @click="showPassword = !showPassword"
            class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
            <span v-if="showPassword">👁️‍🗨️</span>
            <span v-else>👁️</span>
          </button>
        </div>
      </div>

      <button :disabled="loading" type="submit"
        class="w-full bg-white text-ps-black py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-ps-red hover:text-white active:scale-95 transition-all italic shadow-xl">
        {{ loading ? 'Iniciando...' : 'Entrar ahora' }}
      </button>
    </form>

    <div class="mt-8 pt-6 border-t border-white/5 text-center">
      <button @click="$emit('goRegister')"
        class="text-[10px] font-black uppercase text-white/30 hover:text-ps-red tracking-widest transition-all italic cursor-pointer">
        ¿Eres nuevo? <span class="text-ps-red ml-1">Crea tu cuenta aquí</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
// Importamos el cliente centralizado que ya configuramos
import api from '@/api/axios';

const showPassword = ref(false);

const emit = defineEmits(['success', 'close', 'goRegister', 'notify']);
const loading = ref(false);
const form = reactive({ email: '', password: '' });

const handleLogin = async () => {
  loading.value = true;
  try {
    const { data } = await api.post('/tutores/login', form);
    localStorage.setItem('ps_token', data.token);

    emit('success', data.tutor);
    emit('notify', { msg: `¡Bienvenido, ${data.tutor.nombre}!`, type: 'success' });

  } catch (e) {
    const errorMsg = e.response?.data?.message || "Error al entrar o credenciales inválidas";
    emit('notify', { msg: errorMsg, type: 'error' });
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
@reference "../../style.css";

.input-dark {
  @apply w-full bg-white/5 p-4 rounded-2xl border-2 border-transparent focus:border-ps-red outline-none font-bold text-white text-sm transition-all;
}
</style>