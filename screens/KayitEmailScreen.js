import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../constants/theme';

export default function KayitEmailScreen({ navigation }) {
  const [email, setEmail] = useState('');

  const devam = () => {
    const e = email.trim().toLowerCase();
    if (!e || !e.includes('@')) {
      Alert.alert('Uyarı', 'Geçerli bir e-posta adresi girin.');
      return;
    }
    navigation.navigate('KayitDetay', { email: e });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <TouchableOpacity style={styles.kapat} onPress={() => navigation.goBack()} hitSlop={12}>
          <Ionicons name="close" size={28} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.govde}>
          <Text style={styles.baslik}>Hesap aç</Text>

          <TextInput
            style={styles.emailInput}
            placeholder="E-posta adresi"
            placeholderTextColor={colors.textMuted}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoCorrect={false}
          />

          <TouchableOpacity style={styles.maviBtn} onPress={devam} activeOpacity={0.85}>
            <Text style={styles.maviBtnText}>E-posta ile hesap aç</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.girisLink}
            onPress={() => navigation.replace('Giris')}
          >
            <Text style={styles.girisLinkMetin}>
              Zaten hesabın var mı? <Text style={styles.girisLinkVurgu}>Giriş yap</Text>
            </Text>
            <Ionicons name="chevron-forward" size={16} color={colors.link} />
          </TouchableOpacity>

          <View style={styles.ayracSatir}>
            <View style={styles.ayracCizgi} />
            <Text style={styles.ayracMetin}>VEYA</Text>
            <View style={styles.ayracCizgi} />
          </View>

          <View style={styles.sosyalSatir}>
            <TouchableOpacity style={styles.sosyalBtn} disabled>
              <Text style={styles.sosyalEmoji}>G</Text>
              <Text style={styles.sosyalText}>Google (yakında)</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sosyalBtn} disabled>
              <Ionicons name="logo-apple" size={22} color={colors.text} />
              <Text style={styles.sosyalText}>Apple (yakında)</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  flex: { flex: 1 },
  kapat: { alignSelf: 'flex-end', padding: spacing.lg },
  govde: { flex: 1, paddingHorizontal: spacing.xl, paddingTop: spacing.md },
  baslik: { fontSize: 32, fontWeight: '800', color: colors.text, marginBottom: spacing.xl },
  emailInput: {
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  maviBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 16,
    alignItems: 'center',
  },
  maviBtnText: { color: colors.primaryText, fontSize: 17, fontWeight: '700' },
  girisLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: spacing.xl,
  },
  girisLinkMetin: { fontSize: 15, color: colors.textSecondary },
  girisLinkVurgu: { color: colors.link, fontWeight: '700' },
  ayracSatir: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.xl,
    gap: spacing.md,
  },
  ayracCizgi: { flex: 1, height: 1, backgroundColor: colors.border },
  ayracMetin: { fontSize: 13, color: colors.textMuted, fontWeight: '600' },
  sosyalSatir: { flexDirection: 'row', gap: spacing.md },
  sosyalBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    opacity: 0.6,
  },
  sosyalEmoji: { fontSize: 20, fontWeight: '800', marginBottom: 4 },
  sosyalText: { fontSize: 11, color: colors.textSecondary, textAlign: 'center' },
});
