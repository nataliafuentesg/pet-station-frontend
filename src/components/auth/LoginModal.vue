<template>
  <div class="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-ps-dark/95 backdrop-blur-xl">
    <div class="bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl animate-scale-up">
      
      <div class="p-10 text-slate-900">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-3xl font-black text-ps-blue uppercase tracking-tighter italic">
            Hola de <span class="text-ps-red">nuevo</span>
          </h2>
          <button @click="$emit('close')" class="text-slate-400 hover:text-ps-red transition-colors text-2xl">✕</button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <label class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Correo Electrónico</label>
            <input v-model="form.email" type="email" required placeholder="tu@correo.com"
              class="w-full bg-slate-100 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-ps-blue transition-all outline-none font-bold" />
          </div>

          <div>
            <label class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Contraseña</label>
            <input v-model="form.password" type="password" required placeholder="••••••••"
              class="w-full bg-slate-100 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-ps-blue transition-all outline-none font-bold" />
          </div>

          <div v-if="error" class="bg-red-50 text-ps-red text-[10px] font-black uppercase p-4 rounded-2xl border-l-4 border-ps-red space-y-2">
            <p>{{ error }}</p>
            <button v-if="esInvitado" @click="$emit('necesitaActivacion', form.email)" type="button" class="block underline text-ps-blue hover:text-ps-red transition-colors">
              ¿Agendaste como invitado? Activa tu cuenta aquí
            </button>
          </div>

          <button type="submit" :disabled="loading"
            class="w-full bg-ps-blue text-white font-black py-5 rounded-2xl hover:bg-ps-red transition-all shadow-lg uppercase tracking-widest disabled:opacity-50">
            {{ loading ? 'Verificando...' : 'Entrar a mi perfil' }}
          </button>
        </form>

        <p class="text-center mt-8 text-slate-400 text-xs font-medium">
          ¿Aún no eres parte? 
          <button @click="$emit('close')" class="text-ps-blue font-black hover:text-ps-red transition-colors">Regístrate aquí</button>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const emit = defineEmits(['success', 'close', 'necesitaActivacion']);
const loading = ref(false);
const error = ref(null);
const esInvitado = ref(false);
const form = ref({ email: '', password: '' });

const handleSubmit = async () => {
  loading.value = true;
  error.value = null;
  esInvitado.value = false;

  try {
    const response = await fetch('http://localhost:8080/api/tutores/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value)
    });

    if (response.status === 403) {
      esInvitado.value = true;
      throw new Error('Tu cuenta no tiene contraseña. ¡Debes activarla!');
    }

    if (!response.ok) {
      const msg = await response.text();
      throw new Error(msg || 'Credenciales incorrectas');
    }

    const data = await response.json();
    localStorage.setItem('tutor_sesion', JSON.stringify(data));
    emit('success', data);
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
@keyframes scale-up {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
.animate-scale-up {
  animation: scale-up 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
</style>