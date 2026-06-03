import React, { useCallback, useState } from 'react';
import { View, Text, Switch, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getUygulamaAyarlari, setUygulamaAyarlari, dilEtiketi } from '../../utils/profilStorage';
import { colors, spacing } from '../../constants/theme';

export default function AyarlarScreen({ navigation }) {
  const [ayarlar, setAyarlar] = useState({
    azaltilmisHareket: false,
    dil: 'tr',
  });

  useFocusEffect(
    useCallback(() => {
      let aktif = true;
      (async () => {
        const a = await getUygulamaAyarlari();
        if (aktif) {
          setAyarlar({
            azaltilmisHareket: !!a.azaltilmisHareket,
            dil: a.dil || 'tr',
          });
        }
      })();
      return () => {
        aktif = false;
      };
    }, [])
  );

  const guncelle = async (key, value) => {
    const yeni = { ...(await getUygulamaAyarlari()), [key]: value };
    setAyarlar((prev) => ({ ...prev, [key]: value }));
    await setUygulamaAyarlari(yeni);
  };

  return (
    <ScrollView style={styles.wrap}>
      <Text style={styles.bolum}>HARİTADA ARAMA</Text>
      <View style={styles.kutu}>
        <View style={styles.toggleSatir}>
          <View style={styles.toggleSol}>
            <Text style={styles.toggleBaslik}>Azaltılmış hareket</Text>
            <Text style={styles.toggleAciklama}>
              Ön izleme alanından bir ilan seçildiğinde harita ilgili ilanı ortalayacak şekilde
              hareket eder.
            </Text>
          </View>
          <Switch
            value={ayarlar.azaltilmisHareket}
            onValueChange={(v) => guncelle('azaltilmisHareket', v)}
            trackColor={{ false: colors.border, true: colors.primary }}
          />
        </View>
      </View>

      <View style={[styles.kutu, styles.kutuUst]}>
        <TouchableOpacity
          style={styles.dilSatir}
          onPress={() => navigation.navigate('DilSec')}
          activeOpacity={0.7}
        >
          <Text style={styles.dilBaslik}>Language</Text>
          <View style={styles.dilSag}>
            <Text style={styles.dilDeger}>{dilEtiketi(ayarlar.dil)}</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.background },
  bolum: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.3,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  kutu: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  kutuUst: { marginTop: spacing.lg },
  toggleSatir: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
    gap: spacing.md,
  },
  toggleSol: { flex: 1 },
  toggleBaslik: { fontSize: 16, fontWeight: '500', color: colors.text, marginBottom: 6 },
  toggleAciklama: { fontSize: 13, color: colors.textSecondary, lineHeight: 19 },
  dilSatir: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
    minHeight: 52,
  },
  dilBaslik: { fontSize: 16, fontWeight: '500', color: colors.text },
  dilSag: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  dilDeger: { fontSize: 16, color: colors.textSecondary },
});
