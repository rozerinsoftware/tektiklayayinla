import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getUserProfile, updateUserProfile } from '../../api';
import { AppInput, PrimaryButton } from '../../components/ui';
import { colors, radius, spacing } from '../../constants/theme';

function telefonFormatla(text) {
  const rakam = String(text).replace(/\D/g, '').slice(0, 11);
  if (rakam.length <= 4) return rakam;
  if (rakam.length <= 7) return `${rakam.slice(0, 4)} ${rakam.slice(4)}`;
  if (rakam.length <= 9) {
    return `${rakam.slice(0, 4)} ${rakam.slice(4, 7)} ${rakam.slice(7)}`;
  }
  return `${rakam.slice(0, 4)} ${rakam.slice(4, 7)} ${rakam.slice(7, 9)} ${rakam.slice(9)}`;
}

export default function TelefonDuzenleScreen({ navigation }) {
  const [mevcut, setMevcut] = useState('');
  const [duzenle, setDuzenle] = useState(false);
  const [telefon, setTelefon] = useState('');
  const [kaydediyor, setKaydediyor] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let aktif = true;
      (async () => {
        const p = await getUserProfile().catch(() => ({}));
        if (!aktif) return;
        const t = p.telefon || '';
        setMevcut(t);
        setTelefon(t);
        setDuzenle(!t);
      })();
      return () => {
        aktif = false;
      };
    }, [])
  );

  const kaydet = async () => {
    const rakam = telefon.replace(/\D/g, '');
    if (rakam.length < 10) {
      Alert.alert('Uyarı', 'Geçerli bir cep telefonu girin (10–11 hane).');
      return;
    }
    try {
      setKaydediyor(true);
      await updateUserProfile({ telefon: telefonFormatla(rakam) });
      setMevcut(telefonFormatla(rakam));
      setDuzenle(false);
      Alert.alert('Kaydedildi', 'Telefon numaranız güncellendi.');
    } catch (e) {
      Alert.alert('Hata', e?.message || 'Kaydedilemedi.');
    } finally {
      setKaydediyor(false);
    }
  };

  if (!duzenle && mevcut) {
    return (
      <ScrollView style={styles.wrap} contentContainerStyle={styles.content}>
        <View style={styles.kart}>
          <Text style={styles.aciklama}>
            Cep telefonu numaranız ilanlarınızda ve iletişimde gösterilebilir.
          </Text>
          <Text style={styles.etiket}>Cep telefonu numaram:</Text>
          <Text style={styles.numara}>{mevcut}</Text>
          <TouchableOpacity style={styles.outlineBtn} onPress={() => setDuzenle(true)}>
            <Text style={styles.outlineBtnText}>Numarayı değiştir</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.wrap} contentContainerStyle={styles.content}>
      <View style={styles.kart}>
        <Text style={styles.aciklama}>
          Cep telefonu numaranız ilanlarınızda ve iletişimde gösterilebilir.
        </Text>
        <AppInput
          label="Cep telefonu"
          value={telefon}
          onChangeText={(t) => setTelefon(telefonFormatla(t))}
          placeholder="05XX XXX XX XX"
          keyboardType="phone-pad"
        />
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
  etiket: { fontSize: 14, color: colors.textSecondary, marginBottom: 6 },
  numara: { fontSize: 22, fontWeight: '700', color: colors.text, marginBottom: spacing.lg },
  outlineBtn: {
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: 'center',
  },
  outlineBtnText: { fontSize: 16, fontWeight: '700', color: colors.primary },
});
