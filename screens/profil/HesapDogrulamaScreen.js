import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getUserProfile, setUserVerified } from '../../api';
import { getHesapDogrulandi, setHesapDogrulandi } from '../../utils/profilStorage';
import { PrimaryButton } from '../../components/ui';
import { colors, radius, spacing } from '../../constants/theme';

export default function HesapDogrulamaScreen() {
  const [adSoyad, setAdSoyad] = useState('');
  const [dogrulandi, setDogrulandi] = useState(false);

  const yukle = useCallback(async () => {
    try {
      const profil = await getUserProfile();
      const yerel = await getHesapDogrulandi();
      const isim = `${profil.ad || ''} ${profil.soyad || ''}`.trim() || 'Kullanıcı';
      setAdSoyad(isim);
      setDogrulandi(!!profil.verified || yerel);
    } catch {
      setDogrulandi(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      yukle();
    }, [yukle])
  );

  const dogrula = () => {
    Alert.alert(
      'Hesap doğrulama',
      'Kimlik doğrulama işlemi başlatılacak. (Şu an demo: gerçek e-Devlet entegrasyonu yoktur.)',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Doğrula',
          onPress: async () => {
            await setUserVerified(true);
            await setHesapDogrulandi(true);
            setDogrulandi(true);
            Alert.alert('Başarılı', 'Hesabınız doğrulandı.');
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.wrap} contentContainerStyle={styles.content}>
      <View style={styles.kart}>
        <Text style={styles.kartBaslik}>Hesap doğrulama</Text>
        {dogrulandi ? (
          <View style={styles.dogrulandiKutu}>
            <Ionicons name="checkmark-circle" size={22} color={colors.success} />
            <Text style={styles.dogrulandiMetin}>
              Hesabınız {adSoyad} olarak doğrulanmıştır.
            </Text>
          </View>
        ) : (
          <Text style={styles.metin}>
            Güvenilirliği artırmak için hesabınızı doğrulayabilirsiniz. Doğrulama sonrası ilan
            verme ve güvenlik özellikleri açılır.
          </Text>
        )}
        {dogrulandi ? (
          <TouchableOpacity onPress={dogrula}>
            <Text style={styles.link}>Bilgileri yeniden doğrula</Text>
          </TouchableOpacity>
        ) : (
          <PrimaryButton title="Hesabımı doğrula" icon="shield-checkmark-outline" onPress={dogrula} />
        )}
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
  kartBaslik: { fontSize: 17, fontWeight: '700', color: colors.text, marginBottom: spacing.md },
  dogrulandiKutu: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    borderWidth: 1,
    borderColor: colors.success,
    backgroundColor: '#ECFDF5',
    padding: spacing.md,
    borderRadius: radius.sm,
    marginBottom: spacing.md,
  },
  dogrulandiMetin: { flex: 1, fontSize: 14, color: '#047857', lineHeight: 20 },
  metin: { fontSize: 14, color: colors.textSecondary, lineHeight: 21, marginBottom: spacing.lg },
  link: { fontSize: 14, fontWeight: '600', color: colors.link, marginTop: spacing.sm },
});
