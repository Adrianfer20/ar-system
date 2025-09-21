import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Config desde variables de entorno (Vite expone prefijo VITE_)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Validar en dev para evitar builds con config incompleta
if (
  !firebaseConfig.apiKey ||
  !firebaseConfig.authDomain ||
  !firebaseConfig.projectId ||
  !firebaseConfig.storageBucket ||
  !firebaseConfig.messagingSenderId ||
  !firebaseConfig.appId
) {
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.warn(
      "[firebase.config] Faltan variables de entorno VITE_FIREBASE_*. Revisa tu .env o Secrets en CI."
    );
  }
}

// Inicializa Firebase
export const firebaseApp = initializeApp(firebaseConfig);

// Base de Datos Firestore
export const db = getFirestore(firebaseApp);
export const auth = getAuth(firebaseApp);
export const USERS_COLLECTION = "Users";
