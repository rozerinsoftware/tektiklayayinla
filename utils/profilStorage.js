import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  favoriIlanlar: '@profil/favoriIlanlar',
  favoriAramalar: '@profil/favoriAramalar',
  favoriSaticilar: '@profil/favoriSaticilar',
  engellenenler: '@profil/engellenenler',
  ikiAsamali: '@profil/ikiAsamaliDogrulama',
  hesapDogrulandi: '@profil/hesapDogrulandi',
  ayarlar: '@profil/uygulamaAyarlari',
};

async function jsonGet(key, fallback) {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

async function jsonSet(key, value) {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function getFavoriIlanlar() {
  return jsonGet(KEYS.favoriIlanlar, []);
}

export async function setFavoriIlanlar(liste) {
  await jsonSet(KEYS.favoriIlanlar, liste);
}

export async function isFavoriIlan(ilanId) {
  const liste = await getFavoriIlanlar();
  return liste.some((x) => String(x.id) === String(ilanId));
}

/** @returns {boolean} eklendiyse true, çıkarıldıysa false */
export async function toggleFavoriIlan(ilan) {
  if (!ilan?.id) return false;
  const liste = await getFavoriIlanlar();
  const id = String(ilan.id);
  const idx = liste.findIndex((x) => String(x.id) === id);
  if (idx >= 0) {
    liste.splice(idx, 1);
    await setFavoriIlanlar(liste);
    return false;
  }
  liste.unshift({
    id,
    baslik: ilan.baslik || 'İlan',
    alt: ilan.kategoriEtiket || ilan.kategori || '',
    ilan,
    eklenme: Date.now(),
  });
  await setFavoriIlanlar(liste.slice(0, 100));
  return true;
}

export async function getFavoriAramalar() {
  return jsonGet(KEYS.favoriAramalar, []);
}

export async function setFavoriAramalar(liste) {
  await jsonSet(KEYS.favoriAramalar, liste);
}

function aramaKayitId({ kategoriId, aramaMetni }) {
  return `arama-${kategoriId || 'tum'}-${(aramaMetni || '').trim().toLowerCase()}`;
}

export async function isFavoriArama(kayit) {
  const id = aramaKayitId(kayit);
  const liste = await getFavoriAramalar();
  return liste.some((x) => x.id === id);
}

export async function toggleFavoriArama({ aramaMetni, kategoriId, kategoriBaslik }) {
  const metin = (aramaMetni || '').trim();
  if (!metin && !kategoriId) return null;
  const id = aramaKayitId({ kategoriId, aramaMetni: metin });
  const liste = await getFavoriAramalar();
  const idx = liste.findIndex((x) => x.id === id);
  if (idx >= 0) {
    liste.splice(idx, 1);
    await setFavoriAramalar(liste);
    return false;
  }
  const baslik = kategoriBaslik || metin || 'Kayıtlı arama';
  const alt = [kategoriBaslik, metin].filter(Boolean).join(' · ');
  liste.unshift({
    id,
    baslik,
    alt,
    kategoriId: kategoriId || null,
    kategoriBaslik: kategoriBaslik || null,
    aramaMetni: metin,
    eklenme: Date.now(),
  });
  await setFavoriAramalar(liste.slice(0, 50));
  return true;
}

export async function getFavoriSaticilar() {
  return jsonGet(KEYS.favoriSaticilar, []);
}

export async function setFavoriSaticilar(liste) {
  await jsonSet(KEYS.favoriSaticilar, liste);
}

export async function isFavoriSatici(ownerId) {
  if (!ownerId) return false;
  const liste = await getFavoriSaticilar();
  return liste.some((x) => String(x.id) === String(ownerId));
}

export async function toggleFavoriSatici({ ownerId, ad, alt }) {
  if (!ownerId) return false;
  const liste = await getFavoriSaticilar();
  const id = String(ownerId);
  const idx = liste.findIndex((x) => String(x.id) === id);
  if (idx >= 0) {
    liste.splice(idx, 1);
    await setFavoriSaticilar(liste);
    return false;
  }
  liste.unshift({
    id,
    ad: ad || 'Satıcı',
    baslik: ad || 'Satıcı',
    alt: alt || '',
    eklenme: Date.now(),
  });
  await setFavoriSaticilar(liste.slice(0, 50));
  return true;
}

export async function getEngellenenler() {
  return jsonGet(KEYS.engellenenler, []);
}

export async function setEngellenenler(liste) {
  await jsonSet(KEYS.engellenenler, liste);
}

export async function getIkiAsamaliDogrulama() {
  const v = await AsyncStorage.getItem(KEYS.ikiAsamali);
  return v === '1';
}

export async function setIkiAsamaliDogrulama(acik) {
  await AsyncStorage.setItem(KEYS.ikiAsamali, acik ? '1' : '0');
}

export async function getHesapDogrulandi() {
  const v = await AsyncStorage.getItem(KEYS.hesapDogrulandi);
  return v === '1';
}

export async function setHesapDogrulandi(dogrulandi) {
  await AsyncStorage.setItem(KEYS.hesapDogrulandi, dogrulandi ? '1' : '0');
}

export const DIL_SECENEKLERI = [
  { kod: 'tr', etiket: 'Türkçe' },
  { kod: 'en', etiket: 'English' },
];

export function dilEtiketi(kod) {
  return DIL_SECENEKLERI.find((d) => d.kod === kod)?.etiket || 'Türkçe';
}

export async function getUygulamaAyarlari() {
  return jsonGet(KEYS.ayarlar, {
    bildirimler: true,
    ilanBildirimleri: true,
    azaltilmisHareket: false,
    dil: 'tr',
  });
}

export async function setUygulamaAyarlari(ayarlar) {
  await jsonSet(KEYS.ayarlar, ayarlar);
}
