import { messaging, getToken } from '@/firebase';
import api from '@/api/axios';


export async function suscribirNotificaciones() {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return false;

    const token = await getToken(messaging);
    if (!token) return false;

    await api.post('/fcm/registrar', { token });
    return true;
  } catch (e) {
    console.error('Error suscribiendo notificaciones:', e);
    return false;
  }
}
