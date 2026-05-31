import React, { useState } from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { signUp } from '../auth';
import { createUserProfile } from '../api';
import { AppInput, PrimaryButton } from '../components/ui';
import { colors, radius, shadow, spacing } from '../constants/theme';

export default function KayitScreen({ navigation }) {
  const [ad, setAd] = useState('');
  const [soyad, setSoyad] = useState('');
  const [email, setEmail] = useState('');
  const [sifre, setSifre] = useState('');
  const [yukleniyor, setYukleniyor] = useState(false);

  const kayitOl = async () => {
    if (!ad.trim() || !soyad.trim()) {
      Alert.alert('Hata', 'Ad ve soyad girin.');
      return;
    }
    if (!email.trim() || !sifre) {
      Alert.alert('Hata', 'E-posta ve şifre girin.');
      return;
    }
    if (sifre.length < 6) {
      Alert.alert('Hata', 'Şifre en az 6 karakter olmalı.');
      return;
    }
    try {
      setYukleniyor(true);
      await signUp({ email, password: sifre, ad, soyad });
      await createUserProfile({ email, ad, soyad });
      navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
    } catch (error) {
      const kod = error?.code || '';
      let mesaj = error?.message || 'Kayıt oluşturulamadı.';
      if (kod === 'auth/email-already-in-use') {
        mesaj = 'Bu e-posta zaten kayıtlı.';
      } else if (kod === 'auth/invalid-email') {
        mesaj = 'Geçerli bir e-posta girin.';
      }
      Alert.alert('Kayıt Hatası', mesaj);
    } finally {
      setYukleniyor(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.icerik} keyboardShouldPersistTaps="handled">
          <Text style={styles.baslik}>Hesap Oluştur</Text>
          <Text style={styles.altBaslik}>Bilgilerinizi girerek kayıt olun</Text>

          <View style={styles.formKart}>
            <AppInput label="Ad" icon="person-outline" placeholder="Adınız" value={ad} onChangeText={setAd} />
            <AppInput label="Soyad" icon="person-outline" placeholder="Soyadınız" value={soyad} onChangeText={setSoyad} />
            <AppInput
              label="E-posta"
              icon="mail-outline"
              placeholder="ornek@mail.com"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <AppInput
              label="Şifre"
              icon="lock-closed-outline"
              placeholder="En az 6 karakter"
              value={sifre}
              onChangeText={setSifre}
              secureTextEntry
            />
            <PrimaryButton title="Kayıt Ol" icon="checkmark-circle-outline" onPress={kayitOl} loading={yukleniyor} />
          </View>

          <TouchableOpacity style={styles.geriLink} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={18} color={colors.link} />
            <Text style={styles.geriLinkText}>Giriş ekranına dön</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  icerik: { padding: spacing.xl, paddingBottom: 40 },
  baslik: { fontSize: 26, fontWeight: '800', color: colors.text },
  altBaslik: { fontSize: 15, color: colors.textSecondary, marginTop: 6, marginBottom: spacing.lg },
  formKart: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadow.card,
  },
  geriLink: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: spacing.xl, gap: 6 },
  geriLinkText: { color: colors.link, fontSize: 15, fontWeight: '600' },
});
