// config/firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// ✅ ESTA ES LA CONFIGURACIÓN CORRECTA
const firebaseConfig = {
  apiKey: "AIzaSyAOVI5xZSFMuENd8vvB7gkBjagM_0kpY_g",  // ← NOTA: es "0kpY" (cero, no O)
  authDomain: "clientes-movil-app.firebaseapp.com",
  projectId: "clientes-movil-app",
  storageBucket: "clientes-movil-app.firebasestorage.app",
  messagingSenderId: "874557156186",
  appId: "1:874557156186:web:4884ea41d19a068cd0a163"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);

console.log('✅ Firebase inicializado correctamente');