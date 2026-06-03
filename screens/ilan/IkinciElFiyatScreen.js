import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import IlanBreadcrumb from '../../components/ilan/IlanBreadcrumb';
import { AppInput, PrimaryButton } from '../../components/ui';
import { colors, spacing } from '../../constants/theme';
import { ikinciElBreadcrumb } from '../../constants/ikinciElAlanlari';

export default function IkinciElFiyatScreen({ navigation, route }) {
  const { secilenKategori, taslakIlan, adim = 5, toplamAdim = 6, duzenlemeId } = route.params || {};
  const breadcrumb = [...ikinciElBreadcrumb(secilenKategori), 'FİYAT'];

  const [fiyat, setFiyat] = useState(String(taslakIlan?.fiyat || ''));
  const [pazarlik, setPazarlik] = useState(taslakIlan?.pazarlikAcik !== false);
  const [minTeklif, setMinTeklif] = useState(String(taslakIlan?.minTeklif || ''));

  const devamEt = () => {
    const fiyatSayi = Number(fiyat.replace(/\D/g, ''));
    if (!Number.isFinite(fiyatSayi) || fiyatSayi < 1) {
      Alert.alert('Fiyat hatalı', 'Geçerli bir fiyat girin.');
      return;
    }
    const tamamlanan = {
      ...taslakIlan,
      fiyat: String(fiyatSayi),
      pazarlikAcik: pazarlik,
      minTeklif: pazarlik && minTeklif ? String(Number(minTeklif.replace(/\D/g, ''))) : null,
    };
    navigation.navigate('PlatformSec', {
      yeniIlan: tamamlanan,
      duzenlemeId,
      adim: 6,
      toplamAdim,
    });
  };

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.content}>
      <IlanBreadcrumb parcalar={breadcrumb} />
      <Text style={styles.baslik}>Ürün Fiyatı</Text>

      <AppInput
        label="Fiyat (TL) *"
        value={fiyat}
        onChangeText={(t) => setFiyat(t.replace(/\D/g, ''))}
        keyboardType="number-pad"
        placeholder="0"
      />

      <TouchableOpacity style={styles.pazarlikSatir} onPress={() => setPazarlik((v) => !v)}>
        <Ionicons
          name={pazarlik ? 'checkmark-circle' : 'ellipse-outline'}
          size={22}
          color={pazarlik ? colors.success : colors.textMuted}
        />
        <Text style={styles.pazarlikText}>Ürünüm pazarlığa açık, alıcılar teklif verebilir.</Text>
      </TouchableOpacity>

      {pazarlik ? (
        <AppInput
          label="Minimum teklif tutarı (TL)"
          value={minTeklif}
          onChangeText={(t) => setMinTeklif(t.replace(/\D/g, ''))}
          keyboardType="number-pad"
          placeholder="Opsiyonel"
        />
      ) : null}

      <PrimaryButton
        title={duzenlemeId ? 'Güncelle ve Yayınla' : 'Onayla ve Devam Et'}
        icon="checkmark-circle-outline"
        onPress={devamEt}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: 40 },
  baslik: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: spacing.lg },
  pazarlikSatir: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: spacing.md },
  pazarlikText: { flex: 1, fontSize: 14, color: colors.textSecondary },
});
