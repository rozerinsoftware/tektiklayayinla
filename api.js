import { updateProfile } from 'firebase/auth';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { getCurrentUserId, getFirebaseAuth, waitForAuth } from './auth';
import { getDb } from './firebase';
import { ORNEK_ILANLAR, ORNEK_ESKI_BASLIKLAR } from './constants/ornekIlanlar';
import { hazirlaIlanFotograflari } from './utils/ilanFotograf';

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
    konum,
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
    konum: konum && konum.latitude != null ? konum : null,
    detay,
    goruntulenme: 0,
    mesajSayisi: 0,
    favoriSayisi: 0,
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
    konum,
    ...detay,
  };
};

export const updateIlan = async (id, ilan) => {
  const uid = await requireUserId();
  const ref = doc(getDb(), 'ilanlar', String(id));
  const snap = await getDoc(ref);
  if (!snap.exists() || snap.data().ownerId !== uid) {
    throw new Error('Bu ilanı güncelleme yetkiniz yok.');
  }
  const kaynak = ilan || {};
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
    konum,
    ...rest
  } = kaynak;
  const detayMevcut = snap.data()?.detay || {};
  const detay = { ...detayMevcut };
  Object.entries(rest).forEach(([key, value]) => {
    if (value == null) return;
    if (typeof value === 'string' && value.trim() === '') return;
    detay[key] = value;
  });
  const guncelleme = {
    baslik,
    aciklama,
    fiyat,
    platformlar: platformlar ?? snap.data().platformlar,
    kategori,
    detay,
    updatedAt: serverTimestamp(),
  };
  if (kategoriId != null) guncelleme.kategoriId = kategoriId;
  if (Array.isArray(kategoriYolu)) guncelleme.kategoriYolu = kategoriYolu;
  if (kategoriEtiket != null) guncelleme.kategoriEtiket = kategoriEtiket;
  if (kategoriKok != null) guncelleme.kategoriKok = kategoriKok;
  if (konum !== undefined) {
    guncelleme.konum = konum && konum.latitude != null ? konum : null;
  }
  await updateDoc(ref, guncelleme);
  return { id, baslik, aciklama, fiyat, platformlar, kategori, kategoriId, kategoriKok, konum, ...detay };
};

export const unpublishIlan = async (id, neden) => {
  const uid = await requireUserId();
  const ref = doc(getDb(), 'ilanlar', String(id));
  const snap = await getDoc(ref);
  if (!snap.exists() || snap.data().ownerId !== uid) {
    throw new Error('Bu ilanı yayından kaldırma yetkiniz yok.');
  }
  await updateDoc(ref, {
    platformlar: [],
    yayindanKaldirmaNedeni: neden || null,
    updatedAt: serverTimestamp(),
  });
  return { message: 'İlan yayından kaldırıldı' };
};

export const deleteIlan = async (id) => {
  await requireUserId();
  await deleteDoc(doc(getDb(), 'ilanlar', String(id)));
  return { message: 'İlan silindi' };
};

export const getIlanById = async (id) => {
  const snap = await getDoc(doc(getDb(), 'ilanlar', String(id)));
  if (!snap.exists()) return null;
  return docToIlan(snap);
};

/** Fotoğrafları Storage'a yükleyip ilanı yayınlar veya günceller */
export const publishIlan = async (ilan, platformlar, { duzenlemeId } = {}) => {
  const uid = await requireUserId();
  const tamamlanan = { ...ilan, platformlar };

  if (duzenlemeId) {
    const fotograflar = await hazirlaIlanFotograflari(ilan.fotograflar || [], {
      userId: uid,
      ilanId: duzenlemeId,
    });
    return updateIlan(duzenlemeId, { ...tamamlanan, fotograflar });
  }

  const kayit = await addIlan({ ...tamamlanan, fotograflar: [] });
  try {
    const fotograflar = await hazirlaIlanFotograflari(ilan.fotograflar || [], {
      userId: uid,
      ilanId: kayit.id,
    });
    if (fotograflar.length) {
      return updateIlan(kayit.id, { ...tamamlanan, fotograflar });
    }
    return kayit;
  } catch (photoErr) {
    const err = new Error(
      photoErr?.message ||
        'Fotoğraflar yüklenemedi. İlan metin olarak yayınlandı; düzenlemeden tekrar deneyebilirsiniz.'
    );
    err.code = 'photo-upload-partial';
    err.ilanId = kayit.id;
    err.kismiBasari = true;
    err.kayit = kayit;
    throw err;
  }
};

export const updateIlanFiyat = async (id, fiyat) => {
  const uid = await requireUserId();
  const ref = doc(getDb(), 'ilanlar', String(id));
  const snap = await getDoc(ref);
  if (!snap.exists() || snap.data().ownerId !== uid) {
    throw new Error('Bu ilanın fiyatını güncelleme yetkiniz yok.');
  }
  await updateDoc(ref, { fiyat: String(fiyat), updatedAt: serverTimestamp() });
  return { id, fiyat: String(fiyat) };
};

const ISTAT_ALANLARI = ['goruntulenme', 'mesajSayisi', 'favoriSayisi'];

export const incrementIlanStat = async (ilanId, alan) => {
  if (!ilanId || !ISTAT_ALANLARI.includes(alan)) return;
  const ref = doc(getDb(), 'ilanlar', String(ilanId));
  try {
    await updateDoc(ref, { [alan]: increment(1), updatedAt: serverTimestamp() });
  } catch {
    /* istatistik hatası ilanı bozmasın */
  }
};

// ——— Kullanıcı profili ———

function displayNameParcala(displayName) {
  const metin = String(displayName || '').trim();
  if (!metin) return { ad: '', soyad: '' };
  const parcalar = metin.split(/\s+/).filter(Boolean);
  if (parcalar.length === 1) return { ad: parcalar[0], soyad: '' };
  return {
    ad: parcalar.slice(0, -1).join(' '),
    soyad: parcalar[parcalar.length - 1],
  };
}

function profilTemelAlanlar({ ad, soyad, email, telefon } = {}) {
  const authUser = getFirebaseAuth().currentUser;
  let adVal = String(ad || '').trim();
  let soyadVal = String(soyad || '').trim();
  if (!adVal && !soyadVal && authUser?.displayName) {
    const p = displayNameParcala(authUser.displayName);
    adVal = p.ad;
    soyadVal = p.soyad;
  }
  const emailVal = String(email || authUser?.email || '').trim();
  const telefonVal = String(telefon || '').trim();
  const gorunenAd =
    adVal && soyadVal ? `${adVal} ${soyadVal.charAt(0).toUpperCase()}.` : adVal || '';
  return {
    email: emailVal,
    ad: adVal,
    soyad: soyadVal,
    telefon: telefonVal,
    gorunenAd,
    kullaniciAdi: emailVal.split('@')[0] || '',
  };
}

export async function createUserProfile({ ad, soyad, email, telefon }) {
  const uid = await requireUserId();
  const alanlar = profilTemelAlanlar({ ad, soyad, email, telefon });
  await setDoc(
    doc(getDb(), 'users', uid),
    {
      ...alanlar,
      role: 'user',
      createdAt: serverTimestamp(),
    },
    { merge: true }
  );
  return alanlar;
}

/** Giriş / kayıt sonrası profil oluşturur veya eksik alanları doldurur */
export async function ensureUserProfile({ ad, soyad, email, telefon } = {}) {
  const uid = await requireUserId();
  const ref = doc(getDb(), 'users', uid);
  const snap = await getDoc(ref);
  const alanlar = profilTemelAlanlar({ ad, soyad, email, telefon });

  if (!snap.exists()) {
    await setDoc(
      ref,
      {
        ...alanlar,
        role: 'user',
        createdAt: serverTimestamp(),
      },
      { merge: true }
    );
    return { role: 'user', ...alanlar };
  }

  const mevcut = snap.data() || {};
  const yama = {};
  if (!String(mevcut.ad || '').trim() && alanlar.ad) yama.ad = alanlar.ad;
  if (!String(mevcut.soyad || '').trim() && alanlar.soyad) yama.soyad = alanlar.soyad;
  if (!String(mevcut.telefon || '').trim() && alanlar.telefon) yama.telefon = alanlar.telefon;
  if (!String(mevcut.email || '').trim() && alanlar.email) yama.email = alanlar.email;
  if (!String(mevcut.gorunenAd || '').trim() && alanlar.gorunenAd) {
    yama.gorunenAd = alanlar.gorunenAd;
  }
  if (!String(mevcut.kullaniciAdi || '').trim() && alanlar.kullaniciAdi) {
    yama.kullaniciAdi = alanlar.kullaniciAdi;
  }

  if (Object.keys(yama).length > 0) {
    yama.updatedAt = serverTimestamp();
    await setDoc(ref, yama, { merge: true });
  }

  return { ...mevcut, ...yama };
}

export async function getUserProfile() {
  const uid = await requireUserId();
  const ref = doc(getDb(), 'users', uid);
  const snap = await getDoc(ref);
  const authUser = getFirebaseAuth().currentUser;
  const data = snap.exists() ? snap.data() : {};
  const email = data.email || authUser?.email || '';
  return {
    uid,
    email,
    ad: data.ad || '',
    soyad: data.soyad || '',
    telefon: data.telefon || '',
    gorunenAd: data.gorunenAd || '',
    kullaniciAdi: data.kullaniciAdi || String(email).split('@')[0] || '',
    role: data.role || 'user',
    verified: !!data.verified,
  };
}

export async function updateUserProfile({ ad, soyad, telefon, gorunenAd } = {}) {
  const uid = await requireUserId();
  const ref = doc(getDb(), 'users', uid);
  const snap = await getDoc(ref);
  const mevcut = snap.exists() ? snap.data() : {};
  const yeni = {
    ...mevcut,
    ad: ad !== undefined ? String(ad).trim() : mevcut.ad,
    soyad: soyad !== undefined ? String(soyad).trim() : mevcut.soyad,
    telefon: telefon !== undefined ? String(telefon).trim() : mevcut.telefon,
    gorunenAd: gorunenAd !== undefined ? String(gorunenAd).trim() : mevcut.gorunenAd,
    email: mevcut.email || getFirebaseAuth().currentUser?.email || '',
    updatedAt: serverTimestamp(),
  };
  if (!snap.exists()) {
    yeni.role = 'user';
    yeni.createdAt = serverTimestamp();
  }
  await setDoc(ref, yeni, { merge: true });
  const auth = getFirebaseAuth();
  const displayName =
    (yeni.gorunenAd || `${yeni.ad || ''} ${yeni.soyad || ''}`.trim()).trim();
  if (displayName && auth.currentUser) {
    await updateProfile(auth.currentUser, { displayName });
  }
  return yeni;
}

/** Başka kullanıcının görünen adı (favori satıcı vb.) */
export async function getUserPublicProfile(uid) {
  if (!uid) return null;
  const snap = await getDoc(doc(getDb(), 'users', String(uid)));
  if (!snap.exists()) return { uid, ad: 'Satıcı' };
  const d = snap.data() || {};
  const ad =
    d.gorunenAd ||
    `${d.ad || ''} ${d.soyad || ''}`.trim() ||
    d.email ||
    'Satıcı';
  return { uid, ad, email: d.email || '' };
}

export async function setUserVerified(verified) {
  const uid = await requireUserId();
  await setDoc(
    doc(getDb(), 'users', uid),
    { verified: !!verified, updatedAt: serverTimestamp() },
    { merge: true }
  );
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

export const adminUpdateIlan = async (id, ilan) => {
  await requireAdmin();
  const kaynak = ilan || {};
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
    konum,
    ornek,
    ...rest
  } = kaynak;
  const detayMevcut = (await getDoc(doc(getDb(), 'ilanlar', String(id)))).data()?.detay || {};
  const detay = { ...detayMevcut };
  Object.entries(rest).forEach(([key, value]) => {
    if (value != null && String(value).trim() !== '') {
      detay[key] = value;
    }
  });
  const guncelleme = {
    baslik,
    aciklama,
    fiyat,
    platformlar: platformlar || [],
    kategori,
    detay,
    updatedAt: serverTimestamp(),
  };
  if (kategoriId != null) guncelleme.kategoriId = kategoriId;
  if (Array.isArray(kategoriYolu)) guncelleme.kategoriYolu = kategoriYolu;
  if (kategoriEtiket != null) guncelleme.kategoriEtiket = kategoriEtiket;
  if (kategoriKok != null) guncelleme.kategoriKok = kategoriKok;
  if (konum !== undefined) {
    guncelleme.konum = konum && konum.latitude != null ? konum : null;
  }
  if (ornek !== undefined) guncelleme.ornek = !!ornek;
  await updateDoc(doc(getDb(), 'ilanlar', String(id)), guncelleme);
  return { id, baslik, aciklama, fiyat, platformlar, kategori, kategoriId, kategoriKok, ...detay };
};

function firestoreHataMesaji(error) {
  const code = error?.code || '';
  if (code === 'permission-denied') {
    return 'Firestore izni reddedildi. Admin rolünüzü ve e-posta doğrulamanızı kontrol edin.';
  }
  if (code === 'unavailable') {
    return 'Firestore şu an kullanılamıyor. İnternet bağlantınızı kontrol edin.';
  }
  return error?.message || 'Örnek ilanlar yüklenemedi.';
}

/** Admin: vitrin için örnek ilanları Firestore'a ekler / günceller */
export const adminOrnekIlanlariYukle = async ({ ustuneYaz = false, guncelle = true } = {}) => {
  await requireAdmin();
  const uid = await requireUserId();
  const db = getDb();

  try {
    const snap = await getDocs(ilanCol());
    const mevcutOrnek = snap.docs.filter((d) => d.data()?.ornek === true);
    const mevcutByKey = new Map();
    const mevcutByBaslik = new Map();
    mevcutOrnek.forEach((d) => {
      const data = d.data();
      if (data?.ornekKey) mevcutByKey.set(data.ornekKey, d);
      if (data?.baslik) mevcutByBaslik.set(data.baslik, d);
    });

    const ornekDocBul = (ornek) => {
      if (ornek.ornekKey && mevcutByKey.has(ornek.ornekKey)) {
        return mevcutByKey.get(ornek.ornekKey);
      }
      if (mevcutByBaslik.has(ornek.baslik)) {
        return mevcutByBaslik.get(ornek.baslik);
      }
      for (const [eskiBaslik, key] of Object.entries(ORNEK_ESKI_BASLIKLAR)) {
        if (key === ornek.ornekKey && mevcutByBaslik.has(eskiBaslik)) {
          return mevcutByBaslik.get(eskiBaslik);
        }
      }
      return null;
    };

    const batch = writeBatch(db);
    let eklendi = 0;
    let guncellendi = 0;
    let fotoTamamlandi = 0;
    const guncellenenRefler = new Set();

    for (const ornek of ORNEK_ILANLAR) {
      const { detay, fotograflar: _atla, ...ust } = ornek;
      const payload = {
        ...ust,
        detay: detay || {},
        ornek: true,
        fotograflar: [],
      };
      const mevcutDoc = ornekDocBul(ornek);

      if (mevcutDoc) {
        if (guncelle) {
          batch.update(mevcutDoc.ref, payload);
          guncellenenRefler.add(mevcutDoc.ref.path);
          guncellendi += 1;
        }
        continue;
      }

      const ref = doc(ilanCol());
      batch.set(ref, {
        ownerId: uid,
        ...payload,
        createdAt: serverTimestamp(),
      });
      eklendi += 1;
    }

    if (guncelle) {
      const stokFoto = (url) =>
        typeof url === 'string' &&
        (url.includes('picsum.photos') ||
          url.includes('pexels.com') ||
          url.includes('unsplash.com') ||
          url.includes('placehold.co'));

      for (const docSnap of mevcutOrnek) {
        if (guncellenenRefler.has(docSnap.ref.path)) continue;

        const data = docSnap.data();
        const fotolar = Array.isArray(data?.fotograflar) ? data.fotograflar : [];
        const stokVar = fotolar.some(stokFoto);
        if (!stokVar) continue;

        batch.update(docSnap.ref, { fotograflar: [] });
        fotoTamamlandi += 1;
      }
    }

    if (eklendi === 0 && guncellendi === 0 && fotoTamamlandi === 0) {
      return {
        eklendi: 0,
        guncellendi: 0,
        atlandi: true,
        mevcut: mevcutOrnek.length,
        mesaj: 'Güncellenecek veya eklenecek örnek ilan yok.',
      };
    }

    await batch.commit();

    const parcalar = [];
    if (guncellendi > 0) parcalar.push(`${guncellendi} ilan güncellendi`);
    if (fotoTamamlandi > 0) parcalar.push(`${fotoTamamlandi} ilandan stok fotoğraflar temizlendi`);
    if (eklendi > 0) parcalar.push(`${eklendi} yeni ilan eklendi`);
    return {
      eklendi,
      guncellendi,
      atlandi: false,
      mesaj: parcalar.join(', ') + '. Vitrini yenileyin.',
    };
  } catch (error) {
    throw new Error(firestoreHataMesaji(error));
  }
};

export const adminGetAllUsers = async () => {
  await requireAdmin();
  const snap = await getDocs(usersCol());
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};