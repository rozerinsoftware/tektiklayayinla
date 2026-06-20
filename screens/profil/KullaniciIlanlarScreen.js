import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { getIlanlar } from '../../api';
import { colors, spacing, radius, formatFiyat } from '../../constants/theme';
import { ilanYayinda, ilanBitisTarihi, formatIlanTarih } from '../../utils/ilanYardimci';
import { ilanKapakFotoUrl, ILAN_FOTO_HEADERS } from '../../utils/ilanFoto';

export default function KullaniciIlanlarScreen({ navigation, route }) {
  const mod = route.params?.mod || 'yayinda';
  const [liste, setListe] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [arama, setArama] = useState('');

  const yukle = useCallback(async () => {
    try {
      setYukleniyor(true);
      const tum = await getIlanlar();
      const filtre =
        mod === 'yayinda'
          ? tum.filter(ilanYayinda)
          : tum.filter((i) => !ilanYayinda(i));
      setListe(filtre);
    } catch {
      setListe([]);
    } finally {
      setYukleniyor(false);
    }
  }, [mod]);

  useFocusEffect(
    useCallback(() => {
      yukle();
    }, [yukle])
  );

  const gorunen = liste.filter((i) => {
    const q = arama.trim().toLowerCase();
    if (!q) return true;
    return (
      String(i.baslik || '').toLowerCase().includes(q) ||
      String(i.id || '').includes(q)
    );
  });

  const bosMetin =
    mod === 'yayinda'
      ? 'Yayında ilanınız bulunmuyor.'
      : 'Yayında olmayan ilanınız bulunmuyor.';

  if (yukleniyor && liste.length === 0) {
    return (
      <View style={styles.merkez}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <FlatList
      style={styles.liste}
      data={gorunen}
      keyExtractor={(item) => String(item.id)}
      refreshControl={<RefreshControl refreshing={yukleniyor} onRefresh={yukle} />}
      ListHeaderComponent={
        <View style={styles.aramaKutu}>
          <Ionicons name="search" size={18} color={colors.textMuted} />
          <TextInput
            style={styles.aramaInput}
            placeholder="Kelime / ilan no ile ara"
            placeholderTextColor={colors.textMuted}
            value={arama}
            onChangeText={setArama}
          />
        </View>
      }
      ListEmptyComponent={
        <View style={styles.bos}>
          <Text style={styles.bosMetin}>{bosMetin}</Text>
        </View>
      }
      renderItem={({ item }) => {
        const kapakFoto = ilanKapakFotoUrl(item);
        return (
        <TouchableOpacity
          style={styles.kart}
          onPress={() => navigation.navigate('IlanYonetim', { ilan: item })}
          activeOpacity={0.85}
        >
          <View style={styles.foto}>
            {kapakFoto ? (
              <Image
                source={{ uri: kapakFoto, headers: ILAN_FOTO_HEADERS }}
                style={styles.fotoImg}
              />
            ) : (
              <Ionicons name="camera-outline" size={24} color={colors.textMuted} />
            )}
          </View>
          <View style={styles.kartMetin}>
            <Text style={styles.kartBaslik} numberOfLines={1}>
              {item.baslik}
            </Text>
            <Text style={styles.kartFiyat}>{formatFiyat(item.fiyat)}</Text>
            <Text style={styles.kartMeta}>#{item.id?.slice?.(0, 8) || item.id}</Text>
            <Text style={styles.kartMeta}>
              Bitiş: {formatIlanTarih(ilanBitisTarihi(item))}
            </Text>
            <View style={styles.durumSatir}>
              <Ionicons
                name={ilanYayinda(item) ? 'globe-outline' : 'pause-circle-outline'}
                size={14}
                color={ilanYayinda(item) ? colors.success : colors.textMuted}
              />
              <Text style={styles.durumText}>{ilanYayinda(item) ? 'Yayında' : 'Pasif'}</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </TouchableOpacity>
        );
      }}
      contentContainerStyle={gorunen.length === 0 ? styles.bosListe : styles.doluListe}
    />
  );
}

const styles = StyleSheet.create({
  liste: { flex: 1, backgroundColor: colors.background },
  doluListe: { padding: spacing.md, paddingBottom: 32 },
  bosListe: { flexGrow: 1 },
  merkez: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  aramaKutu: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    height: 44,
    marginBottom: spacing.md,
  },
  aramaInput: { flex: 1, fontSize: 15, color: colors.text },
  bos: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xl },
  bosMetin: { fontSize: 15, color: colors.textSecondary, textAlign: 'center' },
  kart: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  foto: {
    width: 72,
    height: 72,
    borderRadius: radius.sm,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  fotoImg: { width: 72, height: 72 },
  kartMetin: { flex: 1 },
  kartBaslik: { fontSize: 16, fontWeight: '700', color: colors.text },
  kartFiyat: { fontSize: 17, fontWeight: '800', color: colors.text, marginTop: 4 },
  kartMeta: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  durumSatir: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  durumText: { fontSize: 12, fontWeight: '600', color: colors.textSecondary },
});
