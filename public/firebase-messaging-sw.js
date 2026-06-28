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
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: '/favicon.ico',
  });
});
