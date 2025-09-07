import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDk-g0l2AFLRvHEEcVuzsDF7rUF8zcxZjc",
  authDomain: "api-mkt-96181.firebaseapp.com",
  projectId: "api-mkt-96181",
  storageBucket: "api-mkt-96181.firebasestorage.app",
  messagingSenderId: "524766780679",
  appId: "1:524766780679:web:ed78ac272ceaf2959a79a2"
};

//Inicializa Firebase
export const firebaseApp = initializeApp(firebaseConfig);

//Base de Datos Firestore
export const db = getFirestore(firebaseApp);
export const auth = getAuth(firebaseApp);
export const USERS_COLLECTION = "Users";
