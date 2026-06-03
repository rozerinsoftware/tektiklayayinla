import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getTumIlanlar } from '../api';
import { ilanKategoriEslesir } from '../constants/kategoriler';
import { filtreYayindaIlanlar } from '../utils/ilanYardimci';
import { colors, radius, spacing } from '../constants/theme';
import IlanVitrinKart from '../components/IlanVitrinKart';
import { openIlanDetay } from '../utils/navigationHelpers';

export default function IkinciElVitrinScreen({ navigation }) {
  const [ilanlar, setIlanlar] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [arama, setArama] = useState('');

  const yukle = useCallback(async () => {
    try {
      setYukleniyor(true);
      const data = await getTumIlanlar();
      setIlanlar(data);
    } catch {
      setIlanlar([]);
    } finally {
      setYukleniyor(false);
    }
  }, []);

  useEffect(() => {
    const sub = navigation.addListener('focus', yukle);
    return sub;
  }, [navigation, yukle]);

  useEffect(() => {
    navigation.setOptions({
      title: 'İkinci El ve Sıfır Alışveriş',
      headerShown: true,
    });
  }, [navigation]);

  const ikinciElIlanlar = useMemo(() => {
    let liste = filtreYayindaIlanlar(ilanlar).filter((i) => ilanKategoriEslesir(i, 'ikinci-el'));
    const q = arama.trim().toLowerCase();
    if (q) {
      liste = liste.filter(
        (i) =>
          String(i.baslik || '').toLowerCase().includes(q) ||
          String(i.aciklama || '').toLowerCase().includes(q)
      );
    }
    return liste;
  }, [ilanlar, arama]);

  const kategorilereGit = () => {
    navigation.navigate('KategoriDetay', { kategoriId: 'ikinci-el', secimModu: false });
  };

  const tumuneGit = () => {
    navigation.navigate('IlanListesi', {
      kategoriId: 'ikinci-el',
      kategoriBaslik: 'İkinci El ve Sıfır Alışveriş',
      vitrin: true,
    });
  };

  const baslik = () => (
    <View style={styles.headerBlock}>
      <View style={styles.aramaKutu}>
        <Ionicons name="search" size={20} color={colors.textMuted} />
        <TextInput
          style={styles.aramaInput}
          placeholder="Alışveriş ilanlarında ara"
          placeholderTextColor={colors.textMuted}
          value={arama}
          onChangeText={setArama}
          selectionColor={colors.cursor}
        />
        <Ionicons name="mic-outline" size={20} color={colors.textMuted} />
      </View>

      <TouchableOpacity style={styles.kategoriBanner} onPress={kategorilereGit} activeOpacity={0.85}>
        <View style={styles.kategoriIcon}>
          <Ionicons name="grid" size={22} color="#7C3AED" />
        </View>
        <View style={styles.kategoriMetin}>
          <Text style={styles.kategoriBaslik}>Tüm alışveriş kategorileri</Text>
          <Text style={styles.kategoriAlt}>Tüm ikinci el ve sıfır ürünler</Text>
        </View>
        <Ionicons name="chevron-forward" size={22} color={colors.textMuted} />
      </TouchableOpacity>

      <View style={styles.bolumBaslik}>
        <Text style={styles.bolumBaslikText}>İlgilenebileceğiniz İlanlar</Text>
        <TouchableOpacity onPress={tumuneGit}>
          <Text style={styles.tumuLink}>Tümü</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const bos = () => (
    <View style={styles.bos}>
      <Text style={styles.bosEmoji}>📦</Text>
      <Text style={styles.bosMetin}>Henüz ikinci el ilanı yok</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      {yukleniyor && ilanlar.length === 0 ? (
        <View style={styles.loaderWrap}>
          {baslik()}
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 32 }} />
        </View>
      ) : (
        <FlatList
          data={ikinciElIlanlar}
          keyExtractor={(item) => String(item.id)}
          numColumns={2}
          columnWrapperStyle={styles.gridRow}
          ListHeaderComponent={baslik}
          ListEmptyComponent={bos}
          contentContainerStyle={styles.liste}
          refreshControl={<RefreshControl refreshing={yukleniyor} onRefresh={yukle} />}
          renderItem={({ item }) => (
            <View style={styles.gridHucre}>
              <IlanVitrinKart ilan={item} onPress={() => openIlanDetay(navigation, item)} />
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  loaderWrap: { flex: 1 },
  headerBlock: { backgroundColor: colors.surface, paddingBottom: spacing.sm },
  aramaKutu: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
    height: 44,
    backgroundColor: colors.background,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  aramaInput: { flex: 1, fontSize: 15, color: colors.text },
  kategoriBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
  },
  kategoriIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.sm,
    backgroundColor: '#EDE9FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  kategoriMetin: { flex: 1 },
  kategoriBaslik: { fontSize: 15, fontWeight: '700', color: colors.text },
  kategoriAlt: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  bolumBaslik: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.background,
  },
  bolumBaslikText: { fontSize: 15, fontWeight: '700', color: colors.text },
  tumuLink: { fontSize: 14, fontWeight: '600', color: colors.link },
  liste: { paddingHorizontal: spacing.sm, paddingBottom: 24, flexGrow: 1 },
  gridRow: { gap: spacing.sm },
  gridHucre: { flex: 1, maxWidth: '50%' },
  bos: { alignItems: 'center', paddingTop: 40, paddingHorizontal: 24 },
  bosEmoji: { fontSize: 40, marginBottom: 8 },
  bosMetin: { fontSize: 14, color: colors.textSecondary, textAlign: 'center' },
});
