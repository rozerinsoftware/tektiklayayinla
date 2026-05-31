import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { deleteIlan } from '../api';
import { colors, radius, shadow, getKategoriMeta, formatFiyat } from '../constants/theme';

const DETAY_ETIKETLER = {
  ilanTuru: 'İlan Türü',
  emlakTipi: 'Emlak Tipi',
  metrekare: 'Metrekare',
  odaSayisi: 'Oda Sayısı',
  binaYasi: 'Bina Yaşı',
  kat: 'Kat',
  aracTipi: 'Araç Tipi',
  marka: 'Marka',
  model: 'Model',
  yil: 'Yıl',
  kilometre: 'Kilometre',
  yakit: 'Yakıt',
  vites: 'Vites',
  urunTipi: 'Ürün Tipi',
  durum: 'Durum',
};

export default function IlanDetayScreen({ navigation, route }) {
  const ilan = route.params?.ilan || {};
  const meta = getKategoriMeta(ilan.kategori);
  const platformlar = Array.isArray(ilan.platformlar) ? ilan.platformlar : [];

  const detaySatirlari = Object.entries(DETAY_ETIKETLER)
    .filter(([key]) => ilan[key])
    .map(([key, label]) => ({ label, value: ilan[key] }));

  const ilanSil = () => {
    Alert.alert('İlanı Sil', 'Bu ilanı silmek istediğinize emin misiniz?', [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Sil',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteIlan(ilan.id);
            navigation.goBack();
          } catch (error) {
            Alert.alert('Hata', error?.message || 'Silinemedi.');
          }
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={[styles.hero, { backgroundColor: meta.bg }]}>
        <Text style={styles.heroEmoji}>{meta.emoji}</Text>
        {ilan.kategori ? (
          <View style={[styles.kategoriBadge, { backgroundColor: meta.renk }]}>
            <Text style={styles.kategoriBadgeText}>{ilan.kategori}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.kart}>
        <Text style={styles.fiyat}>{formatFiyat(ilan.fiyat)}</Text>
        <Text style={styles.baslik}>{ilan.baslik}</Text>
        <Text style={styles.aciklama}>{ilan.aciklama}</Text>
      </View>

      {detaySatirlari.length > 0 ? (
        <View style={styles.kart}>
          <Text style={styles.bolumBaslik}>İlan Detayları</Text>
          {detaySatirlari.map((satir) => (
            <View key={satir.label} style={styles.detaySatir}>
              <Text style={styles.detayLabel}>{satir.label}</Text>
              <Text style={styles.detayDeger}>{satir.value}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {platformlar.length > 0 ? (
        <View style={styles.kart}>
          <Text style={styles.bolumBaslik}>Yayınlanan Platformlar</Text>
          <View style={styles.chipWrap}>
            {platformlar.map((p) => (
              <View key={p} style={styles.chip}>
                <Text style={styles.chipText}>✓ {p}</Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}

      <TouchableOpacity style={styles.silButon} onPress={ilanSil}>
        <Text style={styles.silButonText}>İlanı Sil</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: 32 },
  hero: {
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroEmoji: { fontSize: 72 },
  kategoriBadge: {
    position: 'absolute',
    bottom: 16,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  kategoriBadgeText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  kart: {
    backgroundColor: colors.surface,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },
  fiyat: { fontSize: 26, fontWeight: '800', color: colors.price, marginBottom: 8 },
  baslik: { fontSize: 20, fontWeight: '700', color: colors.text, lineHeight: 26 },
  aciklama: {
    fontSize: 15,
    color: colors.textSecondary,
    marginTop: 12,
    lineHeight: 22,
  },
  bolumBaslik: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  detaySatir: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  detayLabel: { fontSize: 14, color: colors.textSecondary, flex: 1 },
  detayDeger: { fontSize: 14, fontWeight: '600', color: colors.text, flex: 1, textAlign: 'right' },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  chipText: { color: colors.success, fontWeight: '600', fontSize: 13 },
  silButon: {
    marginHorizontal: 16,
    marginTop: 24,
    backgroundColor: '#FEE2E2',
    padding: 16,
    borderRadius: radius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  silButonText: { color: colors.danger, fontWeight: '700', fontSize: 16 },
});
