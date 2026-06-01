import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getTumIlanlar, deleteIlan } from '../api';
import { getCurrentUserId } from '../auth';
import { girisIste } from '../utils/requireAuth';
import { ilanKategoriEslesir } from '../constants/kategoriler';
import { colors, radius, spacing } from '../constants/theme';
import IlanKart from '../components/IlanKart';

export default function IlanListesiScreen({ navigation, route }) {
  const aramaModu = route.params?.aramaModu === true;
  const kategoriId = route.params?.kategoriId || null;
  const kategoriBaslik = route.params?.kategoriBaslik || null;
  const [ilanlar, setIlanlar] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [arama, setArama] = useState('');

  const ilanlariGetir = async () => {
    try {
      setYukleniyor(true);
      const data = await getTumIlanlar();
      setIlanlar(data);
    } catch (error) {
      setIlanlar([]);
      if (__DEV__) console.warn('İlanlar yüklenemedi:', error?.message);
    } finally {
      setYukleniyor(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', ilanlariGetir);
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (kategoriBaslik) {
      navigation.setOptions({ title: kategoriBaslik, headerShown: true });
    }
  }, [navigation, kategoriBaslik]);

  const filtrelenmis = useMemo(() => {
    let liste = [...ilanlar];
    if (kategoriId) {
      liste = liste.filter((i) => ilanKategoriEslesir(i, kategoriId));
    }
    const q = arama.trim().toLowerCase();
    if (q) {
      liste = liste.filter(
        (i) =>
          String(i.baslik || '').toLowerCase().includes(q) ||
          String(i.aciklama || '').toLowerCase().includes(q) ||
          String(i.fiyat || '').includes(q)
      );
    }
    return liste;
  }, [ilanlar, arama, kategoriId]);

  const ilanSil = (id) => {
    Alert.alert('İlan Sil', 'Bu ilanı silmek istediğinize emin misiniz?', [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Sil',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteIlan(id);
            ilanlariGetir();
          } catch (error) {
            Alert.alert('Silinemedi', error?.message || 'İlan silinirken bir hata oluştu.');
          }
        },
      },
    ]);
  };

  const yeniIlan = () => {
    if (!girisIste(navigation)) return;
    const tabNav = navigation.getParent();
    if (tabNav) {
      tabNav.navigate('İlan Ver', { screen: 'IlanEkle' });
      return;
    }
    navigation.navigate('IlanEkle');
  };

  const uid = getCurrentUserId();

  const listeBos = () => (
    <View style={styles.bos}>
      <Text style={styles.bosEmoji}>📭</Text>
      <Text style={styles.bosBaslik}>
        {arama || kategoriId ? 'Sonuç bulunamadı' : 'Henüz ilan yok'}
      </Text>
      <Text style={styles.bosMetin}>
        {arama || kategoriId
          ? 'Farklı bir arama veya kategori deneyin.'
          : 'İlk ilanınızı ekleyerek başlayın.'}
      </Text>
      {!arama && !kategoriId ? (
        <TouchableOpacity style={styles.bosButon} onPress={yeniIlan}>
          <Text style={styles.bosButonText}>+ İlan Ver</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );

  const listeBasligi = () => (
    <>
      <View style={styles.header}>
        <Text style={styles.headerLogo}>TekTıklaYayınla</Text>
        <Text style={styles.headerAlt}>
          {kategoriBaslik
            ? kategoriBaslik
            : aramaModu
              ? 'İlan ara'
              : `${filtrelenmis.length} ilan listeleniyor`}
        </Text>
      </View>

      <View style={styles.aramaKutu}>
        <Text style={styles.aramaIkon}>🔍</Text>
        <TextInput
          style={styles.aramaInput}
          placeholder="Kelime, fiyat veya açıklama ara..."
          placeholderTextColor={colors.textMuted}
          selectionColor={colors.cursor}
          cursorColor={colors.cursor}
          value={arama}
          onChangeText={setArama}
        />
      </View>

      {kategoriId ? (
        <TouchableOpacity
          style={styles.kategoriGeriChip}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.kategoriGeriText}>← Kategorilere dön</Text>
        </TouchableOpacity>
      ) : null}
    </>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {yukleniyor && ilanlar.length === 0 ? (
        <View style={styles.yukleniyorWrap}>
          {listeBasligi()}
          <ActivityIndicator size="large" color={colors.primaryDark} style={styles.loader} />
        </View>
      ) : (
        <FlatList
          data={filtrelenmis}
          keyExtractor={(item) => String(item.id)}
          ListHeaderComponent={listeBasligi}
          contentContainerStyle={styles.liste}
          refreshControl={<RefreshControl refreshing={yukleniyor} onRefresh={ilanlariGetir} />}
          ListEmptyComponent={listeBos}
          renderItem={({ item }) => (
            <IlanKart
              ilan={item}
              onPress={() => navigation.navigate('IlanDetay', { ilan: item })}
              onSil={uid && item.ownerId === uid ? () => ilanSil(item.id) : undefined}
            />
          )}
        />
      )}

      {!aramaModu && !kategoriId ? (
        <TouchableOpacity style={styles.fab} onPress={yeniIlan} activeOpacity={0.9}>
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  yukleniyorWrap: { flex: 1, backgroundColor: colors.background },
  header: {
    backgroundColor: colors.headerBg,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  headerLogo: { fontSize: 22, fontWeight: '800', color: colors.primaryText },
  headerAlt: { fontSize: 13, color: colors.primaryText, opacity: 0.75, marginTop: 2 },
  aramaKutu: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    marginHorizontal: spacing.lg,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    height: 48,
  },
  aramaIkon: { fontSize: 16, marginRight: spacing.sm },
  aramaInput: { flex: 1, fontSize: 15, color: colors.text },
  kategoriGeriChip: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    alignSelf: 'flex-start',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  kategoriGeriText: { fontSize: 13, fontWeight: '600', color: colors.primary },
  liste: { paddingHorizontal: spacing.lg, paddingBottom: 100, flexGrow: 1 },
  loader: { marginTop: 32 },
  bos: { alignItems: 'center', paddingTop: 48, paddingHorizontal: 32 },
  bosEmoji: { fontSize: 48, marginBottom: 12 },
  bosBaslik: { fontSize: 18, fontWeight: '700', color: colors.text },
  bosMetin: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginTop: 8 },
  bosButon: {
    marginTop: 20,
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: radius.md,
  },
  bosButonText: { fontWeight: '700', color: colors.primaryText, fontSize: 15 },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 2,
    borderColor: colors.primaryDark,
  },
  fabText: { fontSize: 28, fontWeight: '300', color: '#FFFFFF', marginTop: -2 },
});
