import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getUserProfile } from '../../api';
import { getFirebaseAuth } from '../../auth';
import { colors, radius, spacing } from '../../constants/theme';

export default function EmailBilgiScreen() {
  const [email, setEmail] = useState('');

  useFocusEffect(
    useCallback(() => {
      let aktif = true;
      (async () => {
        const p = await getUserProfile().catch(() => ({}));
        if (!aktif) return;
        setEmail(p.email || getFirebaseAuth().currentUser?.email || '');
      })();
      return () => {
        aktif = false;
      };
    }, [])
  );

  return (
    <ScrollView style={styles.wrap} contentContainerStyle={styles.content}>
      <View style={styles.kart}>
        <Text style={styles.aciklama}>
          E-posta adresiniz giriş ve hesap güvenliği için kullanılır. Kayıt sırasında onay
          maili gönderilir; onaylamadan ilan veremezsiniz.
        </Text>
        <Text style={styles.etiket}>E-posta adresim:</Text>
        <Text style={styles.email}>{email}</Text>
        <Text style={styles.not}>
          Şu an e-posta, Firebase giriş hesabınıza bağlıdır. Farklı bir adres için yeni hesap
          oluşturmanız veya destek ile iletişime geçmeniz gerekir.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg },
  kart: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  aciklama: { fontSize: 14, color: colors.textSecondary, lineHeight: 21, marginBottom: spacing.lg },
  etiket: { fontSize: 14, color: colors.textSecondary, marginBottom: 6 },
  email: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: spacing.lg },
  not: { fontSize: 13, color: colors.textMuted, lineHeight: 20 },
});
