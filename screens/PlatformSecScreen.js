import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { addIlan } from '../api';
import { colors, radius } from '../constants/theme';

const PLATFORMLAR = [
  { isim: 'Sahibinden', renk: '#FFD700', logo: require('../assets/sahibinden.png') },
  { isim: 'Arabam.com', renk: '#FF4500', logo: require('../assets/arabamcom.png') },
  { isim: 'Letgo', renk: '#6C5CE7', logo: require('../assets/letgo.png') },
  { isim: 'Emlakjet', renk: '#FF6B35', logo: require('../assets/emlakjet.png') },
];

export default function PlatformSecScreen({ navigation, route }) {
  const [secilenler, setSecilenler] = useState([]);
  const [yayinlaniyor, setYayinlaniyor] = useState(false);
  const { yeniIlan } = route.params;

  const platformSec = (platform) => {
    if (secilenler.includes(platform)) {
      setSecilenler(secilenler.filter(p => p !== platform));
    } else {
      setSecilenler([...secilenler, platform]);
    }
  };

  const yayinla = async () => {
    if (secilenler.length === 0) {
      Alert.alert('Hata', 'En az bir platform seçin!');
      return;
    }
    const ilan = yeniIlan || {};
    if (!ilan.kategori || !String(ilan.baslik || '').trim() || !String(ilan.aciklama || '').trim()) {
      Alert.alert('Uyarı', 'İlan bilgileri eksik. Lütfen başlık, açıklama ve kategoriyi doldurun.');
      return;
    }
    const fiyatSayi = Number(String(ilan.fiyat || '').replace(/\D/g, ''));
    if (!Number.isFinite(fiyatSayi) || fiyatSayi <= 0) {
      Alert.alert('Fiyat hatalı', 'Geçerli bir fiyat girilmeden ilan eklenemez.');
      return;
    }
    if (yayinlaniyor) return;
    try {
      setYayinlaniyor(true);
      const tamamlananIlan = { ...ilan, platformlar: secilenler };
      await addIlan(tamamlananIlan);
      navigation.navigate('Yayinla', { ilan: tamamlananIlan });
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'İlan kaydedilemedi. Backend çalışıyor mu kontrol edin.';

      Alert.alert('Yayınlama Hatası', message);
    } finally {
      setYayinlaniyor(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.baslik}>Platform Seçin</Text>
      <Text style={styles.aciklama}>İlanınızı yayınlamak istediğiniz platformları seçin:</Text>

      {PLATFORMLAR.map((platform) => (
        <TouchableOpacity
          key={platform.isim}
          style={[styles.platformKart, secilenler.includes(platform.isim) && { borderColor: platform.renk, borderWidth: 2.5 }]}
          onPress={() => platformSec(platform.isim)}
        >
          <Image source={platform.logo} style={styles.logo} resizeMode="contain" />
          <Text style={styles.platformText}>{platform.isim}</Text>
          <Text style={styles.check}>{secilenler.includes(platform.isim) ? '✅' : '⬜'}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={[styles.yayinlaButon, yayinlaniyor && styles.yayinlaButonDisabled]}
        onPress={yayinla}
        disabled={yayinlaniyor}
      >
        <Text style={styles.yayinlaButonText}>
          {yayinlaniyor ? 'Yayınlanıyor…' : `🚀 Yayınla (${secilenler.length} platform)`}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 20 },
  baslik: { fontSize: 22, fontWeight: '700', marginBottom: 5, color: colors.text },
  aciklama: { color: colors.textSecondary, marginBottom: 20 },
  platformKart: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 15,
    borderRadius: radius.md,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: { width: 50, height: 50, marginRight: 15, borderRadius: 8 },
  platformText: { fontSize: 16, fontWeight: '600', flex: 1, color: colors.text },
  check: { fontSize: 20 },
  yayinlaButon: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: radius.md,
    alignItems: 'center',
    marginTop: 10,
  },
  yayinlaButonDisabled: { opacity: 0.6 },
  yayinlaButonText: { color: colors.primaryText, fontSize: 16, fontWeight: '700' },
});