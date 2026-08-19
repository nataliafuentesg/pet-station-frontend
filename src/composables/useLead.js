import api from '@/api/axios';

export function useLead() {
  const track = (tipo, datos = {}) => {
    try {
      api.post('/leads', { tipo, datos: JSON.stringify(datos) }).catch(() => {});
    } catch (_) {}
  };
  return { track };
}
