import React, { useCallback, useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  Dimensions,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { deleteIlan, getUserPublicProfile, incrementIlanStat } from '../api';
import { getOrCreateKonusma } from '../api/mesajlar';
import { getCurrentUserId } from '../auth';
import { girisIste } from '../utils/requireAuth';
import { mesajDetayGit } from '../utils/mesajNav';
import {
  isFavoriIlan,
  toggleFavoriIlan,
  isFavoriSatici,
  toggleFavoriSatici,
} from '../utils/profilStorage';
import { konumHaritadaAc, formatKonumEtiket } from '../utils/konum';
import { colors, radius, shadow, spacing, getKategoriMeta, formatFiyat } from '../constants/theme';

const DETAY_ETIKETLER = {
  ilanTuru: 'İlan Türü',
  emlakTipi: 'Emlak Tipi',
  metrekare: 'Metrekare',
  metrekareBrut: 'm² (Brüt)',
  metrekareNet: 'm² (Net)',
  odaSayisi: 'Oda Sayısı',
  binaYasi: 'Bina Yaşı',
  kat: 'Bulunduğu Kat',
  katSayisi: 'Kat Sayısı',
  isitma: 'Isıtma',
  banyoSayisi: 'Banyo Sayısı',
  mutfak: 'Mutfak',
  balkon: 'Balkon',
  asansor: 'Asansör',
  otopark: 'Otopark',
  esyali: 'Eşyalı',
  kullanimDurumu: 'Kullanım Durumu',
  aidat: 'Aidat (TL)',
  krediyeUygun: 'Krediye Uygun',
  enerjiKimlik: 'Enerji Kimlik Belgesi',
  tapuDurumu: 'Tapu Durumu',
  tasinmazNo: 'Taşınmaz Numarası',
  kimden: 'Kimden',
  takasli: 'Takaslı',
  imarDurumu: 'İmar Durumu',
  aracTipi: 'Araç Tipi',
  marka: 'Marka',
  model: 'Model',
  yil: 'Yıl',
  kilometre: 'Kilometre',
  yakit: 'Yakıt',
  vites: 'Vites',
  urunTipi: 'Ürün Tipi',
  durum: 'Durum',
};

export default function IlanDetayScreen({ navigation, route }) {
  const ilan = route.params?.ilan || {};
  const sahibi = getCurrentUserId() && ilan.ownerId === getCurrentUserId();
  const meta = getKategoriMeta(ilan.kategori);
  const platformlar = Array.isArray(ilan.platformlar) ? ilan.platformlar : [];
  const konumMetni = formatKonumEtiket(ilan.konum);
  const [favori, setFavori] = useState(false);
  const [saticiFavori, setSaticiFavori] = useState(false);
  const [saticiAd, setSaticiAd] = useState('');

  const favoriDurumunuYukle = useCallback(async () => {
    if (!ilan.id) return;
    setFavori(await isFavoriIlan(ilan.id));
    if (ilan.ownerId && !sahibi) {
      setSaticiFavori(await isFavoriSatici(ilan.ownerId));
      const profil = await getUserPublicProfile(ilan.ownerId).catch(() => null);
      if (profil?.ad) setSaticiAd(profil.ad);
    }
  }, [ilan.id, ilan.ownerId, sahibi]);

  useFocusEffect(
    useCallback(() => {
      favoriDurumunuYukle();
      if (ilan.id && !sahibi) {
        incrementIlanStat(ilan.id, 'goruntulenme');
      }
    }, [favoriDurumunuYukle, ilan.id, sahibi])
  );

  const mesajAt = useCallback(async () => {
    if (!girisIste(navigation, 'Mesaj göndermek için giriş yapın.')) return;
    if (!ilan.id || !ilan.ownerId) {
      Alert.alert('Uyarı', 'Bu ilan için mesaj başlatılamıyor.');
      return;
    }
    try {
      const k = await getOrCreateKonusma({
        ilanId: ilan.id,
        ilanBaslik: ilan.baslik,
        ownerId: ilan.ownerId,
      });
      mesajDetayGit(navigation, {
        konusmaId: k.id,
        ilanBaslik: k.ilanBaslik,
        ilanId: k.ilanId,
        karsiAd: k.digerAd,
      });
    } catch (e) {
      Alert.alert('Mesaj', e?.message || 'Sohbet başlatılamadı.');
    }
  }, [navigation, ilan]);

  const favoriToggle = useCallback(async () => {
    if (!girisIste(navigation, 'Favorilere eklemek için giriş yapın.')) return;
    if (!ilan.id) return;
    const eklendi = await toggleFavoriIlan(ilan);
    setFavori(eklendi);
    if (eklendi && ilan.id) {
      incrementIlanStat(ilan.id, 'favoriSayisi');
    }
  }, [navigation, ilan]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={favoriToggle} hitSlop={12} style={styles.headerFavori}>
          <Ionicons
            name={favori ? 'star' : 'star-outline'}
            size={26}
            color={favori ? '#FACC15' : colors.primaryText}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation, favori, favoriToggle]);

  const saticiFavoriToggle = async () => {
    if (!girisIste(navigation, 'Satıcıyı favorilere eklemek için giriş yapın.')) return;
    if (!ilan.ownerId) return;
    const eklendi = await toggleFavoriSatici({
      ownerId: ilan.ownerId,
      ad: saticiAd || 'Satıcı',
      alt: ilan.kategoriEtiket || ilan.kategori || '',
    });
    setSaticiFavori(eklendi);
  };

  const detaySatirlari = Object.entries(DETAY_ETIKETLER)
    .filter(([key]) => ilan[key])
    .map(([key, label]) => ({ label, value: ilan[key] }));

  const ilanSil = () => {
    Alert.alert('İlanı Sil', 'Bu ilanı silmek istediğinize emin misiniz?', [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Sil',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteIlan(ilan.id);
            navigation.goBack();
          } catch (error) {
            Alert.alert('Hata', error?.message || 'Silinemedi.');
          }
        },
      },
    ]);
  };

  const fotograflar = Array.isArray(ilan.fotograflar) ? ilan.fotograflar.filter(Boolean) : [];
  const ekranGen = Dimensions.get('window').width;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {fotograflar.length > 0 ? (
        <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
          {fotograflar.map((uri, i) => (
            <Image key={uri + i} source={{ uri }} style={[styles.heroFoto, { width: ekranGen }]} />
          ))}
        </ScrollView>
      ) : (
        <View style={[styles.hero, { backgroundColor: meta.bg }]}>
          <Text style={styles.heroEmoji}>{meta.emoji}</Text>
          {ilan.kategori ? (
            <View style={[styles.kategoriBadge, { backgroundColor: meta.renk }]}>
              <Text style={styles.kategoriBadgeText}>{ilan.kategori}</Text>
            </View>
          ) : null}
        </View>
      )}

      <View style={styles.kart}>
        <Text style={styles.fiyat}>{formatFiyat(ilan.fiyat)}</Text>
        <Text style={styles.baslik}>{ilan.baslik}</Text>
        <Text style={styles.aciklama}>{ilan.aciklama}</Text>
      </View>

      {konumMetni ? (
        <TouchableOpacity
          style={styles.kart}
          onPress={() => konumHaritadaAc(ilan.konum)}
          activeOpacity={0.85}
        >
          <Text style={styles.bolumBaslik}>Konum</Text>
          <View style={styles.konumSatir}>
            <Ionicons name="location" size={22} color={colors.primary} />
            <Text style={styles.konumMetin}>{konumMetni}</Text>
          </View>
          <Text style={styles.konumHarita}>Haritada göster →</Text>
        </TouchableOpacity>
      ) : null}

      {ilan.ownerId && !sahibi ? (
        <View style={styles.kart}>
          <Text style={styles.bolumBaslik}>İlan sahibi</Text>
          <Text style={styles.saticiAd}>{saticiAd || 'Satıcı'}</Text>
          <TouchableOpacity style={styles.mesajBtn} onPress={mesajAt} activeOpacity={0.85}>
            <Ionicons name="chatbubble-outline" size={20} color={colors.primaryText} />
            <Text style={styles.mesajBtnText}>Mesaj gönder</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saticiFavoriBtn} onPress={saticiFavoriToggle}>
            <Ionicons
              name={saticiFavori ? 'star' : 'star-outline'}
              size={20}
              color={saticiFavori ? '#FACC15' : colors.primary}
            />
            <Text style={styles.saticiFavoriText}>
              {saticiFavori ? 'Favori satıcıdan çıkar' : 'Favori satıcılarıma ekle'}
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {detaySatirlari.length > 0 ? (
        <View style={styles.kart}>
          <Text style={styles.bolumBaslik}>İlan Detayları</Text>
          {detaySatirlari.map((satir) => (
            <View key={satir.label} style={styles.detaySatir}>
              <Text style={styles.detayLabel}>{satir.label}</Text>
              <Text style={styles.detayDeger}>{satir.value}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {platformlar.length > 0 ? (
        <View style={styles.kart}>
          <Text style={styles.bolumBaslik}>Yayınlanan Platformlar</Text>
          <View style={styles.chipWrap}>
            {platformlar.map((p) => (
              <View key={p} style={styles.chip}>
                <Text style={styles.chipText}>✓ {p}</Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}

      {sahibi ? (
        <TouchableOpacity style={styles.silButon} onPress={ilanSil}>
          <Text style={styles.silButonText}>İlanı Sil</Text>
        </TouchableOpacity>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: 32 },
  headerFavori: { marginRight: 8 },
  heroFoto: { height: 220, resizeMode: 'cover' },
  hero: {
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroEmoji: { fontSize: 72 },
  kategoriBadge: {
    position: 'absolute',
    bottom: 16,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  kategoriBadgeText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  kart: {
    backgroundColor: colors.surface,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },
  fiyat: { fontSize: 26, fontWeight: '800', color: colors.price, marginBottom: 8 },
  baslik: { fontSize: 20, fontWeight: '700', color: colors.text, lineHeight: 26 },
  aciklama: {
    fontSize: 15,
    color: colors.textSecondary,
    marginTop: 12,
    lineHeight: 22,
  },
  bolumBaslik: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  saticiAd: { fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: spacing.md },
  mesajBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 12,
    marginBottom: spacing.md,
  },
  mesajBtnText: { color: colors.primaryText, fontSize: 15, fontWeight: '700' },
  saticiFavoriBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
  },
  saticiFavoriText: { fontSize: 14, fontWeight: '600', color: colors.primary },
  konumSatir: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  konumMetin: { flex: 1, fontSize: 15, color: colors.text, lineHeight: 22 },
  konumHarita: { fontSize: 14, fontWeight: '600', color: colors.link, marginTop: spacing.sm },
  detaySatir: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  detayLabel: { fontSize: 14, color: colors.textSecondary, flex: 1 },
  detayDeger: { fontSize: 14, fontWeight: '600', color: colors.text, flex: 1, textAlign: 'right' },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  chipText: { color: colors.success, fontWeight: '600', fontSize: 13 },
  silButon: {
    marginHorizontal: 16,
    marginTop: 24,
    backgroundColor: '#FEE2E2',
    padding: 16,
    borderRadius: radius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  silButonText: { color: colors.danger, fontWeight: '700', fontSize: 16 },
});
