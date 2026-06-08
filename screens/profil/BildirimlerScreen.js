import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../../constants/theme';

export default function BildirimlerScreen() {
  return (
    <ScrollView style={styles.wrap} contentContainerStyle={styles.content}>
      <View style={styles.bosKutu}>
        <Ionicons name="notifications-outline" size={48} color={colors.textMuted} />
        <Text style={styles.bosBaslik}>Bildirim yok</Text>
        <Text style={styles.bosMetin}>
          İlanlarınız, mesajlarınız ve sistem bildirimleri burada listelenecek. Şu an yeni
          bildiriminiz yok.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.background },
  content: { flexGrow: 1, padding: spacing.lg },
  bosKutu: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.xxl,
    alignItems: 'center',
    marginTop: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  bosBaslik: { fontSize: 18, fontWeight: '700', color: colors.text, marginTop: spacing.md },
  bosMetin: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 21,
    marginTop: spacing.sm,
  },
});
