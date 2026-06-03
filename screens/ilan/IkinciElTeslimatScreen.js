import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import IlanBreadcrumb from '../../components/ilan/IlanBreadcrumb';
import { PrimaryButton } from '../../components/ui';
import { colors, spacing, radius } from '../../constants/theme';
import { ikinciElBreadcrumb } from '../../constants/ikinciElAlanlari';

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

  const devamEt = () => {
    if (secilenler.length === 0) return;
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
});
