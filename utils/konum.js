import { Alert, Linking, Platform } from 'react-native';
import * as Location from 'expo-location';

/** Tüm ilan türlerinde konum zorunlu (elden teslim / yakınlık / harita) */
export function konumZorunluMu(kategoriKok) {
  return Boolean(kategoriKok);
}

/** GPS yoksa veya emülatörde manuel seçim için hazır il/ilçe noktaları */
export const KONUM_SECENEKLERI = [
  { etiket: 'Kadıköy, İstanbul', latitude: 41.015137, longitude: 28.97953, il: 'İstanbul', ilce: 'Kadıköy' },
  { etiket: 'Beşiktaş, İstanbul', latitude: 41.0422, longitude: 29.0067, il: 'İstanbul', ilce: 'Beşiktaş' },
  { etiket: 'Üsküdar, İstanbul', latitude: 41.0234, longitude: 29.0152, il: 'İstanbul', ilce: 'Üsküdar' },
  { etiket: 'Ataşehir, İstanbul', latitude: 40.9923, longitude: 29.1244, il: 'İstanbul', ilce: 'Ataşehir' },
  { etiket: 'Çankaya, Ankara', latitude: 39.9208, longitude: 32.8541, il: 'Ankara', ilce: 'Çankaya' },
  { etiket: 'Bornova, İzmir', latitude: 38.4237, longitude: 27.1428, il: 'İzmir', ilce: 'Bornova' },
  { etiket: 'Bodrum, Muğla', latitude: 37.0344, longitude: 27.4305, il: 'Muğla', ilce: 'Bodrum' },
  { etiket: 'Kepez, Antalya', latitude: 36.8969, longitude: 30.7133, il: 'Antalya', ilce: 'Kepez' },
  { etiket: 'Gaziantep', latitude: 37.0662, longitude: 37.3833, il: 'Gaziantep', ilce: 'Şehitkamil' },
  { etiket: 'Eskişehir', latitude: 39.7767, longitude: 30.5206, il: 'Eskişehir', ilce: 'Odunpazarı' },
];

export function konumSecenegiOlustur(secenek) {
  return {
    latitude: secenek.latitude,
    longitude: secenek.longitude,
    il: secenek.il || '',
    ilce: secenek.ilce || '',
    mahalle: '',
    etiket: secenek.etiket,
  };
}

export function formatKonumEtiket(konum) {
  if (!konum) return '';
  if (konum.etiket) return konum.etiket;
  const parcalar = [konum.mahalle, konum.ilce, konum.il].filter(Boolean);
  return parcalar.join(', ');
}

function geocodeSonucuIsle(results, coords) {
  const ilk = results?.[0];
  if (!ilk) {
    return {
      latitude: coords.latitude,
      longitude: coords.longitude,
      il: '',
      ilce: '',
      mahalle: '',
      etiket: `${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)}`,
    };
  }
  const il =
    ilk.city ||
    ilk.subregion ||
    ilk.region ||
    '';
  const ilce = ilk.district || ilk.subregion || '';
  const mahalle = ilk.street || ilk.name || '';
  const etiket = [mahalle, ilce, il].filter(Boolean).join(', ') || formatKonumEtiket({ il, ilce, mahalle });
  return {
    latitude: coords.latitude,
    longitude: coords.longitude,
    il,
    ilce,
    mahalle,
    etiket,
  };
}

export async function mevcutKonumuAl() {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Konum izni verilmedi. Ayarlardan izin verin veya listeden il/ilçe seçin.');
  }

  let pos = await Location.getLastKnownPositionAsync();
  if (!pos) {
    pos = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
      timeout: 12000,
    });
  }

  const coords = {
    latitude: pos.coords.latitude,
    longitude: pos.coords.longitude,
  };

  try {
    const results = await Location.reverseGeocodeAsync(coords);
    return geocodeSonucuIsle(results, coords);
  } catch {
    return geocodeSonucuIsle([], coords);
  }
}

function koordinatSayiyaCevir(deger) {
  if (typeof deger === 'number' && Number.isFinite(deger)) return deger;
  const parsed = parseFloat(String(deger ?? '').trim().replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : NaN;
}

async function urlAc(url, { tarayici = false } = {}) {
  try {
    if (!tarayici) {
      const acilabilir = await Linking.canOpenURL(url);
      if (!acilabilir) return false;
    }
    await Linking.openURL(url);
    return true;
  } catch {
    return false;
  }
}

function koordinatGecerli(konum) {
  const lat = koordinatSayiyaCevir(konum?.latitude);
  const lng = koordinatSayiyaCevir(konum?.longitude);
  return !Number.isNaN(lat) && !Number.isNaN(lng) ? { lat, lng } : null;
}

/** İlan detayı — OpenStreetMap önizleme görseli */
export function konumStatikHaritaUrl(konum, { genislik = 640, yukseklik = 360 } = {}) {
  const koord = koordinatGecerli(konum);
  if (!koord) return null;
  const { lat, lng } = koord;
  return `https://staticmap.openstreetmap.de/staticmap.php?center=${lat},${lng}&zoom=15&size=${genislik}x${yukseklik}&markers=${lat},${lng},red-pushpin`;
}

export async function konumHaritadaAc(konum) {
  const lat = koordinatSayiyaCevir(konum?.latitude);
  const lng = koordinatSayiyaCevir(konum?.longitude);

  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    Alert.alert(
      'Konum hatalı',
      'Koordinatlar okunamadı. Firebase\'de latitude ve longitude sayı (çift) olmalı.'
    );
    return;
  }

  const etiket = encodeURIComponent(konum?.etiket || 'Konum');
  // Google Maps mobil sayfası intent:// yönlendirmesi yapar — emülatör WebView'da patlar.
  // OpenStreetMap tarayıcıda doğrudan açılır (jüri / demo için güvenilir).
  const tarayiciHarita = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}`;

  const adaylar = [
    ...(Platform.select({
      ios: [`maps:0,0?q=${etiket}&ll=${lat},${lng}`, `https://maps.apple.com/?ll=${lat},${lng}&q=${etiket}`],
      android: [`geo:0,0?q=${lat},${lng}(${etiket})`, `geo:${lat},${lng}?q=${lat},${lng}`],
      default: [],
    }) || []),
    tarayiciHarita,
  ];

  for (let i = 0; i < adaylar.length; i += 1) {
    const tarayici = adaylar[i].startsWith('https://');
    if (await urlAc(adaylar[i], { tarayici })) return;
  }

  Alert.alert('Harita açılamadı', `${konum?.etiket || 'Konum'}\n${lat.toFixed(5)}, ${lng.toFixed(5)}`);
}
