import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Permite configurar por variables de entorno en despliegue sin romper local
// Vite expone variables prefijadas con VITE_
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDk-g0l2AFLRvHEEcVuzsDF7rUF8zcxZjc",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "api-mkt-96181.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "api-mkt-96181",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "api-mkt-96181.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "524766780679",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:524766780679:web:ed78ac272ceaf2959a79a2",
};

// Inicializa Firebase
export const firebaseApp = initializeApp(firebaseConfig);

// Base de Datos Firestore
export const db = getFirestore(firebaseApp);
export const auth = getAuth(firebaseApp);
export const USERS_COLLECTION = "Users";
