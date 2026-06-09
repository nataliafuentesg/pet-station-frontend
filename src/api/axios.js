import axios from 'axios';

// En desarrollo local: crea .env.local con VITE_API_URL=http://localhost:8080/api
// En producción: usa el valor por defecto de .env
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api.petstationvet.com/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('ps_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response, 
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      const tieneToken = localStorage.getItem('ps_token');
      // Solo redirigir si había un token activo (sesión real expirada)
      // y no estamos ya en la página de inicio para evitar el loop
      if (tieneToken && window.location.pathname === '/' && !window.location.search.includes('sesion_expirada')) {
        localStorage.removeItem('ps_token');
        localStorage.removeItem('ps_session');
        localStorage.removeItem('ps_active_pet');
        window.location.href = '/?sesion_expirada=true';
      } else if (tieneToken && window.location.pathname !== '/') {
        localStorage.removeItem('ps_token');
        localStorage.removeItem('ps_session');
        localStorage.removeItem('ps_active_pet');
        window.location.href = '/?sesion_expirada=true';
      }
    }
    return Promise.reject(error);
  }
);

export default api;