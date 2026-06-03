import React, { useCallback, useState, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getUserProfile, updateUserProfile } from '../../api';
import { gorunenAdSecenekleri } from '../../utils/gorunenAd';
import { PrimaryButton } from '../../components/ui';
import { colors, radius, spacing } from '../../constants/theme';

export default function GorunenAdScreen({ navigation }) {
  const [ad, setAd] = useState('');
  const [soyad, setSoyad] = useState('');
  const [secim, setSecim] = useState('');
  const [kaydediyor, setKaydediyor] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let aktif = true;
      (async () => {
        const p = await getUserProfile().catch(() => ({}));
        if (!aktif) return;
        setAd(p.ad || '');
        setSoyad(p.soyad || '');
        setSecim(p.gorunenAd || '');
      })();
      return () => {
        aktif = false;
      };
    }, [])
  );

  const secenekler = useMemo(() => gorunenAdSecenekleri(ad, soyad), [ad, soyad]);

  const kaydet = async () => {
    if (!secim) {
      Alert.alert('Uyarı', 'Bir görünen ad seçin.');
      return;
    }
    try {
      setKaydediyor(true);
      await updateUserProfile({ gorunenAd: secim });
      Alert.alert('Kaydedildi', 'Görünen adınız güncellendi.', [
        { text: 'Tamam', onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      Alert.alert('Hata', e?.message || 'Kaydedilemedi.');
    } finally {
      setKaydediyor(false);
    }
  };

  if (!ad.trim() && !soyad.trim()) {
    return (
      <View style={styles.bos}>
        <Text style={styles.bosMetin}>Önce ad soyad bilgilerinizi doldurun.</Text>
        <PrimaryButton
          title="Ad soyada git"
          onPress={() => navigation.navigate('AdSoyadDuzenle')}
        />
      </View>
    );
  }

  return (
    <ScrollView style={styles.wrap} contentContainerStyle={styles.content}>
      <View style={styles.kart}>
        <Text style={styles.aciklama}>
          İlan verme ve mesajlaşmada diğer kullanıcıların sizi nasıl göreceğini seçin.
        </Text>
        {secenekler.map((opt) => {
          const aktif = secim === opt;
          return (
            <TouchableOpacity
              key={opt}
              style={[styles.secenek, aktif && styles.secenekAktif]}
              onPress={() => setSecim(opt)}
            >
              <Ionicons
                name={aktif ? 'radio-button-on' : 'radio-button-off'}
                size={22}
                color={aktif ? colors.primary : colors.textMuted}
              />
              <Text style={styles.secenekText}>{opt}</Text>
            </TouchableOpacity>
          );
        })}
        <PrimaryButton
          title="Görünen ad seçimini kaydet"
          onPress={kaydet}
          loading={kaydediyor}
        />
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
  secenek: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  secenekAktif: { backgroundColor: colors.primaryLight },
  secenekText: { flex: 1, fontSize: 16, color: colors.text, fontWeight: '500' },
  bos: { flex: 1, justifyContent: 'center', padding: spacing.xl, backgroundColor: colors.background },
  bosMetin: { textAlign: 'center', color: colors.textSecondary, marginBottom: spacing.lg },
});
