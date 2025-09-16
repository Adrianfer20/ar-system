// src/features/auth/services/auth.service.ts
import {
  auth,
  db,
  USERS_COLLECTION,
} from "@/lib/firebase.config";
import type { AppUser } from "@/types/AppUser";
import type { Role } from "@/types/Role";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";

export async function login(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function logout() {
  await signOut(auth);
}

export async function registerUser(
  email: string,
  password: string
) {
  return await createUserWithEmailAndPassword(auth, email, password);
}

export async function saveUserRole(uid: string, role: Role) {
  // Guardar/actualizar documento del usuario por uid con su rol
  const ref = doc(collection(db, USERS_COLLECTION), uid);
  await setDoc(ref, { uid, role }, { merge: true });
}

export async function getUserRole(uid: string): Promise<Role | null> {
  // Buscar el documento cuyo campo "uid" coincide
  const q = query(collection(db, USERS_COLLECTION), where("uid", "==", uid));
  const snap = await getDocs(q);

  if (snap.empty) {
    console.warn(`No se encontró usuario en Firestore con uid: ${uid}`);
    return null;
  }

  // Tomamos el primer resultado (en teoría debería haber solo 1)
  const data = snap.docs[0].data() as { role?: Role };
  return data.role ?? null;
}

export function mapFirebaseUser(user: User, role: Role | null): AppUser {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    role: role ?? "client", // fallback conservador
  };
}

export function listenToAuthState(onChange: (user: AppUser | null) => void) {
  // Suscribe a cambios y completa con rol desde Firestore
  const unsub = onAuthStateChanged(auth, async (fbUser) => {
    if (!fbUser) {
      onChange(null);
      return;
    }
    const role = await getUserRole(fbUser.uid);
    onChange(mapFirebaseUser(fbUser, role));
  });
  return unsub;
}