import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { getCurrentUserId, getFirebaseAuth, waitForAuth } from './auth';
import { getDb } from './firebase';

const ilanCol = () => collection(getDb(), 'ilanlar');
const usersCol = () => collection(getDb(), 'users');

async function requireUserId() {
  await waitForAuth();
  const uid = getCurrentUserId();
  if (!uid) {
    throw new Error('İlan işlemi için giriş yapmalısınız.');
  }
  return uid;
}

const docToIlan = (snap) => {
  const data = snap.data() || {};
  const { detay, ...rest } = data;
  return {
    id: snap.id,
    ...rest,
    ...(detay && typeof detay === 'object' ? detay : null),
  };
};

/** Ana sayfa — giriş gerekmez (Firestore kurallarında herkese okuma açık olmalı) */
export const getTumIlanlar = async () => {
  const snap = await getDocs(ilanCol());
  const liste = snap.docs.map(docToIlan);
  return liste.sort((a, b) => {
    const ta = a.createdAt?.toMillis?.() ?? a.createdAt ?? 0;
    const tb = b.createdAt?.toMillis?.() ?? b.createdAt ?? 0;
    return tb - ta;
  });
};

export const getIlanlar = async () => {
  const uid = await requireUserId();
  const q = query(ilanCol(), where('ownerId', '==', uid));
  const snap = await getDocs(q);
  return snap.docs.map(docToIlan);
};

export const addIlan = async (ilan) => {
  const uid = await requireUserId();
  const {
    baslik,
    aciklama,
    fiyat,
    platformlar,
    kategori,
    kategoriId,
    kategoriYolu,
    kategoriEtiket,
    kategoriKok,
    ...detay
  } = ilan || {};
  const ref = await addDoc(ilanCol(), {
    ownerId: uid,
    baslik,
    aciklama,
    fiyat,
    platformlar,
    kategori: kategori || null,
    kategoriId: kategoriId || null,
    kategoriYolu: Array.isArray(kategoriYolu) ? kategoriYolu : [],
    kategoriEtiket: kategoriEtiket || null,
    kategoriKok: kategoriKok || null,
    detay,
    createdAt: serverTimestamp(),
  });
  return {
    id: ref.id,
    baslik,
    aciklama,
    fiyat,
    platformlar,
    kategori,
    kategoriId,
    kategoriYolu,
    kategoriEtiket,
    kategoriKok,
    ...detay,
  };
};

export const updateIlan = async (id, ilan) => {
  await requireUserId();
  const { baslik, aciklama, fiyat, platformlar, ...detay } = ilan || {};
  await updateDoc(doc(getDb(), 'ilanlar', String(id)), {
    baslik,
    aciklama,
    fiyat,
    platformlar,
    detay,
    updatedAt: serverTimestamp(),
  });
  return { id, baslik, aciklama, fiyat, platformlar, ...detay };
};

export const deleteIlan = async (id) => {
  await requireUserId();
  await deleteDoc(doc(getDb(), 'ilanlar', String(id)));
  return { message: 'İlan silindi' };
};

// ——— Kullanıcı profili ———

export async function createUserProfile({ ad, soyad, email }) {
  const uid = await requireUserId();
  await setDoc(doc(getDb(), 'users', uid), {
    email: String(email || getFirebaseAuth().currentUser?.email || '').trim(),
    ad: String(ad || '').trim(),
    soyad: String(soyad || '').trim(),
    role: 'user',
    createdAt: serverTimestamp(),
  });
}

export async function ensureUserProfile({ ad, soyad, email } = {}) {
  const uid = await requireUserId();
  const ref = doc(getDb(), 'users', uid);
  const snap = await getDoc(ref);
  if (snap.exists()) return snap.data();
  await setDoc(ref, {
    email: String(email || getFirebaseAuth().currentUser?.email || '').trim(),
    ad: String(ad || '').trim(),
    soyad: String(soyad || '').trim(),
    role: 'user',
    createdAt: serverTimestamp(),
  });
  return { role: 'user' };
}

export async function getCurrentUserRole() {
  const uid = await requireUserId();
  const snap = await getDoc(doc(getDb(), 'users', uid));
  if (!snap.exists()) return 'user';
  return snap.data()?.role || 'user';
}

export async function isCurrentUserAdmin() {
  return (await getCurrentUserRole()) === 'admin';
}

async function requireAdmin() {
  const role = await getCurrentUserRole();
  if (role !== 'admin') {
    throw new Error('Bu işlem için admin yetkisi gerekir.');
  }
}

// ——— Admin ———

export const adminGetAllIlanlar = async () => {
  await requireAdmin();
  const snap = await getDocs(ilanCol());
  return snap.docs.map(docToIlan);
};

export const adminDeleteIlan = async (id) => {
  await requireAdmin();
  await deleteDoc(doc(getDb(), 'ilanlar', String(id)));
  return { message: 'İlan silindi' };
};

const DETAY_ALAN_ANAHTARLARI = new Set([
  'ilanTuru', 'emlakTipi', 'metrekare', 'odaSayisi', 'binaYasi', 'kat',
  'aracTipi', 'marka', 'model', 'yil', 'kilometre', 'yakit', 'vites',
  'urunTipi', 'durum',
]);

export const adminUpdateIlan = async (id, ilan) => {
  await requireAdmin();
  const kaynak = ilan || {};
  const { baslik, aciklama, fiyat, platformlar, kategori, ...rest } = kaynak;
  const detay = {};
  Object.entries(rest).forEach(([key, value]) => {
    if (DETAY_ALAN_ANAHTARLARI.has(key) && value != null && String(value).trim() !== '') {
      detay[key] = value;
    }
  });
  await updateDoc(doc(getDb(), 'ilanlar', String(id)), {
    baslik,
    aciklama,
    fiyat,
    platformlar: platformlar || [],
    kategori,
    detay,
    updatedAt: serverTimestamp(),
  });
  return { id, baslik, aciklama, fiyat, platformlar, kategori, ...detay };
};

export const adminGetAllUsers = async () => {
  await requireAdmin();
  const snap = await getDocs(usersCol());
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};