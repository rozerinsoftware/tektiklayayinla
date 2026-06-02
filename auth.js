import {
  createUserWithEmailAndPassword,
  getAuth,
  getReactNativePersistence,
  initializeAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { getFirebaseApp } from './firebase';

let authInstance = null;

function authOlustur(app) {
  try {
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    return initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch (error) {
    if (error?.code === 'auth/already-initialized') {
      return getAuth(app);
    }
    return getAuth(app);
  }
}

export function getFirebaseAuth() {
  if (authInstance) return authInstance;
  const app = getFirebaseApp();
  authInstance = authOlustur(app);
  return authInstance;
}

export function getCurrentUserId() {
  return getFirebaseAuth().currentUser?.uid ?? null;
}

export function waitForAuth() {
  const auth = getFirebaseAuth();
  if (auth.currentUser) {
    return Promise.resolve(auth.currentUser);
  }
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      unsubscribe();
      reject(new Error('Oturum beklenirken zaman aşımı.'));
    }, 15000);
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        clearTimeout(timeout);
        unsubscribe();
        if (user) resolve(user);
        else reject(new Error('Giriş yapılmadı.'));
      },
      (err) => {
        clearTimeout(timeout);
        unsubscribe();
        reject(err);
      }
    );
  });
}

export async function signIn(email, password) {
  const cred = await signInWithEmailAndPassword(getFirebaseAuth(), email.trim(), password);
  return cred.user;
}

export async function signUp({ email, password, ad, soyad }) {
  const cred = await createUserWithEmailAndPassword(getFirebaseAuth(), email.trim(), password);
  const displayName = `${String(ad || '').trim()} ${String(soyad || '').trim()}`.trim();
  if (displayName) {
    await updateProfile(cred.user, { displayName });
  }
  return cred.user;
}

export async function signOutUser() {
  await signOut(getFirebaseAuth());
}
