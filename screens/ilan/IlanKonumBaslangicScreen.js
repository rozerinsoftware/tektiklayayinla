import React, { useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius } from '../../constants/theme';

export default function IlanKonumBaslangicScreen({ navigation, route }) {
  const { taslakIlan, adim = 2, toplamAdim = 5 } = route.params || {};

  useLayoutEffect(() => {
    navigation.setOptions({ title: 'İlanın Adresini Giriniz' });
  }, [navigation]);

  const git = (mod) => {
    navigation.navigate('IlanKonumIsaretle', {
      taslakIlan,
      konumModu: mod,
      adim,
      toplamAdim,
      sonrakiEkran: route.params?.sonrakiEkran,
      geriParams: route.params?.geriParams,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.haritaArka}>
        <View style={styles.haritaOverlay} />
        <Ionicons name="map-outline" size={64} color={colors.textMuted} style={styles.haritaIcon} />
      </View>

      <View style={styles.btnWrap}>
        <TouchableOpacity style={styles.btn} onPress={() => git('gps')} activeOpacity={0.85}>
          <Ionicons name="navigate-outline" size={22} color={colors.primary} />
          <Text style={styles.btnText}>Mevcut Konumu Kullan</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={() => git('manuel')} activeOpacity={0.85}>
          <Ionicons name="pin-outline" size={22} color={colors.primary} />
          <Text style={styles.btnText}>Kendim Seçmek İstiyorum</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  haritaArka: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D1D5DB',
  },
  haritaOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'transparent' },
  haritaIcon: { opacity: 0.5 },
  btnWrap: { padding: spacing.lg, gap: spacing.md, backgroundColor: colors.surface },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: colors.surface,
  },
  btnText: { fontSize: 16, fontWeight: '700', color: colors.primary },
});
