import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadow, getKategoriMeta, formatFiyat } from '../constants/theme';

export default function IlanKart({ ilan, onPress, onSil, compact }) {
  const meta = getKategoriMeta(ilan.kategori);
  const platformlar = Array.isArray(ilan.platformlar)
    ? ilan.platformlar
    : ilan.platformlar
      ? [ilan.platformlar]
      : [];

  return (
    <TouchableOpacity
      style={[styles.kart, compact && styles.kartCompact]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={[styles.gorselAlan, { backgroundColor: meta.bg }]}>
        <Text style={styles.gorselEmoji}>{meta.emoji}</Text>
        {ilan.kategori ? (
          <View style={[styles.kategoriEtiket, { backgroundColor: meta.renk }]}>
            <Text style={styles.kategoriEtiketText}>{ilan.kategori}</Text>
          </View>
        ) : null}
        <View style={styles.tapIcon}>
          <Ionicons name="chevron-forward" size={20} color={colors.primary} />
        </View>
      </View>

      <View style={styles.icerik}>
        <Text style={styles.fiyat}>{formatFiyat(ilan.fiyat)}</Text>
        <Text style={styles.baslik} numberOfLines={2}>
          {ilan.baslik}
        </Text>
        <Text style={styles.aciklama} numberOfLines={2}>
          {ilan.aciklama}
        </Text>

        {platformlar.length > 0 ? (
          <View style={styles.platformSatir}>
            {platformlar.slice(0, 2).map((p) => (
              <View key={p} style={styles.platformChip}>
                <Text style={styles.platformChipText}>{p}</Text>
              </View>
            ))}
            {platformlar.length > 2 ? (
              <Text style={styles.platformFazla}>+{platformlar.length - 2}</Text>
            ) : null}
          </View>
        ) : null}

        {onSil ? (
          <TouchableOpacity
            style={styles.silButon}
            onPress={(e) => {
              e?.stopPropagation?.();
              onSil();
            }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="trash-outline" size={14} color={colors.danger} />
            <Text style={styles.silButonText}>Sil</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  kart: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },
  kartCompact: { marginBottom: 10 },
  gorselAlan: {
    width: 110,
    minHeight: 120,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  gorselEmoji: { fontSize: 40 },
  kategoriEtiket: {
    position: 'absolute',
    bottom: 36,
    left: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
    alignItems: 'center',
  },
  kategoriEtiketText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  tapIcon: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.soft,
  },
  icerik: { flex: 1, padding: 12, justifyContent: 'center' },
  fiyat: { fontSize: 18, fontWeight: '800', color: colors.price, marginBottom: 4 },
  baslik: { fontSize: 15, fontWeight: '600', color: colors.text, lineHeight: 20 },
  aciklama: { fontSize: 13, color: colors.textSecondary, marginTop: 4, lineHeight: 18 },
  platformSatir: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', marginTop: 8, gap: 6 },
  platformChip: {
    backgroundColor: colors.background,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  platformChipText: { fontSize: 11, color: colors.textSecondary, fontWeight: '500' },
  platformFazla: { fontSize: 11, color: colors.textMuted },
  silButon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    marginTop: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: radius.sm,
    backgroundColor: '#FEE2E2',
  },
  silButonText: { color: colors.danger, fontSize: 12, fontWeight: '600' },
});
