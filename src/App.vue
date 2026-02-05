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

    <nav :class="['fixed top-0 w-full z-[100] transition-all px-4 md:px-12', isScrolled ? 'bg-white/95 dark:bg-black/90 border-b border-slate-200 dark:border-white/10 py-3 shadow-xl' : 'bg-transparent py-5']">
      <div class="max-w-[1800px] mx-auto flex items-center justify-between">
        
        <router-link to="/" class="text-xl md:text-3xl font-[1000] italic uppercase tracking-tighter shrink-0">
          <span class="text-ps-red">PET</span><span class="dark:text-white text-ps-blue"> STATION</span>
        </router-link>

        <div class="hidden lg:flex items-center gap-8 bg-slate-100/50 dark:bg-white/5 px-8 py-3 rounded-2xl border border-slate-200/50 dark:border-white/10 backdrop-blur-md">
          <router-link to="/" class="nav-desktop-link">Inicio</router-link>
          <router-link to="/tienda" class="nav-desktop-link">Tienda</router-link>
          <router-link to="/servicios" class="nav-desktop-link">Servicios</router-link>
          <button @click="handleAgendarClick" class="nav-desktop-link">Agendar</button>
        </div>

        <div class="flex items-center gap-2 md:gap-5">
          <button @click="toggleTheme" class="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-white/5 transition-all cursor-pointer">
            <span class="text-lg">{{ darkMode ? '☀️' : '🌙' }}</span>
          </button>

          <button @click="isCartOpen = true" class="relative p-2 hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-ps-blue dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span v-if="cartStore.cartCount > 0" class="absolute -top-1 -right-1 bg-ps-red text-white text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-black">
              {{ cartStore.cartCount }}
            </span>
          </button>

          <template v-if="!tutorData">
            <button @click="isLoginOpen = true" class="p-2 bg-ps-red/10 text-ps-red rounded-xl hover:bg-ps-red hover:text-white transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
          </template>

          <template v-else>
            <div class="flex items-center gap-2 bg-slate-100 dark:bg-white/10 p-1 md:pr-4 rounded-full border border-slate-200 dark:border-white/10">
              <router-link to="/seleccionar-perfil" class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-full border-2 border-ps-red overflow-hidden bg-white shrink-0">
                  <img v-if="activePet?.fotoUrl" :src="activePet.fotoUrl" class="w-full h-full object-cover" />
                  <div v-else class="w-full h-full flex items-center justify-center bg-ps-blue text-white text-[10px] font-black uppercase">{{ activePet ? activePet.nombre.charAt(0) : '?' }}</div>
                </div>
                <span class="hidden sm:block text-[10px] font-black uppercase italic">{{ activePet?.nombre || 'Elegir' }}</span>
              </router-link>
              <button @click="handleLogout" class="p-1.5 text-slate-400 hover:text-ps-red transition-all cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7" />
                </svg>
              </button>
            </div>
          </template>
        </div>
      </div>
    </nav>

    <div class="lg:hidden fixed bottom-0 w-full bg-white/95 dark:bg-[#050505]/95 backdrop-blur-xl border-t border-slate-200 dark:border-white/10 z-[1000] px-2 pb-8 pt-3 flex items-end shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
      <router-link to="/" class="flex-1 flex flex-col items-center gap-1 text-slate-400 dark:text-white/40">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h3" stroke-width="2" /></svg>
        <span class="text-[8px] font-black uppercase tracking-widest">Inicio</span>
      </router-link>
      <router-link to="/tienda" class="flex-1 flex flex-col items-center gap-1 text-slate-400 dark:text-white/40">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" stroke-width="2" /></svg>
        <span class="text-[8px] font-black uppercase tracking-widest">Tienda</span>
      </router-link>
      <div class="flex-1 flex justify-center">
        <button @click="handleAgendarClick" class="relative -top-6 bg-ps-red text-white p-4 rounded-2xl shadow-xl active:scale-90 transition-transform">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 4v16m8-8H4" stroke-width="3" /></svg>
        </button>
      </div>
      <a href="https://wa.me/573124965755" target="_blank" class="flex-1 flex flex-col items-center gap-1 text-green-500">
        <svg viewBox="0 0 24 24" class="h-6 w-6 fill-current" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        <span class="text-[8px] font-black uppercase tracking-widest">Soporte</span>
      </a>
      <router-link :to="tutorData ? '/expediente' : '/login'" class="flex-1 flex flex-col items-center gap-1 text-slate-400 dark:text-white/40">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" stroke-width="2" /></svg>
        <span class="text-[8px] font-black uppercase tracking-widest">Cuenta</span>
      </router-link>
    </div>

    <main class="w-full pt-24 md:pt-0 pb-24 md:pb-0">
      <router-view :key="availablePets.length" v-if="!loadingSession" :tutor="tutorData" :pet="activePet" :availablePets="availablePets" @selected="handlePetSelection" @notify="addNotify" @create-new="isOnboardingOpen = true" @login-success="handleLoginSuccess" />
    </main>

    <TheFooter :tutor="tutorData" />
    <WhatsappButton class="hidden lg:flex" />
    <CartDrawer :is-open="isCartOpen" :tutor="tutorData" @close="isCartOpen = false" />
    
    <Transition name="fade">
      <div v-if="isLoginOpen || isOnboardingOpen" class="fixed inset-0 z-[4000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <LoginModal v-if="isLoginOpen" @success="handleLoginSuccess" @goRegister="isLoginOpen = false; isOnboardingOpen = true" @close="isLoginOpen = false" @notify="addNotify" />
        <PetOnboarding v-if="isOnboardingOpen" :tutorExistente="tutorData" @finalizado="handleOnboardingFinish" @close="isOnboardingOpen = false" @notify="addNotify" />
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from './stores/cartStore';
import api from '@/api/axios'; 
import LoginModal from './components/auth/LoginModal.vue';
import PetOnboarding from './components/auth/PetOnboarding.vue';
import CartDrawer from './components/cart/CartDrawer.vue';
import TheFooter from './components/TheFooter.vue';
import WhatsappButton from './components/shared/WhatsappButton.vue';

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

const toggleTheme = () => {
  darkMode.value = !darkMode.value;
  document.documentElement.classList.toggle('dark', darkMode.value);
  localStorage.setItem('ps_theme', darkMode.value ? 'dark' : 'light');
};

const addNotify = (n) => {
  const message = n.msg || n.message || n;
  const type = n.type || 'success';
  const id = Date.now();
  notifications.value.push({ id, message, type });
  setTimeout(() => notifications.value = notifications.value.filter(x => x.id !== id), 4000);
};

const handleLoginSuccess = async (data) => {
  const tutor = data.id ? data : data.tutor;
  const token = data.token || localStorage.getItem('ps_token');
  const esNuevo = data.esNuevoDeGoogle || false;
  localStorage.setItem('ps_token', token);
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  tutorData.value = tutor;
  availablePets.value = tutor.mascotas || [];
  saveSession();
  isLoginOpen.value = false;
  await nextTick();
  if (tutor.rol === 'ROLE_ADMIN' || tutor.rol === 'ADMIN') {
    router.push('/admin/dashboard');
  } else if (esNuevo || availablePets.value.length === 0) {
    isOnboardingOpen.value = true;
  } else {
    router.push('/seleccionar-perfil');
  }
};

const handlePetSelection = (pet) => {
  activePet.value = pet;
  localStorage.setItem('ps_active_pet', JSON.stringify(pet));
  saveSession();
  router.push('/expediente');
};

const saveSession = () => {
  localStorage.setItem('ps_session', JSON.stringify({
    tutor: tutorData.value, pet: activePet.value, pets: availablePets.value
  }));
};

const handleLogout = () => {
  localStorage.removeItem('ps_session');
  localStorage.removeItem('ps_token');
  localStorage.removeItem('ps_active_pet');
  tutorData.value = null; activePet.value = null; availablePets.value = [];
  delete api.defaults.headers.common['Authorization']; 
  router.push('/');
};

const handleAgendarClick = () => {
  if (tutorData.value) {
    router.push('/agendar');
  } else {
    isLoginOpen.value = true;
  }
};

onMounted(() => {
  window.addEventListener('scroll', () => isScrolled.value = window.scrollY > 30);
  darkMode.value = localStorage.getItem('ps_theme') === 'dark';
  document.documentElement.classList.toggle('dark', darkMode.value);
  const saved = localStorage.getItem('ps_session');
  const token = localStorage.getItem('ps_token');
  if (saved && token) {
    const session = JSON.parse(saved);
    tutorData.value = session.tutor;
    availablePets.value = session.pets || [];
    activePet.value = session.pet;
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
  loadingSession.value = false;
});
</script>

<style scoped>
@reference "./style.css";

.nav-desktop-link {
  @apply text-[11px] font-[1000] uppercase italic tracking-widest text-ps-blue dark:text-white/60 hover:text-ps-red dark:hover:text-white transition-all cursor-pointer;
}

.router-link-active.nav-desktop-link {
  @apply text-ps-red dark:text-white;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.router-link-active svg { @apply text-ps-red; }
.router-link-active span { @apply text-ps-red; }
</style>