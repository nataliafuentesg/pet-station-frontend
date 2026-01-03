<template>
  <div class="min-h-screen bg-[#050505] font-sans text-white overflow-x-hidden">
    
    <nav 
      :class="[
        'fixed top-0 w-full z-[100] flex items-center justify-between px-6 md:px-12 transition-all duration-500',
        isScrolled ? 'py-4 bg-black/90 backdrop-blur-md border-b border-white/10 shadow-2xl' : 'py-8 bg-transparent'
      ]"
    >
      <div class="flex items-center gap-12">
        <router-link to="/" class="text-2xl font-black italic tracking-tighter uppercase transition-transform active:scale-95">
          <span class="text-[#DE1F27]">Pet</span><span class="text-[#152C77]">Station</span>
        </router-link>

        <div class="hidden lg:flex items-center gap-8">
          <router-link to="/" class="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 hover:text-white transition-all italic" active-class="text-white">Inicio</router-link>
          <router-link to="/servicios" class="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 hover:text-white transition-all italic" active-class="text-white">Servicios</router-link>
          <router-link to="/tienda" class="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 hover:text-white transition-all italic" active-class="text-white">Tienda</router-link>
          
          <router-link to="/agendar" 
            class="text-[10px] font-black uppercase tracking-widest px-6 py-2.5 bg-[#DE1F27] text-white rounded-full transition-all hover:scale-105 shadow-lg shadow-[#DE1F27]/20"
            active-class="ring-2 ring-white shadow-[#DE1F27]/40">
            Agendar Cita
          </router-link>

          <router-link v-if="tutorData" to="/expediente" class="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 hover:text-white transition-all italic" active-class="text-white">Expediente</router-link>
        </div>
      </div>

      <div class="flex items-center gap-4">
        <template v-if="tutorData">
          <router-link v-if="activePet" to="/seleccionar-perfil" 
            class="flex items-center gap-3 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full border border-white/10 transition-all group">
            <div class="text-right hidden sm:block leading-none">
              <p class="text-[7px] font-black uppercase text-[#DE1F27] italic">Mascota</p>
              <p class="text-[10px] font-black uppercase tracking-tighter">{{ activePet.nombre }}</p>
            </div>
            <div class="w-8 h-8 rounded-full border-2 border-[#152C77] overflow-hidden group-hover:border-[#DE1F27] transition-colors">
              <img v-if="activePet.fotoUrl || activePet.foto" :src="activePet.fotoUrl || activePet.foto" class="w-full h-full object-cover" />
              <div v-else class="w-full h-full flex items-center justify-center bg-[#152C77] text-[10px] font-black italic">{{ activePet.nombre.charAt(0) }}</div>
            </div>
          </router-link>
          <button @click="handleLogout" class="text-[10px] font-black uppercase text-white/40 hover:text-[#DE1F27] transition-colors ml-2">Salir</button>
        </template>
        
        <template v-else>
          <div class="hidden sm:flex items-center gap-5">
            <button @click="isLoginOpen = true" class="text-[10px] font-black uppercase tracking-widest hover:text-[#DE1F27] transition-colors">Ingresar</button>
            <button @click="isOnboardingOpen = true" class="bg-[#DE1F27] px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#DE1F27]/20 hover:scale-105 transition-transform">Registro</button>
          </div>
          <button @click="isMobileMenuOpen = !isMobileMenuOpen" class="lg:hidden text-2xl p-2">
            <span>{{ isMobileMenuOpen ? '✕' : '☰' }}</span>
          </button>
        </template>
      </div>
    </nav>

    <transition name="slide">
      <div v-if="isMobileMenuOpen" class="fixed inset-0 z-[95] bg-black flex flex-col items-center justify-center gap-8 text-2xl font-black uppercase italic p-10 text-center">
        <router-link @click="isMobileMenuOpen = false" to="/">Inicio</router-link>
        <router-link @click="isMobileMenuOpen = false" to="/servicios">Servicios</router-link>
        <router-link @click="isMobileMenuOpen = false" to="/tienda">Tienda</router-link>
        <router-link @click="isMobileMenuOpen = false" to="/agendar" class="text-[#DE1F27]">Agendar Cita</router-link>
        <router-link @click="isMobileMenuOpen = false" v-if="tutorData" to="/expediente">Expediente</router-link>
        <button @click="isMobileMenuOpen = false" class="mt-10 text-xs not-italic border border-white/20 px-8 py-3 rounded-full opacity-50 uppercase tracking-widest">Cerrar Menú</button>
      </div>
    </transition>

    <div class="lg:hidden fixed bottom-0 left-0 right-0 z-[100] bg-black/80 backdrop-blur-2xl border-t border-white/5 px-6 py-4 flex justify-between items-center">
      <router-link to="/" class="flex flex-col items-center opacity-50" active-class="text-[#DE1F27] opacity-100">
        <span class="text-xl">🏠</span>
        <span class="text-[8px] font-black uppercase mt-1">Inicio</span>
      </router-link>
      <router-link to="/tienda" class="flex flex-col items-center opacity-50" active-class="text-[#DE1F27] opacity-100">
        <span class="text-xl">🛒</span>
        <span class="text-[8px] font-black uppercase mt-1">Tienda</span>
      </router-link>
      
      <router-link to="/agendar" class="flex flex-col items-center group">
        <div class="w-12 h-12 bg-[#DE1F27] -mt-10 rounded-2xl flex items-center justify-center shadow-xl shadow-[#DE1F27]/40 border-4 border-[#050505] transform group-active:scale-90 transition-transform">
          <span class="text-xl">📅</span>
        </div>
        <span class="text-[8px] font-black uppercase mt-1">Agendar</span>
      </router-link>

      <router-link to="/servicios" class="flex flex-col items-center opacity-50" active-class="text-[#DE1F27] opacity-100">
        <span class="text-xl">🛠️</span>
        <span class="text-[8px] font-black uppercase mt-1">Servicios</span>
      </router-link>

      <router-link v-if="tutorData" to="/expediente" class="flex flex-col items-center opacity-50" active-class="text-[#DE1F27] opacity-100">
        <span class="text-xl">📋</span>
        <span class="text-[8px] font-black uppercase mt-1">Ficha</span>
      </router-link>
      <button v-else @click="isLoginOpen = true" class="flex flex-col items-center opacity-50">
        <span class="text-xl">👤</span>
        <span class="text-[8px] font-black uppercase mt-1">Entrar</span>
      </button>
    </div>

    <main class="relative z-10">
      <router-view 
        :pet="activePet" 
        :tutor="tutorData"
        :availablePets="tutorData?.mascotas || []"
        :tutorLogueado="!!tutorData"
        @selected="handlePetSelection" 
        @update-pet="handlePetUpdate" 
        @update-tutor="handleTutorUpdate"
        @open-login="isLoginOpen = true"
      />
    </main>

    <div v-if="isLoginOpen || isOnboardingOpen || isActivationOpen"
      class="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
      <div class="w-full max-w-xl max-h-[90vh] overflow-y-auto bg-white rounded-[2.5rem] shadow-2xl relative text-slate-900">
        <PetOnboarding v-if="isOnboardingOpen" :tutorExistente="tutorData" @finalizado="handleRegistrationSuccess" @close="isOnboardingOpen = false" />
        <LoginModal v-if="isLoginOpen" @success="handleLoginSuccess" @necesitaActivacion="handleAbrirActivacion" @close="isLoginOpen = false" />
        <ActivarCuenta v-if="isActivationOpen" :email="emailAActivar" @listo="handleActivacionExitosa" @close="isActivationOpen = false" />
        
        <button @click="closeModals" class="absolute top-6 right-6 w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-black text-slate-400 hover:text-red-500 transition-colors">✕</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import PetOnboarding from './components/auth/PetOnboarding.vue';
import LoginModal from './components/auth/LoginModal.vue';
import ActivarCuenta from './components/auth/ActivationModal.vue';

const router = useRouter();
const isScrolled = ref(false);
const isMobileMenuOpen = ref(false);

const activePet = ref(null);
const tutorData = ref(null);
const isLoginOpen = ref(false);
const isOnboardingOpen = ref(false);
const isActivationOpen = ref(false);
const emailAActivar = ref('');

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  const saved = localStorage.getItem('ps_session');
  if (saved) {
    const session = JSON.parse(saved);
    tutorData.value = session.tutor;
    activePet.value = session.pet;
    if (tutorData.value?.id) refrescarDatosDesdeBack(tutorData.value.id);
  }
});

onUnmounted(() => window.removeEventListener('scroll', handleScroll));

const refrescarDatosDesdeBack = async (tutorId) => {
  try {
    const res = await fetch(`http://localhost:8080/api/tutores/${tutorId}`);
    if (res.ok) {
      const freshData = await res.json();
      tutorData.value = freshData;
      if (activePet.value) {
        activePet.value = freshData.mascotas.find(m => m.id === activePet.value.id) || null;
      }
      saveSession();
    }
  } catch (e) { console.warn("Modo offline."); }
};

const handleLoginSuccess = (data) => {
  tutorData.value = data;
  isLoginOpen.value = false;
  activePet.value = null;
  saveSession();
  router.push('/seleccionar-perfil');
};

const handlePetUpdate = (updatedPet) => {
  activePet.value = updatedPet;
  saveSession();
};

const handleTutorUpdate = (updatedTutor) => {
  tutorData.value = updatedTutor;
  saveSession();
};

const handleRegistrationSuccess = async (data) => {
  isOnboardingOpen.value = false;
  const tutorId = data.tutor?.id || data.id;
  if (tutorId) await refrescarDatosDesdeBack(tutorId);
  router.push('/seleccionar-perfil');
};

const handlePetSelection = (pet) => {
  activePet.value = pet;
  saveSession();
  router.push('/expediente');
};

const saveSession = () => {
  localStorage.setItem('ps_session', JSON.stringify({
    tutor: tutorData.value,
    pet: activePet.value
  }));
};

const handleLogout = () => {
  localStorage.removeItem('ps_session');
  tutorData.value = null;
  activePet.value = null;
  router.push('/');
};

const handleAbrirActivacion = (email) => {
  emailAActivar.value = email;
  isLoginOpen.value = false;
  isActivationOpen.value = true;
};

const handleActivacionExitosa = (tutor) => {
  tutorData.value = tutor;
  isActivationOpen.value = false;
  saveSession();
};

const closeModals = () => {
  isLoginOpen.value = false;
  isOnboardingOpen.value = false;
  isActivationOpen.value = false;
};
</script>

<style scoped>
/* Transiciones */
.slide-enter-active, .slide-leave-active { transition: transform 0.4s ease; }
.slide-enter-from, .slide-leave-to { transform: translateY(-100%); }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* IMPORTANTE: Ajuste de Hero para que no quede debajo del nav en PC */
@media (min-width: 1024px) {
  :deep(.hero-section) {
    padding-top: 100px !important;
  }
}
</style>