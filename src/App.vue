<template>
  <div :class="{ 'dark': darkMode }" class="min-h-screen transition-colors duration-500 bg-white dark:bg-[#050505] text-slate-900 dark:text-white font-sans overflow-x-hidden">
    
    <div class="fixed bottom-24 right-6 md:bottom-10 md:right-10 z-[3000] flex flex-col gap-3">
      <TransitionGroup name="toast">
        <div v-for="n in notifications" :key="n.id" 
          :class="[
            'px-6 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl flex items-center gap-4 border backdrop-blur-md transition-all duration-300',
            n.type === 'error' ? 'bg-red-600/90 text-white border-white/20' : 'bg-[#152C77]/90 text-white border-white/20'
          ]">
          <span>{{ n.type === 'error' ? '✕' : '✓' }}</span>
          {{ n.message }}
        </div>
      </TransitionGroup>
    </div>

    <div class="fixed bottom-6 right-6 z-[500] flex flex-col gap-4 items-end">
      <button 
        @click="handleAgendarClick"
        class="group flex items-center gap-3 bg-[#DE1F27] hover:bg-[#b91a21] text-white p-4 md:px-6 md:py-4 rounded-2xl md:rounded-full shadow-[0_15px_30px_rgba(222,31,39,0.4)] transition-all hover:scale-110 active:scale-95"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span class="hidden md:block text-[10px] font-[1000] uppercase tracking-widest">Agendar Cita</span>
      </button>
    </div>

    <nav :class="[
      'fixed top-0 w-full z-[100] transition-all px-4 md:px-12', 
      isScrolled 
        ? 'bg-white/95 dark:bg-black/90 border-b border-slate-200 dark:border-[#DE1F27]/30 py-3 shadow-xl' 
        : 'bg-white/50 dark:bg-black/20 backdrop-blur-sm py-6'
    ]">
      <div class="max-w-[1800px] mx-auto flex items-center justify-between gap-2">
        
        <router-link to="/" class="text-xl md:text-3xl font-[1000] italic uppercase tracking-tighter shrink-0">
          <span class="text-[#DE1F27]">PET</span><span class="dark:text-white text-[#152C77]">STATION</span>
        </router-link>

        <div class="hidden lg:flex items-center gap-8">
          <router-link to="/servicios" class="nav-link">Servicios</router-link>
          <router-link to="/tienda" class="nav-link text-[#DE1F27] dark:text-[#DE1F27]">Tienda</router-link>
          <router-link v-if="tutorData" to="/expediente" class="nav-link">Mi Expediente</router-link>
        </div>

        <div class="flex items-center gap-2 md:gap-6">
          <button @click="isCartOpen = true" class="relative group p-2 hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-[#152C77] dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span v-if="cartStore.count > 0" class="absolute -top-1 -right-1 bg-[#DE1F27] text-white text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center animate-pulse border-2 border-white dark:border-black">
              {{ cartStore.count }}
            </span>
          </button>

          <button @click="toggleTheme" class="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-white/5 hover:scale-110 transition-all">
            {{ darkMode ? '☀️' : '🌙' }}
          </button>

          <template v-if="!tutorData">
            <button @click="isLoginOpen = true" class="text-[9px] md:text-[10px] font-black uppercase tracking-widest px-2">Ingresar</button>
            <button @click="isOnboardingOpen = true" class="bg-[#DE1F27] text-white px-4 md:px-8 py-3 rounded-xl md:rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest shadow-lg">Registro</button>
          </template>

          <template v-else>
            <div class="flex items-center gap-1.5 md:gap-3 bg-slate-100 dark:bg-white/10 p-1 md:pr-4 rounded-full border border-slate-200 dark:border-white/10">
              <router-link v-if="activePet" to="/seleccionar-perfil" class="flex items-center gap-2 max-w-[150px] md:max-w-none">
                <div class="w-8 h-8 md:w-9 md:h-9 rounded-full border-2 border-[#DE1F27] overflow-hidden bg-white shrink-0">
                  <img v-if="activePet.fotoUrl" :src="activePet.fotoUrl" class="w-full h-full object-cover" />
                  <div v-else class="w-full h-full flex items-center justify-center bg-[#152C77] text-white text-[10px] font-black">{{ activePet.nombre.charAt(0) }}</div>
                </div>
                <div class="hidden sm:flex flex-col leading-none">
                  <span class="text-[7px] font-black uppercase text-slate-400 dark:text-white/30">Perfil</span>
                  <span class="text-[10px] font-black uppercase italic truncate max-w-[80px] dark:text-white text-[#152C77]">{{ activePet.nombre }}</span>
                </div>
              </router-link>
              
              <div class="w-[1px] h-6 bg-slate-300 dark:bg-white/10 mx-1 hidden sm:block"></div>

              <button @click="handleLogout" class="p-2 text-slate-400 hover:text-[#DE1F27] transition-all hover:scale-110 group" title="Cerrar Sesión">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </template>
        </div>
      </div>
    </nav>

    <div v-if="isCartOpen" class="fixed inset-0 z-[5000] flex justify-end">
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="isCartOpen = false"></div>
      <div class="relative w-full max-w-md bg-white dark:bg-[#0A0A0A] h-full shadow-2xl p-8 flex flex-col animate-in slide-in-from-right duration-300">
        <div class="flex justify-between items-center mb-10">
          <h2 class="text-3xl font-[1000] italic uppercase dark:text-white leading-none">TU <span class="text-[#DE1F27]">CARRO.</span></h2>
          <button @click="isCartOpen = false" class="text-[10px] font-black uppercase text-slate-400 hover:text-[#DE1F27]">Cerrar ✕</button>
        </div>

        <div class="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar">
          <div v-for="item in cartStore.items" :key="item.id" class="flex gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-transparent hover:border-[#DE1F27]/20 transition-all">
            <div class="w-16 h-16 bg-white dark:bg-white/10 rounded-xl flex-shrink-0 flex items-center justify-center text-2xl shadow-sm">
              📦
            </div>
            <div class="flex-1">
              <h4 class="font-black text-[11px] dark:text-white uppercase leading-tight italic tracking-tighter">{{ item.nombre }}</h4>
              <p class="text-[#DE1F27] font-black text-xs mt-1">${{ (item.precio * item.cantidad).toLocaleString() }}</p>
              
              <div class="flex items-center justify-between mt-3">
                <div class="flex items-center bg-white dark:bg-black rounded-lg border border-slate-200 dark:border-white/10">
                  <button @click="cartStore.updateQty(item.id, -1)" class="px-2 py-1 text-slate-400 hover:text-[#DE1F27]">-</button>
                  <span class="px-2 text-[10px] font-black dark:text-white">{{ item.cantidad }}</span>
                  <button @click="cartStore.updateQty(item.id, 1)" class="px-2 py-1 text-slate-400 hover:text-[#DE1F27]">+</button>
                </div>
                <button @click="cartStore.removeItem(item.id)" class="text-[8px] font-black uppercase text-slate-400 hover:text-red-500">Eliminar</button>
              </div>
            </div>
          </div>
          <div v-if="cartStore.items.length === 0" class="text-center py-20 opacity-30 italic font-black uppercase text-xs">El carro está vacío</div>
        </div>

        <div class="pt-8 border-t border-slate-100 dark:border-white/10 mt-6">
          <div class="flex justify-between items-end mb-6">
            <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total</span>
            <span class="text-3xl font-[1000] dark:text-white italic tracking-tighter">${{ cartStore.total.toLocaleString() }}</span>
          </div>
          <button @click="handleCheckout" class="w-full bg-[#152C77] text-white py-5 rounded-2xl font-[1000] uppercase italic tracking-tighter hover:bg-[#DE1F27] transition-all shadow-xl active:scale-95">
            FINALIZAR COMPRA
          </button>
        </div>
      </div>
    </div>

    <main class="w-full overflow-x-hidden pt-4 md:pt-0">
      <router-view 
        v-if="!loadingSession"
        :tutor="tutorData"
        :pet="activePet"
        :availablePets="availablePets"
        @selected="handlePetSelection"
        @deletePet="handleDeletePet"
        @update-pet="handlePetUpdate" 
        @update-tutor="handleTutorUpdate"
        @notify="addNotify"
      />
    </main>

    <TheFooter />

    <div v-if="isLoginOpen || isOnboardingOpen" class="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div class="w-full max-w-lg relative animate-in zoom-in duration-300">
        <LoginModal 
          v-if="isLoginOpen" 
          @success="handleLoginSuccess" 
          @goRegister="isLoginOpen = false; isOnboardingOpen = true" 
          @close="isLoginOpen = false" 
          @notify="addNotify" 
        />
        <PetOnboarding 
          v-if="isOnboardingOpen" 
          :tutorExistente="tutorData" 
          @finalizado="handleOnboardingFinish" 
          @close="isOnboardingOpen = false" 
          @notify="addNotify" 
        />
        <button @click="isLoginOpen = false; isOnboardingOpen = false" class="absolute -top-12 right-0 text-white/50 hover:text-white font-black uppercase text-[10px] tracking-widest">✕ Cerrar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from './stores/cartStore'; // IMPORTANTE: Agregado
import LoginModal from './components/auth/LoginModal.vue';
import PetOnboarding from './components/auth/PetOnboarding.vue';
import TheFooter from './components/TheFooter.vue';

const router = useRouter();
const cartStore = useCartStore(); // INSTANCIA DEL CARRITO
const darkMode = ref(false);
const isScrolled = ref(false);
const isCartOpen = ref(false); // CONTROL DEL SIDEBAR
const tutorData = ref(null);
const activePet = ref(null);
const availablePets = ref([]);
const loadingSession = ref(true);
const isLoginOpen = ref(false);
const isOnboardingOpen = ref(false);
const notifications = ref([]);

// SISTEMA DE NOTIFICACIONES
const addNotify = (message, type = 'success') => {
  const id = Date.now();
  notifications.value.push({ id, message, type });
  setTimeout(() => notifications.value = notifications.value.filter(n => n.id !== id), 4000);
};

// CHECKOUT LÓGICA
const handleCheckout = () => {
  if (!tutorData.value) {
    addNotify("Registrate para pagar", "error");
    isLoginOpen.value = true;
  } else if (cartStore.items.length === 0) {
    addNotify("Tu carro está vacío", "error");
  } else {
    isCartOpen.value = false;
    router.push('/checkout');
  }
};

const handleAgendarClick = () => {
  if (tutorData.value && activePet.value) {
    router.push('/agendar');
  } else if (!tutorData.value) {
    addNotify("Inicia sesión para agendar", "error");
    isLoginOpen.value = true;
  } else {
    addNotify("Registra tu mascota primero", "error");
    isOnboardingOpen.value = true;
  }
};

// ACTUALIZACIÓN DE DATOS
const handlePetUpdate = (updatedPet) => {
  activePet.value = { ...updatedPet };
  const index = availablePets.value.findIndex(p => p.id === updatedPet.id);
  if (index !== -1) availablePets.value[index] = { ...updatedPet };
  saveSession();
};

const handleTutorUpdate = (updatedTutor) => {
  tutorData.value = { ...updatedTutor };
  saveSession();
};

const handlePetSelection = (pet) => {
  activePet.value = pet;
  saveSession();
  router.push('/expediente');
};

const handleLoginSuccess = async (tutor) => {
  tutorData.value = tutor;
  availablePets.value = tutor.mascotas || [];
  isLoginOpen.value = false;
  
  // SINCRONIZAMOS CARRITO AL ENTRAR
  await cartStore.syncWithServer(tutor.id);
  
  saveSession();
  router.push('/seleccionar-perfil');
};

const handleDeletePet = async (id) => {
  try {
    const res = await fetch(`http://localhost:8080/api/mascotas/${id}`, { method: 'DELETE' });
    if (res.ok) {
      availablePets.value = availablePets.value.filter(p => p.id !== id);
      if (activePet.value?.id === id) activePet.value = null;
      saveSession();
      addNotify("Perfil eliminado");
    }
  } catch (e) { addNotify("Error al eliminar", "error"); }
};

const handleOnboardingFinish = (data) => {
  tutorData.value = data.tutor;
  availablePets.value = data.tutor.mascotas || [];
  isOnboardingOpen.value = false;
  saveSession();
  addNotify("Mascota añadida con éxito");
};

// THEME & PERSISTENCIA
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

const handleLogout = () => {
  localStorage.removeItem('ps_session');
  tutorData.value = null; activePet.value = null; availablePets.value = [];
  cartStore.clearCart(); // Limpiar carrito al salir
  router.push('/');
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

<style>
/* Estilos Globales para Scrollbar del carrito */
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #DE1F27; border-radius: 10px; }

.toast-enter-active, .toast-leave-active { transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.toast-enter-from { opacity: 0; transform: translateY(20px) scale(0.9); }
.toast-leave-to { opacity: 0; transform: translateX(100px); }

.nav-link {
  font-size: 10px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  transition: all 0.3s;
}
</style>