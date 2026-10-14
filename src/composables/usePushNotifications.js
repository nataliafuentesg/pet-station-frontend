import { messaging, getToken, deleteToken } from '@/firebase';
import api from '@/api/axios';

// Clave VAPID que se usó por error (no es de este proyecto). Firebase reutiliza la suscripción push
// que ya tenga el navegador, y una creada con esta clave registra bien pero Apple/Google rechazan
// cada envío (INVALID_ARGUMENT). Hay que borrarla para que se cree otra con la clave correcta.
const CLAVE_VAPID_VIEJA = 'BEhpSSQEGLKGKWXJBlorQCQWzAjvDNsmiTPbQtlf6O65OweHeQ5ALxnnmzapctZfJw9W7FM4b-5jDQvOEIJFcmc';

async function borrarSuscripcionVieja() {
  const reg = await navigator.serviceWorker?.getRegistration('/firebase-cloud-messaging-push-scope');
  const sub = await reg?.pushManager.getSubscription();
  const clave = sub?.options?.applicationServerKey;
  if (!clave) return;
  const b64 = btoa(String.fromCharCode(...new Uint8Array(clave)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  if (b64 !== CLAVE_VAPID_VIEJA) return;
  try { await deleteToken(messaging); } catch { /* el token viejo nunca quedó válido */ }
  await sub.unsubscribe().catch(() => {});
}

export async function obtenerTokenPush() {
  await borrarSuscripcionVieja();
  return getToken(messaging);
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
