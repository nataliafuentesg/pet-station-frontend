import { messaging, getToken } from '@/firebase';
import api from '@/api/axios';

const VAPID_KEY = 'BEhpSSQEGLKGKWXJBlorQCQWzAjvDNsmiTPbQtlf6O65OweHeQ5ALxnnmzapctZfJw9W7FM4b-5jDQvOEIJFcmc';

export async function suscribirNotificaciones() {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return false;

    const token = await getToken(messaging, { vapidKey: VAPID_KEY });
    if (!token) return false;

    await api.post('/fcm/registrar', { token });
    return true;
  } catch (e) {
    console.error('Error suscribiendo notificaciones:', e);
    return false;
  }
}
