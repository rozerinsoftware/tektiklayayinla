import { formatKonumEtiket } from './konum';

function alanDeger(ilan, ...anahtarlar) {
  for (const key of anahtarlar) {
    const deger = ilan?.[key];
    if (deger != null && String(deger).trim()) return String(deger).trim();
  }
  return '';
}

function sayiMetin(deger) {
  const rakam = String(deger).replace(/\D/g, '');
  if (!rakam) return '';
  return Number(rakam).toLocaleString('tr-TR');
}

/** Vitrin kartı — kısa konum (ilçe, il) */
export function ilanKonumKisa(ilan) {
  const konum = ilan?.konum;
  if (!konum) return '';
  if (konum.ilce && konum.il) return `${konum.ilce}, ${konum.il}`;
  if (konum.il) return konum.il;
  return formatKonumEtiket(konum);
}

/** Kategori rozet metni (Satılık, Kiralık, Daire…) */
export function ilanVitrinRozet(ilan) {
  const tur = alanDeger(ilan, 'ilanTuru');
  if (tur) return tur;
  const etiket = ilan?.kategoriEtiket || '';
  const son = etiket.split(' › ').filter(Boolean).pop();
  return son || '';
}

/** Sahibinden tarzı özet satır: "120 m² · 3+1 · 8 yaşında" */
export function ilanVitrinOzellikleri(ilan) {
  const kok = ilan?.kategoriKok;
  const parcalar = [];

  if (kok === 'emlak') {
    const m2 = alanDeger(ilan, 'metrekareBrut', 'metrekare', 'metrekareNet');
    if (m2) parcalar.push(`${m2} m²`);
    const oda = alanDeger(ilan, 'odaSayisi');
    if (oda) parcalar.push(oda);
    const kat = alanDeger(ilan, 'kat');
    if (kat) parcalar.push(kat.includes('Kat') ? kat : `${kat}. Kat`);
    const yas = alanDeger(ilan, 'binaYasi');
    if (yas) parcalar.push(`${yas} yaşında`);
    const imar = alanDeger(ilan, 'imarDurumu');
    if (imar && !m2) parcalar.push(imar);
  } else if (kok === 'vasita') {
    const yil = alanDeger(ilan, 'yil');
    if (yil) parcalar.push(yil);
    const km = sayiMetin(alanDeger(ilan, 'kilometre'));
    if (km) parcalar.push(`${km} km`);
    const yakit = alanDeger(ilan, 'yakit');
    if (yakit) parcalar.push(yakit);
    const vites = alanDeger(ilan, 'vites');
    if (vites) parcalar.push(vites);
  } else if (kok === 'ikinci-el') {
    const marka = alanDeger(ilan, 'marka');
    if (marka) parcalar.push(marka);
    const durum = alanDeger(ilan, 'durum');
    if (durum) parcalar.push(durum);
    const urun = alanDeger(ilan, 'urunTipi');
    if (urun && !marka) parcalar.push(urun);
  } else if (kok === 'is-makineleri') {
    const yil = alanDeger(ilan, 'yil');
    if (yil) parcalar.push(yil);
    const saat = sayiMetin(alanDeger(ilan, 'calismaSaati'));
    if (saat) parcalar.push(`${saat} saat`);
    const marka = alanDeger(ilan, 'marka');
    if (marka) parcalar.push(marka);
  } else {
    const marka = alanDeger(ilan, 'marka');
    if (marka) parcalar.push(marka);
    const m2 = alanDeger(ilan, 'metrekare', 'metrekareBrut');
    if (m2) parcalar.push(`${m2} m²`);
  }

  return parcalar.slice(0, 4);
}

export function ilanVitrinOzetMetni(ilan) {
  return ilanVitrinOzellikleri(ilan).join(' · ');
}
