import { messaging, getToken } from '@/firebase';
import api from '@/api/axios';

// Firebase reutiliza la suscripción push que ya exista en el navegador. Las creadas con la VAPID
// key anterior (de otro proyecto) hacen fallar el registro, así que se borran y se reintenta una vez.
export async function obtenerTokenPush() {
  try {
    return await getToken(messaging);
  } catch (e) {
    if (e?.code !== 'messaging/token-subscribe-failed') throw e;
    const reg = await navigator.serviceWorker.getRegistration('/firebase-cloud-messaging-push-scope');
    const sub = await reg?.pushManager.getSubscription();
    if (!sub) throw e;
    await sub.unsubscribe();
    return await getToken(messaging);
  }
}

export async function suscribirNotificaciones() {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return false;

    const token = await obtenerTokenPush();
    if (!token) return false;

    await api.post('/fcm/registrar', { token });
    return true;
  } catch (e) {
    console.error('Error suscribiendo notificaciones:', e);
    return false;
  }
}
