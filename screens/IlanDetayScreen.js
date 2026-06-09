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
  Linking,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
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
import {
  konumHaritadaAc,
  konumStatikHaritaUrl,
} from '../utils/konum';
import {
  ilanBilgiTablosu,
  ilanKonumTam,
  ilanKategoriYoluMetni,
  ilanNoMetni,
} from '../utils/ilanDetaySatirlari';
import { colors, radius, shadow, spacing, getKategoriMeta, formatFiyat } from '../constants/theme';
import { ilanKapakFotoUrl, ILAN_FOTO_HEADERS } from '../utils/ilanFoto';

const SEKMELER = [
  { id: 'bilgi', label: 'İlan Bilgileri' },
  { id: 'aciklama', label: 'Açıklama' },
  { id: 'konum', label: 'Konumu' },
];

export default function IlanDetayScreen({ navigation, route }) {
  const ilan = route.params?.ilan || {};
  const sahibi = getCurrentUserId() && ilan.ownerId === getCurrentUserId();
  const meta = getKategoriMeta(ilan.kategori);
  const platformlar = Array.isArray(ilan.platformlar) ? ilan.platformlar : [];
  const konumTam = ilanKonumTam(ilan);
  const kategoriYolu = ilanKategoriYoluMetni(ilan);
  const [favori, setFavori] = useState(false);
  const [saticiFavori, setSaticiFavori] = useState(false);
  const [saticiAd, setSaticiAd] = useState('');
  const [sekme, setSekme] = useState('bilgi');
  const [fotoIndex, setFotoIndex] = useState(0);
  const [haritaHata, setHaritaHata] = useState(false);

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
  const kapak = ilanKapakFotoUrl(ilan);
  const gecerliFotolar = fotograflar.filter((u) => ilanKapakFotoUrl({ fotograflar: [u] }));
  const gosterilenFotolar = gecerliFotolar.length ? gecerliFotolar : kapak ? [kapak] : [];
  const ekranGen = Dimensions.get('window').width;
  const bilgiSatirlari = ilanBilgiTablosu(ilan, formatFiyat);
  const haritaUrl = konumStatikHaritaUrl(ilan.konum);
  const telefon = String(ilan.telefon || '').replace(/\D/g, '');

  const ara = () => {
    if (!telefon || telefon.length < 10) {
      Alert.alert('Telefon yok', 'Bu ilanda telefon numarası belirtilmemiş. Mesaj gönderebilirsiniz.');
      return;
    }
    Linking.openURL(`tel:${telefon}`);
  };

  const renderSekmeIcerik = () => {
    if (sekme === 'aciklama') {
      return (
        <View style={styles.sekmeKutu}>
          <Text style={styles.aciklamaMetin}>
            {ilan.aciklama?.trim() || 'Açıklama eklenmemiş.'}
          </Text>
        </View>
      );
    }

    if (sekme === 'konum') {
      if (!ilan.konum?.latitude && !konumTam) {
        return (
          <View style={styles.sekmeKutu}>
            <Ionicons name="location-outline" size={48} color={colors.textMuted} style={styles.konumBosIkon} />
            <Text style={styles.konumBosMetin}>Bu ilan için konum bilgisi yok.</Text>
          </View>
        );
      }
      return (
        <View style={styles.sekmeKutu}>
          {haritaUrl && !haritaHata ? (
            <TouchableOpacity onPress={() => konumHaritadaAc(ilan.konum)} activeOpacity={0.9}>
              <Image
                source={{ uri: haritaUrl }}
                style={styles.haritaOnizleme}
                resizeMode="cover"
                onError={() => setHaritaHata(true)}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.haritaYedek}
              onPress={() => konumHaritadaAc(ilan.konum)}
              activeOpacity={0.85}
            >
              <Ionicons name="map" size={64} color={colors.primary} style={{ opacity: 0.4 }} />
              <Ionicons name="location" size={36} color={colors.danger} style={styles.haritaPin} />
            </TouchableOpacity>
          )}
          <View style={styles.konumDetayKutu}>
            <Ionicons name="location" size={20} color={colors.primary} />
            <Text style={styles.konumDetayMetin}>{konumTam || 'Konum işaretli'}</Text>
          </View>
          <TouchableOpacity style={styles.haritaBtn} onPress={() => konumHaritadaAc(ilan.konum)}>
            <Ionicons name="navigate-outline" size={18} color={colors.primaryText} />
            <Text style={styles.haritaBtnText}>Haritada göster / Nasıl giderim?</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.sekmeKutu}>
        {bilgiSatirlari.map((satir, i) => (
          <View
            key={satir.label}
            style={[styles.bilgiSatir, i === bilgiSatirlari.length - 1 && styles.bilgiSatirSon]}
          >
            <Text style={styles.bilgiLabel}>{satir.label}</Text>
            <Text
              style={[
                styles.bilgiDeger,
                satir.vurgu === 'fiyat' && styles.bilgiFiyat,
                satir.vurgu === 'ilanNo' && styles.bilgiIlanNo,
              ]}
              numberOfLines={3}
            >
              {satir.value}
            </Text>
          </View>
        ))}
        {platformlar.length > 0 ? (
          <View style={styles.platformBolum}>
            <Text style={styles.platformBaslik}>Yayınlanan Platformlar</Text>
            <View style={styles.chipWrap}>
              {platformlar.map((p) => (
                <View key={p} style={styles.chip}>
                  <Text style={styles.chipText}>{p}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}
      </View>
    );
  };

  return (
    <View style={styles.kok}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.fotoAlani}>
          {gosterilenFotolar.length > 0 ? (
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(e) => {
                const i = Math.round(e.nativeEvent.contentOffset.x / ekranGen);
                setFotoIndex(i);
              }}
            >
              {gosterilenFotolar.map((uri, i) => (
                <Image
                  key={uri + i}
                  source={{ uri, headers: ILAN_FOTO_HEADERS }}
                  style={[styles.heroFoto, { width: ekranGen }]}
                />
              ))}
            </ScrollView>
          ) : (
            <View style={[styles.hero, { backgroundColor: meta.bg }]}>
              <Text style={styles.heroEmoji}>{meta.emoji}</Text>
            </View>
          )}
          {ilan.id ? (
            <Text style={styles.fotoIlanNo}>#{ilanNoMetni(ilan)}</Text>
          ) : null}
          {gosterilenFotolar.length > 1 ? (
            <View style={styles.fotoSayacWrap}>
              <View style={styles.fotoSayacPill}>
                <Text style={styles.fotoSayac}>
                  {fotoIndex + 1} / {gosterilenFotolar.length}
                </Text>
              </View>
            </View>
          ) : null}
        </View>

        <Text style={styles.ustBaslik} numberOfLines={3}>
          {ilan.baslik || 'İlan'}
        </Text>

        {ilan.ownerId && !sahibi ? (
          <View style={styles.saticiSatir}>
            <Text style={styles.saticiAd}>{saticiAd || 'Satıcı'}</Text>
            <TouchableOpacity onPress={saticiFavoriToggle} hitSlop={8}>
              <Ionicons
                name={saticiFavori ? 'star' : 'star-outline'}
                size={20}
                color={saticiFavori ? '#FACC15' : colors.textMuted}
              />
            </TouchableOpacity>
          </View>
        ) : null}

        {kategoriYolu ? (
          <Text style={styles.kategoriYolu} numberOfLines={2}>
            {kategoriYolu}
          </Text>
        ) : null}

        {konumTam ? (
          <View style={styles.konumUstSatir}>
            <Ionicons name="location-outline" size={15} color={colors.textSecondary} />
            <Text style={styles.konumUstMetin} numberOfLines={2}>
              {konumTam}
            </Text>
          </View>
        ) : null}

        <View style={styles.sekmeBar}>
          {SEKMELER.map((s) => (
            <TouchableOpacity
              key={s.id}
              style={[styles.sekmeBtn, sekme === s.id && styles.sekmeBtnAktif]}
              onPress={() => setSekme(s.id)}
              activeOpacity={0.8}
            >
              <Text style={[styles.sekmeBtnText, sekme === s.id && styles.sekmeBtnTextAktif]}>
                {s.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {renderSekmeIcerik()}

        {sahibi ? (
          <TouchableOpacity style={styles.silButon} onPress={ilanSil}>
            <Text style={styles.silButonText}>İlanı Sil</Text>
          </TouchableOpacity>
        ) : null}
      </ScrollView>

      {!sahibi && ilan.ownerId ? (
        <SafeAreaView edges={['bottom']} style={styles.altBar}>
          <TouchableOpacity style={styles.araBtn} onPress={ara} activeOpacity={0.85}>
            <Ionicons name="call-outline" size={20} color={colors.primaryText} />
            <Text style={styles.altBtnText}>Ara</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.mesajBtnAlt} onPress={mesajAt} activeOpacity={0.85}>
            <Ionicons name="chatbubble-outline" size={20} color={colors.primaryText} />
            <Text style={styles.altBtnText}>Mesaj Gönder</Text>
          </TouchableOpacity>
        </SafeAreaView>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  kok: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1 },
  content: { paddingBottom: 100 },
  headerFavori: { marginRight: 8 },
  fotoAlani: { position: 'relative', backgroundColor: colors.border },
  heroFoto: { height: 240, resizeMode: 'cover' },
  hero: { height: 200, alignItems: 'center', justifyContent: 'center' },
  heroEmoji: { fontSize: 72 },
  fotoIlanNo: {
    position: 'absolute',
    top: 8,
    left: 10,
    fontSize: 11,
    color: colors.textMuted,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  fotoSayacWrap: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  fotoSayacPill: {
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  fotoSayac: { fontSize: 12, fontWeight: '600', color: '#fff' },
  ustBaslik: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    lineHeight: 21,
    textTransform: 'uppercase',
  },
  saticiSatir: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  saticiAd: { fontSize: 15, fontWeight: '700', color: colors.link },
  kategoriYolu: {
    fontSize: 13,
    color: colors.link,
    paddingHorizontal: spacing.md,
    paddingTop: 4,
    lineHeight: 18,
  },
  konumUstSatir: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingTop: 6,
    paddingBottom: spacing.sm,
  },
  konumUstMetin: { flex: 1, fontSize: 13, color: colors.textSecondary, lineHeight: 18 },
  sekmeBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  sekmeBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  sekmeBtnAktif: { backgroundColor: '#FDE047' },
  sekmeBtnText: { fontSize: 12, fontWeight: '600', color: colors.textSecondary },
  sekmeBtnTextAktif: { color: colors.text, fontWeight: '700' },
  sekmeKutu: {
    backgroundColor: colors.surface,
    marginTop: 1,
    paddingBottom: spacing.md,
  },
  bilgiSatir: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    gap: 12,
  },
  bilgiSatirSon: { borderBottomWidth: 0 },
  bilgiLabel: { flex: 1, fontSize: 14, color: colors.textSecondary },
  bilgiDeger: { flex: 1.2, fontSize: 14, fontWeight: '600', color: colors.text, textAlign: 'right' },
  bilgiFiyat: { fontSize: 16, fontWeight: '800', color: colors.link },
  bilgiIlanNo: { color: colors.danger, fontWeight: '700' },
  aciklamaMetin: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 23,
    padding: spacing.md,
  },
  haritaOnizleme: { width: '100%', height: 220, backgroundColor: '#E5E7EB' },
  haritaYedek: {
    height: 220,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  haritaPin: { position: 'absolute' },
  konumDetayKutu: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  konumDetayMetin: { flex: 1, fontSize: 15, color: colors.text, lineHeight: 22, fontWeight: '500' },
  konumBosIkon: { alignSelf: 'center', marginTop: spacing.lg },
  konumBosMetin: {
    textAlign: 'center',
    color: colors.textMuted,
    padding: spacing.lg,
    fontSize: 14,
  },
  haritaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: radius.md,
  },
  haritaBtnText: { color: colors.primaryText, fontSize: 14, fontWeight: '700' },
  platformBolum: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: spacing.sm,
  },
  platformBaslik: { fontSize: 13, fontWeight: '700', color: colors.textSecondary, marginBottom: 8 },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    backgroundColor: colors.background,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipText: { fontSize: 12, color: colors.textSecondary, fontWeight: '600' },
  silButon: {
    marginHorizontal: spacing.md,
    marginTop: spacing.lg,
    backgroundColor: '#FEE2E2',
    padding: 16,
    borderRadius: radius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  silButonText: { color: colors.danger, fontWeight: '700', fontSize: 16 },
  altBar: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    ...shadow.card,
  },
  araBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: radius.md,
  },
  mesajBtnAlt: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: radius.md,
  },
  altBtnText: { color: colors.primaryText, fontSize: 15, fontWeight: '700' },
});
