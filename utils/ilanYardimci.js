/** İlan yayın durumu — platform seçilmediyse pasif */
export function ilanYayinda(ilan) {
  return Array.isArray(ilan?.platformlar) && ilan.platformlar.length > 0;
}

export function filtreYayindaIlanlar(liste) {
  return (liste || []).filter(ilanYayinda);
}

export function fiyatSayiyaCevir(fiyat) {
  const n = Number(String(fiyat ?? '').replace(/\D/g, ''));
  return Number.isFinite(n) ? n : 0;
}

export const SIRALAMA_SECENEKLERI = [
  { id: 'fiyat_desc', label: 'Fiyata göre (Önce en yüksek)' },
  { id: 'fiyat_asc', label: 'Fiyata göre (Önce en düşük)' },
  { id: 'en_yeni', label: 'Tarihe göre (Önce en yeni ilan)' },
  { id: 'en_eski', label: 'Tarihe göre (Önce en eski ilan)' },
  { id: 'adres_asc', label: 'Adrese göre (A-Z)' },
  { id: 'adres_desc', label: 'Adrese göre (Z-A)' },
];

function ilanTarihMs(ilan) {
  const ts = ilan?.createdAt?.toMillis?.() ?? ilan?.createdAt ?? 0;
  return typeof ts === 'number' ? ts : 0;
}

function ilanAdresMetni(ilan) {
  const k = ilan?.konum;
  if (!k) return '';
  return k.etiket || [k.ilce, k.il].filter(Boolean).join(', ') || '';
}

/** Vitrinde emlak → vasıta → diğer önceliği */
export function vitrinKategoriOnceligi(ilan) {
  const kok = ilan?.kategoriKok;
  if (kok === 'emlak') return 0;
  if (kok === 'vasita') return 1;
  return 2;
}

export function siralamaIlanlar(liste, siralamaId = 'en_yeni') {
  const kopya = [...(liste || [])];
  if (siralamaId === 'fiyat_asc') {
    return kopya.sort((a, b) => fiyatSayiyaCevir(a.fiyat) - fiyatSayiyaCevir(b.fiyat));
  }
  if (siralamaId === 'fiyat_desc') {
    return kopya.sort((a, b) => fiyatSayiyaCevir(b.fiyat) - fiyatSayiyaCevir(a.fiyat));
  }
  if (siralamaId === 'en_eski') {
    return kopya.sort((a, b) => ilanTarihMs(a) - ilanTarihMs(b));
  }
  if (siralamaId === 'adres_asc') {
    return kopya.sort((a, b) => ilanAdresMetni(a).localeCompare(ilanAdresMetni(b), 'tr'));
  }
  if (siralamaId === 'adres_desc') {
    return kopya.sort((a, b) => ilanAdresMetni(b).localeCompare(ilanAdresMetni(a), 'tr'));
  }
  return kopya.sort((a, b) => ilanTarihMs(b) - ilanTarihMs(a));
}

/** Ana vitrin — önce emlak/vasıta, sonra seçilen sıralama */
export function vitrinSiralamaIlanlar(liste, siralamaId = 'en_yeni') {
  const sirali = siralamaIlanlar(liste, siralamaId);
  return sirali.sort((a, b) => vitrinKategoriOnceligi(a) - vitrinKategoriOnceligi(b));
}

export function uygulaIlanFiltreleri(liste, filtre = {}) {
  let sonuc = [...(liste || [])];
  const { minFiyat, maxFiyat, durum, kimden, kategoriKok, il, haritaliIlanlar, ilanTarihiGun } = filtre;

  if (minFiyat != null && minFiyat !== '') {
    const min = Number(minFiyat);
    if (Number.isFinite(min)) sonuc = sonuc.filter((i) => fiyatSayiyaCevir(i.fiyat) >= min);
  }
  if (maxFiyat != null && maxFiyat !== '') {
    const max = Number(maxFiyat);
    if (Number.isFinite(max)) sonuc = sonuc.filter((i) => fiyatSayiyaCevir(i.fiyat) <= max);
  }
  if (durum) sonuc = sonuc.filter((i) => i.durum === durum);
  if (kimden) sonuc = sonuc.filter((i) => i.kimden === kimden);
  if (kategoriKok) sonuc = sonuc.filter((i) => i.kategoriKok === kategoriKok);
  if (il) sonuc = sonuc.filter((i) => i.konum?.il === il);
  if (ilanTarihiGun) {
    const gun = Number(ilanTarihiGun);
    if (Number.isFinite(gun) && gun > 0) {
      const sinir = Date.now() - gun * 24 * 60 * 60 * 1000;
      sonuc = sonuc.filter((i) => ilanTarihMs(i) >= sinir);
    }
  }
  if (haritaliIlanlar) {
    sonuc = sonuc.filter(
      (i) =>
        Number.isFinite(Number(i.konum?.latitude)) && Number.isFinite(Number(i.konum?.longitude))
    );
  }

  return sonuc;
}

export function ilanBitisTarihi(ilan) {
  const ts = ilan?.createdAt?.toMillis?.() ?? ilan?.createdAt;
  if (!ts) return null;
  const ms = typeof ts === 'number' ? ts : Date.now();
  const bitis = new Date(ms);
  bitis.setMonth(bitis.getMonth() + 1);
  return bitis;
}

export function formatIlanTarih(date) {
  if (!date) return '—';
  return date.toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' });
}
