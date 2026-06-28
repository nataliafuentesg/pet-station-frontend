import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyCNTLKHt_Tlb1g2mLlpNizetPdmzPOAVnc",
  authDomain: "pet-station-835e4.firebaseapp.com",
  projectId: "pet-station-835e4",
  storageBucket: "pet-station-835e4.firebasestorage.app",
  messagingSenderId: "802901597668",
  appId: "1:802901597668:web:5b9ba1b021a6f298843bf1"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export { messaging, getToken, onMessage };
