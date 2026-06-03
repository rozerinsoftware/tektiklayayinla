import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../constants/theme';

export default function IlanAramaToolbar({
  siralamaLabel,
  onFiltre,
  onSira,
  onGorunum,
  onAramaKaydet,
  chipEtiketler = [],
  aktifChip,
  onChip,
}) {
  return (
    <View style={styles.wrap}>
      <View style={styles.ustSatir}>
        <ToolbarBtn icon="options-outline" label="Filtrele" onPress={onFiltre} />
        <ToolbarBtn icon="swap-vertical-outline" label={siralamaLabel || 'Sırala'} onPress={onSira} />
        <ToolbarBtn icon="grid-outline" label="Görünüm" onPress={onGorunum} />
        {onAramaKaydet ? (
          <ToolbarBtn icon="bookmark-outline" label="Kaydet" onPress={onAramaKaydet} compact />
        ) : null}
      </View>
      {chipEtiketler.length > 0 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipSatir}>
          {chipEtiketler.map((c) => {
            const aktif = aktifChip === c.id;
            return (
              <TouchableOpacity
                key={c.id}
                style={[styles.chip, aktif && styles.chipAktif]}
                onPress={() => onChip?.(c.id)}
              >
                <Text style={[styles.chipText, aktif && styles.chipTextAktif]}>{c.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      ) : null}
    </View>
  );
}

function ToolbarBtn({ icon, label, onPress, compact }) {
  return (
    <TouchableOpacity style={[styles.btn, compact && styles.btnCompact]} onPress={onPress} activeOpacity={0.7}>
      <Ionicons name={icon} size={16} color={colors.text} />
      <Text style={styles.btnText} numberOfLines={1}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: spacing.sm,
  },
  ustSatir: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    gap: 4,
  },
  btn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: radius.sm,
    backgroundColor: colors.background,
  },
  btnCompact: { flex: 0.85 },
  btnText: { fontSize: 12, fontWeight: '600', color: colors.text },
  chipSatir: { paddingHorizontal: spacing.sm, paddingBottom: spacing.sm, gap: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipAktif: { backgroundColor: colors.primaryLight, borderColor: colors.primary },
  chipText: { fontSize: 12, fontWeight: '600', color: colors.textSecondary },
  chipTextAktif: { color: colors.primary },
});
