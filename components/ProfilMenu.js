import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../constants/theme';

export function ProfilMenuSection({ baslik, children }) {
  return (
    <View style={styles.bolum}>
      {baslik ? <Text style={styles.bolumBaslik}>{baslik}</Text> : null}
      <View style={styles.kutu}>{children}</View>
    </View>
  );
}

export function ProfilMenuRow({ icon, baslik, alt, onPress, son = false, tehlikeli }) {
  return (
    <TouchableOpacity
      style={[styles.satir, son && styles.satirSon]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {icon ? (
        <View style={styles.ikonKutu}>
          <Ionicons name={icon} size={22} color={tehlikeli ? colors.danger : colors.textSecondary} />
        </View>
      ) : null}
      <View style={styles.satirOrta}>
        <Text style={[styles.satirBaslik, tehlikeli && styles.tehlikeli]}>{baslik}</Text>
        {alt ? <Text style={styles.satirAlt}>{alt}</Text> : null}
      </View>
      {!tehlikeli ? <Ionicons name="chevron-forward" size={20} color={colors.textMuted} /> : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  bolum: { marginBottom: spacing.md },
  bolumBaslik: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.3,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
    paddingTop: spacing.sm,
  },
  kutu: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  satir: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    minHeight: 52,
  },
  satirSon: { borderBottomWidth: 0 },
  ikonKutu: { width: 32, alignItems: 'center', marginRight: spacing.md },
  satirOrta: { flex: 1 },
  satirBaslik: { fontSize: 16, fontWeight: '500', color: colors.text },
  satirAlt: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  tehlikeli: { color: colors.danger, fontWeight: '600' },
});
