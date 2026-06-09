import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import IlanBreadcrumb from '../../components/ilan/IlanBreadcrumb';
import { PrimaryButton } from '../../components/ui';
import { colors, spacing, radius } from '../../constants/theme';
import { ikinciElBreadcrumb } from '../../constants/ikinciElAlanlari';
import { formatKonumEtiket } from '../../utils/konum';

const TESLIMAT_SECENEKLERI = [
  {
    id: 'bulusma',
    baslik: 'Buluşup teslim edebilirim',
    aciklama: 'Alıcı ile buluşarak ürünü elden teslim edersiniz.',
    icon: 'hand-left-outline',
  },
  {
    id: 'kargo',
    baslik: 'Kargo ile gönderebilirim',
    aciklama: 'Kargo ile Türkiye geneline gönderim yapabilirsiniz.',
    icon: 'car-outline',
  },
];

export default function IkinciElTeslimatScreen({ navigation, route }) {
  const { secilenKategori, taslakIlan, adim = 4, toplamAdim = 6 } = route.params || {};
  const breadcrumb = [...ikinciElBreadcrumb(secilenKategori), 'TESLİMAT'];
  const [secilenler, setSecilenler] = useState(() => {
    const mevcut = taslakIlan?.teslimatSecenekleri;
    if (Array.isArray(mevcut) && mevcut.length) return mevcut;
    return ['bulusma'];
  });

  const toggle = (id) => {
    setSecilenler((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const konumMetni = formatKonumEtiket(taslakIlan?.konum);
  const eldenSecili = secilenler.includes('bulusma');

  const devamEt = () => {
    if (secilenler.length === 0) return;
    if (eldenSecili && (!taslakIlan?.konum?.latitude || !taslakIlan?.konum?.longitude)) {
      Alert.alert(
        'Konum gerekli',
        'Elden teslim seçtiniz. Önceki adımda buluşma konumunuzu işaretleyin.'
      );
      return;
    }
    navigation.navigate('IkinciElFiyat', {
      secilenKategori,
      taslakIlan: { ...taslakIlan, teslimatSecenekleri: secilenler },
      adim: 5,
      toplamAdim,
    });
  };

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.content}>
      <IlanBreadcrumb parcalar={breadcrumb} />
      <Text style={styles.baslik}>Teslimat Tercihleri</Text>
      <Text style={styles.alt}>Her ikisini de seçerseniz daha fazla alıcıya ulaşabilirsiniz.</Text>

      {eldenSecili ? (
        <View style={styles.konumKutu}>
          <Ionicons name="location" size={20} color={colors.primary} />
          <View style={styles.konumMetinWrap}>
            <Text style={styles.konumBaslik}>Buluşma konumu</Text>
            <Text style={styles.konumMetin}>
              {konumMetni || 'Henüz işaretlenmedi — İlan Bilgileri adımına dönün'}
            </Text>
          </View>
        </View>
      ) : null}

      {TESLIMAT_SECENEKLERI.map((s) => {
        const secili = secilenler.includes(s.id);
        return (
          <TouchableOpacity
            key={s.id}
            style={[styles.kart, secili && styles.kartSecili]}
            onPress={() => toggle(s.id)}
            activeOpacity={0.85}
          >
            <Ionicons
              name={secili ? 'checkbox' : 'square-outline'}
              size={24}
              color={secili ? colors.primary : colors.textMuted}
            />
            <View style={styles.kartMetin}>
              <Text style={styles.kartBaslik}>{s.baslik}</Text>
              <Text style={styles.kartAciklama}>{s.aciklama}</Text>
            </View>
            <Ionicons name={s.icon} size={32} color={colors.textMuted} />
          </TouchableOpacity>
        );
      })}

      <PrimaryButton title="Devam Et" icon="arrow-forward" onPress={devamEt} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: 40 },
  baslik: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 6 },
  alt: { fontSize: 13, color: colors.textSecondary, marginBottom: spacing.lg },
  kart: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  kartSecili: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  kartMetin: { flex: 1 },
  kartBaslik: { fontSize: 15, fontWeight: '700', color: colors.text },
  kartAciklama: { fontSize: 12, color: colors.textSecondary, marginTop: 4, lineHeight: 17 },
  konumKutu: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    padding: spacing.md,
    marginBottom: spacing.md,
    backgroundColor: colors.primaryLight,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  konumMetinWrap: { flex: 1 },
  konumBaslik: { fontSize: 13, fontWeight: '700', color: colors.text, marginBottom: 4 },
  konumMetin: { fontSize: 14, color: colors.textSecondary, lineHeight: 20 },
});
