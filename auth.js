import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  getAuth,
  getReactNativePersistence,
  initializeAuth,
  onAuthStateChanged,
  reauthenticateWithCredential,
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  updatePassword,
  updateProfile,
} from 'firebase/auth';
import { getFirebaseApp } from './firebase';
import Constants from 'expo-constants';

let authInstance = null;

function authDomain() {
  return Constants.expoConfig?.extra?.firebaseAuthDomain || 'tektiklayayinla.firebaseapp.com';
}

const ANDROID_PACKAGE = 'com.rozerinbeyazit.tektiklayayinla';

/** Onay sonrası açılacak sayfa (Firebase Hosting — bir kez deploy edilmeli) */
function dogrulandiSayfaUrl() {
  return `https://${authDomain()}/dogrulandi.html`;
}

/**
 * Önce uygulamayı açmayı dener; olmazsa Hosting sayfasına düşer.
 */
function emailVerifyActionSettings() {
  return {
    url: dogrulandiSayfaUrl(),
    handleCodeInApp: true,
    android: {
      packageName: ANDROID_PACKAGE,
      installApp: false,
    },
    iOS: {
      bundleId: ANDROID_PACKAGE,
    },
  };
}

function emailVerifyActionSettingsYedek() {
  return {
    url: dogrulandiSayfaUrl(),
    handleCodeInApp: false,
  };
}

function firebaseHataMesaji(e) {
  const kod = e?.code || '';
  if (kod === 'auth/too-many-requests') {
    return 'Çok fazla deneme. 30–60 dakika bekleyin veya Firebase Console’dan kullanıcıyı kontrol edin.';
  }
  if (kod === 'auth/invalid-continue-uri' || kod === 'auth/unauthorized-continue-uri') {
    return 'Firebase ayarı hatalı (continue URL). Console → Authentication → Settings → Authorized domains.';
  }
  return e?.message || kod || 'Bilinmeyen hata';
}

/** Doğrulama e-postası gönder (Firebase şablonu) */
export async function sendVerificationEmailToUser(user) {
  if (!user) throw new Error('Oturum bulunamadı.');
  try {
    await sendEmailVerification(user, emailVerifyActionSettings());
  } catch (e1) {
    try {
      await sendEmailVerification(user, emailVerifyActionSettingsYedek());
    } catch (e2) {
      const err = new Error(firebaseHataMesaji(e2));
      err.code = e2?.code;
      throw err;
    }
  }
}

function emailNotVerifiedError(autoSent, mailHata) {
  let mesaj =
    'E-posta adresiniz henüz onaylanmadı. Gelen kutusu ve spam klasörünü kontrol edin; onay bağlantısına tıkladıktan sonra tekrar giriş yapın.';
  if (autoSent) {
    mesaj =
      'E-postanız onaylı değil. Az önce yeni bir onay e-postası gönderdik (birkaç dakika sürebilir). Spam / önemsiz klasörüne de bakın.';
  }
  if (mailHata === 'auth/too-many-requests') {
    mesaj = 'Çok fazla deneme. 15–30 dakika bekleyip tekrar deneyin veya spam klasöründeki son maili kullanın.';
  } else if (mailHata && !autoSent) {
    mesaj = `Onay e-postası gönderilemedi: ${mailHata}. Firebase Console → Authentication → Templates ve Authorized domains kontrol edin.`;
  }
  const error = new Error(mesaj);
  error.code = 'auth/email-not-verified';
  error.autoSent = autoSent;
  return error;
}

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

export function getCurrentUser() {
  const user = getFirebaseAuth().currentUser;
  if (!user?.emailVerified) return null;
  return user;
}

export function getCurrentUserId() {
  return getCurrentUser()?.uid ?? null;
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
  await cred.user.reload();
  if (!cred.user.emailVerified) {
    let autoSent = false;
    let mailHata = null;
    try {
      await sendVerificationEmailToUser(cred.user);
      autoSent = true;
    } catch (e) {
      mailHata = e?.code || e?.message;
    }
    await signOut(getFirebaseAuth());
    throw emailNotVerifiedError(autoSent, mailHata);
  }
  return cred.user;
}

/** Kayıt sonrası veya giriş ekranından — oturum açmadan doğrulama maili gönderir */
export async function resendVerificationEmail(email, password) {
  const cred = await signInWithEmailAndPassword(getFirebaseAuth(), email.trim(), password);
  await cred.user.reload();
  if (cred.user.emailVerified) {
    await signOut(getFirebaseAuth());
    const error = new Error('E-posta adresiniz zaten onaylı. Giriş yapabilirsiniz.');
    error.code = 'auth/email-already-verified';
    throw error;
  }
  await sendVerificationEmailToUser(cred.user);
  await signOut(getFirebaseAuth());
}

/** Linke tıkladıktan sonra: onaylı mı kontrol et (kısa süreli giriş) */
export async function kontrolEmailOnaylandi(email, password) {
  const cred = await signInWithEmailAndPassword(getFirebaseAuth(), email.trim(), password);
  await cred.user.reload();
  const onayli = cred.user.emailVerified;
  await signOut(getFirebaseAuth());
  return onayli;
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

export async function sendVerificationEmail() {
  const user = getFirebaseAuth().currentUser;
  await sendVerificationEmailToUser(user);
}

export async function changePassword(mevcutSifre, yeniSifre) {
  const auth = getFirebaseAuth();
  const user = auth.currentUser;
  if (!user?.email) {
    throw new Error('Şifre değiştirmek için e-posta ile giriş yapmalısınız.');
  }
  const cred = EmailAuthProvider.credential(user.email, mevcutSifre);
  await reauthenticateWithCredential(user, cred);
  await updatePassword(user, yeniSifre);
}
