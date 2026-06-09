import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadow, spacing, getKategoriMeta, formatFiyat } from '../constants/theme';
import { kokIdToMetaKey } from '../constants/kategoriler';
import { ilanKapakFotoUrl, ILAN_FOTO_HEADERS } from '../utils/ilanFoto';
import {
  ilanKonumKisa,
  ilanVitrinRozet,
  ilanVitrinOzetMetni,
} from '../utils/ilanKartOzet';

/** Sahibinden vitrin — 2 sütun grid kartı */
export default function IlanVitrinKart({ ilan, onPress, onSil }) {
  const metaKey = ilan.kategoriKok ? kokIdToMetaKey(ilan.kategoriKok) : ilan.kategori;
  const meta = getKategoriMeta(metaKey);
  const kapakFoto = ilanKapakFotoUrl(ilan);
  const konum = ilanKonumKisa(ilan);
  const ozet = ilanVitrinOzetMetni(ilan);
  const rozet = ilanVitrinRozet(ilan);

  return (
    <TouchableOpacity style={styles.kart} onPress={onPress} activeOpacity={0.88}>
      <View style={[styles.gorsel, { backgroundColor: meta.bg }]}>
        {kapakFoto ? (
          <Image
            source={{ uri: kapakFoto, headers: ILAN_FOTO_HEADERS }}
            style={styles.gorselFoto}
            resizeMode="cover"
          />
        ) : (
          <Text style={styles.gorselEmoji}>{meta.emoji}</Text>
        )}
        {rozet ? (
          <View style={[styles.rozet, { backgroundColor: meta.renk }]}>
            <Text style={styles.rozetText} numberOfLines={1}>
              {rozet}
            </Text>
          </View>
        ) : null}
      </View>

      <View style={styles.alt}>
        {konum ? (
          <View style={styles.konumSatir}>
            <Ionicons name="location-outline" size={11} color={colors.textMuted} />
            <Text style={styles.konum} numberOfLines={1}>
              {konum}
            </Text>
          </View>
        ) : null}

        <Text style={styles.baslik} numberOfLines={2}>
          {ilan.baslik || 'İlan'}
        </Text>

        {ozet ? (
          <Text style={styles.ozet} numberOfLines={1}>
            {ozet}
          </Text>
        ) : null}

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
  rozet: {
    position: 'absolute',
    top: 6,
    left: 6,
    maxWidth: '75%',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  rozetText: { fontSize: 9, fontWeight: '700', color: '#fff' },
  alt: { paddingHorizontal: 8, paddingTop: 7, paddingBottom: 9 },
  konumSatir: { flexDirection: 'row', alignItems: 'center', gap: 3, marginBottom: 3 },
  konum: { flex: 1, fontSize: 11, color: colors.textMuted, fontWeight: '500' },
  baslik: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    lineHeight: 17,
    minHeight: 34,
  },
  ozet: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 3,
    fontWeight: '500',
  },
  fiyat: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.link,
    marginTop: 5,
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
