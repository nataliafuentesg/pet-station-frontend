import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Interceptor para añadir el TOKEN a todas las peticiones
api.interceptors.request.use(config => {
  const token = localStorage.getItem('ps_token');
  if (token) {
    // IMPORTANTE: Asegúrate de que el string no tenga saltos de línea ni espacios extra
    config.headers.Authorization = `Bearer ${token.trim()}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// Interceptor para manejar errores globales
api.interceptors.response.use(
  response => response,
  error => {
    const status = error.response?.status;

    if (status === 401) {
      console.error("Sesión expirada (401)");
      localStorage.removeItem('ps_session');
      localStorage.removeItem('ps_token');
      window.location.href = '/'; 
    }

    if (status === 403) {
      // Este es tu error actual: El token es válido pero el servidor rechaza el acceso a esta ruta
      console.error("Acceso denegado (403): Tu usuario no tiene permisos de ADMIN o el CORS está bloqueando la ruta.");
    }

    return Promise.reject(error);
  }
);

export default api;