import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { getDb } from './firebase';

const ilanCol = () => collection(getDb(), 'ilanlar');

const docToIlan = (snap) => {
  const data = snap.data() || {};
  const { detay, ...rest } = data;
  return {
    id: snap.id,
    ...rest,
    ...(detay && typeof detay === 'object' ? detay : null),
  };
};

export const getIlanlar = async () => {
  const snap = await getDocs(ilanCol());
  return snap.docs.map(docToIlan);
};

export const addIlan = async (ilan) => {
  const { baslik, aciklama, fiyat, platformlar, ...detay } = ilan || {};
  const ref = await addDoc(ilanCol(), {
    baslik,
    aciklama,
    fiyat,
    platformlar,
    detay,
    createdAt: serverTimestamp(),
  });
  return { id: ref.id, baslik, aciklama, fiyat, platformlar, ...detay };
};

export const updateIlan = async (id, ilan) => {
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
  await deleteDoc(doc(getDb(), 'ilanlar', String(id)));
  return { message: 'İlan silindi' };
};