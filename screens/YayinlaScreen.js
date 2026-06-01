import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PrimaryButton, Card } from '../components/ui';
import { colors, radius, spacing, formatFiyat, getKategoriMeta } from '../constants/theme';
import { kokIdToMetaKey } from '../constants/kategoriler';

function anaSayfayaGit(navigation) {
  const tabNav = navigation.getParent?.();
  if (tabNav) {
    tabNav.navigate('Ana Sayfa', { screen: 'IlanListesi' });
    return;
  }
  navigation.navigate('IlanListesi');
}

export default function YayinlaScreen({ navigation, route }) {
  const { ilan } = route.params;
  const platformlar = Array.isArray(ilan?.platformlar) ? ilan.platformlar : [];
  const metaKey = ilan?.kategoriKok ? kokIdToMetaKey(ilan.kategoriKok) : ilan?.kategori;
  const meta = getKategoriMeta(metaKey);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.basarili}>
        <View style={styles.basariliIcon}>
          <Ionicons name="checkmark-circle" size={64} color={colors.success} />
        </View>
        <Text style={styles.baslik}>İlanınız Yayınlandı!</Text>
        <Text style={styles.alt}>Seçtiğiniz platformlarda simülasyon olarak işaretlendi.</Text>
      </View>

      <Card>
        <View style={[styles.kategoriStrip, { backgroundColor: meta.bg }]}>
          <Text style={styles.kategoriEmoji}>{meta.emoji}</Text>
          <Text style={styles.kategoriAd}>{ilan.kategoriEtiket || ilan.kategori || 'İlan'}</Text>
        </View>
        <Text style={styles.fiyat}>{formatFiyat(ilan.fiyat)}</Text>
        <Text style={styles.detayBaslik}>{ilan.baslik}</Text>
        <Text style={styles.detayAciklama}>{ilan.aciklama}</Text>

        {platformlar.length > 0 ? (
          <View style={styles.platformBolge}>
            <View style={styles.platformBaslikSatir}>
              <Ionicons name="globe-outline" size={18} color={colors.textSecondary} />
              <Text style={styles.platformBaslik}>Platformlar</Text>
            </View>
            <View style={styles.chipWrap}>
              {platformlar.map((p) => (
                <View key={p} style={styles.chip}>
                  <Ionicons name="checkmark" size={14} color={colors.success} />
                  <Text style={styles.chipText}>{p}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}
      </Card>

      <PrimaryButton
        title="Ana Sayfaya Dön"
        icon="home-outline"
        onPress={() => anaSayfayaGit(navigation)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: 40 },
  basarili: { alignItems: 'center', marginBottom: spacing.lg },
  basariliIcon: { marginBottom: spacing.md },
  baslik: { fontSize: 24, fontWeight: '800', color: colors.text },
  alt: { fontSize: 14, color: colors.textSecondary, marginTop: 6, textAlign: 'center' },
  kategoriStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radius.sm,
    marginBottom: spacing.md,
    gap: 8,
  },
  kategoriEmoji: { fontSize: 24 },
  kategoriAd: { fontSize: 14, fontWeight: '700', color: colors.text },
  fiyat: { fontSize: 22, fontWeight: '800', color: colors.price, marginBottom: 6 },
  detayBaslik: { fontSize: 18, fontWeight: '700', color: colors.text },
  detayAciklama: { fontSize: 14, color: colors.textSecondary, marginTop: 8, lineHeight: 20 },
  platformBolge: { marginTop: spacing.lg, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.border },
  platformBaslikSatir: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: spacing.sm },
  platformBaslik: { fontSize: 14, fontWeight: '700', color: colors.textSecondary },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  chipText: { fontSize: 13, color: colors.success, fontWeight: '600' },
});
