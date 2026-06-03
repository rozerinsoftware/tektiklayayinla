import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../constants/theme';

export function ProfilBilgiSatiri({ etiket, deger, onPress, son, saltOkunur }) {
  const icerik = (
    <>
      <View style={styles.orta}>
        <Text style={styles.etiket}>{etiket}</Text>
        <Text style={[styles.deger, saltOkunur && styles.degerSoluk]} numberOfLines={2}>
          {deger || '—'}
        </Text>
      </View>
      {!saltOkunur && onPress ? (
        <Ionicons name="chevron-forward" size={22} color={colors.textMuted} />
      ) : null}
    </>
  );

  if (saltOkunur || !onPress) {
    return <View style={[styles.satir, son && styles.satirSon]}>{icerik}</View>;
  }

  return (
    <TouchableOpacity
      style={[styles.satir, son && styles.satirSon]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {icerik}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  satir: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  satirSon: { borderBottomWidth: 0 },
  orta: { flex: 1 },
  etiket: { fontSize: 13, color: colors.textSecondary, marginBottom: 4 },
  deger: { fontSize: 17, fontWeight: '600', color: colors.text },
  degerSoluk: { color: colors.textMuted, fontWeight: '500' },
});
