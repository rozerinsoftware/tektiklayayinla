import { Alert, Linking, Platform } from 'react-native';
import * as Location from 'expo-location';

/** Sahibinden tarzı: emlak, vasıta, ikinci el ve iş makinelerinde konum zorunlu */
export function konumZorunluMu(kategoriKok) {
  return ['emlak', 'vasita', 'ikinci-el', 'is-makineleri'].includes(kategoriKok);
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
    throw new Error('Konum izni verilmedi. Ayarlardan konuma izin verin.');
  }

  const pos = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });

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
  const adaylar = Platform.select({
    ios: [
      `maps:0,0?q=${etiket}&ll=${lat},${lng}`,
      `https://maps.apple.com/?ll=${lat},${lng}&q=${etiket}`,
    ],
    android: [
      `geo:0,0?q=${lat},${lng}(${etiket})`,
      `geo:${lat},${lng}?q=${lat},${lng}`,
      `google.navigation:q=${lat},${lng}`,
    ],
    default: [],
  });

  for (const url of adaylar) {
    try {
      await Linking.openURL(url);
      return;
    } catch {
      // sıradaki şemayı dene
    }
  }

  Alert.alert(
    'Harita açılamadı',
    Platform.OS === 'android'
      ? 'Google Maps yüklü değil veya emülatörde harita uygulaması yok. Play Store\'dan Google Maps kurun.'
      : 'Harita uygulaması açılamadı.'
  );
}
