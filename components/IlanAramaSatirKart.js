import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, formatFiyat } from '../constants/theme';
import { formatKonumEtiket } from '../utils/konum';
import { ilanKapakFotoUrl, ILAN_FOTO_HEADERS } from '../utils/ilanFoto';

/** Sahibinden arama sonucu — yatay satır kartı */
export default function IlanAramaSatirKart({ ilan, onPress, oneCikan }) {
  const kapak = ilanKapakFotoUrl(ilan);
  const konum = formatKonumEtiket(ilan.konum);

  return (
    <TouchableOpacity
      style={[styles.satir, oneCikan && styles.satirOneCikan]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.thumbWrap}>
        {kapak ? (
          <Image source={{ uri: kapak, headers: ILAN_FOTO_HEADERS }} style={styles.thumb} />
        ) : (
          <View style={styles.thumbBos}>
            <Ionicons name="image-outline" size={28} color={colors.textMuted} />
          </View>
        )}
      </View>
      <View style={styles.icerik}>
        <Text style={styles.baslik} numberOfLines={2}>
          {ilan.baslik}
        </Text>
        {konum ? (
          <View style={styles.konumSatir}>
            <Ionicons name="location-outline" size={13} color={colors.textSecondary} />
            <Text style={styles.konum} numberOfLines={1}>
              {konum}
            </Text>
          </View>
        ) : null}
        <Text style={styles.fiyat}>{formatFiyat(ilan.fiyat)}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  satir: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 10,
  },
  satirOneCikan: { backgroundColor: '#E8F5E9' },
  thumbWrap: {
    width: 96,
    height: 72,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: colors.background,
  },
  thumb: { width: '100%', height: '100%' },
  thumbBos: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  icerik: { flex: 1, justifyContent: 'space-between', minHeight: 72 },
  baslik: { fontSize: 14, fontWeight: '600', color: colors.text, lineHeight: 18 },
  konumSatir: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 4 },
  konum: { flex: 1, fontSize: 12, color: colors.textSecondary },
  fiyat: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.price,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
});
