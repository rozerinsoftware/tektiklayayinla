import { getKategoriById } from './kategoriler';

const DURUM = ['Sıfır', 'Sıfır Ayarında', 'İyi', 'Orta', 'Yıpranmış'];
const EVET_HAYIR = ['Evet', 'Hayır'];
const KIMDEN = ['Sahibinden', 'Mağazadan'];
const KARGO = ['Kargo ile gönderilir', 'Elden teslim', 'Her ikisi de'];

function alan(key, label, tip, ek = {}) {
  return { key, label, tip, ...ek };
}

const ORTAK_SON = [
  alan('durum', 'Durum', 'select', { zorunlu: true, secenekler: DURUM }),
  alan('kimden', 'Kimden', 'select', { secenekler: KIMDEN, varsayilan: 'Sahibinden' }),
  alan('takas', 'Takas', 'select', { secenekler: EVET_HAYIR, varsayilan: 'Hayır' }),
  alan('kargo', 'Teslimat', 'select', { secenekler: KARGO, varsayilan: 'Elden teslim' }),
];

const TOPLAMA_ALANLARI = [
  alan('ekranBoyutu', 'Ekran Boyutu', 'text'),
  alan('ekranKarti', 'Ekran Kartı', 'text'),
  alan('kasa', 'Kasa', 'select', { secenekler: ['Tower', 'All-in-One', 'Mini PC', 'Diğer'] }),
  alan('ram', 'RAM Bellek', 'select', { secenekler: ['4 GB', '8 GB', '16 GB', '32 GB', '64 GB'] }),
  alan('islemci', 'İşlemci', 'text', { zorunlu: true }),
  alan('hdd', 'Harddisk Kapasitesi', 'text'),
  alan('ssd', 'SSD Kapasitesi', 'text'),
  ...ORTAK_SON,
];

const LAPTOP_ALANLARI = [
  alan('marka', 'Marka', 'text', { zorunlu: true }),
  alan('model', 'Model', 'text', { zorunlu: true }),
  alan('ram', 'RAM', 'select', { secenekler: ['4 GB', '8 GB', '16 GB', '32 GB', '64 GB'] }),
  alan('islemci', 'İşlemci', 'text'),
  alan('depolama', 'Depolama', 'text'),
  alan('ekranBoyutu', 'Ekran Boyutu', 'text'),
  alan('garanti', 'Garanti', 'select', { secenekler: ['Var', 'Yok'] }),
  ...ORTAK_SON,
];

const PROFILLER = {
  toplama: TOPLAMA_ALANLARI,
  'marka-pc': TOPLAMA_ALANLARI,
  'all-in-one': TOPLAMA_ALANLARI,
  laptop: LAPTOP_ALANLARI,
  'telefon-apple': [
    alan('model', 'Model', 'text', { zorunlu: true }),
    alan('hafiza', 'Hafıza', 'select', { secenekler: ['64 GB', '128 GB', '256 GB', '512 GB', '1 TB'] }),
    alan('renk', 'Renk', 'text'),
    alan('garanti', 'Garanti', 'select', { secenekler: ['Var', 'Yok', 'Distribütör Garantili'] }),
    ...ORTAK_SON,
  ],
  'telefon-samsung': [
    alan('model', 'Model', 'text', { zorunlu: true }),
    alan('hafiza', 'Hafıza', 'select', { secenekler: ['64 GB', '128 GB', '256 GB', '512 GB'] }),
    alan('renk', 'Renk', 'text'),
    ...ORTAK_SON,
  ],
  'telefon-xiaomi': [
    alan('model', 'Model', 'text', { zorunlu: true }),
    alan('hafiza', 'Hafıza', 'select', { secenekler: ['64 GB', '128 GB', '256 GB'] }),
    ...ORTAK_SON,
  ],
  'telefon-huawei': [
    alan('model', 'Model', 'text', { zorunlu: true }),
    ...ORTAK_SON,
  ],
  'telefon-diger': [
    alan('marka', 'Marka', 'text', { zorunlu: true }),
    alan('model', 'Model', 'text', { zorunlu: true }),
    ...ORTAK_SON,
  ],
  'cep-telefonu': [
    alan('marka', 'Marka', 'select', {
      zorunlu: true,
      secenekler: ['Apple', 'Samsung', 'Xiaomi', 'Huawei', 'Oppo', 'Realme', 'Diğer'],
    }),
    alan('model', 'Model', 'text', { zorunlu: true }),
    alan('hafiza', 'Hafıza', 'select', {
      secenekler: ['32 GB', '64 GB', '128 GB', '256 GB', '512 GB', '1 TB'],
    }),
    alan('renk', 'Renk', 'text'),
    alan('garanti', 'Garanti', 'select', {
      secenekler: ['Var', 'Yok', 'Distribütör Garantili'],
    }),
    ...ORTAK_SON,
  ],
  bilgisayar: [
    alan('urunAltTipi', 'Ürün Tipi', 'select', {
      zorunlu: true,
      secenekler: ['Laptop', 'Masaüstü', 'Tablet', 'Monitör', 'Oyun Konsolu', 'Diğer'],
    }),
    alan('marka', 'Marka', 'text', { zorunlu: true }),
    alan('model', 'Model', 'text'),
    alan('islemci', 'İşlemci', 'text'),
    alan('ram', 'RAM', 'select', { secenekler: ['4 GB', '8 GB', '16 GB', '32 GB', '64 GB'] }),
    alan('depolama', 'Depolama', 'select', {
      secenekler: ['128 GB', '256 GB', '512 GB', '1 TB', '2 TB'],
    }),
    alan('garanti', 'Garanti', 'select', { secenekler: ['Var', 'Yok'] }),
    ...ORTAK_SON,
  ],
  'ev-dekorasyon': [
    alan('urunAltTipi', 'Ürün Tipi', 'select', {
      zorunlu: true,
      secenekler: ['Mobilya', 'Halı', 'Perde', 'Aydınlatma', 'Mutfak Gereçleri', 'Diğer'],
    }),
    alan('marka', 'Marka', 'text'),
    alan('malzeme', 'Malzeme', 'text'),
    alan('olcu', 'Ölçü / Boyut', 'text'),
    ...ORTAK_SON,
  ],
  'ev-elektronigi': [
    alan('urunAltTipi', 'Ürün Tipi', 'select', {
      zorunlu: true,
      secenekler: [
        'Televizyon',
        'Buzdolabı',
        'Çamaşır Makinesi',
        'Bulaşık Makinesi',
        'Klima',
        'Küçük Ev Aleti',
        'Diğer',
      ],
    }),
    alan('marka', 'Marka', 'text', { zorunlu: true }),
    alan('model', 'Model', 'text'),
    alan('garanti', 'Garanti', 'select', { secenekler: ['Var', 'Yok', 'Distribütör Garantili'] }),
    ...ORTAK_SON,
  ],
  giyim: [
    alan('urunAltTipi', 'Ürün Tipi', 'select', {
      zorunlu: true,
      secenekler: ['Giyim', 'Ayakkabı', 'Çanta', 'Saat', 'Takı', 'Aksesuar', 'Diğer'],
    }),
    alan('marka', 'Marka', 'text'),
    alan('beden', 'Beden', 'text'),
    alan('cinsiyet', 'Cinsiyet', 'select', { secenekler: ['Kadın', 'Erkek', 'Unisex', 'Çocuk'] }),
    alan('renk', 'Renk', 'text'),
    ...ORTAK_SON,
  ],
  hobi: [
    alan('urunAltTipi', 'Ürün Tipi', 'select', {
      zorunlu: true,
      secenekler: ['Oyun', 'Müzik Aleti', 'Spor', 'Koleksiyon', 'Kitap', 'Sanat', 'Diğer'],
    }),
    alan('marka', 'Marka', 'text'),
    alan('model', 'Model', 'text'),
    ...ORTAK_SON,
  ],
  'bilgisayar-genel': [
    alan('urunAltTipi', 'Ürün Tipi', 'text'),
    alan('marka', 'Marka', 'text'),
    ...ORTAK_SON,
  ],
  'ikinci-el-genel': [
    alan('marka', 'Marka', 'text'),
    alan('model', 'Model', 'text'),
    ...ORTAK_SON,
  ],
};

export function ikinciElProfilKey(kategoriId, yolIds = []) {
  if (PROFILLER[kategoriId]) return kategoriId;
  if (kategoriId === 'toplama' || yolIds.includes('toplama')) return 'toplama';
  if (kategoriId?.startsWith('laptop-') || yolIds.includes('laptop')) return 'laptop';
  if (yolIds.includes('bilgisayar')) return 'bilgisayar-genel';
  if (yolIds.includes('cep-telefonu')) return 'telefon-diger';
  return 'ikinci-el-genel';
}

export function getIkinciElProfil(secilenKategori) {
  const bilgi = getKategoriById(secilenKategori?.kategoriId);
  const yolBaslik = bilgi?.yolBaslik || secilenKategori?.kategoriEtiket?.split(' › ') || [];
  const yolIds = bilgi?.yolIds || secilenKategori?.kategoriYolu || [];
  const urunTipi = yolBaslik[yolBaslik.length - 1] || 'İkinci El';
  const profilKey = ikinciElProfilKey(secilenKategori?.kategoriId, yolIds);
  const alanlar = PROFILLER[profilKey] || PROFILLER['ikinci-el-genel'];
  let otomatikBaslik = urunTipi;
  if (profilKey === 'laptop' && yolBaslik.length >= 2) {
    otomatikBaslik = `${yolBaslik[yolBaslik.length - 1]} Laptop`;
  }
  return {
    profilKey,
    urunTipi,
    yolBaslik,
    alanlar,
    otomatikBaslik,
  };
}

export function ikinciElBreadcrumb(secilenKategori) {
  const etiket = secilenKategori?.kategoriEtiket || '';
  return etiket ? etiket.split(' › ').map((p) => p.toUpperCase()) : [];
}

/** Firestore detay alanlarına dönüştür */
export function ikinciElDetayNormalize(degerler, profil) {
  return {
    urunTipi: profil.urunTipi,
    ikinciElProfil: profil.profilKey,
    ...degerler,
  };
}
