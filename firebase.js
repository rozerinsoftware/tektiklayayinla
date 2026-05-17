import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import Constants from 'expo-constants';

function getFirebaseConfig() {
  const extra = Constants.expoConfig?.extra || {};
  return {
    apiKey: extra.firebaseApiKey,
    authDomain: extra.firebaseAuthDomain,
    projectId: extra.firebaseProjectId,
    storageBucket: extra.firebaseStorageBucket,
    messagingSenderId: extra.firebaseMessagingSenderId,
    appId: extra.firebaseAppId,
  };
}

export function getFirebaseApp() {
  const cfg = getFirebaseConfig();
  const missing = Object.entries(cfg).filter(([, v]) => !v || String(v).includes('YOUR_'));
  if (missing.length) {
    throw new Error('Firebase ayarları eksik: app.json içindeki expo.extra alanını doldurun.');
  }

  if (getApps().length) return getApps()[0];
  return initializeApp(cfg);
}

export function getDb() {
  return getFirestore(getFirebaseApp());
}
