<template>
  <div class="bg-white rounded-[3rem] p-12 max-w-sm w-full shadow-2xl text-center animate-in zoom-in duration-300">
    <div class="text-4xl mb-4 text-ps-red">🔑</div>
    <h2 class="text-2xl font-black text-ps-blue uppercase italic mb-2 tracking-tighter">
      {{ email ? 'Protege tu cuenta' : 'Activa tu perfil' }}
    </h2>
    
    <p class="text-slate-400 text-[10px] mb-8 font-bold uppercase tracking-widest leading-relaxed">
      {{ email ? `Para: ${email}` : 'Ingresa tu correo para establecer una contraseña' }}
    </p>
    
    <form @submit.prevent="handleActivate" class="space-y-4">
      <div v-if="!email" class="text-left space-y-1">
        <label class="ml-4 text-[9px] font-black text-slate-400 uppercase">Correo de registro</label>
        <input v-model="manualEmail" type="email" placeholder="ejemplo@correo.com" class="w-full bg-slate-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-ps-blue" required />
      </div>

      <div class="text-left space-y-1">
        <label class="ml-4 text-[9px] font-black text-slate-400 uppercase">Nueva Contraseña</label>
        <input v-model="pass" type="password" placeholder="Mínimo 6 caracteres" class="w-full bg-slate-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-ps-blue" required minlength="6" />
      </div>

      <p v-if="statusMsg" :class="isError ? 'text-ps-red' : 'text-green-500'" class="text-[10px] font-black uppercase tracking-widest animate-pulse">
        {{ statusMsg }}
      </p>

      <button :disabled="loading" class="w-full bg-ps-red text-white font-black py-5 rounded-2xl uppercase tracking-widest hover:bg-ps-blue transition-all shadow-lg mt-4 disabled:opacity-50">
        {{ loading ? 'Procesando...' : 'Activar Cuenta ahora' }}
      </button>

      <button type="button" @click="$emit('close')" class="text-slate-400 text-[9px] font-black uppercase mt-4 hover:text-ps-red">
        Cancelar
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const props = defineProps(['email']);
const emit = defineEmits(['listo', 'close']);

const manualEmail = ref('');
const pass = ref('');
const loading = ref(false);
const statusMsg = ref('');
const isError = ref(false);

const handleActivate = async () => {
  const emailAFinalizar = props.email || manualEmail.value;
  if (!emailAFinalizar) {
    isError.value = true;
    statusMsg.value = "Por favor ingresa un correo";
    return;
  }

  loading.value = true;
  statusMsg.value = '';

  try {
    const res = await fetch('http://localhost:8080/api/tutores/activar-cuenta', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email: emailAFinalizar, 
        password: pass.value 
      })
    });

    const data = await res.json();

    if (res.ok) {
      isError.value = false;
      statusMsg.value = "¡Éxito! Iniciando sesión...";
      
      // Guardamos la sesión localmente
      localStorage.setItem('tutor_sesion', JSON.stringify(data));
      
      setTimeout(() => {
        emit('listo', data);
      }, 1500);
    } else {
      isError.value = true;
      // El backend envía el mensaje de error como string
      statusMsg.value = typeof data === 'string' ? data : "Error al activar la cuenta";
    }
  } catch (e) {
    isError.value = true;
    statusMsg.value = "Error de conexión con PetStation.";
  } finally {
    loading.value = false;
  }
};
</script>