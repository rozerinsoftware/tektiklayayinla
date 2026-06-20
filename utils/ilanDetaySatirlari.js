import { formatKonumEtiket } from './konum';

const ALAN_ETIKETLERI = {
  ilanTuru: 'İlan Türü',
  emlakTipi: 'Emlak Tipi',
  kategori: 'Kategori',
  metrekare: 'Metrekare',
  metrekareBrut: 'm² (Brüt)',
  metrekareNet: 'm² (Net)',
  odaSayisi: 'Oda Sayısı',
  bolumSayisi: 'Bölüm & Oda Sayısı',
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
  yatakSayisi: 'Yatak Sayısı',
  donem: 'Devre Dönemi',
  projeAdi: 'Proje Adı',
  teslimTarihi: 'Teslim Tarihi',
  tapuDurumu: 'Tapu Durumu',
  tasinmazNo: 'Taşınmaz Numarası',
  kimden: 'Kimden',
  takasli: 'Takaslı',
  takas: 'Takaslı',
  imarDurumu: 'İmar Durumu',
  adaNo: 'Ada No',
  parselNo: 'Parsel No',
  // Vasıta
  aracTipi: 'Araç Tipi',
  marka: 'Marka',
  model: 'Model',
  seri: 'Seri',
  donanim: 'Donanım',
  yil: 'Yıl',
  kilometre: 'KM',
  yakit: 'Yakıt Tipi',
  kasaTipi: 'Kasa Tipi',
  vites: 'Vites',
  motorHacmi: 'Motor Hacmi',
  motorGucu: 'Motor Gücü',
  aracDurumu: 'Araç Durumu',
  plaka: 'Plaka / Uyruk',
  sasi: 'Şasi',
  // İkinci el
  urunTipi: 'Ürün Tipi',
  urunAltTipi: 'Tür',
  hafiza: 'Hafıza',
  ram: 'RAM',
  islemci: 'İşlemci',
  depolama: 'Depolama',
  ekranBoyutu: 'Ekran Boyutu',
  ekranKarti: 'Ekran Kartı',
  kasa: 'Kasa',
  hdd: 'Harddisk Kapasitesi',
  ssd: 'SSD Kapasitesi',
  malzeme: 'Malzeme',
  olcu: 'Ölçü / Boyut',
  beden: 'Beden',
  cinsiyet: 'Cinsiyet',
  kargo: 'Teslimat',
  // İş makineleri
  makineTipi: 'Makine Tipi',
  parcaTipi: 'Parça Tipi',
  uyumluMarka: 'Uyumlu Marka',
  durum: 'Durum',
  calismaSaati: 'Çalışma Saati',
  renk: 'Renk',
  garanti: 'Garanti',
};

const KATEGORI_ALAN_SIRASI = {
  emlak: [
    'ilanTuru', 'emlakTipi', 'metrekareBrut', 'metrekareNet', 'metrekare', 'odaSayisi', 'bolumSayisi',
    'binaYasi', 'kat', 'katSayisi', 'isitma', 'banyoSayisi', 'mutfak', 'balkon', 'asansor',
    'otopark', 'esyali', 'kullanimDurumu', 'aidat', 'krediyeUygun', 'enerjiKimlik',
    'yatakSayisi', 'donem', 'projeAdi', 'teslimTarihi', 'tapuDurumu', 'tasinmazNo',
    'kimden', 'takasli', 'imarDurumu', 'adaNo', 'parselNo',
  ],
  vasita: [
    'aracTipi', 'marka', 'seri', 'model', 'donanim', 'yil', 'yakit', 'kasaTipi', 'vites',
    'motorHacmi', 'motorGucu', 'kilometre', 'aracDurumu', 'durum', 'renk', 'plaka', 'sasi',
    'kimden', 'takasli', 'garanti',
  ],
  'ikinci-el': [
    'urunTipi', 'urunAltTipi', 'marka', 'model', 'hafiza', 'ram', 'islemci', 'depolama',
    'ekranBoyutu', 'ekranKarti', 'kasa', 'hdd', 'ssd', 'malzeme', 'olcu', 'beden', 'cinsiyet',
    'renk', 'durum', 'garanti', 'kimden', 'takas', 'kargo',
  ],
  'is-makineleri': [
    'makineTipi', 'marka', 'model', 'yil', 'calismaSaati', 'parcaTipi', 'uyumluMarka',
    'durum', 'kimden', 'takasli', 'takas',
  ],
  hizmet: ['kimden'],
};

// `metrekare`, kullanıcı ilanlarında `metrekareBrut`'un kopyası olarak da yazılır.
// İkisi birden doluysa tekrar satır oluşmaması için alias'ı gizle.
function alanGizli(ilan, key) {
  if (key === 'metrekare' && String(ilan?.metrekareBrut ?? '').trim()) return true;
  return false;
}

function alanDeger(ilan, key) {
  if (alanGizli(ilan, key)) return '';
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
