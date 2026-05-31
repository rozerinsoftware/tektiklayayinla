import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { signUp } from '../auth';
import { createUserProfile } from '../api';

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
        mesaj = 'Bu e-posta zaten kayıtlı. Giriş yapmayı deneyin.';
      } else if (kod === 'auth/invalid-email') {
        mesaj = 'Geçerli bir e-posta adresi girin.';
      } else if (kod === 'auth/weak-password') {
        mesaj = 'Şifre çok zayıf. En az 6 karakter kullanın.';
      }
      Alert.alert('Kayıt Hatası', mesaj);
    } finally {
      setYukleniyor(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.icerik} keyboardShouldPersistTaps="handled">
          <Text style={styles.baslik}>Hesap Oluştur</Text>
          <Text style={styles.altBaslik}>Bilgilerinizi girerek kayıt olun</Text>

          <Text style={styles.label}>Ad</Text>
          <TextInput
            style={styles.input}
            placeholder="Adınız"
            value={ad}
            onChangeText={setAd}
            autoCapitalize="words"
            autoComplete="given-name"
          />

          <Text style={styles.label}>Soyad</Text>
          <TextInput
            style={styles.input}
            placeholder="Soyadınız"
            value={soyad}
            onChangeText={setSoyad}
            autoCapitalize="words"
            autoComplete="family-name"
          />

          <Text style={styles.label}>E-posta</Text>
          <TextInput
            style={styles.input}
            placeholder="ornek@mail.com"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
          />

          <Text style={styles.label}>Şifre</Text>
          <TextInput
            style={styles.input}
            placeholder="En az 6 karakter"
            value={sifre}
            onChangeText={setSifre}
            secureTextEntry
            autoComplete="new-password"
          />

          {yukleniyor ? (
            <ActivityIndicator color="#fff" style={styles.loader} />
          ) : (
            <TouchableOpacity style={styles.kayitButon} onPress={kayitOl}>
              <Text style={styles.kayitButonText}>Kayıt Ol</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.geriLink} onPress={() => navigation.goBack()}>
            <Text style={styles.geriLinkText}>Zaten hesabın var mı? Giriş yap</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFC800' },
  flex: { flex: 1 },
  icerik: { flexGrow: 1, padding: 30, paddingTop: 40 },
  baslik: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  altBaslik: { fontSize: 16, color: '#e8f0fe', marginBottom: 28 },
  label: { color: '#fff', fontWeight: '600', marginBottom: 6 },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 14,
    fontSize: 16,
  },
  loader: { marginVertical: 20 },
  kayitButon: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 30,
    alignItems: 'center',
    elevation: 5,
    marginTop: 8,
  },
  kayitButonText: { color: '#1A1A1A', fontSize: 18, fontWeight: 'bold' },
  geriLink: { marginTop: 20, alignItems: 'center', padding: 10 },
  geriLinkText: { color: '#fff', fontSize: 15, fontWeight: '600' },
});
