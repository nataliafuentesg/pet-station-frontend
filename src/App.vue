<template>
  <div :class="{ 'dark': darkMode }"
    class="min-h-screen transition-colors duration-500 bg-white dark:bg-[#050505] text-slate-900 dark:text-white font-sans overflow-x-hidden">

    <div class="fixed top-24 right-4 md:top-10 md:right-10 z-[5000] flex flex-col gap-3 pointer-events-none">
      <TransitionGroup name="toast">
        <div v-for="n in notifications" :key="n.id" :class="[
          'px-6 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl flex items-center gap-4 border backdrop-blur-md pointer-events-auto',
          n.type === 'error' ? 'bg-red-600/90 text-white border-white/20' : 'bg-[#152C77]/90 text-white border-white/20'
        ]">
          <span>{{ n.type === 'error' ? '✕' : '✓' }}</span>
          {{ n.message }}
        </div>
      </TransitionGroup>
    </div>

    <nav :class="[
      'fixed top-0 w-full z-[100] transition-all px-4 md:px-12',
      isScrolled
        ? 'bg-white/95 dark:bg-black/90 border-b border-slate-200 dark:border-white/10 py-3 shadow-xl'
        : 'bg-transparent py-6'
    ]">
      <div class="max-w-[1800px] mx-auto flex items-center justify-between gap-4">

        <router-link to="/" class="text-2xl md:text-3xl font-[1000] italic uppercase tracking-tighter shrink-0">
          <span class="text-ps-red">PET</span><span class="dark:text-white text-ps-blue">STATION</span>
        </router-link>

        <div class="hidden lg:flex items-center gap-8">
          <router-link to="/servicios" class="nav-link">Servicios</router-link>
          <router-link to="/tienda" class="nav-link text-ps-red">Tienda</router-link>
          <router-link v-if="tutorData" to="/expediente" class="nav-link">Mi Expediente</router-link>
        </div>

        <div class="flex items-center gap-2 md:gap-5">
          <button @click="toggleTheme" class="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-white/5 hover:scale-110 transition-all cursor-pointer">
            <span class="text-xl">{{ darkMode ? '☀️' : '🌙' }}</span>
          </button>

          <button @click="isCartOpen = true" class="relative group p-2 hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-ps-blue dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span v-if="cartStore.count > 0" class="absolute -top-1 -right-1 bg-ps-red text-white text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-black">
              {{ cartStore.count }}
            </span>
          </button>

          <template v-if="!tutorData">
            <div class="flex items-center gap-2 md:gap-4">
              <button @click="isLoginOpen = true" class="text-[9px] md:text-[10px] font-black uppercase tracking-widest px-2 cursor-pointer">Ingresar</button>
              <button @click="isOnboardingOpen = true" class="bg-ps-red text-white px-5 md:px-8 py-3 rounded-xl md:rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest shadow-lg hover:brightness-110 transition-all">
                Registro
              </button>
            </div>
          </template>

          <template v-else>
            <div class="flex items-center gap-2 md:gap-3 bg-slate-100 dark:bg-white/10 p-1 md:pr-4 rounded-full border border-slate-200 dark:border-white/10">
              <router-link to="/seleccionar-perfil" class="flex items-center gap-2 max-w-[130px] md:max-w-none">
                <div class="w-8 h-8 md:w-9 md:h-9 rounded-full border-2 border-ps-red overflow-hidden bg-white shrink-0">
                  <img v-if="activePet?.fotoUrl" :src="activePet.fotoUrl" class="w-full h-full object-cover" />
                  <div v-else class="w-full h-full flex items-center justify-center bg-ps-blue text-white text-[10px] font-black italic">
                    {{ activePet ? activePet.nombre.charAt(0) : '?' }}
                  </div>
                </div>
                <div class="hidden sm:flex flex-col leading-none">
                  <span class="text-[7px] font-black uppercase text-slate-400">Perfil</span>
                  <span class="text-[10px] font-black uppercase italic truncate max-w-[70px]">{{ activePet?.nombre || 'Elegir' }}</span>
                </div>
              </router-link>
              <button @click="handleLogout" class="p-2 text-slate-400 hover:text-ps-red transition-all cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </template>
        </div>
      </div>
    </nav>

    <div class="lg:hidden fixed bottom-0 w-full bg-white/95 dark:bg-[#050505]/95 backdrop-blur-xl border-t border-slate-200 dark:border-white/10 z-[1000] px-2 pb-8 pt-3 flex items-end shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
      <router-link to="/" class="flex-1 flex flex-col items-center gap-1 text-slate-400 dark:text-white/40 router-link-active:text-ps-red">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h3" stroke-width="2"/></svg>
        <span class="text-[8px] font-black uppercase tracking-widest">Inicio</span>
      </router-link>
      <router-link to="/tienda" class="flex-1 flex flex-col items-center gap-1 text-slate-400 dark:text-white/40 router-link-active:text-ps-red">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" stroke-width="2"/></svg>
        <span class="text-[8px] font-black uppercase tracking-widest">Tienda</span>
      </router-link>
      <div class="flex-1 flex justify-center">
        <button @click="handleAgendarClick" class="relative -top-6 bg-ps-red text-white p-4 rounded-2xl shadow-xl active:scale-90 transition-transform">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 4v16m8-8H4" stroke-width="3"/></svg>
        </button>
      </div>
      <router-link to="/servicios" class="flex-1 flex flex-col items-center gap-1 text-slate-400 dark:text-white/40 router-link-active:text-ps-red">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7" stroke-width="2"/></svg>
        <span class="text-[8px] font-black uppercase tracking-widest">Servicios</span>
      </router-link>
      <router-link :to="tutorData ? '/expediente' : '/login'" class="flex-1 flex flex-col items-center gap-1 text-slate-400 dark:text-white/40 router-link-active:text-ps-red">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" stroke-width="2"/></svg>
        <span class="text-[8px] font-black uppercase tracking-widest">Cuenta</span>
      </router-link>
    </div>

    <main class="w-full pt-20 md:pt-0 pb-24 md:pb-0">
      <router-view v-if="!loadingSession" 
        :tutor="tutorData" :pet="activePet" :availablePets="availablePets"
        @selected="handlePetSelection" @notify="addNotify" @create-new="isOnboardingOpen = true"
        @login-success="handleLoginSuccess" @update-pet="handlePetUpdate" @delete-pet="handleDeletePet" />
    </main>

    <TheFooter />

    <CartDrawer :is-open="isCartOpen" @close="isCartOpen = false" />

    <Transition name="fade">
      <div v-if="isLoginOpen || isOnboardingOpen" class="fixed inset-0 z-[4000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <LoginModal v-if="isLoginOpen" @success="handleLoginSuccess" @goRegister="isLoginOpen = false; isOnboardingOpen = true" @close="isLoginOpen = false" @notify="addNotify" />
        <PetOnboarding v-if="isOnboardingOpen" :tutorExistente="tutorData" @finalizado="handleOnboardingFinish" @close="isOnboardingOpen = false" @notify="addNotify" />
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from './stores/cartStore';
import LoginModal from './components/auth/LoginModal.vue';
import PetOnboarding from './components/auth/PetOnboarding.vue';
import CartDrawer from './components/cart/CartDrawer.vue';
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
  addNotify({ message: "¡Nueva mascota vinculada!", type: 'success' });
};

const handlePetSelection = (pet) => {
  activePet.value = pet;
  localStorage.setItem('ps_active_pet', JSON.stringify(pet));
  saveSession();
  router.push('/expediente'); 
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
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      availablePets.value = availablePets.value.filter(p => p.id !== petId);
      if (activePet.value?.id === petId) activePet.value = null;
      saveSession();
      addNotify("Mascota eliminada correctamente");
    }
  } catch (error) { addNotify({ message: "Error de conexión", type: 'error' }); }
};

const handleLogout = () => {
  localStorage.removeItem('ps_session');
  localStorage.removeItem('ps_token');
  localStorage.removeItem('ps_active_pet');
  tutorData.value = null; 
  activePet.value = null; 
  availablePets.value = [];
  router.push('/');
  addNotify("Sesión cerrada");
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
    activePet.value = session.pet || JSON.parse(localStorage.getItem('ps_active_pet'));
    availablePets.value = session.pets || [];
  }
  loadingSession.value = false;
});
</script>

<style scoped>
@reference "./style.css";
.nav-link { @apply text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:text-ps-red cursor-pointer; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.toast-enter-active, .toast-leave-active { transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.toast-enter-from { opacity: 0; transform: translateY(-20px) scale(0.9); }
.toast-leave-to { opacity: 0; transform: translateX(100px); }
</style>