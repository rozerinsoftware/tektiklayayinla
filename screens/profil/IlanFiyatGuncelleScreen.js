import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { AppInput, PrimaryButton } from '../../components/ui';
import { updateIlanFiyat } from '../../api';
import { colors, spacing } from '../../constants/theme';
import { formatFiyat } from '../../constants/theme';

export default function IlanFiyatGuncelleScreen({ navigation, route }) {
  const ilan = route.params?.ilan;
  const [fiyat, setFiyat] = useState(String(ilan?.fiyat || '').replace(/\D/g, ''));
  const [yukleniyor, setYukleniyor] = useState(false);

  if (!ilan?.id) {
    return (
      <View style={styles.merkez}>
        <Text>İlan bulunamadı</Text>
      </View>
    );
  }

  const kaydet = async () => {
    const sayi = Number(fiyat.replace(/\D/g, ''));
    if (!Number.isFinite(sayi) || sayi <= 0) {
      Alert.alert('Fiyat', 'Geçerli bir fiyat girin.');
      return;
    }
    try {
      setYukleniyor(true);
      await updateIlanFiyat(ilan.id, String(sayi));
      Alert.alert('Tamam', `Yeni fiyat: ${formatFiyat(sayi)}`, [
        { text: 'Tamam', onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      Alert.alert('Hata', e?.message || 'Fiyat güncellenemedi.');
    } finally {
      setYukleniyor(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.baslik}>{ilan.baslik}</Text>
      <Text style={styles.mevcut}>Mevcut: {formatFiyat(ilan.fiyat)}</Text>
      <AppInput
        label="Yeni fiyat (TL)"
        icon="cash-outline"
        keyboardType="number-pad"
        value={fiyat}
        onChangeText={(t) => setFiyat(t.replace(/\D/g, ''))}
        placeholder="Fiyat girin"
      />
      <PrimaryButton title="Kaydet" onPress={kaydet} loading={yukleniyor} icon="checkmark-outline" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg },
  merkez: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  baslik: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 4 },
  mevcut: { fontSize: 14, color: colors.textSecondary, marginBottom: spacing.lg },
});
