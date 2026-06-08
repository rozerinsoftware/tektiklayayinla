import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActionSheetIOS,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { deleteIlan, getIlanById } from '../../api';
import { formatFiyat } from '../../constants/theme';
import { ilanBitisTarihi, formatIlanTarih, ilanYayinda } from '../../utils/ilanYardimci';
import { colors, spacing, radius } from '../../constants/theme';

export default function IlanYonetimScreen({ navigation, route }) {
  const [ilan, setIlan] = useState(route.params?.ilan);
  const [yukleniyor, setYukleniyor] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (!route.params?.ilan?.id) return;
      getIlanById(route.params.ilan.id).then((g) => {
        if (g) setIlan(g);
      });
    }, [route.params?.ilan?.id])
  );

  if (!ilan) {
    return (
      <View style={styles.merkez}>
        <Text>İlan bulunamadı</Text>
      </View>
    );
  }

  const yayinda = ilanYayinda(ilan);
  const bitis = ilanBitisTarihi(ilan);

  const aksiyonMenu = () => {
    const secenekler = yayinda
      ? ['Yayından Kaldır', 'Fiyatı Güncelle', 'İlanı Sil', 'Vazgeç']
      : ['İlanı Yayınla', 'İlanı Sil', 'Vazgeç'];
    const handler = (index) => {
      if (yayinda) {
        if (index === 0) navigation.navigate('IlanYayindanKaldir', { ilan });
        if (index === 1) navigation.navigate('IlanFiyatGuncelle', { ilan });
        if (index === 2) ilanSil();
      } else {
        if (index === 0) tekrarYayinla();
        if (index === 1) ilanSil();
      }
    };
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        { options: secenekler, cancelButtonIndex: secenekler.length - 1, destructiveButtonIndex: yayinda ? 2 : 1 },
        handler
      );
    } else {
      Alert.alert('İşlem seçin', '', [
        ...(yayinda
          ? [
              { text: 'Yayından Kaldır', onPress: () => navigation.navigate('IlanYayindanKaldir', { ilan }) },
              { text: 'Fiyatı Güncelle', onPress: () => navigation.navigate('IlanFiyatGuncelle', { ilan }) },
              { text: 'İlanı Düzenle', onPress: () => navigation.navigate('IlanDuzenle', { ilan }) },
            ]
          : [{ text: 'İlanı Yayınla', onPress: tekrarYayinla }]),
        { text: 'İlanı Sil', style: 'destructive', onPress: ilanSil },
        { text: 'Vazgeç', style: 'cancel' },
      ]);
    }
  };

  const tekrarYayinla = () => {
    navigation.getParent()?.navigate('İlan Ver', {
      screen: 'PlatformSec',
      params: { yeniIlan: ilan, duzenlemeId: ilan.id },
    });
  };

  const ilanSil = () => {
    Alert.alert('İlanı Sil', 'Bu ilan kalıcı olarak silinsin mi?', [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Sil',
        style: 'destructive',
        onPress: async () => {
          try {
            setYukleniyor(true);
            await deleteIlan(ilan.id);
            navigation.goBack();
          } catch (e) {
            Alert.alert('Hata', e?.message || 'Silinemedi.');
          } finally {
            setYukleniyor(false);
          }
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.content}>
      <TouchableOpacity style={styles.ozetKart} onPress={() => navigation.navigate('IlanDetay', { ilan })}>
        <View style={styles.foto}>
          <Ionicons name="camera-outline" size={28} color={colors.textMuted} />
        </View>
        <View style={styles.ozetMetin}>
          <Text style={styles.baslik}>{ilan.baslik}</Text>
          <Text style={styles.fiyat}>{formatFiyat(ilan.fiyat)}</Text>
          <Text style={styles.meta}>İlan Bitiş: {formatIlanTarih(bitis)}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
      </TouchableOpacity>

      <View style={styles.istatistik}>
        <IstatistikKutu label="Gösterim" deger={String(ilan.goruntulenme ?? 0)} icon="eye-outline" />
        <IstatistikKutu label="Mesaj" deger={String(ilan.mesajSayisi ?? 0)} icon="mail-outline" />
        <IstatistikKutu label="Favori" deger={String(ilan.favoriSayisi ?? 0)} icon="star-outline" />
      </View>

      <TouchableOpacity style={styles.duzenleAltBtn} onPress={() => navigation.navigate('IlanDuzenle', { ilan })}>
        <Ionicons name="create-outline" size={18} color={colors.primary} />
        <Text style={styles.duzenleAltText}>Başlık ve açıklamayı düzenle</Text>
      </TouchableOpacity>

      <View style={styles.bildirimKutu}>
        <Ionicons name="notifications-outline" size={18} color={colors.textSecondary} />
        <Text style={styles.bildirimMetin}>
          {yayinda ? 'İlan yayında.' : 'İlan yayından kaldırıldı.'}
        </Text>
      </View>

      <View style={styles.aksiyonSatir}>
        <TouchableOpacity style={styles.duzenleBtn} onPress={aksiyonMenu}>
          <Ionicons name="create-outline" size={18} color={colors.primaryText} />
          <Text style={styles.duzenleText}>İşlemler</Text>
        </TouchableOpacity>
        {yayinda ? (
          <TouchableOpacity
            style={styles.kaldirBtn}
            onPress={() => navigation.navigate('IlanYayindanKaldir', { ilan })}
            disabled={yukleniyor}
          >
            <Ionicons name="power-outline" size={18} color={colors.primaryText} />
            <Text style={styles.kaldirText}>Yayından Kaldır</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.kaldirBtn} onPress={tekrarYayinla}>
            <Ionicons name="rocket-outline" size={18} color={colors.primaryText} />
            <Text style={styles.kaldirText}>Yeniden Yayınla</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

function IstatistikKutu({ label, deger, icon }) {
  return (
    <View style={styles.istatKutu}>
      <Ionicons name={icon} size={20} color={colors.primary} />
      <Text style={styles.istatDeger}>{deger}</Text>
      <Text style={styles.istatLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: 40 },
  merkez: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  ozetKart: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  foto: {
    width: 64,
    height: 64,
    borderRadius: radius.sm,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ozetMetin: { flex: 1 },
  baslik: { fontSize: 16, fontWeight: '700', color: colors.text },
  fiyat: { fontSize: 18, fontWeight: '800', color: colors.text, marginTop: 4 },
  meta: { fontSize: 12, color: colors.textSecondary, marginTop: 4 },
  istatistik: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  istatKutu: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  istatDeger: { fontSize: 18, fontWeight: '800', color: colors.text, marginTop: 4 },
  istatLabel: { fontSize: 11, color: colors.textSecondary, marginTop: 2 },
  bildirimKutu: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    marginBottom: spacing.lg,
  },
  bildirimMetin: { fontSize: 14, color: colors.textSecondary },
  aksiyonSatir: { flexDirection: 'row', gap: spacing.sm },
  duzenleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
  },
  duzenleText: { color: colors.primaryText, fontWeight: '700' },
  kaldirBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
  },
  kaldirText: { color: colors.primaryText, fontWeight: '700' },
  duzenleAltBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: spacing.md,
    marginBottom: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  duzenleAltText: { fontSize: 14, fontWeight: '600', color: colors.primary },
});
