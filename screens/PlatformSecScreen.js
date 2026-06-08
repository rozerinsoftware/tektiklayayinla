import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { publishIlan } from '../api';
import { PrimaryButton, SectionTitle } from '../components/ui';
import { colors, radius, shadow, spacing } from '../constants/theme';

const PLATFORMLAR = [
  { isim: 'Sahibinden', renk: '#FFD700', logo: require('../assets/sahibinden.png') },
  { isim: 'Arabam.com', renk: '#FF4500', logo: require('../assets/arabamcom.png') },
  { isim: 'Letgo', renk: '#6C5CE7', logo: require('../assets/letgo.png') },
  { isim: 'Emlakjet', renk: '#FF6B35', logo: require('../assets/emlakjet.png') },
];

export default function PlatformSecScreen({ navigation, route }) {
  const [secilenler, setSecilenler] = useState([]);
  const [yayinlaniyor, setYayinlaniyor] = useState(false);
  const { yeniIlan, duzenlemeId } = route.params;

  const platformSec = (platform) => {
    setSecilenler((prev) =>
      prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]
    );
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
      const kayit = await publishIlan(tamamlananIlan, secilenler, { duzenlemeId });
      navigation.navigate('Yayinla', {
        ilan: { ...kayit, id: kayit.id || duzenlemeId, platformlar: secilenler },
        guncelleme: !!duzenlemeId,
      });
    } catch (error) {
      if (error?.kismiBasari && error?.ilanId) {
        navigation.navigate('Yayinla', {
          ilan: {
            ...(error.kayit || ilan),
            id: error.ilanId,
            platformlar: secilenler,
          },
          guncelleme: !!duzenlemeId,
          fotoUyari: error.message,
        });
        return;
      }
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'İlan kaydedilemedi. İnternet bağlantınızı ve e-posta onayınızı kontrol edin.';
      Alert.alert('Yayınlama Hatası', message);
    } finally {
      setYayinlaniyor(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <SectionTitle
        icon="globe-outline"
        title="Platform Seçin"
        subtitle="İlanınızı yayınlamak istediğiniz siteleri işaretleyin"
      />

      {PLATFORMLAR.map((platform) => {
        const secili = secilenler.includes(platform.isim);
        return (
          <TouchableOpacity
            key={platform.isim}
            style={[styles.platformKart, secili && { borderColor: platform.renk, borderWidth: 2 }]}
            onPress={() => platformSec(platform.isim)}
            activeOpacity={0.85}
          >
            <Image source={platform.logo} style={styles.logo} resizeMode="contain" />
            <Text style={styles.platformText}>{platform.isim}</Text>
            <View style={[styles.checkKutu, secili && { backgroundColor: platform.renk }]}>
              <Ionicons
                name={secili ? 'checkmark' : 'ellipse-outline'}
                size={secili ? 20 : 22}
                color={secili ? '#fff' : colors.textMuted}
              />
            </View>
          </TouchableOpacity>
        );
      })}

      <PrimaryButton
        title={yayinlaniyor ? 'Yayınlanıyor…' : `Yayınla (${secilenler.length} platform)`}
        icon="rocket-outline"
        onPress={yayinla}
        loading={yayinlaniyor}
        disabled={secilenler.length === 0}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: 40 },
  platformKart: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    ...shadow.card,
  },
  logo: { width: 48, height: 48, marginRight: spacing.md, borderRadius: radius.sm },
  platformText: { fontSize: 16, fontWeight: '700', flex: 1, color: colors.text },
  checkKutu: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
