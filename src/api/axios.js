import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// ESTO ES LO QUE TE FALTA: Inyectar el token en cada llamada
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
    if (status === 401 && !error.config.url.includes('/auth/')) {
      localStorage.removeItem('ps_token');
      localStorage.removeItem('ps_session');
      
      if (window.location.pathname !== '/') {
        window.location.replace('/?auth_error=session_expired');
      }
    }
    return Promise.reject(error);
  }
);

export default api;