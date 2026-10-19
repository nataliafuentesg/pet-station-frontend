<template>
  <div class="min-h-screen bg-[#0a0f1e] flex items-center justify-center p-4">
    <div class="w-full max-w-sm">

      <!-- Logo -->
      <div class="text-center mb-10">
        <h1 class="text-4xl font-[1000] uppercase italic tracking-tighter text-white leading-none">
          PET <span class="text-[#DE1F27]">STATION.</span>
        </h1>
        <p class="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mt-3">
          Acceso Interno
        </p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div class="space-y-1">
          <label class="text-[9px] font-black uppercase text-white/40 ml-1 tracking-widest">Usuario</label>
          <input
            v-model="form.email"
            type="text"
            autocomplete="username"
            autocapitalize="none"
            autocorrect="off"
            spellcheck="false"
            placeholder="usuario o correo"
            class="w-full bg-white/5 border-2 border-white/10 focus:border-[#DE1F27] rounded-2xl px-5 py-4 text-white font-bold outline-none transition-all placeholder:text-white/20"
          />
        </div>

        <div class="space-y-1">
          <label class="text-[9px] font-black uppercase text-white/40 ml-1 tracking-widest">Contraseña</label>
          <div class="relative">
            <input
              v-model="form.password"
              :type="showPwd ? 'text' : 'password'"
              autocomplete="current-password"
              placeholder="••••••••"
              class="w-full bg-white/5 border-2 border-white/10 focus:border-[#DE1F27] rounded-2xl px-5 py-4 text-white font-bold outline-none transition-all placeholder:text-white/20 pr-12"
            />
            <button type="button" @click="showPwd = !showPwd"
              class="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors">
              <span v-if="showPwd">👁️‍🗨️</span>
              <span v-else>👁️</span>
            </button>
          </div>
        </div>

        <div v-if="error" class="bg-[#DE1F27]/10 border border-[#DE1F27]/30 rounded-xl px-4 py-3 text-[11px] font-bold text-[#DE1F27]">
          {{ error }}
        </div>

        <button
          type="submit"
          :disabled="loading || !form.email || !form.password"
          class="w-full bg-[#152C77] hover:bg-[#DE1F27] disabled:opacity-30 disabled:cursor-not-allowed text-white py-5 rounded-2xl font-[1000] uppercase italic tracking-widest transition-all active:scale-95 shadow-xl mt-2"
        >
          {{ loading ? 'Ingresando...' : 'Entrar →' }}
        </button>
      </form>

      <p class="text-center text-[9px] font-bold text-white/20 uppercase tracking-widest mt-10">
        Este acceso es exclusivo para personal de Pet Station
      </p>

    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/api/axios';

const router = useRouter();
const showPwd = ref(false);
const loading = ref(false);
const error = ref('');
const form = reactive({ email: '', password: '' });

const handleLogin = async () => {
  error.value = '';
  loading.value = true;
  try {
    const { data } = await api.post('/tutores/login', {
      email: form.email.trim(),
      password: form.password,
    });
    const rol = data.tutor?.rol;
    // Administradores limitados (ROLE_GESTOR) también entran: el panel les muestra solo sus pestañas
    const tieneAcceso = rol === 'ROLE_ADMIN' || rol === 'ADMIN' || rol === 'ROLE_GESTOR' || data.tutor?.panelAdmin;
    if (!tieneAcceso) {
      error.value = 'Esta cuenta no tiene acceso al panel administrativo';
      return;
    }
    localStorage.setItem('ps_token', data.token);
    localStorage.setItem('ps_session', JSON.stringify({ tutor: data.tutor, rol }));
    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    router.push('/admin/dashboard');
  } catch (e) {
    const status = e.response?.status;
    if (status === 401 || status === 403 || status === 404) {
      error.value = 'Correo o contraseña incorrectos';
    } else {
      error.value = 'Error al iniciar sesión. Intenta de nuevo';
    }
  } finally {
    loading.value = false;
  }
};
</script>
