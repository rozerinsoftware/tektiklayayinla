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
  { id: 'en_yeni', label: 'En yeni' },
  { id: 'fiyat_asc', label: 'Fiyat (artan)' },
  { id: 'fiyat_desc', label: 'Fiyat (azalan)' },
];

export function siralamaIlanlar(liste, siralamaId = 'en_yeni') {
  const kopya = [...(liste || [])];
  if (siralamaId === 'fiyat_asc') {
    return kopya.sort((a, b) => fiyatSayiyaCevir(a.fiyat) - fiyatSayiyaCevir(b.fiyat));
  }
  if (siralamaId === 'fiyat_desc') {
    return kopya.sort((a, b) => fiyatSayiyaCevir(b.fiyat) - fiyatSayiyaCevir(a.fiyat));
  }
  return kopya.sort((a, b) => {
    const ta = a.createdAt?.toMillis?.() ?? a.createdAt ?? 0;
    const tb = b.createdAt?.toMillis?.() ?? b.createdAt ?? 0;
    return tb - ta;
  });
}

export function uygulaIlanFiltreleri(liste, filtre = {}) {
  let sonuc = [...(liste || [])];
  const { minFiyat, maxFiyat, durum, kimden, kategoriKok } = filtre;

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
