import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { colors, radius, shadow, spacing, getKategoriMeta, formatFiyat } from '../constants/theme';
import { kokIdToMetaKey } from '../constants/kategoriler';
import { gecerliKapakFoto } from '../utils/ilanFoto';

/** Sahibinden vitrin — 2 sütun grid kartı */
export default function IlanVitrinKart({ ilan, onPress, onSil }) {
  const metaKey = ilan.kategoriKok ? kokIdToMetaKey(ilan.kategoriKok) : ilan.kategori;
  const meta = getKategoriMeta(metaKey);
  const ilanNo = ilan.id ? `#${String(ilan.id).slice(-9)}` : '';
  const kapakFoto = gecerliKapakFoto(ilan.fotograflar);

  return (
    <TouchableOpacity style={styles.kart} onPress={onPress} activeOpacity={0.88}>
      <View style={[styles.gorsel, { backgroundColor: meta.bg }]}>
        {kapakFoto ? (
          <Image source={{ uri: kapakFoto }} style={styles.gorselFoto} resizeMode="cover" />
        ) : (
          <Text style={styles.gorselEmoji}>{meta.emoji}</Text>
        )}
        {ilanNo ? <Text style={styles.ilanNo}>{ilanNo}</Text> : null}
      </View>
      <View style={styles.alt}>
        <Text style={styles.baslik} numberOfLines={2}>
          {ilan.baslik || 'İlan'}
        </Text>
        <Text style={styles.fiyat}>{formatFiyat(ilan.fiyat)}</Text>
      </View>
      {onSil ? (
        <TouchableOpacity
          style={styles.sil}
          onPress={(e) => {
            e?.stopPropagation?.();
            onSil();
          }}
          hitSlop={8}
        >
          <Text style={styles.silText}>Sil</Text>
        </TouchableOpacity>
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  kart: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
    ...shadow.card,
  },
  gorsel: {
    width: '100%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  gorselEmoji: { fontSize: 48 },
  gorselFoto: { width: '100%', height: '100%' },
  ilanNo: {
    position: 'absolute',
    top: 6,
    left: 6,
    fontSize: 9,
    color: colors.textMuted,
    backgroundColor: 'rgba(255,255,255,0.85)',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  alt: { padding: 8, paddingTop: 6 },
  baslik: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.text,
    lineHeight: 17,
    minHeight: 34,
  },
  fiyat: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.link,
    marginTop: 4,
  },
  sil: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  silText: { fontSize: 10, fontWeight: '700', color: colors.danger },
});
