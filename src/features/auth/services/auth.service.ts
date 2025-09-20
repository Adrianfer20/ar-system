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
  updateProfile,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  type User,
} from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
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

// ----------------------------
// Perfil del usuario actual (Firebase Auth + Firestore)
// ----------------------------
export async function updateOwnProfile(data: { displayName?: string; phoneNumber?: string }) {
  const current = auth.currentUser;
  if (!current) throw new Error("No hay usuario autenticado");

  // Actualiza perfil de Firebase Auth (solo displayName está disponible en client)
  if (data.displayName !== undefined) {
    await updateProfile(current, { displayName: data.displayName });
  }

  // Persiste en Firestore dentro de Users/{uid}
  const ref = doc(collection(db, USERS_COLLECTION), current.uid);
  await setDoc(ref, { ...data, uid: current.uid }, { merge: true });
}

export async function getUserDoc(uid: string) {
  const ref = doc(collection(db, USERS_COLLECTION), uid);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

export async function updateUserDoc(uid: string, data: Record<string, unknown>) {
  const ref = doc(collection(db, USERS_COLLECTION), uid);
  await setDoc(ref, { ...data, uid }, { merge: true });
}

export async function listUsersByRole(role: Role) {
  const q = query(collection(db, USERS_COLLECTION), where("role", "==", role));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Record<string, unknown>) }));
}

// ----------------------------
// Contraseñas
// ----------------------------
export async function changeOwnPassword(currentPassword: string, newPasswordValue: string) {
  const current = auth.currentUser;
  if (!current || !current.email) throw new Error("No hay sesión válida");

  // Reautenticación requerida por seguridad
  const cred = EmailAuthProvider.credential(current.email, currentPassword);
  await reauthenticateWithCredential(current, cred);
  await updatePassword(current, newPasswordValue);
}

export async function sendPasswordReset(email: string) {
  await sendPasswordResetEmail(auth, email);
}