import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getUserProfile, updateUserProfile } from '../../api';
import { AppInput, PrimaryButton } from '../../components/ui';
import { colors, radius, spacing } from '../../constants/theme';

export default function AdSoyadDuzenleScreen({ navigation }) {
  const [ad, setAd] = useState('');
  const [soyad, setSoyad] = useState('');
  const [kaydediyor, setKaydediyor] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let aktif = true;
      (async () => {
        const p = await getUserProfile().catch(() => ({}));
        if (!aktif) return;
        setAd(p.ad || '');
        setSoyad(p.soyad || '');
      })();
      return () => {
        aktif = false;
      };
    }, [])
  );

  const kaydet = async () => {
    if (!ad.trim() || !soyad.trim()) {
      Alert.alert('Uyarı', 'Ad ve soyad zorunludur.');
      return;
    }
    try {
      setKaydediyor(true);
      await updateUserProfile({ ad: ad.trim(), soyad: soyad.trim() });
      Alert.alert('Kaydedildi', 'Ad soyad bilgileriniz güncellendi.', [
        { text: 'Tamam', onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      Alert.alert('Hata', e?.message || 'Kaydedilemedi.');
    } finally {
      setKaydediyor(false);
    }
  };

  return (
    <ScrollView style={styles.wrap} contentContainerStyle={styles.content}>
      <View style={styles.kart}>
        <Text style={styles.aciklama}>
          Ad soyad bilgileriniz hesabınızın tanınması ve ilan güvenliği için kullanılır.
        </Text>
        <AppInput label="Ad" value={ad} onChangeText={setAd} placeholder="Adınız" />
        <AppInput label="Soyad" value={soyad} onChangeText={setSoyad} placeholder="Soyadınız" />
        <PrimaryButton title="Kaydet" icon="save-outline" onPress={kaydet} loading={kaydediyor} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg },
  kart: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  aciklama: { fontSize: 14, color: colors.textSecondary, lineHeight: 21, marginBottom: spacing.lg },
});
