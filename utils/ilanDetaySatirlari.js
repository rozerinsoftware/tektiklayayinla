import { formatKonumEtiket } from './konum';

const ALAN_ETIKETLERI = {
  ilanTuru: 'İlan Türü',
  emlakTipi: 'Emlak Tipi',
  kategori: 'Kategori',
  metrekare: 'Metrekare',
  metrekareBrut: 'm² (Brüt)',
  metrekareNet: 'm² (Net)',
  odaSayisi: 'Oda Sayısı',
  binaYasi: 'Bina Yaşı',
  kat: 'Bulunduğu Kat',
  katSayisi: 'Kat Sayısı',
  isitma: 'Isıtma',
  banyoSayisi: 'Banyo Sayısı',
  mutfak: 'Mutfak',
  balkon: 'Balkon',
  asansor: 'Asansör',
  otopark: 'Otopark',
  esyali: 'Eşyalı',
  kullanimDurumu: 'Kullanım Durumu',
  aidat: 'Aidat (TL)',
  krediyeUygun: 'Krediye Uygun',
  enerjiKimlik: 'Enerji Kimlik Belgesi',
  tapuDurumu: 'Tapu Durumu',
  tasinmazNo: 'Taşınmaz Numarası',
  kimden: 'Kimden',
  takasli: 'Takaslı',
  imarDurumu: 'İmar Durumu',
  adaNo: 'Ada No',
  parselNo: 'Parsel No',
  aracTipi: 'Araç Tipi',
  marka: 'Marka',
  model: 'Model',
  seri: 'Seri',
  yil: 'Yıl',
  kilometre: 'KM',
  yakit: 'Yakıt Tipi',
  vites: 'Vites',
  urunTipi: 'Ürün Tipi',
  durum: 'Durum',
  calismaSaati: 'Çalışma Saati',
  renk: 'Renk',
  garanti: 'Garanti',
};

const KATEGORI_ALAN_SIRASI = {
  emlak: [
    'ilanTuru', 'emlakTipi', 'metrekareBrut', 'metrekareNet', 'odaSayisi', 'binaYasi',
    'kat', 'katSayisi', 'isitma', 'banyoSayisi', 'mutfak', 'balkon', 'asansor', 'otopark',
    'esyali', 'kullanimDurumu', 'aidat', 'krediyeUygun', 'enerjiKimlik', 'tapuDurumu',
    'tasinmazNo', 'kimden', 'takasli', 'imarDurumu', 'adaNo', 'parselNo',
  ],
  vasita: ['marka', 'seri', 'model', 'yil', 'yakit', 'vites', 'kilometre', 'durum', 'kimden', 'takasli', 'renk', 'garanti'],
  'ikinci-el': ['urunTipi', 'marka', 'model', 'durum', 'kimden'],
  'is-makineleri': ['marka', 'model', 'yil', 'calismaSaati', 'kimden', 'takasli'],
  hizmet: ['kimden'],
};

function alanDeger(ilan, key) {
  const ham = ilan?.[key];
  if (ham == null || !String(ham).trim()) return '';
  if (key === 'kilometre' || key === 'calismaSaati') {
    const rakam = String(ham).replace(/\D/g, '');
    return rakam ? Number(rakam).toLocaleString('tr-TR') : String(ham);
  }
  return String(ham).trim();
}

export function ilanKonumTam(ilan) {
  const k = ilan?.konum;
  if (!k) return '';
  const parcalar = [k.il, k.ilce, k.mahalle].filter(Boolean);
  if (parcalar.length) return parcalar.join(', ');
  return formatKonumEtiket(k);
}

export function ilanKategoriYoluMetni(ilan) {
  const etiket = ilan?.kategoriEtiket || ilan?.kategori || '';
  if (!etiket) return '';
  return etiket.replace(/ › /g, ' > ');
}

export function ilanTarihiMetni(ilan) {
  const ts = ilan?.createdAt;
  if (!ts) return '—';
  let tarih;
  if (typeof ts?.toDate === 'function') tarih = ts.toDate();
  else if (ts?.seconds) tarih = new Date(ts.seconds * 1000);
  else if (typeof ts === 'number') tarih = new Date(ts);
  else return '—';
  if (Number.isNaN(tarih.getTime())) return '—';
  return tarih.toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function ilanNoMetni(ilan) {
  if (!ilan?.id) return '—';
  return String(ilan.id).replace(/\D/g, '').slice(-10) || String(ilan.id);
}

/** Sahibinden tarzı İlan Bilgileri tablosu */
export function ilanBilgiTablosu(ilan, formatFiyat) {
  const satirlar = [
    { label: 'Fiyat', value: formatFiyat(ilan.fiyat), vurgu: 'fiyat' },
    { label: 'İlan Tarihi', value: ilanTarihiMetni(ilan) },
    { label: 'İlan No', value: ilanNoMetni(ilan), vurgu: 'ilanNo' },
  ];

  const kok = ilan?.kategoriKok;
  const kategoriEtiket = ilan?.kategoriEtiket || ilan?.kategori;
  if (kategoriEtiket) {
    satirlar.push({ label: 'Kategori', value: kategoriEtiket.replace(/ › /g, ' > ') });
  }

  const sira = KATEGORI_ALAN_SIRASI[kok] || Object.keys(ALAN_ETIKETLERI);
  const eklenen = new Set(satirlar.map((s) => s.label));

  sira.forEach((key) => {
    const deger = alanDeger(ilan, key);
    if (!deger) return;
    const label = ALAN_ETIKETLERI[key] || key;
    if (eklenen.has(label)) return;
    satirlar.push({ label, value: deger });
    eklenen.add(label);
  });

  // Kalan detay alanları (yayınlanmış ama sırada olmayan)
  Object.keys(ALAN_ETIKETLERI).forEach((key) => {
    const deger = alanDeger(ilan, key);
    if (!deger) return;
    const label = ALAN_ETIKETLERI[key];
    if (eklenen.has(label)) return;
    satirlar.push({ label, value: deger });
    eklenen.add(label);
  });

  return satirlar;
}
