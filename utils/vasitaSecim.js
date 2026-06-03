/** Vasıta ilan verme — seçim adımları ve breadcrumb */

export const VASITA_ADIMLAR = [
  { key: 'yil', label: 'Yıl' },
  { key: 'marka', label: 'Marka' },
  { key: 'model', label: 'Model' },
  { key: 'yakit', label: 'Yakıt' },
  { key: 'kasaTipi', label: 'Kasa' },
  { key: 'vites', label: 'Vites' },
  { key: 'donanim', label: 'Donanım' },
  { key: 'onay', label: 'Onay' },
];

export function vasitaYillari() {
  const yil = new Date().getFullYear() + 1;
  const liste = [];
  for (let y = yil; y >= 1980; y -= 1) liste.push(String(y));
  return liste;
}

export function vasitaBreadcrumb(secilenKategori, secimler) {
  const parcalar = [];
  if (secilenKategori?.kategoriEtiket) {
    parcalar.push(...secilenKategori.kategoriEtiket.split(' › '));
  }
  for (const adim of VASITA_ADIMLAR) {
    if (adim.key === 'onay') continue;
    const v = secimler[adim.key];
    if (v) parcalar.push(String(v).toUpperCase());
  }
  return parcalar;
}

export function otomatikBaslik(secimler, donanimKayit) {
  if (donanimKayit?.baslik) return donanimKayit.baslik;
  const p = [secimler.yil, secimler.marka, secimler.model, secimler.donanim].filter(Boolean);
  return p.join(' ') || '';
}

export function secimdenDetay(secimler, donanimKayit, aracTipId) {
  return {
    aracTipi: aracTipId,
    yil: secimler.yil || null,
    marka: secimler.marka || null,
    model: secimler.model || null,
    yakit: secimler.yakit || null,
    kasaTipi: secimler.kasaTipi || null,
    vites: secimler.vites || null,
    donanim: secimler.donanim || donanimKayit?.baslik || null,
    kilometre: null,
    motorGucu: donanimKayit?.hp ? String(donanimKayit.hp) : null,
    motorHacmi: donanimKayit?.cc ? String(donanimKayit.cc) : null,
    yilAraligi: donanimKayit?.yilAralik || null,
    vasitaOzellikleri: donanimKayit?.ozellikler || [],
  };
}

export function aktifAdimIndeksi(secimler) {
  for (let i = 0; i < VASITA_ADIMLAR.length; i += 1) {
    const key = VASITA_ADIMLAR[i].key;
    if (key === 'onay') {
      if (secimler.donanim) return i;
      return i - 1;
    }
    if (!secimler[key]) return i;
  }
  return VASITA_ADIMLAR.length - 1;
}
