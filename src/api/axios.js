import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// 1. INYECTOR DE TOKEN (Igual que antes)
api.interceptors.request.use(config => {
  const token = localStorage.getItem('ps_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token.trim()}`;
  }
  return config;
}, error => Promise.reject(error));

// 2. INTERCEPTOR DE RESPUESTA (MODO SEGURO)
api.interceptors.response.use(
  response => response,
  error => {
    const status = error.response?.status;
    
    // CASO A: Sesión Expirada REAL (401 o 403)
    // Aquí SÍ sacamos al usuario porque es un tema de permisos
    if ((status === 401 || status === 403) && !error.config.url.includes('/auth/')) {
      console.warn('Sesión caducada. Cerrando...');
      localStorage.removeItem('ps_token');
      localStorage.removeItem('ps_session');
      localStorage.removeItem('ps_active_pet');
      
      if (window.location.pathname !== '/') {
        window.location.href = '/';
      }
    }
    if (status === 400) {
      console.warn('Petición mal formada (Error 400). Posiblemente ID inválido o Token dañado.');

    }

    return Promise.reject(error);
  }
);

export default api;