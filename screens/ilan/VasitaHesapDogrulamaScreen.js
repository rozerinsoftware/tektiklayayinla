import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius } from '../../constants/theme';

/**
 * Sahibinden’deki e-Devlet doğrulama adımının yer tutucusu.
 * Gerçek entegrasyon yok; geliştirme için “devam” ile atlanır.
 */
export default function VasitaHesapDogrulamaScreen({ navigation, route }) {
  const { secilenKategori, secimler, donanimKayit } = route.params || {};

  const devam = () => {
    navigation.navigate('VasitaTemelBilgi', {
      secilenKategori,
      secimler,
      donanimKayit,
      manuelArac: false,
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.kart}>
        <Ionicons name="shield-checkmark-outline" size={40} color={colors.primary} style={styles.icon} />
        <Text style={styles.baslik}>Hesap doğrulama</Text>
        <Text style={styles.metin}>
          İkinci el araç ilanlarında güvenilirlik için e-Devlet ile kimlik doğrulaması gerekir
          (Sahibinden’deki gibi). Bu özellik henüz bağlanmadı.
        </Text>
        <Text style={styles.metin}>
          Şimdilik test için aşağıdaki düğme ile ilan adımlarına devam edebilirsiniz. Canlıda bu
          adım zorunlu olacak.
        </Text>
        <TouchableOpacity
          style={styles.linkBtn}
          onPress={() => Linking.openURL('tel:08502224444').catch(() => {})}
        >
          <Text style={styles.linkText}>Destek: 0 850 222 44 44</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.primaryBtn} onPress={devam} activeOpacity={0.85}>
        <Text style={styles.primaryBtnText}>Devam et (geliştirme)</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryBtn} onPress={() => navigation.goBack()} activeOpacity={0.85}>
        <Text style={styles.secondaryBtnText}>Geri dön</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: 40 },
  kart: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  icon: { alignSelf: 'center', marginBottom: spacing.md },
  baslik: { fontSize: 20, fontWeight: '700', color: colors.text, textAlign: 'center', marginBottom: spacing.md },
  metin: { fontSize: 14, color: colors.textSecondary, lineHeight: 21, marginBottom: spacing.sm },
  linkBtn: { marginTop: spacing.md, alignItems: 'center' },
  linkText: { fontSize: 14, fontWeight: '600', color: colors.link },
  primaryBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: radius.md,
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  primaryBtnText: { fontSize: 16, fontWeight: '700', color: colors.primaryText },
  secondaryBtn: {
    paddingVertical: 14,
    borderRadius: radius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  secondaryBtnText: { fontSize: 15, fontWeight: '600', color: colors.primary },
});
