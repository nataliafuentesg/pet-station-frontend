<template>
  <div class="min-h-screen flex items-center justify-center bg-white dark:bg-[#050505] p-4">
    <div class="w-full max-w-md bg-white dark:bg-ps-black rounded-[3rem] p-10 shadow-2xl border border-slate-200 dark:border-white/5 animate-in zoom-in duration-300">
      
      <div class="text-center mb-10">
        <h2 class="text-4xl font-black uppercase italic tracking-tighter text-ps-black dark:text-white leading-none">
          NUEVA <span class="text-ps-red">CLAVE.</span>
        </h2>
        <p class="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] mt-3 italic">Restablecer acceso</p>
      </div>

      <form v-if="!success" @submit.prevent="handleReset" class="space-y-6">
        <div class="space-y-1">
          <label class="text-[10px] font-black uppercase text-slate-500 ml-4">Nueva Contraseña</label>
          <input v-model="form.password" type="password" required class="input-dark" placeholder="••••••••" />
        </div>

        <div class="space-y-1">
          <label class="text-[10px] font-black uppercase text-slate-500 ml-4">Confirmar Contraseña</label>
          <input v-model="form.confirmPassword" type="password" required class="input-dark" placeholder="••••••••" />
        </div>

        <button :disabled="loading" type="submit"
          class="w-full bg-ps-black dark:bg-white text-white dark:text-ps-black py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-ps-red dark:hover:bg-ps-red hover:text-white active:scale-95 transition-all italic shadow-xl">
          {{ loading ? 'Actualizando...' : 'Cambiar Contraseña' }}
        </button>
      </form>

      <div v-else class="text-center space-y-6 animate-in fade-in">
        <div class="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto text-3xl">✓</div>
        <p class="font-bold text-ps-black dark:text-white uppercase italic">¡Contraseña actualizada con éxito!</p>
        <router-link to="/" class="block w-full bg-ps-red text-white py-4 rounded-xl font-black uppercase italic text-center">Ir al Inicio</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/api/axios';

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const success = ref(false);

const form = reactive({
  password: '',
  confirmPassword: '',
  token: ''
});

onMounted(() => {
  // Capturamos el token de la URL: ?token=XYZ
  form.token = route.query.token;
  if (!form.token) {
    router.push('/?error=invalid_token');
  }
});

const handleReset = async () => {
  if (form.password !== form.confirmPassword) {
    alert("Las contraseñas no coinciden");
    return;
  }

  loading.value = true;
  try {
    await api.post('/auth/reset-password', {
      token: form.token,
      password: form.password
    });
    success.value = true;
  } catch (e) {
    alert(e.response?.data || "Error al restablecer la contraseña");
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
@reference "../../style.css";
.input-dark {
  @apply w-full bg-slate-100 dark:bg-white/5 p-4 rounded-2xl border-2 border-transparent focus:border-ps-red outline-none font-bold text-ps-black dark:text-white text-sm transition-all;
}
</style>