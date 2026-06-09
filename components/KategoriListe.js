import React, { useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../constants/theme';
import { formatIlanSayisi, getAltBaslikMetni } from '../constants/kategoriler';

function SayimSatiri({ baslik, sayi, vurgulu, onPress, hizmet }) {
  return (
    <TouchableOpacity style={styles.satir} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.satirSol}>
        <Text style={[styles.satirBaslik, vurgulu && styles.satirVurgulu]} numberOfLines={2}>
          {baslik}
        </Text>
      </View>
      <View style={styles.satirSag}>
        {!hizmet && sayi != null ? (
          <Text style={[styles.sayi, vurgulu && styles.sayiVurgulu]}>({formatIlanSayisi(sayi)})</Text>
        ) : null}
        <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
      </View>
    </TouchableOpacity>
  );
}

export default function KategoriListe({
  baslik,
  tumBaslik,
  tumSayi,
  onTumuneBas,
  cocuklar = [],
  ilgili = [],
  sayimlar = {},
  yukleniyor,
  onCocukBas,
  onIlgiliBas,
  listeHeader,
}) {
  const bolumler = useMemo(() => {
    const items = [];
    items.push({ tip: 'tum', id: '__tum__' });
    cocuklar.forEach((c) => items.push({ tip: 'cocuk', ...c }));
    if (ilgili.length) {
      items.push({ tip: 'baslik', id: '__ilgili__', baslik: 'İLGİLİ KATEGORİLER' });
      ilgili.forEach((c) => items.push({ tip: 'ilgili', ...c }));
    }
    return items;
  }, [cocuklar, ilgili]);

  const renderItem = ({ item }) => {
    if (item.tip === 'baslik') {
      return (
        <View style={styles.bolumBaslik}>
          <Text style={styles.bolumBaslikText}>{item.baslik}</Text>
        </View>
      );
    }
    if (item.tip === 'tum') {
      return (
        <SayimSatiri
          baslik={tumBaslik}
          sayi={tumSayi}
          vurgulu
          onPress={onTumuneBas}
        />
      );
    }
    const hizmet = item.hizmet === true;
    const sayi = sayimlar[item.id];
    const onPress =
      item.tip === 'ilgili'
        ? () => onIlgiliBas?.(item)
        : () => onCocukBas?.(item);

    return (
      <SayimSatiri
        baslik={item.baslik}
        sayi={sayi}
        hizmet={hizmet}
        onPress={onPress}
      />
    );
  };

  return (
    <FlatList
      data={bolumler}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      ListHeaderComponent={
        <>
          {listeHeader}
          {yukleniyor ? (
            <View style={styles.sayimYukleniyor}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={styles.sayimYukleniyorText}>İlan sayıları güncelleniyor…</Text>
            </View>
          ) : null}
        </>
      }
      ItemSeparatorComponent={() => <View style={styles.ayrac} />}
      contentContainerStyle={styles.liste}
      style={styles.flex}
    />
  );
}

/** Ana kategori satırı — alt başlıklı (Arama sekmesi kök listesi) */
export function KategoriKokSatiri({ kategori, altMetin, onPress }) {
  return (
    <TouchableOpacity style={styles.kokSatir} onPress={onPress} activeOpacity={0.75}>
      <View style={[styles.kokIcon, { backgroundColor: kategori.renkBg }]}>
        <Text style={styles.kokEmoji}>{kategori.emoji}</Text>
      </View>
      <View style={styles.kokMetin}>
        <Text style={styles.kokBaslik}>{kategori.baslik}</Text>
        {altMetin ? (
          <Text style={styles.kokAlt} numberOfLines={2}>
            {altMetin}
          </Text>
        ) : null}
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
    </TouchableOpacity>
  );
}

export { getAltBaslikMetni };

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.surface },
  liste: { paddingBottom: 24 },
  sayimYukleniyor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.background,
  },
  sayimYukleniyorText: { fontSize: 12, color: colors.textMuted },
  satir: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    minHeight: 48,
  },
  satirSol: { flex: 1, paddingRight: 8 },
  satirBaslik: { fontSize: 15, color: colors.text, fontWeight: '500' },
  satirVurgulu: { color: colors.primary, fontWeight: '700' },
  satirSag: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  sayi: { fontSize: 14, color: colors.textMuted },
  sayiVurgulu: { color: colors.primary, fontWeight: '600' },
  ayrac: { height: 1, backgroundColor: colors.border, marginLeft: spacing.lg },
  bolumBaslik: {
    backgroundColor: colors.background,
    paddingVertical: 10,
    paddingHorizontal: spacing.lg,
  },
  bolumBaslikText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  kokSatir: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  kokIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  kokEmoji: { fontSize: 22 },
  kokMetin: { flex: 1 },
  kokBaslik: { fontSize: 16, fontWeight: '700', color: colors.text },
  kokAlt: { fontSize: 13, color: colors.textSecondary, marginTop: 3, lineHeight: 18 },
});
