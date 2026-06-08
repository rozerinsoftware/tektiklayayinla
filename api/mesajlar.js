import {
  collection,
  doc,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { getDb } from '../firebase';
import { getCurrentUserId, waitForAuth } from '../auth';

const konusmalarCol = () => collection(getDb(), 'konusmalar');

async function requireUid() {
  await waitForAuth();
  const uid = getCurrentUserId();
  if (!uid) throw new Error('Mesajlaşmak için giriş yapmalısınız.');
  return uid;
}

export function konusmaIdOlustur(ilanId, uid1, uid2) {
  const s = [String(uid1), String(uid2)].sort();
  return `${ilanId}_${s[0]}_${s[1]}`;
}

function konusmaOkunmadiMi(data, myUid) {
  if (!data?.sonMesaj) return false;
  if (data.sonGonderenId === myUid) return false;
  const okundu = data.okundu || {};
  const sonAt = data.sonMesajAt?.toMillis?.() ?? 0;
  const okAt = okundu[myUid]?.toMillis?.() ?? 0;
  return sonAt > okAt;
}

function docToKonusma(snap, myUid) {
  const d = snap.data() || {};
  const digerUid = (d.katilimcilar || []).find((u) => u !== myUid);
  return {
    id: snap.id,
    ...d,
    digerUid,
    digerAd: d.katilimciAdlari?.[digerUid] || 'Kullanıcı',
    okunmadi: konusmaOkunmadiMi(d, myUid),
  };
}

async function kullaniciAdiAl(uid) {
  try {
    const snap = await getDoc(doc(getDb(), 'users', uid));
    if (!snap.exists()) return 'Kullanıcı';
    const d = snap.data() || {};
    return (
      d.gorunenAd ||
      `${d.ad || ''} ${d.soyad || ''}`.trim() ||
      d.email?.split('@')[0] ||
      'Kullanıcı'
    );
  } catch {
    return 'Kullanıcı';
  }
}

/** İlan üzerinden sohbet başlat veya mevcut sohbeti getir */
export async function getOrCreateKonusma({ ilanId, ilanBaslik, ownerId }) {
  const uid = await requireUid();
  if (!ilanId || !ownerId) throw new Error('İlan bilgisi eksik.');
  if (uid === ownerId) throw new Error('Kendi ilanınıza mesaj gönderemezsiniz.');

  const id = konusmaIdOlustur(ilanId, uid, ownerId);
  const ref = doc(getDb(), 'konusmalar', id);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    return docToKonusma(snap, uid);
  }

  const [benimAd, sahipAd] = await Promise.all([kullaniciAdiAl(uid), kullaniciAdiAl(ownerId)]);

  const veri = {
    ilanId: String(ilanId),
    ilanBaslik: String(ilanBaslik || 'İlan'),
    katilimcilar: [uid, ownerId].sort(),
    ownerId: String(ownerId),
    aliciId: uid,
    katilimciAdlari: {
      [uid]: benimAd,
      [ownerId]: sahipAd,
    },
    sonMesaj: '',
    sonGonderenId: null,
    sonMesajAt: serverTimestamp(),
    okundu: {},
    createdAt: serverTimestamp(),
  };

  await setDoc(ref, veri);
  const yeni = await getDoc(ref);
  return docToKonusma(yeni, uid);
}

/** Canlı konuşma listesi */
export function dinleKonusmalar(onData, onError) {
  let unsub = () => {};
  let iptal = false;
  (async () => {
    try {
      const uid = await requireUid();
      if (iptal) return;
      const q = query(
        konusmalarCol(),
        where('katilimcilar', 'array-contains', uid),
        orderBy('sonMesajAt', 'desc')
      );
      unsub = onSnapshot(
        q,
        (snap) => {
          const liste = snap.docs.map((d) => docToKonusma(d, uid));
          onData(liste);
        },
        (err) => onError?.(err)
      );
    } catch (e) {
      onError?.(e);
    }
  })();
  return () => {
    iptal = true;
    unsub();
  };
}

/** Sohbet mesajları — gerçek zamanlı */
export function dinleMesajlar(konusmaId, onData, onError) {
  const q = query(
    collection(getDb(), 'konusmalar', String(konusmaId), 'mesajlar'),
    orderBy('createdAt', 'asc')
  );
  return onSnapshot(
    q,
    (snap) => {
      onData(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }))
      );
    },
    (err) => onError?.(err)
  );
}

export async function mesajGonder(konusmaId, metin) {
  const uid = await requireUid();
  const t = String(metin || '').trim();
  if (!t) throw new Error('Mesaj boş olamaz.');

  const kRef = doc(getDb(), 'konusmalar', String(konusmaId));
  const kSnap = await getDoc(kRef);
  if (!kSnap.exists()) throw new Error('Sohbet bulunamadı.');
  const k = kSnap.data();
  if (!k.katilimcilar?.includes(uid)) throw new Error('Bu sohbete erişiminiz yok.');

  await addDoc(collection(kRef, 'mesajlar'), {
    gonderenId: uid,
    metin: t,
    createdAt: serverTimestamp(),
  });

  await updateDoc(kRef, {
    sonMesaj: t,
    sonGonderenId: uid,
    sonMesajAt: serverTimestamp(),
  });

  if (k.ilanId && uid !== k.ownerId) {
    const { incrementIlanStat } = await import('../api');
    incrementIlanStat(k.ilanId, 'mesajSayisi');
  }
}

export async function konusmaOkunduIsaretle(konusmaId) {
  const uid = await requireUid();
  const ref = doc(getDb(), 'konusmalar', String(konusmaId));
  await updateDoc(ref, {
    [`okundu.${uid}`]: serverTimestamp(),
  });
}
