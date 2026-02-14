import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.petstationvet.com/api',
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
      
      console.warn("Sesión inválida detectada. Limpiando datos...");
      localStorage.removeItem('ps_token');
      localStorage.removeItem('ps_session');
      localStorage.removeItem('ps_active_pet');
      if (!window.location.pathname.includes('login_required')) {
        window.location.href = '/?sesion_expirada=true';
      }
    }
    return Promise.reject(error);
  }
);

export default api;