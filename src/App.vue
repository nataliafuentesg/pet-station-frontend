<template>
  <div :class="{ 'dark': darkMode }"
    class="min-h-screen transition-colors duration-500 bg-white dark:bg-[#050505] text-slate-900 dark:text-white font-sans overflow-x-hidden">

    <div class="fixed bottom-24 right-6 md:bottom-10 md:right-10 z-[3000] flex flex-col gap-3">
      <TransitionGroup name="toast">
        <div v-for="n in notifications" :key="n.id" :class="[
          'px-6 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl flex items-center gap-4 border backdrop-blur-md transition-all duration-300',
          n.type === 'error' ? 'bg-red-600/90 text-white border-white/20' : 'bg-[#152C77]/90 text-white border-white/20'
        ]">
          <span>{{ n.type === 'error' ? '✕' : '✓' }}</span>
          {{ n.message }}
        </div>
      </TransitionGroup>
    </div>

    <div class="fixed bottom-6 right-6 z-[500] flex flex-col gap-4 items-end">
      <button @click="handleAgendarClick"
        class="group flex items-center gap-3 bg-ps-red hover:bg-[#b91a21] text-white p-4 md:px-6 md:py-4 rounded-2xl md:rounded-full shadow-[0_15px_30px_rgba(222,31,39,0.4)] transition-all hover:scale-110 active:scale-95">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span class="hidden md:block text-[10px] font-black uppercase tracking-widest">Agendar Cita</span>
      </button>
    </div>

    <nav :class="[
      'fixed top-0 w-full z-[100] transition-all px-4 md:px-12',
      isScrolled
        ? 'bg-white/95 dark:bg-black/90 border-b border-slate-200 dark:border-ps-red/30 py-3 shadow-xl'
        : 'bg-transparent py-6'
    ]">
      <div class="max-w-[1800px] mx-auto flex items-center justify-between gap-4">

        <router-link to="/" class="text-2xl md:text-3xl font-black italic uppercase tracking-tighter shrink-0">
          <span class="text-ps-red">PET</span><span class="dark:text-white text-ps-blue">STATION</span>
        </router-link>

        <div class="hidden lg:flex items-center gap-8">
          <router-link to="/servicios" class="nav-link">Servicios</router-link>
          <router-link to="/tienda" class="nav-link text-ps-red">Tienda</router-link>
          <router-link v-if="tutorData" to="/expediente" class="nav-link">Mi Expediente</router-link>
        </div>

        <div class="flex items-center gap-2 md:gap-5">

          <button @click="toggleTheme"
            class="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-white/5 hover:scale-110 transition-all cursor-pointer z-[110]">
            <span class="text-xl">{{ darkMode ? '☀️' : '🌙' }}</span>
          </button>

          <button @click="isCartOpen = true" class="relative group p-2 hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-ps-blue dark:text-white" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span v-if="cartStore.count > 0"
              class="absolute -top-1 -right-1 bg-ps-red text-white text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-black">
              {{ cartStore.count }}
            </span>
          </button>

          <template v-if="!tutorData">
            <div class="flex items-center gap-2 md:gap-4">
              <button @click="isLoginOpen = true"
                class="text-[9px] md:text-[10px] font-black uppercase tracking-widest px-2 cursor-pointer">Ingresar</button>
              <button @click="isOnboardingOpen = true"
                class="bg-ps-red text-white px-5 md:px-8 py-3 rounded-xl md:rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest shadow-lg hover:brightness-110 transition-all">
                Registro
              </button>
            </div>
          </template>

          <template v-else>
            <div
              class="flex items-center gap-2 md:gap-3 bg-slate-100 dark:bg-white/10 p-1 md:pr-4 rounded-full border border-slate-200 dark:border-white/10">
              <router-link to="/seleccionar-perfil" class="flex items-center gap-2 max-w-[130px] md:max-w-none">
                <div
                  class="w-8 h-8 md:w-9 md:h-9 rounded-full border-2 border-ps-red overflow-hidden bg-white shrink-0">
                  <img v-if="activePet?.fotoUrl" :src="activePet.fotoUrl" class="w-full h-full object-cover" />
                  <div v-else
                    class="w-full h-full flex items-center justify-center bg-ps-blue text-white text-[10px] font-black italic">
                    {{ activePet ? activePet.nombre.charAt(0) : '?' }}</div>
                </div>
                <div class="hidden sm:flex flex-col leading-none">
                  <span class="text-[7px] font-black uppercase text-slate-400">Perfil</span>
                  <span class="text-[10px] font-black uppercase italic truncate max-w-[70px]">{{ activePet?.nombre ||
                    'Elegir' }}</span>
                </div>
              </router-link>
              <button @click="handleLogout"
                class="p-2 text-slate-400 hover:text-ps-red transition-all cursor-pointer"><svg
                  xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg></button>
            </div>
          </template>
        </div>
      </div>
    </nav>

    <main class="w-full pt-20 md:pt-0">
      <router-view v-if="!loadingSession" :tutor="tutorData" :pet="activePet" :availablePets="availablePets"
        @selected="handlePetSelection" @notify="addNotify" @create-new="isOnboardingOpen = true"
        @login-success="handleLoginSuccess" @update-pet="handlePetUpdate" @delete-pet="handleDeletePet" />
    </main>

    <TheFooter />

    <div v-if="isLoginOpen || isOnboardingOpen"
      class="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <LoginModal v-if="isLoginOpen" @success="handleLoginSuccess"
        @goRegister="isLoginOpen = false; isOnboardingOpen = true" @close="isLoginOpen = false" @notify="addNotify" />
      <PetOnboarding v-if="isOnboardingOpen" :tutorExistente="tutorData" @finalizado="handleOnboardingFinish"
        @close="isOnboardingOpen = false" @notify="addNotify" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from './stores/cartStore';
import LoginModal from './components/auth/LoginModal.vue';
import PetOnboarding from './components/auth/PetOnboarding.vue';
import TheFooter from './components/TheFooter.vue';

const router = useRouter();
const cartStore = useCartStore();
const darkMode = ref(false);
const isScrolled = ref(false);
const isCartOpen = ref(false);
const tutorData = ref(null);
const activePet = ref(null);
const availablePets = ref([]);
const loadingSession = ref(true);
const isLoginOpen = ref(false);
const isOnboardingOpen = ref(false);
const notifications = ref([]);

const addNotify = (n) => {
  const message = n.msg || n.message || n;
  const type = n.type || 'success';
  const id = Date.now();
  notifications.value.push({ id, message, type });
  setTimeout(() => notifications.value = notifications.value.filter(x => x.id !== id), 4000);
};

const handleLoginSuccess = async (tutor) => {
  tutorData.value = tutor;
  availablePets.value = tutor.mascotas || [];
  isLoginOpen.value = false;
  saveSession();
  // Si el usuario tiene mascotas, lo mandamos al selector, si no, al onboarding
  if (availablePets.value.length > 0) router.push('/seleccionar-perfil');
  else isOnboardingOpen.value = true;
};

const handleOnboardingFinish = (data) => {
  const tutorActualizado = data.tutor || data;
  
  if (tutorActualizado && tutorActualizado.mascotas) {
    tutorData.value = { ...tutorActualizado };
        availablePets.value = [...tutorActualizado.mascotas];
        saveSession();
  }

  isOnboardingOpen.value = false;
  addNotify({ message: "¡Nueva mascota añadida!", type: 'success' });
};

const handlePetSelection = (pet) => {
  // 1. Guardamos la mascota seleccionada en el estado global
  activePet.value = pet;
  
  // 2. Lo guardamos en localStorage para que no se pierda al recargar
  localStorage.setItem('ps_active_pet', JSON.stringify(pet));
  
  // 3. Redirigimos al expediente médico
  router.push('/expediente'); 
  
  // 4. (Opcional) Notificación visual
  addNotify({ message: `Entrando al perfil de ${pet.nombre}`, type: 'success' });
};

const handlePetUpdate = (updatedPet) => {
  activePet.value = updatedPet;
  const idx = availablePets.value.findIndex(p => p.id === updatedPet.id);
  if (idx !== -1) availablePets.value[idx] = updatedPet;
  saveSession();
};

const handleDeletePet = async (petId) => {
  const token = localStorage.getItem('ps_token');
  try {
    const res = await fetch(`http://localhost:8080/api/mascotas/${petId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (res.ok) {
      // Filtramos la mascota borrada de la lista actual en el front
      availablePets.value = availablePets.value.filter(p => p.id !== petId);
      
      // Si la mascota borrada era la activa, limpiamos la selección
      if (activePet.value?.id === petId) {
        activePet.value = null;
      }
      
      saveSession(); // Actualizamos el localStorage
      addNotify({ message: "Mascota eliminada correctamente", type: 'success' });
    } else {
      addNotify({ message: "No se pudo eliminar la mascota", type: 'error' });
    }
  } catch (error) {
    addNotify({ message: "Error de conexión", type: 'error' });
  }
};

const handleLogout = () => {
  localStorage.removeItem('ps_session');
  localStorage.removeItem('ps_token');
  tutorData.value = null; activePet.value = null; availablePets.value = [];
  router.push('/');
  addNotify("Sesión cerrada correctamente");
};

const handleAgendarClick = () => {
  if (!tutorData.value) isLoginOpen.value = true;
  else if (availablePets.value.length === 0) isOnboardingOpen.value = true;
  else router.push('/agendar');
};

const toggleTheme = () => {
  darkMode.value = !darkMode.value;
  document.documentElement.classList.toggle('dark', darkMode.value);
  localStorage.setItem('ps_theme', darkMode.value ? 'dark' : 'light');
};

const saveSession = () => {
  localStorage.setItem('ps_session', JSON.stringify({
    tutor: tutorData.value,
    pet: activePet.value,
    pets: availablePets.value
  }));
};

onMounted(() => {
  window.addEventListener('scroll', () => isScrolled.value = window.scrollY > 30);
  darkMode.value = localStorage.getItem('ps_theme') === 'dark';
  document.documentElement.classList.toggle('dark', darkMode.value);
  const saved = localStorage.getItem('ps_session');
  if (saved) {
    const session = JSON.parse(saved);
    tutorData.value = session.tutor;
    activePet.value = session.pet;
    availablePets.value = session.pets || [];
  }
  loadingSession.value = false;
});
</script>

<style scoped>
@reference "./style.css";

.nav-link {
  @apply text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:text-ps-red cursor-pointer;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.9);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100px);
}
</style>