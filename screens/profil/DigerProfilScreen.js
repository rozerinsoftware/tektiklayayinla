import React from 'react';
import { Text, ScrollView, StyleSheet } from 'react-native';
import { colors, spacing } from '../../constants/theme';

/** Sadece QR — diğer kurumsal sayfalar KurumsalBilgi ekranında */
export default function DigerProfilScreen() {
  return (
    <ScrollView style={styles.wrap} contentContainerStyle={styles.content}>
      <Text style={styles.metin}>
        QR kod ile ilan paylaşma ve hızlı giriş özellikleri yakında eklenecek. Şimdilik ilanlarınızı
        uygulama içinden yönetebilirsiniz.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: 40 },
  metin: { fontSize: 15, color: colors.text, lineHeight: 24 },
});
