import { getKategoriById, getKategoriByYol } from './kategoriler';
import {
  getIsMakinesiTipBaslik,
  getIsMakinesiMarkaBaslik,
  isMakinesiMarkaYapragi,
} from './isMakineleriKatalog';

const DURUM = ['Sıfır', '2. El', 'Yenilenmiş'];
const KIMDEN = ['Sahibinden', 'Galeriden', 'Yetkili Bayiden'];
const EVET_HAYIR = ['Evet', 'Hayır'];

function alan(key, label, tip, ek = {}) {
  return { key, label, tip, ...ek };
}

const ORTAK_ALANLAR = [
  alan('modelYili', 'Model Yılı', 'number', { zorunlu: true, keyboard: 'numeric' }),
  alan('calismaSaati', 'Çalışma Saati', 'number', { keyboard: 'numeric' }),
  alan('kimden', 'Kimden', 'select', { secenekler: KIMDEN, varsayilan: 'Sahibinden' }),
  alan('durum', 'Durumu', 'select', { zorunlu: true, secenekler: DURUM }),
  alan('takas', 'Takaslı', 'select', { secenekler: EVET_HAYIR, varsayilan: 'Hayır' }),
];

const MARKA_ALANLI = [
  alan('model', 'Model', 'text'),
  ...ORTAK_ALANLAR,
];

const YEDEK_PARCA = [
  alan('parcaTipi', 'Parça Tipi', 'text'),
  alan('uyumluMarka', 'Uyumlu Marka', 'text'),
  alan('kimden', 'Kimden', 'select', { secenekler: KIMDEN, varsayilan: 'Sahibinden' }),
  alan('durum', 'Durumu', 'select', { zorunlu: true, secenekler: DURUM }),
];

export function getIsMakinesiProfil(secilenKategori) {
  const bilgi =
    (secilenKategori?.kategoriYolu?.length && getKategoriByYol(secilenKategori.kategoriYolu)) ||
    getKategoriById(secilenKategori?.kategoriId);
  const yolBaslik = bilgi?.yolBaslik || secilenKategori?.kategoriEtiket?.split(' › ') || [];
  const yolIds = bilgi?.yolIds || secilenKategori?.kategoriYolu || [];
  const kategoriId = secilenKategori?.kategoriId;

  const ilanTuru = yolBaslik.find((b) => ['Satılık', 'Kiralık', 'Yedek Parça & Ataşman'].includes(b)) || '';
  const makineTipi = getIsMakinesiTipBaslik(kategoriId, yolBaslik);
  const marka = getIsMakinesiMarkaBaslik(kategoriId, yolBaslik);

  let alanlar = MARKA_ALANLI;
  if (yolIds.includes('yedek-parca') || kategoriId?.startsWith('yp-')) {
    alanlar = YEDEK_PARCA;
  }

  let otomatikBaslik = [ilanTuru, makineTipi, marka].filter(Boolean).join(' ');
  if (!isMakinesiMarkaYapragi(kategoriId) && !kategoriId?.startsWith('yp-')) {
    otomatikBaslik = [ilanTuru, makineTipi].filter(Boolean).join(' ');
  }

  return {
    ilanTuru,
    makineTipi,
    marka,
    yolBaslik,
    alanlar,
    otomatikBaslik,
    markaOtomatik: marka && marka !== 'Diğer' ? marka : '',
  };
}

export function isMakineleriBreadcrumb(secilenKategori) {
  const etiket = secilenKategori?.kategoriEtiket || '';
  return etiket ? etiket.split(' › ').map((p) => p.toUpperCase()) : [];
}

export function isMakineleriDetayNormalize(degerler, profil) {
  const detay = {
    makineTipi: profil.makineTipi,
    marka: profil.markaOtomatik || degerler.marka || profil.marka,
    ilanTuru: profil.ilanTuru,
    ...degerler,
  };
  // Form `modelYili`/`takas` kaydeder; vitrin ve detay `yil`/`takasli` bekler.
  if (degerler.modelYili && !detay.yil) detay.yil = degerler.modelYili;
  if (degerler.takas && !detay.takasli) detay.takasli = degerler.takas;
  return detay;
}

/** İlan ver akışında form ekranına geçilecek yaprak mı? */
export function isMakinesiFormYapragi(kategoriId, yolIds = []) {
  if (!kategoriId) return false;
  if (isMakinesiMarkaYapragi(kategoriId)) return true;
  if (kategoriId.startsWith('yp-')) return true;
  if (yolIds.includes('yedek-parca') && kategoriId.startsWith('yp-')) return true;
  return false;
}
