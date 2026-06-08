/**
 * Uygulamanın desteklediği ana ilan kategorileri (Emlak, Vasıta, İkinci El, İş Makineleri).
 */

import { BILGISAYAR_ALT_AGAC, CEP_TELEFONU_ALT_AGAC } from './ikinciElAltKategoriler';
import { IS_MAKINELERI_ALT_AGAC } from './isMakineleriKatalog';

const emlakKonutSatilik = [
  { id: 'daire', baslik: 'Daire', yaprak: true },
  { id: 'rezidans', baslik: 'Rezidans', yaprak: true },
  { id: 'mustakil-ev', baslik: 'Müstakil Ev', yaprak: true },
  { id: 'villa', baslik: 'Villa', yaprak: true },
  { id: 'ciftlik-evi', baslik: 'Çiftlik Evi', yaprak: true },
  { id: 'kosk-konak', baslik: 'Köşk & Konak', yaprak: true },
  { id: 'yali', baslik: 'Yalı', yaprak: true },
  { id: 'yali-dairesi', baslik: 'Yalı Dairesi', yaprak: true },
  { id: 'yazlik', baslik: 'Yazlık', yaprak: true },
  { id: 'kooperatif', baslik: 'Kooperatif', yaprak: true },
];

const emlakKonutKiralik = emlakKonutSatilik.map((n) => ({ ...n, id: `kiralik-${n.id}` }));

export const KOK_KATEGORILER = [
  {
    id: 'emlak',
    baslik: 'Emlak',
    emoji: '🏠',
    renk: '#0284C7',
    renkBg: '#E0F2FE',
    cocuklar: [
      {
        id: 'konut',
        baslik: 'Konut',
        cocuklar: [
          { id: 'satilik', baslik: 'Satılık', cocuklar: emlakKonutSatilik },
          { id: 'kiralik', baslik: 'Kiralık', cocuklar: emlakKonutKiralik },
          { id: 'turistik-gunluk', baslik: 'Turistik Günlük Kiralık', yaprak: true },
          { id: 'devren-satilik-konut', baslik: 'Devren Satılık Konut', yaprak: true },
        ],
      },
      {
        id: 'is-yeri',
        baslik: 'İş Yeri',
        cocuklar: [
          { id: 'is-yeri-satilik', baslik: 'Satılık', yaprak: true },
          { id: 'is-yeri-kiralik', baslik: 'Kiralık', yaprak: true },
          { id: 'is-yeri-devren', baslik: 'Devren', yaprak: true },
        ],
      },
      {
        id: 'arsa',
        baslik: 'Arsa',
        cocuklar: [
          { id: 'arsa-satilik', baslik: 'Satılık', yaprak: true },
          { id: 'arsa-kiralik', baslik: 'Kiralık', yaprak: true },
        ],
      },
      { id: 'konut-projeleri', baslik: 'Konut Projeleri', yaprak: true },
      { id: 'bina', baslik: 'Bina', yaprak: true },
      { id: 'devre-mulk', baslik: 'Devre Mülk', yaprak: true },
      { id: 'turistik-tesis', baslik: 'Turistik Tesis', yaprak: true },
    ],
  },
  {
    id: 'vasita',
    baslik: 'Vasıta',
    emoji: '🚗',
    renk: '#EA580C',
    renkBg: '#FFEDD5',
    cocuklar: [
      { id: 'otomobil', baslik: 'Otomobil', yaprak: true },
      { id: 'arazi-suv', baslik: 'Arazi, SUV & Pickup', yaprak: true },
      { id: 'elektrikli', baslik: 'Elektrikli Araçlar', yaprak: true },
      { id: 'motosiklet', baslik: 'Motosiklet', yaprak: true },
      { id: 'minivan', baslik: 'Minivan & Panelvan', yaprak: true },
      { id: 'ticari', baslik: 'Ticari Araçlar', yaprak: true },
      { id: 'deniz', baslik: 'Deniz Araçları', yaprak: true },
      { id: 'hasarli', baslik: 'Hasarlı Araçlar', yaprak: true },
    ],
  },
  {
    id: 'ikinci-el',
    baslik: 'İkinci El ve Sıfır Alışveriş',
    emoji: '📦',
    renk: '#7C3AED',
    renkBg: '#EDE9FE',
    cocuklar: [
      BILGISAYAR_ALT_AGAC,
      CEP_TELEFONU_ALT_AGAC,
      { id: 'ev-dekorasyon', baslik: 'Ev Dekorasyon', yaprak: true },
      { id: 'ev-elektronigi', baslik: 'Ev Elektroniği', yaprak: true },
      { id: 'giyim', baslik: 'Giyim & Aksesuar', yaprak: true },
      { id: 'hobi', baslik: 'Hobi & Oyun', yaprak: true },
    ],
  },
  {
    id: 'is-makineleri',
    baslik: 'İş Makineleri & Sanayi',
    emoji: '🚜',
    renk: '#B45309',
    renkBg: '#FEF3C7',
    cocuklar: [IS_MAKINELERI_ALT_AGAC],
  },
];

/** Düz harita: id → { düğüm, yol id'leri, yol başlıkları, kök id } */
const _index = new Map();
/** Tam yol: emlak/konut/kiralik gibi — aynı id birden fazla dalda olabiliyor */
const _pathIndex = new Map();

function walk(nodes, yolIds = [], yolBaslik = [], kokId = null) {
  nodes.forEach((node) => {
    const kok = kokId || node.id;
    const ids = [...yolIds, node.id];
    const basliklar = [...yolBaslik, node.baslik];
    const entry = {
      node,
      yolIds: ids,
      yolBaslik: basliklar,
      kokId: kok,
      etiket: basliklar.join(' › '),
    };
    _index.set(node.id, entry);
    _pathIndex.set(ids.join('/'), entry);
    if (node.cocuklar?.length) walk(node.cocuklar, ids, basliklar, kok);
    if (node.ilgili?.length) {
      node.ilgili.forEach((ilg) => {
        if (!_index.has(ilg.id)) {
          _index.set(ilg.id, {
            node: ilg,
            yolIds: [...ids, ilg.id],
            yolBaslik: [...basliklar, ilg.baslik],
            kokId: kok,
            etiket: [...basliklar, ilg.baslik].join(' › '),
            hizmet: true,
          });
        }
      });
    }
  });
}

walk(KOK_KATEGORILER);

export function getKategoriByYol(yolIds) {
  if (!Array.isArray(yolIds) || !yolIds.length) return null;
  return _pathIndex.get(yolIds.join('/')) || null;
}

/** ustYolIds: üst kategori yolu (ör. ['emlak','konut']) — aynı id çakışmalarını çözer */
export function getKategoriById(id, ustYolIds = null) {
  if (!id) return null;
  if (ustYolIds?.length) {
    const byPath = getKategoriByYol([...ustYolIds, id]);
    if (byPath) return byPath;
  }
  return _index.get(id) || null;
}

export function getKokKategori(id) {
  const e = _index.get(id);
  if (!e) return null;
  return KOK_KATEGORILER.find((k) => k.id === e.kokId) || null;
}

export function getAltBaslikMetni(node) {
  const cocuklar = node.cocuklar || [];
  if (!cocuklar.length) return '';
  const isimler = cocuklar.slice(0, 6).map((c) => c.baslik);
  const metin = isimler.join(', ');
  return cocuklar.length > 6 ? `${metin}...` : metin;
}

/** Eski ilanlar: kategori = "Emlak" | "Araç" | "İkinci El" | "İş Makineleri" */
export function legacyKategoriToKok(kategori) {
  const m = {
    Emlak: 'emlak',
    Araç: 'vasita',
    'İkinci El': 'ikinci-el',
    'İş Makineleri': 'is-makineleri',
  };
  return m[kategori] || null;
}

export function getIlanKategoriYolu(ilan) {
  if (Array.isArray(ilan.kategoriYolu) && ilan.kategoriYolu.length) {
    return ilan.kategoriYolu;
  }
  if (ilan.kategoriId) {
    const bilgi = getKategoriById(ilan.kategoriId);
    if (bilgi?.yolIds?.length) return bilgi.yolIds;
  }
  const kok = legacyKategoriToKok(ilan.kategori);
  if (kok && ilan.kategoriId) return [kok, ilan.kategoriId];
  if (kok) return [kok];
  return [];
}

/**
 * İlan, seçilen kategoriyle eşleşiyor mu?
 * - Yaprak filtre (Daire, Yalı Dairesi): sadece aynı yaprak veya o yolun altı
 * - Üst kategori (Satılık, Konut): altındaki tüm ilanlar
 * - Eski ilanlar (sadece kök "Emlak"): yalnızca kök kategoride görünür
 */
export function ilanKategoriEslesir(ilan, kategoriId, filtreYolu = null) {
  if (!kategoriId) return true;

  const filtre =
    (Array.isArray(filtreYolu) && filtreYolu.length ? getKategoriByYol(filtreYolu) : null) ||
    getKategoriById(kategoriId);
  const yol = getIlanKategoriYolu(ilan);

  if (ilan.kategoriId === kategoriId) return true;
  if (yol.includes(kategoriId)) return true;

  if (filtre?.yolIds?.length && yol.length >= filtre.yolIds.length) {
    const ustKategori = filtre.yolIds.every((id, i) => yol[i] === id);
    if (ustKategori) return true;
  }

  const kok = legacyKategoriToKok(ilan.kategori) || yol[0];
  if (kok === kategoriId) return true;

  // Eski ilan: sadece kök kategori (Emlak, Vasıta…) seçiliyken göster — alt kategorilerde değil
  if (filtre && kok && filtre.kokId === kok && yol.length <= 1) {
    return filtre.yolIds.length === 1 && filtre.yolIds[0] === kok;
  }

  return false;
}

export function formatIlanSayisi(n) {
  const sayi = Number(n) || 0;
  return sayi.toLocaleString('tr-TR');
}

/** Kök için theme meta anahtarı */
export function kokIdToMetaKey(kokId) {
  const m = {
    emlak: 'Emlak',
    vasita: 'Araç',
    'ikinci-el': 'İkinci El',
    'is-makineleri': 'İş Makineleri',
  };
  return m[kokId] || 'Emlak';
}

/** Ana kategori kısa açıklaması (liste alt satırı) */
export function getKokAciklama(kokId) {
  const m = {
    emlak: 'Konut, iş yeri, arsa, bina…',
    vasita: 'Otomobil, SUV, motosiklet, ticari…',
    'ikinci-el': 'Telefon, bilgisayar, ev eşyası, giyim…',
    'is-makineleri': 'Traktör, tarım, ekskavatör, sanayi…',
  };
  return m[kokId] || '';
}
