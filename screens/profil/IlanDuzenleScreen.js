import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { AppInput, PrimaryButton } from '../../components/ui';
import { updateIlan } from '../../api';
import { colors, spacing } from '../../constants/theme';

export default function IlanDuzenleScreen({ navigation, route }) {
  const ilan = route.params?.ilan || {};
  const [baslik, setBaslik] = useState(ilan.baslik || '');
  const [aciklama, setAciklama] = useState(ilan.aciklama || '');
  const [fiyat, setFiyat] = useState(String(ilan.fiyat || '').replace(/\D/g, ''));
  const [yukleniyor, setYukleniyor] = useState(false);

  const kaydet = async () => {
    if (!String(baslik).trim() || !String(aciklama).trim()) {
      Alert.alert('Eksik', 'Başlık ve açıklama zorunludur.');
      return;
    }
    const sayi = Number(fiyat.replace(/\D/g, ''));
    if (!Number.isFinite(sayi) || sayi <= 0) {
      Alert.alert('Fiyat', 'Geçerli bir fiyat girin.');
      return;
    }
    try {
      setYukleniyor(true);
      await updateIlan(ilan.id, { baslik: baslik.trim(), aciklama: aciklama.trim(), fiyat: String(sayi) });
      Alert.alert('Tamam', 'İlan güncellendi.', [
        { text: 'Tamam', onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      Alert.alert('Hata', e?.message || 'Güncellenemedi.');
    } finally {
      setYukleniyor(false);
    }
  };

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.content}>
      <AppInput label="İlan Başlığı" value={baslik} onChangeText={setBaslik} placeholder="Başlık" />
      <AppInput
        label="Açıklama"
        value={aciklama}
        onChangeText={setAciklama}
        placeholder="Açıklama"
        multiline
      />
      <AppInput
        label="Fiyat (TL)"
        keyboardType="number-pad"
        value={fiyat}
        onChangeText={(t) => setFiyat(t.replace(/\D/g, ''))}
        placeholder="Fiyat"
      />
      <PrimaryButton title="Kaydet" onPress={kaydet} loading={yukleniyor} icon="save-outline" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: 40 },
});
