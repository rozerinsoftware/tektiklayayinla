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
import { signIn } from '../auth';
import { ensureUserProfile } from '../api';

export default function GirisScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [sifre, setSifre] = useState('');
  const [yukleniyor, setYukleniyor] = useState(false);

  const girisYap = async () => {
    if (!email.trim() || !sifre) {
      Alert.alert('Hata', 'E-posta ve şifre girin.');
      return;
    }
    try {
      setYukleniyor(true);
      await signIn(email, sifre);
      await ensureUserProfile({ email });
      navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
    } catch (error) {
      const kod = error?.code || '';
      let mesaj = error?.message || 'Giriş yapılamadı.';
      if (kod === 'auth/invalid-credential' || kod === 'auth/wrong-password') {
        mesaj = 'E-posta veya şifre hatalı.';
      } else if (kod === 'auth/invalid-email') {
        mesaj = 'Geçerli bir e-posta adresi girin.';
      }
      Alert.alert('Giriş Hatası', mesaj);
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
          <View style={styles.logoKutu}>
            <Text style={styles.logoYazi}>👆</Text>
          </View>

          <Text style={styles.baslik}>TekTıklaYayınla</Text>
          <Text style={styles.slogan}>İlanını bir kere gir,{'\n'}her yerde yayınla!</Text>

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
            placeholder="Şifreniz"
            value={sifre}
            onChangeText={setSifre}
            secureTextEntry
            autoComplete="password"
          />

          {yukleniyor ? (
            <ActivityIndicator color="#fff" style={styles.loader} />
          ) : (
            <TouchableOpacity style={styles.baslaButon} onPress={girisYap}>
              <Text style={styles.baslaButonText}>Giriş Yap</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.kayitLink}
            onPress={() => navigation.navigate('Kayit')}
          >
            <Text style={styles.kayitLinkText}>Hesap Oluştur</Text>
          </TouchableOpacity>

          <Text style={styles.altYazi}>Sahibinden • Arabam.com • Letgo • Emlakjet</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFC800' },
  flex: { flex: 1 },
  icerik: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 30 },
  logoKutu: {
    width: 100,
    height: 100,
    backgroundColor: '#fff',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
    elevation: 10,
  },
  logoYazi: { fontSize: 50 },
  baslik: { fontSize: 32, fontWeight: 'bold', color: '#fff', marginBottom: 10 },
  slogan: { fontSize: 18, color: '#e8f0fe', textAlign: 'center', marginBottom: 24, lineHeight: 26 },
  label: { alignSelf: 'stretch', color: '#fff', fontWeight: '600', marginBottom: 6 },
  input: {
    alignSelf: 'stretch',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 14,
    fontSize: 16,
  },
  loader: { marginVertical: 20 },
  baslaButon: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
    elevation: 5,
    marginTop: 8,
  },
  baslaButonText: { color: '#1A1A1A', fontSize: 18, fontWeight: 'bold' },
  kayitLink: {
    marginTop: 16,
    padding: 14,
    width: '100%',
    alignItems: 'center',
  },
  kayitLinkText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  altYazi: { color: 'rgba(255,255,255,0.6)', marginTop: 24, fontSize: 12, textAlign: 'center' },
});
