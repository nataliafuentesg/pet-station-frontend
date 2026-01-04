<template>
  <div class="bg-white dark:bg-[#0a0a0a] p-10 rounded-[3rem] shadow-2xl border border-slate-200 dark:border-white/5 transition-all">
    
    <div v-if="view === 'login'">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-[1000] uppercase italic tracking-tighter text-[#152C77] dark:text-white">Ingresar</h2>
        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Acceso de Tutor</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div class="space-y-1">
          <label class="text-[10px] font-black uppercase text-slate-400 ml-4">Correo Electrónico</label>
          <input 
            v-model="form.email" 
            type="email" 
            required 
            placeholder="tu@email.com"
            class="w-full bg-slate-100 dark:bg-white/5 p-4 rounded-2xl border-2 border-transparent focus:border-[#152C77] dark:focus:border-[#de1f27] outline-none font-bold dark:text-white transition-all text-sm" 
          />
        </div>

        <div class="space-y-1">
          <label class="text-[10px] font-black uppercase text-slate-400 ml-4">Contraseña</label>
          <input 
            v-model="form.password" 
            type="password" 
            required 
            placeholder="••••••••"
            class="w-full bg-slate-100 dark:bg-white/5 p-4 rounded-2xl border-2 border-transparent focus:border-[#152C77] dark:focus:border-[#de1f27] outline-none font-bold dark:text-white transition-all text-sm" 
          />
        </div>

        <button 
          :disabled="loading" 
          type="submit"
          class="w-full bg-[#de1f27] text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:scale-[1.02] transition-all shadow-xl shadow-[#de1f27]/20 disabled:opacity-50 mt-4"
        >
          {{ loading ? 'Iniciando sesión...' : 'Entrar al Sistema' }}
        </button>
      </form>

      <div class="mt-6 flex flex-col gap-4 text-center">
        <button @click="view = 'forgot'" class="text-[10px] font-black uppercase text-slate-400 hover:text-[#de1f27] transition-colors">
          ¿Olvidaste tu contraseña?
        </button>
        <button @click="$emit('goRegister')" class="text-[10px] font-black uppercase text-[#de1f27] border-t border-slate-100 dark:border-white/5 pt-4 hover:underline">
          ¿No tienes cuenta? Regístrate
        </button>
      </div>
    </div>

    <div v-else class="animate-in fade-in zoom-in-95 duration-300">
      <div class="text-center mb-8">
        <h2 class="text-2xl font-[1000] uppercase italic text-[#de1f27]">Recuperar</h2>
        <p class="text-[10px] font-bold text-slate-400 uppercase mt-2">Enviaremos un token a tu correo</p>
      </div>
      <div class="space-y-4">
        <input 
          v-model="form.email" 
          type="email" 
          placeholder="Correo registrado"
          class="w-full bg-slate-100 dark:bg-white/5 p-4 rounded-2xl border-2 border-transparent focus:border-[#152C77] outline-none font-bold dark:text-white transition-all text-sm" 
        />
        <button @click="handleForgot" class="w-full bg-[#152C77] text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:scale-[1.02] transition-all">
          Generar Token
        </button>
        <button @click="view = 'login'" class="text-[10px] font-black uppercase text-slate-400 w-full mt-2">
          Volver al Login
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const emit = defineEmits(['success', 'goRegister', 'close']);
const form = reactive({ email: '', password: '' }); // Cambiado 'cedula' por 'password'
const loading = ref(false);
const view = ref('login');

const handleLogin = async () => {
  loading.value = true;
  try {
    // IMPORTANTE: Tu back espera un POST con JSON
    const res = await fetch('http://localhost:8080/api/tutores/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: form.email,
        password: form.password
      })
    });
    
    if (res.ok) {
      const tutor = await res.json();
      emit('success', tutor);
    } else {
      const errorText = await res.text();
      alert(errorText || "Credenciales incorrectas");
    }
  } catch (e) {
    alert("Error conectando con el servidor. Verifica que el backend esté corriendo.");
  } finally {
    loading.value = false;
  }
};

const handleForgot = async () => {
  if (!form.email) return alert("Ingresa tu email");
  try {
    const res = await fetch('http://localhost:8080/api/tutores/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: form.email })
    });
    if (res.ok) {
      const data = await res.json();
      alert("Token de recuperación generado. Revisa la consola.");
      console.log("TOKEN DE PRUEBA:", data.token);
      view.value = 'login';
    } else {
      alert("El correo no está registrado.");
    }
  } catch (e) {
    console.error(e);
  }
};
</script>