import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../constants/theme';

export default function KayitTamamScreen({ navigation, route }) {
  const email = route.params?.email || '';

  const giriseGit = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Giris', params: { email } }],
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <TouchableOpacity style={styles.kapat} onPress={giriseGit} hitSlop={12}>
        <Ionicons name="close" size={28} color={colors.text} />
      </TouchableOpacity>

      <View style={styles.govde}>
        <Text style={styles.baslik}>Son Bir Adım Kaldı</Text>
        <Text style={styles.metin}>
          <Text style={styles.email}>{email}</Text>
          {' '}adresinize gönderdiğimiz e-postadan hesap talebinizi onaylayın.
        </Text>
        <Text style={styles.altMetin}>
          Mail spam klasöründe olabilir — «Spam değil» deyin. Bağlantıya tıklayınca onay sayfası
          açılır; «Uygulamayı aç» ile giriş yapın.
        </Text>
        <TouchableOpacity style={styles.maviBtn} onPress={giriseGit}>
          <Text style={styles.maviBtnText}>Tamam</Text>
        </TouchableOpacity>
        <Text style={styles.spam}>
          Onay e-postası gelmediyse spam / önemsiz klasörünü kontrol edin. Giriş ekranından
          e-posta ve şifrenizle doğrulama mailini tekrar gönderebilirsiniz.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  kapat: { alignSelf: 'flex-end', padding: spacing.lg },
  govde: { flex: 1, paddingHorizontal: spacing.xl, paddingTop: spacing.xxl },
  baslik: { fontSize: 28, fontWeight: '800', color: colors.text, marginBottom: spacing.xl },
  metin: { fontSize: 17, color: colors.text, lineHeight: 26, marginBottom: spacing.md },
  email: { fontWeight: '800' },
  altMetin: { fontSize: 15, color: colors.textSecondary, marginBottom: spacing.xl, lineHeight: 22 },
  maviBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  maviBtnText: { color: colors.primaryText, fontSize: 17, fontWeight: '700' },
  spam: { fontSize: 13, color: colors.textSecondary, lineHeight: 20 },
});
