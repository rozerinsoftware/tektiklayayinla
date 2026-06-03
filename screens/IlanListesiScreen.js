import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getTumIlanlar, deleteIlan } from '../api';
import { getCurrentUserId } from '../auth';
import { girisIste } from '../utils/requireAuth';
import { isFavoriArama, toggleFavoriArama } from '../utils/profilStorage';
import { ilanKategoriEslesir, getKategoriById } from '../constants/kategoriler';
import {
  filtreYayindaIlanlar,
  siralamaIlanlar,
  uygulaIlanFiltreleri,
  SIRALAMA_SECENEKLERI,
} from '../utils/ilanYardimci';
import IlanAramaToolbar from '../components/IlanAramaToolbar';
import { IlanFiltreModal, IlanSiralamaModal } from '../components/IlanFiltreModal';
import { colors, radius, spacing } from '../constants/theme';
import IlanKart from '../components/IlanKart';
import IlanVitrinKart from '../components/IlanVitrinKart';
import { openIlanDetay } from '../utils/navigationHelpers';

export default function IlanListesiScreen({ navigation, route }) {
  const aramaModu = route.params?.aramaModu === true;
  const kategoriId = route.params?.kategoriId || null;
  const kategoriBaslik = route.params?.kategoriBaslik || null;
  const ownerId = route.params?.ownerId || null;
  const vitrinParam = route.params?.vitrin;
  const [ilanlar, setIlanlar] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [arama, setArama] = useState(route.params?.initialArama || '');
  const [aramaFavori, setAramaFavori] = useState(false);
  const [siralama, setSiralama] = useState('en_yeni');
  const [filtre, setFiltre] = useState({});
  const [filtreModal, setFiltreModal] = useState(false);
  const [siraModal, setSiraModal] = useState(false);

  const kategoriBilgi = kategoriId ? getKategoriById(kategoriId) : null;
  const ikinciElModu = kategoriBilgi?.kokId === 'ikinci-el' || kategoriId === 'ikinci-el';

  const vitrinModu =
    vitrinParam === true ||
    (vitrinParam !== false && !ownerId && !aramaModu);

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
    } else if (vitrinModu && !kategoriId) {
      navigation.setOptions?.({ headerShown: false });
    }
  }, [navigation, kategoriBaslik, vitrinModu, kategoriId]);

  const aramaFavoriKontrol = useCallback(async () => {
    const metin = arama.trim();
    if (!metin && !kategoriId) {
      setAramaFavori(false);
      return;
    }
    setAramaFavori(await isFavoriArama({ aramaMetni: metin, kategoriId }));
  }, [arama, kategoriId]);

  useEffect(() => {
    aramaFavoriKontrol();
  }, [aramaFavoriKontrol]);

  const aramayiFavorile = async () => {
    if (!girisIste(navigation, 'Aramayı kaydetmek için giriş yapın.')) return;
    const metin = arama.trim();
    if (!metin && !kategoriId) {
      Alert.alert('Uyarı', 'Önce bir kelime yazın veya kategori seçin.');
      return;
    }
    const eklendi = await toggleFavoriArama({
      aramaMetni: metin,
      kategoriId,
      kategoriBaslik,
    });
    if (eklendi === null) return;
    setAramaFavori(eklendi);
  };

  const filtrelenmis = useMemo(() => {
    let liste = filtreYayindaIlanlar(ilanlar);
    if (ownerId) {
      liste = liste.filter((i) => i.ownerId === ownerId);
    }
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
    liste = uygulaIlanFiltreleri(liste, filtre);
    return siralamaIlanlar(liste, siralama);
  }, [ilanlar, arama, kategoriId, ownerId, filtre, siralama]);

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
    </View>
  );

  const anaVitrinBaslik = () => (
    <View style={styles.vitrinHeader}>
      <View style={styles.vitrinHeaderSatir}>
        <View style={styles.logoKutu}>
          <Text style={styles.logoHarfi}>T</Text>
        </View>
        <Text style={styles.vitrinBaslik}>Vitrin</Text>
        <TouchableOpacity
          style={styles.bildirimBtn}
          onPress={() => {
            if (!girisIste(navigation)) return;
            navigation.getParent()?.navigate('Profilim', { screen: 'Bildirimler' });
          }}
          hitSlop={8}
        >
          <Ionicons name="notifications-outline" size={24} color={colors.primaryText} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const listeBasligi = () => (
    <>
      {vitrinModu && !kategoriId ? anaVitrinBaslik() : null}

      {!vitrinModu || kategoriId ? (
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
      ) : null}

      {kategoriId || aramaModu || ownerId ? (
        <>
          <View style={styles.aramaSatir}>
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
            {(arama.trim() || kategoriId) && getCurrentUserId() ? (
              <TouchableOpacity style={styles.favoriAramaBtn} onPress={aramayiFavorile}>
                <Ionicons
                  name={aramaFavori ? 'star' : 'star-outline'}
                  size={26}
                  color={aramaFavori ? '#FACC15' : colors.primary}
                />
              </TouchableOpacity>
            ) : null}
          </View>
          {(kategoriId || aramaModu) && !ownerId ? (
            <IlanAramaToolbar
              siralamaLabel={SIRALAMA_SECENEKLERI.find((s) => s.id === siralama)?.label}
              onFiltre={() => setFiltreModal(true)}
              onSira={() => setSiraModal(true)}
              onGorunum={() => Alert.alert('Görünüm', vitrinModu ? 'Liste görünümü yakında.' : 'Grid görünümü aktif.')}
              onAramaKaydet={aramayiFavorile}
              chipEtiketler={
                ikinciElModu
                  ? [
                      { id: 'durum:sifir', label: 'Sıfır' },
                      { id: 'durum:iyi', label: 'İyi' },
                      { id: 'kimden:sahibinden', label: 'Sahibinden' },
                    ]
                  : []
              }
              aktifChip={
                filtre.durum === 'Sıfır'
                  ? 'durum:sifir'
                  : filtre.durum === 'İyi'
                    ? 'durum:iyi'
                    : filtre.kimden === 'Sahibinden'
                      ? 'kimden:sahibinden'
                      : null
              }
              onChip={(id) => {
                if (id === 'durum:sifir') setFiltre((p) => ({ ...p, durum: p.durum === 'Sıfır' ? '' : 'Sıfır' }));
                if (id === 'durum:iyi') setFiltre((p) => ({ ...p, durum: p.durum === 'İyi' ? '' : 'İyi' }));
                if (id === 'kimden:sahibinden') {
                  setFiltre((p) => ({ ...p, kimden: p.kimden === 'Sahibinden' ? '' : 'Sahibinden' }));
                }
              }}
            />
          ) : null}
        </>
      ) : null}

      {kategoriId ? (
        <TouchableOpacity style={styles.kategoriGeriChip} onPress={() => navigation.goBack()}>
          <Text style={styles.kategoriGeriText}>← Kategorilere dön</Text>
        </TouchableOpacity>
      ) : null}

      {vitrinModu && kategoriId ? (
        <View style={styles.vitrinBolumBaslik}>
          <Text style={styles.vitrinBolumText}>İlanlar</Text>
          <Text style={styles.vitrinBolumSayi}>{filtrelenmis.length} sonuç</Text>
        </View>
      ) : null}
    </>
  );

  const renderKart = ({ item }) => {
    const silFn = uid && item.ownerId === uid ? () => ilanSil(item.id) : undefined;
    if (vitrinModu) {
      return (
        <View style={styles.gridHucre}>
          <IlanVitrinKart
            ilan={item}
            onPress={() => openIlanDetay(navigation, item)}
            onSil={silFn}
          />
        </View>
      );
    }
    return (
      <IlanKart
        ilan={item}
        onPress={() => openIlanDetay(navigation, item)}
        onSil={silFn}
      />
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={vitrinModu && !kategoriId ? ['top'] : ['top']}>
      <IlanFiltreModal
        visible={filtreModal}
        onClose={() => setFiltreModal(false)}
        filtre={filtre}
        onUygula={setFiltre}
        ikinciElModu={ikinciElModu}
      />
      <IlanSiralamaModal
        visible={siraModal}
        onClose={() => setSiraModal(false)}
        siralama={siralama}
        onSec={setSiralama}
      />
      {yukleniyor && ilanlar.length === 0 ? (
        <View style={styles.yukleniyorWrap}>
          {listeBasligi()}
          <ActivityIndicator size="large" color={colors.primaryDark} style={styles.loader} />
        </View>
      ) : (
        <FlatList
          data={filtrelenmis}
          key={vitrinModu ? 'vitrin' : 'liste'}
          keyExtractor={(item) => String(item.id)}
          numColumns={vitrinModu ? 2 : 1}
          columnWrapperStyle={vitrinModu ? styles.gridRow : undefined}
          ListHeaderComponent={listeBasligi}
          contentContainerStyle={[styles.liste, vitrinModu && styles.listeVitrin]}
          refreshControl={<RefreshControl refreshing={yukleniyor} onRefresh={ilanlariGetir} />}
          ListEmptyComponent={listeBos}
          renderItem={renderKart}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  yukleniyorWrap: { flex: 1, backgroundColor: colors.background },
  vitrinHeader: {
    backgroundColor: colors.headerBg,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  vitrinHeaderSatir: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoKutu: {
    position: 'absolute',
    left: 0,
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#FACC15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoHarfi: { fontSize: 18, fontWeight: '900', color: '#1A1A1A' },
  vitrinBaslik: { fontSize: 18, fontWeight: '700', color: colors.primaryText },
  bildirimBtn: { position: 'absolute', right: 0, padding: 4 },
  header: {
    backgroundColor: colors.headerBg,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  headerLogo: { fontSize: 22, fontWeight: '800', color: colors.primaryText },
  headerAlt: { fontSize: 13, color: colors.primaryText, opacity: 0.75, marginTop: 2 },
  aramaSatir: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.lg,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  aramaKutu: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    height: 48,
  },
  favoriAramaBtn: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
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
  vitrinBolumBaslik: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.xs,
  },
  vitrinBolumText: { fontSize: 15, fontWeight: '700', color: colors.text },
  vitrinBolumSayi: { fontSize: 13, color: colors.textSecondary },
  liste: { paddingHorizontal: spacing.lg, paddingBottom: 24, flexGrow: 1 },
  listeVitrin: { paddingHorizontal: spacing.sm },
  gridRow: { gap: spacing.sm },
  gridHucre: { flex: 1, maxWidth: '50%' },
  loader: { marginTop: 32 },
  bos: { alignItems: 'center', paddingTop: 48, paddingHorizontal: 32, width: '100%' },
  bosEmoji: { fontSize: 48, marginBottom: 12 },
  bosBaslik: { fontSize: 18, fontWeight: '700', color: colors.text },
  bosMetin: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginTop: 8 },
});
