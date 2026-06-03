import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppInput } from '../ui';
import { colors, spacing } from '../../constants/theme';

export default function IlanAlanSatiri({ alan, deger, onSec, hata }) {
  if (alan.tip === 'text' || alan.tip === 'number') {
    return (
      <AppInput
        label={`${alan.label}${alan.zorunlu ? ' *' : ''}`}
        placeholder={alan.label}
        value={deger || ''}
        onChangeText={(t) =>
          onSec(alan.key, alan.tip === 'number' ? t.replace(/\D/g, '') : t)
        }
        keyboardType={alan.keyboard || 'default'}
      />
    );
  }
  return (
    <TouchableOpacity
      style={styles.secimSatir}
      onPress={() => onSec(alan.key, null, alan)}
      activeOpacity={0.7}
    >
      <View style={styles.secimSol}>
        <Text style={styles.secimLabel}>
          {alan.label}
          {alan.zorunlu ? ' *' : ''}
        </Text>
        {hata ? <Text style={styles.hataMetin}>Zorunlu alan</Text> : null}
      </View>
      <Text style={[styles.secimDeger, !deger && styles.secimBos]} numberOfLines={1}>
        {deger || 'Seçin'}
      </Text>
      <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  secimSatir: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingVertical: 14,
    paddingHorizontal: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    marginBottom: 1,
  },
  secimSol: { flex: 1 },
  secimLabel: { fontSize: 15, color: colors.text },
  hataMetin: { fontSize: 11, color: colors.danger, marginTop: 2 },
  secimDeger: { fontSize: 14, fontWeight: '600', color: colors.text, maxWidth: '40%', marginRight: 4 },
  secimBos: { color: colors.textMuted, fontWeight: '400' },
});
