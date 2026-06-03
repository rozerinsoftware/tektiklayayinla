/** Sahibinden tarzı iş makineleri kategori ağacı */

function slug(metin) {
  return String(metin)
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export const IS_MAKINESI_TIPLERI = [
  'Asfalt Makinesi',
  'Beko Loder (Kazıcı-Yükleyici)',
  'Belden Kırmalı Damper',
  'Beton Dağıtıcı',
  'Beton Pompası',
  'Çöp Kompaktörü',
  'Demiryolu Makinesi',
  'Dizel Çekiç',
  'Dozer',
  'Ekskavatör (Kepçe)',
  'Finişer',
  'Fore Kazık Makinesi',
  'Greyder',
  'Kanal & Hendek Kazıcı',
  'Kar Aracı',
  'Kar Küreme Aracı',
  'Kar Püskürtme Makinesi',
  'Kaya Delici (Ankraj)',
  'Kaya Kamyonu',
  'Forklift',
  'Vinç',
  'Traktör',
  'Jeneratör',
  'Kompresör',
  'Loder',
  'Silindir',
];

export const ASFALT_MARKALARI = [
  'Ammann',
  'Askale Makina',
  'Asmaksan',
  'Astec',
  'Benninghoven',
  'Bitelli',
  'Bobcat',
  'Bomag',
  'Caterpillar',
  'Constmach',
  'Demag',
  'Dynapac',
  'Elibol',
  'E-MAK',
  'Esisan Makine',
  'Etnyre',
  'Fabo Makina',
  'Diğer',
];

export const ORTAK_IS_MAKINESI_MARKALARI = [
  'Caterpillar',
  'Komatsu',
  'Hitachi',
  'JCB',
  'Volvo',
  'Liebherr',
  'Bobcat',
  'Case',
  'New Holland',
  'John Deere',
  'Hyundai',
  'Doosan',
  'Kubota',
  'Hidromek',
  'Zoomlion',
  'XCMG',
  'Sany',
  'Diğer',
];

export const YEDEK_PARCA_TIPLERI = [
  'Hidrolik Parça',
  'Motor Parçası',
  'Ataşman',
  'Lastik & Jant',
  'Filtre & Yağ',
  'Diğer',
];

function markaYapraklari(markalar, tipId) {
  return markalar.map((m) => ({
    id: `${tipId}-${slug(m)}`,
    baslik: m,
    yaprak: true,
  }));
}

function makineTipiDugumleri(markalar = ORTAK_IS_MAKINESI_MARKALARI) {
  return IS_MAKINESI_TIPLERI.map((tip) => {
    const tipId = slug(tip);
    const markalarListe = tip === 'Asfalt Makinesi' ? ASFALT_MARKALARI : markalar;
    return {
      id: tipId,
      baslik: tip,
      cocuklar: markaYapraklari(markalarListe, tipId),
    };
  });
}

function ilanTuruDugumu(turuId, baslik) {
  if (turuId === 'yedek-parca') {
    return {
      id: turuId,
      baslik,
      cocuklar: YEDEK_PARCA_TIPLERI.map((t) => ({
        id: `yp-${slug(t)}`,
        baslik: t,
        yaprak: true,
      })),
    };
  }
  return {
    id: turuId,
    baslik,
    cocuklar: makineTipiDugumleri(),
  };
}

export const IS_MAKINELERI_ALT_AGAC = {
  id: 'is-makineleri-grup',
  baslik: 'İş Makineleri',
  cocuklar: [
    ilanTuruDugumu('satilik', 'Satılık'),
    ilanTuruDugumu('kiralik', 'Kiralık'),
    ilanTuruDugumu('yedek-parca', 'Yedek Parça & Ataşman'),
  ],
};

/** Marka yaprak mı? (id içinde tip-marka yapısı) */
export function isMakinesiMarkaYapragi(kategoriId) {
  if (!kategoriId) return false;
  return IS_MAKINESI_TIPLERI.some((tip) => {
    const tipId = slug(tip);
    return kategoriId.startsWith(`${tipId}-`) && kategoriId !== tipId;
  });
}

export function getIsMakinesiTipBaslik(kategoriId, yolBaslik = []) {
  if (yolBaslik.length >= 2) {
    const idx = yolBaslik.findIndex((b) =>
      IS_MAKINESI_TIPLERI.some((t) => t === b)
    );
    if (idx >= 0) return yolBaslik[idx];
  }
  for (const tip of IS_MAKINESI_TIPLERI) {
    if (kategoriId?.startsWith(slug(tip))) return tip;
  }
  return yolBaslik[yolBaslik.length - 1] || 'İş Makinesi';
}

export function getIsMakinesiMarkaBaslik(kategoriId, yolBaslik = []) {
  if (yolBaslik.length) return yolBaslik[yolBaslik.length - 1];
  return '';
}
