importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCNTLKHt_Tlb1g2mLlpNizetPdmzPOAVnc",
  authDomain: "pet-station-835e4.firebaseapp.com",
  projectId: "pet-station-835e4",
  storageBucket: "pet-station-835e4.firebasestorage.app",
  messagingSenderId: "802901597668",
  appId: "1:802901597668:web:5b9ba1b021a6f298843bf1"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  // Con bloque notification el SDK ya la muestra solo; pintarla aquí la duplicaba
  if (payload.notification) return;
  // Mensajes data-only (control de jornada): renotify para que vibre aunque reemplace la anterior
  const d = payload.data || {};
  if (!d.title) return;
  self.registration.showNotification(d.title, {
    body: d.body,
    icon: '/images/logo-pet-station.png',
    tag: d.tag || undefined,
    renotify: !!d.tag,
    requireInteraction: true,
    data: { link: d.link },
  });
});

self.addEventListener('notificationclick', (event) => {
  const link = event.notification.data && event.notification.data.link;
  if (!link) return;
  event.notification.close();
  event.waitUntil((async () => {
    const wins = await clients.matchAll({ type: 'window', includeUncontrolled: true });
    const abierta = wins.find(w => w.url.startsWith(link));
    if (abierta) return abierta.focus();
    return clients.openWindow(link);
  })());
});
