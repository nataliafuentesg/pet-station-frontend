import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// 1. INYECTOR DE TOKEN (Esto está bien, lo dejamos igual)
api.interceptors.request.use(config => {
  const token = localStorage.getItem('ps_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token.trim()}`;
  }
  return config;
}, error => Promise.reject(error));

api.interceptors.response.use(
  response => response,
  error => {
    const status = error.response?.status;
    const url = error.config?.url || '';
    const esErrorCritico = 
      status === 401 || 
      status === 403 || 
      (status === 400 && (url.includes('/tutores/me') || url.includes('/auth/me')));

    if (esErrorCritico && !url.includes('/login')) {
      console.error('⛔ SESIÓN CORRUPTA O EXPIRADA. CERRANDO SESIÓN...');
      
      localStorage.removeItem('ps_token');
      localStorage.removeItem('ps_tutor');     // O como guardes el user
      localStorage.removeItem('ps_active_pet');
      localStorage.removeItem('ps_session');
      
      if (window.location.pathname !== '/') {
        window.location.href = '/?sesion_expirada=true';
      }
    }

    return Promise.reject(error);
  }
);

export default api;