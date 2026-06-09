/** Rastgele / alakasız stok foto (picsum seed vb.) */
import { ornekIlanFotograflar, ORNEK_ESKI_BASLIKLAR } from '../constants/ornekIlanFotolari';

export function kotuStokFotoUrl(url) {
  if (!url || typeof url !== 'string') return false;
  return (
    url.includes('picsum.photos') ||
    url.includes('pexels.com') ||
    url.includes('unsplash.com') ||
    url.includes('placehold.co') ||
    url.includes('placeholder.com')
  );
}

/** Örnek ilanlara özel sabit Wikimedia demo fotoğrafı mı */
export function ornekDemoFotoUrl(url) {
  if (!url || typeof url !== 'string') return false;
  return (
    url.includes('commons.wikimedia.org') || url.includes('upload.wikimedia.org')
  );
}

/** Vitrinde gösterilecek kapak fotoğrafı (Cloudinary, Wikimedia demo veya kullanıcı yüklemesi) */
export function gecerliKapakFoto(fotograflar) {
  const url = Array.isArray(fotograflar) ? fotograflar[0] : null;
  if (!url || typeof url !== 'string') return null;
  if (!url.startsWith('http://') && !url.startsWith('https://')) return null;
  if (kotuStokFotoUrl(url)) return null;
  // Wikimedia 800px thumb çoğu dosyada 400 döner — 960px kullanın
  if (url.includes('upload.wikimedia.org') && url.includes('/800px-')) return null;
  return url;
}

/** İlan kartı — Firestore boş/eskiyse örnek foto yedekle */
export function ilanKapakFotoUrl(ilan) {
  const mevcut = gecerliKapakFoto(ilan?.fotograflar);
  if (mevcut) return mevcut;
  if (!ilan?.ornek && !ilan?.ornekKey) return null;
  const key =
    ilan.ornekKey ||
    (ilan.baslik && ORNEK_ESKI_BASLIKLAR[ilan.baslik]) ||
    null;
  if (key) return gecerliKapakFoto(ornekIlanFotograflar(key));
  return null;
}

export const ILAN_FOTO_HEADERS = {
  'User-Agent': 'TekTiklaYayinla/1.0 (React Native; demo)',
};

/** Eski/bozuk demo foto URL — yeniden yüklenmeli */
export function ornekFotoGuncellenmeli(url) {
  if (!url || typeof url !== 'string') return true;
  if (kotuStokFotoUrl(url)) return true;
  if (url.includes('Special:FilePath') || url.includes('Special:Redirect')) return true;
  if (url.includes('upload.wikimedia.org') && url.includes('/800px-')) return true;
  if (!url.includes('upload.wikimedia.org') && !url.includes('res.cloudinary.com')) return true;
  return false;
}
