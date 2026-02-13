import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// 1. INYECTOR DE TOKEN (Con validación extra para evitar "null" o "undefined")
api.interceptors.request.use(config => {
  const token = localStorage.getItem('ps_token');
  // Aseguramos que el token exista y sea una cadena válida
  if (token && token !== 'undefined' && token !== 'null') {
    config.headers.Authorization = `Bearer ${token.trim()}`;
  }
  return config;
}, error => Promise.reject(error));

// 2. INTERCEPTOR DE RESPUESTA (MODO SEGURO - RELAJADO)
api.interceptors.response.use(
  response => response,
  error => {
    const status = error.response?.status;
    const url = error.config?.url || '';

    // --- LÓGICA DE CIERRE DE SESIÓN ---
    // SOLO expulsamos si es 401 (Token vencido) o 403 (Permisos denegados).
    // QUITAMOS el estatus 400 de aquí para que no te saque al recargar.
    const esSesionInvalida = status === 401 || status === 403;

    if (esSesionInvalida && !url.includes('/login') && !url.includes('/auth/')) {
      console.warn('⛔ SESIÓN VENCIDA (401/403). CERRANDO...');
      
      localStorage.removeItem('ps_token');
      localStorage.removeItem('ps_session');
      localStorage.removeItem('ps_active_pet');
      
      if (window.location.pathname !== '/') {
        window.location.href = '/?sesion_expirada=true';
      }
    }

    return Promise.reject(error);
  }
);

export default api;