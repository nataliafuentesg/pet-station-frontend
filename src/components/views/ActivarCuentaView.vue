<template>
  <div class="min-h-screen bg-slate-50 dark:bg-[#080808] flex items-center justify-center p-6">
    <div class="w-full max-w-md">

      <!-- Logo -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-[1000] uppercase italic tracking-tighter">
          <span class="text-[#152C77] dark:text-white">PET</span>
          <span class="text-[#DE1F27]"> STATION.</span>
        </h1>
        <p class="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 mt-1">Veterinaria &amp; Grooming · Chía</p>
      </div>

      <!-- Card -->
      <div class="bg-white dark:bg-[#111] rounded-[2.5rem] shadow-xl overflow-hidden">

        <!-- Estado: token inválido -->
        <div v-if="tokenInvalido" class="p-10 text-center">
          <p class="text-4xl mb-4">⚠️</p>
          <h2 class="text-xl font-[1000] uppercase italic text-[#152C77] dark:text-white mb-3">Enlace expirado</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-6">
            Este enlace ya fue usado o venció. Escríbenos y te enviamos uno nuevo.
          </p>
          <a href="https://wa.me/573053462413?text=Hola,%20necesito%20activar%20mi%20cuenta%20en%20Pet%20Station"
            target="_blank"
            class="inline-block bg-[#152C77] text-white font-black uppercase text-[11px] tracking-widest px-6 py-3 rounded-2xl">
            Contactar por WhatsApp
          </a>
        </div>

        <!-- Estado: éxito -->
        <div v-else-if="activado" class="p-10 text-center">
          <p class="text-4xl mb-4">🐾</p>
          <h2 class="text-xl font-[1000] uppercase italic text-[#152C77] dark:text-white mb-3">¡Cuenta activada!</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-6">
            Bienvenido<span v-if="nombre">, <strong class="text-[#152C77] dark:text-white">{{ nombre }}</strong></span>.
            Ya puedes ver el perfil de tu mascota, agendar citas y acceder a la tienda.
          </p>
          <button @click="irAlPerfil"
            class="bg-[#DE1F27] text-white font-black uppercase text-[11px] tracking-widest px-6 py-3 rounded-2xl w-full active:scale-95 transition-all">
            Ver mi perfil →
          </button>
        </div>

        <!-- Estado: formulario -->
        <div v-else>
          <div class="bg-[#152C77] px-8 pt-8 pb-6">
            <p class="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-1">Ya eres parte de la familia</p>
            <h2 class="text-2xl font-[1000] uppercase italic text-white leading-tight">
              Activa tu<br>cuenta
            </h2>
          </div>

          <div class="p-8">
            <p class="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Elige una contraseña para acceder a tu historial, citas y tienda desde cualquier dispositivo.
            </p>

            <form @submit.prevent="activar" class="space-y-4">
              <div>
                <label class="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Nueva contraseña</label>
                <input v-model="password" type="password" placeholder="Mínimo 6 caracteres"
                  class="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-4 py-3 text-sm font-bold dark:text-white focus:outline-none focus:ring-2 focus:ring-[#152C77]"
                  required minlength="6" />
              </div>
              <div>
                <label class="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Confirmar contraseña</label>
                <input v-model="confirmar" type="password" placeholder="Repite la contraseña"
                  class="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-4 py-3 text-sm font-bold dark:text-white focus:outline-none focus:ring-2 focus:ring-[#152C77]"
                  required />
              </div>

              <!-- Consentimiento para recordatorios automáticos -->
              <label class="flex items-start gap-3 cursor-pointer group">
                <input type="checkbox" v-model="recibeNotificaciones"
                  class="mt-0.5 w-4 h-4 rounded accent-[#152C77] shrink-0 cursor-pointer" />
                <span class="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Quiero recibir recordatorios de vacunas y baños de mis mascotas por email
                </span>
              </label>

              <p v-if="error" class="text-[11px] font-bold text-[#DE1F27]">{{ error }}</p>

              <button type="submit" :disabled="cargando"
                class="w-full bg-[#152C77] text-white font-black uppercase text-[11px] tracking-widest py-4 rounded-2xl mt-2 active:scale-95 transition-all disabled:opacity-50 italic">
                {{ cargando ? 'Activando...' : 'Activar mi cuenta →' }}
              </button>
            </form>
          </div>
        </div>

      </div>

      <p class="text-center text-[10px] text-slate-400 mt-6">
        ¿Ya tienes cuenta?
        <a href="/" class="text-[#152C77] dark:text-white font-black">Iniciar sesión</a>
      </p>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/api/axios';

const route = useRoute();
const router = useRouter();

const token = ref('');
const nombre = ref('');
const password = ref('');
const confirmar = ref('');
const cargando = ref(false);
const error = ref('');
const activado = ref(false);
const tokenInvalido = ref(false);
const recibeNotificaciones = ref(false);

onMounted(async () => {
  token.value = route.query.token || '';
  if (!token.value) {
    tokenInvalido.value = true;
    return;
  }
  try {
    const { data } = await api.get('/auth/activar-cuenta/info', { params: { token: token.value } });
    nombre.value = data.nombre || '';
  } catch {
    tokenInvalido.value = true;
  }
});

const activar = async () => {
  error.value = '';
  if (password.value !== confirmar.value) {
    error.value = 'Las contraseñas no coinciden.';
    return;
  }
  cargando.value = true;
  try {
    const { data } = await api.post('/auth/activar-cuenta', {
      token: token.value,
      password: password.value,
      recibeNotificaciones: recibeNotificaciones.value,
    });
    localStorage.setItem('ps_token', data.token);
    localStorage.setItem('ps_session', JSON.stringify({ tutor: { nombre: data.nombre, email: data.email } }));
    nombre.value = data.nombre;
    activado.value = true;
  } catch (e) {
    error.value = e.response?.data?.error || 'No pudimos activar tu cuenta. Intenta de nuevo.';
  } finally {
    cargando.value = false;
  }
};

const irAlPerfil = () => router.push('/seleccionar-perfil');
</script>
