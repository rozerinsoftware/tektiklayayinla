import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getTumIlanlar, deleteIlan } from '../api';
import { getCurrentUserId } from '../auth';
import { girisIste } from '../utils/requireAuth';
import { isFavoriArama, toggleFavoriArama } from '../utils/profilStorage';
import { ilanKategoriEslesir, getKategoriById, getKategoriByYol } from '../constants/kategoriler';
import {
  filtreYayindaIlanlar,
  siralamaIlanlar,
  vitrinSiralamaIlanlar,
  uygulaIlanFiltreleri,
} from '../utils/ilanYardimci';
import IlanAramaToolbar from '../components/IlanAramaToolbar';
import { IlanFiltreModal, IlanSiralamaModal } from '../components/IlanFiltreModal';
import { colors, radius, spacing } from '../constants/theme';
import IlanKart from '../components/IlanKart';
import IlanVitrinKart from '../components/IlanVitrinKart';
import IlanAramaSatirKart from '../components/IlanAramaSatirKart';
import { openIlanDetay } from '../utils/navigationHelpers';

const EKRAN_GENISligi = Dimensions.get('window').width;
const VITRIN_YATAY_PAD = spacing.sm * 2;
const VITRIN_ARALIK = spacing.sm;
const VITRIN_HUCRE_GENISligi = (EKRAN_GENISligi - VITRIN_YATAY_PAD - VITRIN_ARALIK) / 2;

const vitrinHeaderStyles = StyleSheet.create({
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
});

const VitrinBaslik = React.memo(function VitrinBaslik({ navigation }) {
  return (
    <View style={vitrinHeaderStyles.vitrinHeader}>
      <View style={vitrinHeaderStyles.vitrinHeaderSatir}>
        <View style={vitrinHeaderStyles.logoKutu}>
          <Text style={vitrinHeaderStyles.logoHarfi}>T</Text>
        </View>
        <Text style={vitrinHeaderStyles.vitrinBaslik}>Vitrin</Text>
        <TouchableOpacity
          style={vitrinHeaderStyles.bildirimBtn}
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
});

export default function IlanListesiScreen({ navigation, route }) {
  const aramaModu = route.params?.aramaModu === true;
  const kategoriId = route.params?.kategoriId || null;
  const kategoriYolu = route.params?.kategoriYolu || null;
  const kategoriBaslik = route.params?.kategoriBaslik || null;
  const ownerId = route.params?.ownerId || null;
  const vitrinParam = route.params?.vitrin;
  const tumIlanlarModu = route.params?.tumIlanlar === true;

  const [ilanlar, setIlanlar] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [yenileniyor, setYenileniyor] = useState(false);
  const [arama, setArama] = useState(route.params?.initialArama || '');
  const [aramaFavori, setAramaFavori] = useState(false);
  const [siralama, setSiralama] = useState('en_yeni');
  const [filtre, setFiltre] = useState({});
  const [filtreModal, setFiltreModal] = useState(false);
  const [siraModal, setSiraModal] = useState(false);
  const [gorunum, setGorunum] = useState(
    route.params?.tumIlanlar || route.params?.aramaModu ? 'liste' : 'grid'
  );

  const kategoriBilgi = kategoriYolu?.length
    ? getKategoriByYol(kategoriYolu)
    : kategoriId
      ? getKategoriById(kategoriId)
      : null;
  const ikinciElModu = kategoriBilgi?.kokId === 'ikinci-el' || kategoriId === 'ikinci-el';
  const isMakineleriModu =
    kategoriBilgi?.kokId === 'is-makineleri' || kategoriId === 'is-makineleri';

  const vitrinModu =
    !tumIlanlarModu &&
    (vitrinParam === true || (vitrinParam !== false && !ownerId && !aramaModu));
  const anaVitrinEkrani =
    vitrinModu && !kategoriId && !ownerId && !aramaModu && !tumIlanlarModu;
  const sahibindenListeEkrani = tumIlanlarModu || aramaModu || (kategoriId && !vitrinModu);

  const ilanlariGetir = useCallback(async (cekme = false) => {
    try {
      if (cekme) setYenileniyor(true);
      else setYukleniyor(true);
      const data = await getTumIlanlar();
      setIlanlar(Array.isArray(data) ? data : []);
    } catch (error) {
      if (!cekme) setIlanlar([]);
      if (__DEV__) console.warn('İlanlar yüklenemedi:', error?.message);
    } finally {
      if (cekme) setYenileniyor(false);
      else setYukleniyor(false);
    }
  }, []);

  useEffect(() => {
    ilanlariGetir(false);
  }, [ilanlariGetir]);

  useEffect(() => {
    if (route.params?.yenile) {
      ilanlariGetir(true);
    }
  }, [route.params?.yenile, ilanlariGetir]);

  useEffect(() => {
    if (tumIlanlarModu) {
      navigation.setOptions({ title: 'Tüm İlanlar', headerShown: true });
    } else if (kategoriBaslik) {
      navigation.setOptions({ title: kategoriBaslik, headerShown: true });
    } else if (vitrinModu && !kategoriId) {
      navigation.setOptions?.({ headerShown: false });
    }
  }, [navigation, kategoriBaslik, vitrinModu, kategoriId, tumIlanlarModu]);

  useEffect(() => {
    (async () => {
      const metin = arama.trim();
      if (!metin && !kategoriId) {
        setAramaFavori(false);
        return;
      }
      setAramaFavori(await isFavoriArama({ aramaMetni: metin, kategoriId }));
    })();
  }, [arama, kategoriId]);

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
    if (ownerId) liste = liste.filter((i) => i.ownerId === ownerId);
    if (kategoriId) liste = liste.filter((i) => ilanKategoriEslesir(i, kategoriId, kategoriYolu));
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
    return anaVitrinEkrani
      ? vitrinSiralamaIlanlar(liste, siralama)
      : siralamaIlanlar(liste, siralama);
  }, [ilanlar, arama, kategoriId, kategoriYolu, ownerId, filtre, siralama, anaVitrinEkrani]);

  const tumIlanlaraGit = useCallback(() => {
    navigation.push('IlanListesi', { tumIlanlar: true, vitrin: false });
  }, [navigation]);

  const ilanSil = useCallback(
    (id) => {
      Alert.alert('İlan Sil', 'Bu ilanı silmek istediğinize emin misiniz?', [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteIlan(id);
              ilanlariGetir(true);
            } catch (error) {
              Alert.alert('Silinemedi', error?.message || 'İlan silinirken bir hata oluştu.');
            }
          },
        },
      ]);
    },
    [ilanlariGetir]
  );

  const silmeFn = (ownerId) => {
    if (!ownerId) return undefined;
    let mevcutUid = null;
    try {
      mevcutUid = getCurrentUserId();
    } catch {
      return undefined;
    }
    if (!mevcutUid || mevcutUid !== ownerId) return undefined;
    return (id) => ilanSil(id);
  };

  const vitrinGridKart = (item) => {
    const silFn = silmeFn(item.ownerId);
    return (
      <View key={String(item.id)} style={styles.vitrinHucre}>
        <IlanVitrinKart
          ilan={item}
          onPress={() => openIlanDetay(navigation, item)}
          onSil={silFn ? () => silFn(item.id) : undefined}
        />
      </View>
    );
  };

  const listeSatirKart = (item) => {
    const oneCikan = item.oneCikan || item.kategoriKok === 'emlak' || item.kategoriKok === 'vasita';
    return (
      <IlanAramaSatirKart
        key={String(item.id)}
        ilan={item}
        oneCikan={oneCikan}
        onPress={() => openIlanDetay(navigation, item)}
      />
    );
  };

  const renderKart = useCallback(
    ({ item }) => {
      let mevcutUid = null;
      try {
        mevcutUid = getCurrentUserId();
      } catch {
        mevcutUid = null;
      }
      const silFn = mevcutUid && item.ownerId === mevcutUid ? () => ilanSil(item.id) : undefined;
      return (
        <IlanKart
          ilan={item}
          onPress={() => openIlanDetay(navigation, item)}
          onSil={silFn}
        />
      );
    },
    [navigation, ilanSil]
  );

  const listHeader = useMemo(
    () => (
      <>
        {anaVitrinEkrani ? <VitrinBaslik navigation={navigation} /> : null}

        {tumIlanlarModu ? (
          <IlanAramaToolbar
            onFiltre={() => setFiltreModal(true)}
            onSira={() => setSiraModal(true)}
            onGorunum={() => setGorunum((g) => (g === 'grid' ? 'liste' : 'grid'))}
            onAramaKaydet={aramayiFavorile}
          />
        ) : null}

        {!anaVitrinEkrani && !tumIlanlarModu ? (
          <View style={styles.header}>
            <Text style={styles.headerLogo}>
              {aramaModu && arama.trim() ? 'Arama Sonucu' : 'TekTıklaYayınla'}
            </Text>
            <Text style={styles.headerAlt}>
              {kategoriBaslik
                ? `${filtrelenmis.length} ilan · ${kategoriBaslik}`
                : aramaModu
                  ? `${filtrelenmis.length} ilan`
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
                onFiltre={() => setFiltreModal(true)}
                onSira={() => setSiraModal(true)}
                onGorunum={() => setGorunum((g) => (g === 'grid' ? 'liste' : 'grid'))}
                onAramaKaydet={aramayiFavorile}
                chipEtiketler={
                  ikinciElModu
                    ? [
                        { id: 'durum:sifir', label: 'Sıfır' },
                        { id: 'durum:iyi', label: 'İyi' },
                        { id: 'kimden:sahibinden', label: 'Sahibinden' },
                      ]
                    : isMakineleriModu
                      ? [
                          { id: 'durum:sifir', label: 'Sıfır' },
                          { id: 'durum:ikinci', label: '2. El' },
                          { id: 'kimden:sahibinden', label: 'Sahibinden' },
                        ]
                      : []
                }
                aktifChip={
                  filtre.durum === 'Sıfır'
                    ? 'durum:sifir'
                    : filtre.durum === 'İyi'
                      ? 'durum:iyi'
                      : filtre.durum === '2. El'
                        ? 'durum:ikinci'
                        : filtre.kimden === 'Sahibinden'
                          ? 'kimden:sahibinden'
                          : null
                }
                onChip={(id) => {
                  if (id === 'durum:sifir') setFiltre((p) => ({ ...p, durum: p.durum === 'Sıfır' ? '' : 'Sıfır' }));
                  if (id === 'durum:iyi') setFiltre((p) => ({ ...p, durum: p.durum === 'İyi' ? '' : 'İyi' }));
                  if (id === 'durum:ikinci') setFiltre((p) => ({ ...p, durum: p.durum === '2. El' ? '' : '2. El' }));
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
    ),
    [
      anaVitrinEkrani,
      tumIlanlarModu,
      kategoriId,
      kategoriBaslik,
      aramaModu,
      arama,
      filtrelenmis.length,
      arama,
      aramaFavori,
      ikinciElModu,
      isMakineleriModu,
      siralama,
      filtre,
      ownerId,
      vitrinModu,
      navigation,
    ]
  );

  const listeBos = () => (
    <View style={styles.bos}>
      <Text style={styles.bosEmoji}>📭</Text>
      <Text style={styles.bosBaslik}>
        {arama || kategoriId ? 'Sonuç bulunamadı' : 'Henüz ilan yok'}
      </Text>
      <Text style={styles.bosMetin}>
        {arama || kategoriId
          ? 'Farklı bir arama veya kategori deneyin.'
          : 'İlan Ver ile ilk ilanınızı yayınlayın veya admin panelinden örnek ilanları yükleyin.'}
      </Text>
      {anaVitrinEkrani ? (
        <TouchableOpacity
          style={styles.bosBtn}
          onPress={() => navigation.getParent()?.navigate('İlan Ver')}
        >
          <Text style={styles.bosBtnText}>+ İlan Ver</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );

  const vitrinIcerik = (
    <>
      <View style={styles.vitrinGrid}>{filtrelenmis.map((item) => vitrinGridKart(item))}</View>
      {filtrelenmis.length > 0 ? (
        <TouchableOpacity style={styles.tumunuGoster} onPress={tumIlanlaraGit} activeOpacity={0.85}>
          <Text style={styles.tumunuGosterText}>Tüm İlanlar</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.primary} />
        </TouchableOpacity>
      ) : null}
    </>
  );

  const listeModuIcerik =
    gorunum === 'liste' ? (
      <View style={styles.listeGorunum}>{filtrelenmis.map((item) => listeSatirKart(item))}</View>
    ) : (
      <View style={styles.vitrinGrid}>{filtrelenmis.map((item) => vitrinGridKart(item))}</View>
    );

  return (
    <View style={styles.kok}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <IlanFiltreModal
          visible={filtreModal}
          onClose={() => setFiltreModal(false)}
          filtre={filtre}
          onUygula={setFiltre}
          ikinciElModu={ikinciElModu}
          isMakineleriModu={isMakineleriModu}
          vitrinModu={tumIlanlarModu || (vitrinModu && !!kategoriId)}
          sonucSayisi={filtrelenmis.length}
        />
        <IlanSiralamaModal
          visible={siraModal}
          onClose={() => setSiraModal(false)}
          siralama={siralama}
          onSec={setSiralama}
        />
        {yukleniyor && ilanlar.length === 0 ? (
          <View style={styles.yukleniyorWrap}>
            {listHeader}
            <ActivityIndicator size="large" color={colors.primaryDark} style={styles.loader} />
          </View>
        ) : anaVitrinEkrani ? (
          <ScrollView
            style={styles.listeFlex}
            contentContainerStyle={[styles.liste, styles.listeVitrin]}
            showsVerticalScrollIndicator
            refreshControl={
              <RefreshControl refreshing={yenileniyor} onRefresh={() => ilanlariGetir(true)} />
            }
          >
            {listHeader}
            {filtrelenmis.length === 0 ? listeBos() : vitrinIcerik}
          </ScrollView>
        ) : vitrinModu ? (
          <ScrollView
            style={styles.listeFlex}
            contentContainerStyle={[styles.liste, styles.listeVitrin]}
            showsVerticalScrollIndicator
            refreshControl={
              <RefreshControl refreshing={yenileniyor} onRefresh={() => ilanlariGetir(true)} />
            }
          >
            {listHeader}
            {filtrelenmis.length === 0 ? listeBos() : listeModuIcerik}
          </ScrollView>
        ) : (
          <FlatList
            style={styles.listeFlex}
            data={filtrelenmis}
            keyExtractor={(item) => String(item.id)}
            ListHeaderComponent={listHeader}
            contentContainerStyle={styles.liste}
            refreshControl={
              <RefreshControl refreshing={yenileniyor} onRefresh={() => ilanlariGetir(true)} />
            }
            ListEmptyComponent={listeBos}
            renderItem={({ item }) =>
              gorunum === 'liste' && (sahibindenListeEkrani || tumIlanlarModu) ? (
                <IlanAramaSatirKart
                  ilan={item}
                  oneCikan={item.oneCikan || item.kategoriKok === 'emlak' || item.kategoriKok === 'vasita'}
                  onPress={() => openIlanDetay(navigation, item)}
                />
              ) : (
                renderKart({ item })
              )
            }
          />
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  kok: { flex: 1, backgroundColor: colors.background },
  safe: { flex: 1, backgroundColor: colors.background },
  yukleniyorWrap: { flex: 1, backgroundColor: colors.background },
  listeFlex: { flex: 1 },
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
  vitrinBolum: { marginBottom: spacing.md },
  vitrinBolumText: { fontSize: 15, fontWeight: '700', color: colors.text },
  vitrinBolumSayi: { fontSize: 13, color: colors.textSecondary },
  ilanSayiSatir: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  ilanSayiText: { fontSize: 13, color: colors.textSecondary, fontWeight: '600' },
  tumunuGoster: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 16,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tumunuGosterText: { fontSize: 14, fontWeight: '700', color: colors.primary },
  listeGorunum: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  liste: { paddingHorizontal: spacing.lg, paddingBottom: 32 },
  listeVitrin: { paddingHorizontal: spacing.sm, paddingTop: spacing.sm },
  vitrinGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: VITRIN_ARALIK,
  },
  vitrinHucre: { width: VITRIN_HUCRE_GENISligi },
  loader: { marginTop: 32 },
  bos: { alignItems: 'center', paddingTop: 48, paddingHorizontal: 32, width: '100%' },
  bosEmoji: { fontSize: 48, marginBottom: 12 },
  bosBaslik: { fontSize: 18, fontWeight: '700', color: colors.text },
  bosMetin: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginTop: 8 },
  bosBtn: {
    marginTop: spacing.lg,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: 12,
    borderRadius: radius.md,
  },
  bosBtnText: { color: colors.primaryText, fontWeight: '700', fontSize: 15 },
});
