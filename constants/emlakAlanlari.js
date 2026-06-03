import { getKategoriById } from './kategoriler';

const ISITMA = [
  'Yok',
  'Soba',
  'Doğalgaz Sobası',
  'Kat Kaloriferi',
  'Merkezi',
  'Merkezi (Pay Ölçer)',
  'Kombi (Doğalgaz)',
  'Kombi (Elektrik)',
  'Klima',
  'Fancoil Ünite',
  'Jeotermal',
  'Güneş Enerjisi',
  'VRV',
];

const ODA = ['Stüdyo (1+0)', '1+0', '1+1', '2+0', '2+1', '3+0', '3+1', '3,5+1', '4+0', '4+1', '4,5+1', '5+1', '5+2', '6+1', '6+2', '7+1', '7+2', '8+1', '8+2', '8+3', '9+1', '9+2', '9+3', '10 Üzeri'];

const MUTFAK = ['Kapalı', 'Açık (Amerikan)', 'Mutfak Yok'];
const BALKON = ['Var', 'Yok'];
const ASANSOR = ['Var', 'Yok'];
const OTOPARK = ['Açık Otopark', 'Kapalı Otopark', 'Açık & Kapalı Otopark', 'Yok'];
const EVET_HAYIR = ['Evet', 'Hayır'];
const KULLANIM = ['Boş', 'Kiracılı', 'Mal Sahibi Oturuyor'];
const TAPU = ['Kat Mülkiyetli', 'Kat İrtifaklı', 'Arsa Tapulu', 'Hisseli Tapulu', 'Yurt Dışı Tapulu', 'Tapu Kaydı Yok'];
const KIMDEN = ['Sahibinden', 'Emlak Ofisinden', 'İnşaat Firmasından', 'Bankadan'];
const EKB = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'Yok'];

const KAT = ['Bodrum', 'Zemin Kat', 'Giriş Katı', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21+'];

function alan(key, label, tip, ek = {}) {
  return { key, label, tip, ...ek };
}

const ORTAK_UST = [
  alan('metrekareBrut', 'm² (Brüt)', 'number', { zorunlu: true, keyboard: 'numeric' }),
  alan('metrekareNet', 'm² (Net)', 'number', { keyboard: 'numeric' }),
  alan('odaSayisi', 'Oda Sayısı', 'select', { zorunlu: true, secenekler: ODA }),
  alan('binaYasi', 'Bina Yaşı', 'number', { keyboard: 'numeric' }),
];

const ORTAK_KONUT = [
  ...ORTAK_UST,
  alan('kat', 'Bulunduğu Kat', 'select', { secenekler: KAT, profil: 'apartman' }),
  alan('katSayisi', 'Kat Sayısı', 'number', { keyboard: 'numeric', profil: 'apartman' }),
  alan('isitma', 'Isıtma', 'select', { zorunlu: true, secenekler: ISITMA }),
  alan('banyoSayisi', 'Banyo Sayısı', 'select', { secenekler: ['1', '2', '3', '4', '5', '6+'] }),
  alan('mutfak', 'Mutfak', 'select', { secenekler: MUTFAK }),
  alan('balkon', 'Balkon', 'select', { secenekler: BALKON }),
  alan('asansor', 'Asansör', 'select', { zorunlu: true, secenekler: ASANSOR, profil: 'apartman' }),
  alan('otopark', 'Otopark', 'select', { zorunlu: true, secenekler: OTOPARK }),
  alan('esyali', 'Eşyalı', 'select', { secenekler: EVET_HAYIR }),
  alan('kullanimDurumu', 'Kullanım Durumu', 'select', { zorunlu: true, secenekler: KULLANIM }),
  alan('aidat', 'Aidat (TL)', 'number', { keyboard: 'numeric' }),
  alan('krediyeUygun', 'Krediye Uygun', 'select', { secenekler: EVET_HAYIR }),
  alan('enerjiKimlik', 'Enerji Kimlik Belgesi', 'select', { secenekler: EKB }),
  alan('tapuDurumu', 'Tapu Durumu', 'select', { zorunlu: true, secenekler: TAPU }),
  alan('tasinmazNo', 'Taşınmaz Numarası', 'text'),
  alan('kimden', 'Kimden', 'select', { secenekler: KIMDEN, varsayilan: 'Sahibinden' }),
  alan('takasli', 'Takaslı', 'select', { zorunlu: true, secenekler: EVET_HAYIR }),
];

const PROFILLER = {
  'konut-apartman': ORTAK_KONUT,
  'konut-mustakil': ORTAK_KONUT.filter((a) => a.profil !== 'apartman'),
  'konut-genel': [
    alan('metrekareBrut', 'm² (Brüt)', 'number', { zorunlu: true, keyboard: 'numeric' }),
    alan('odaSayisi', 'Oda Sayısı', 'select', { secenekler: ODA }),
    alan('isitma', 'Isıtma', 'select', { secenekler: ISITMA }),
    alan('tapuDurumu', 'Tapu Durumu', 'select', { zorunlu: true, secenekler: TAPU }),
    alan('kimden', 'Kimden', 'select', { secenekler: KIMDEN, varsayilan: 'Sahibinden' }),
  ],
  arsa: [
    alan('metrekareBrut', 'm²', 'number', { zorunlu: true, keyboard: 'numeric' }),
    alan('imarDurumu', 'İmar Durumu', 'select', {
      zorunlu: true,
      secenekler: ['Konut', 'Ticari', 'Sanayi', 'Tarla', 'Bağ-Bahçe', 'Ada'],
    }),
    alan('adaNo', 'Ada No', 'text'),
    alan('parselNo', 'Parsel No', 'text'),
    alan('tapuDurumu', 'Tapu Durumu', 'select', { zorunlu: true, secenekler: TAPU }),
    alan('kimden', 'Kimden', 'select', { secenekler: KIMDEN, varsayilan: 'Sahibinden' }),
    alan('takasli', 'Takaslı', 'select', { secenekler: EVET_HAYIR }),
  ],
  'is-yeri': [
    alan('metrekareBrut', 'm² (Brüt)', 'number', { zorunlu: true, keyboard: 'numeric' }),
    alan('bolumSayisi', 'Bölüm & Oda Sayısı', 'text'),
    alan('kat', 'Bulunduğu Kat', 'select', { secenekler: KAT }),
    alan('isitma', 'Isıtma', 'select', { secenekler: ISITMA }),
    alan('tapuDurumu', 'Tapu Durumu', 'select', { zorunlu: true, secenekler: TAPU }),
    alan('kimden', 'Kimden', 'select', { secenekler: KIMDEN, varsayilan: 'Sahibinden' }),
  ],
  bina: [
    alan('metrekareBrut', 'm² (Brüt)', 'number', { zorunlu: true, keyboard: 'numeric' }),
    alan('katSayisi', 'Kat Sayısı', 'number', { keyboard: 'numeric' }),
    alan('binaYasi', 'Bina Yaşı', 'number', { keyboard: 'numeric' }),
    alan('tapuDurumu', 'Tapu Durumu', 'select', { zorunlu: true, secenekler: TAPU }),
    alan('kimden', 'Kimden', 'select', { secenekler: KIMDEN, varsayilan: 'Sahibinden' }),
  ],
  'devre-mulk': [
    alan('metrekareBrut', 'm²', 'number', { keyboard: 'numeric' }),
    alan('donem', 'Devre Dönemi', 'text'),
    alan('tapuDurumu', 'Tapu Durumu', 'select', { secenekler: TAPU }),
    alan('kimden', 'Kimden', 'select', { secenekler: KIMDEN, varsayilan: 'Sahibinden' }),
  ],
  'turistik-tesis': [
    alan('metrekareBrut', 'm² (Brüt)', 'number', { zorunlu: true, keyboard: 'numeric' }),
    alan('odaSayisi', 'Oda Sayısı', 'number', { keyboard: 'numeric' }),
    alan('yatakSayisi', 'Yatak Sayısı', 'number', { keyboard: 'numeric' }),
    alan('tapuDurumu', 'Tapu Durumu', 'select', { secenekler: TAPU }),
    alan('kimden', 'Kimden', 'select', { secenekler: KIMDEN, varsayilan: 'Sahibinden' }),
  ],
  'konut-projeleri': [
    alan('metrekareBrut', 'm² (Brüt)', 'number', { keyboard: 'numeric' }),
    alan('projeAdi', 'Proje Adı', 'text', { zorunlu: true }),
    alan('teslimTarihi', 'Teslim Tarihi', 'text'),
    alan('kimden', 'Kimden', 'select', { secenekler: KIMDEN, varsayilan: 'İnşaat Firmasından' }),
  ],
  'emlak-genel': [
    alan('metrekareBrut', 'm²', 'number', { keyboard: 'numeric' }),
    alan('kimden', 'Kimden', 'select', { secenekler: KIMDEN, varsayilan: 'Sahibinden' }),
  ],
};

const APARTMAN_TIPLER = new Set(['daire', 'rezidans', 'yali-dairesi', 'kooperatif']);
const MUSTAKIL_TIPLER = new Set(['mustakil-ev', 'villa', 'ciftlik-evi', 'kosk-konak', 'yali', 'yazlik']);

export function emlakProfilKey(kategoriId, yolIds = []) {
  const id = String(kategoriId || '').replace(/^kiralik-/, '');
  if (kategoriId === 'arsa') return 'arsa';
  if (kategoriId === 'is-yeri') return 'is-yeri';
  if (kategoriId === 'bina') return 'bina';
  if (kategoriId === 'devre-mulk') return 'devre-mulk';
  if (kategoriId === 'turistik-tesis') return 'turistik-tesis';
  if (kategoriId === 'konut-projeleri') return 'konut-projeleri';
  if (kategoriId === 'turistik-gunluk' || kategoriId === 'devren-satilik-konut') return 'konut-genel';
  if (APARTMAN_TIPLER.has(id)) return 'konut-apartman';
  if (MUSTAKIL_TIPLER.has(id)) return 'konut-mustakil';
  if (yolIds.includes('konut')) return 'konut-genel';
  return 'emlak-genel';
}

export function getEmlakProfil(secilenKategori) {
  const bilgi = getKategoriById(secilenKategori?.kategoriId);
  const yolBaslik = bilgi?.yolBaslik || secilenKategori?.kategoriEtiket?.split(' › ') || [];
  const yolIds = bilgi?.yolIds || secilenKategori?.kategoriYolu || [];
  const emlakTipi = yolBaslik[yolBaslik.length - 1] || 'Emlak';
  const ilanTuru =
    yolBaslik.find((b) =>
      ['Satılık', 'Kiralık', 'Turistik Günlük Kiralık', 'Devren Satılık Konut'].includes(b)
    ) || yolBaslik[1] || '';
  const profilKey = emlakProfilKey(secilenKategori?.kategoriId, yolIds);
  const alanlar = PROFILLER[profilKey] || PROFILLER['emlak-genel'];
  return {
    profilKey,
    emlakTipi,
    ilanTuru,
    yolBaslik,
    alanlar,
    otomatikBaslik: [ilanTuru, emlakTipi].filter(Boolean).join(' '),
  };
}

export function emlakBreadcrumb(secilenKategori) {
  const etiket = secilenKategori?.kategoriEtiket || '';
  return etiket ? etiket.split(' › ').map((p) => p.toUpperCase()) : [];
}

/** Firestore detay alanlarına dönüştür */
export function emlakDetayNormalize(degerler, profil) {
  const detay = {
    emlakTipi: profil.emlakTipi,
    ilanTuru: profil.ilanTuru,
    emlakProfil: profil.profilKey,
    ...degerler,
  };
  if (degerler.metrekareBrut) detay.metrekare = degerler.metrekareBrut;
  return detay;
}
