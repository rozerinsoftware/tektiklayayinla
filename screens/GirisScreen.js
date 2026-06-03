import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { signIn, resendVerificationEmail, kontrolEmailOnaylandi } from '../auth';
import { ensureUserProfile } from '../api';
import { AppInput, PrimaryButton } from '../components/ui';
import { colors, radius, shadow, spacing } from '../constants/theme';

function girisSonrasiGit(navigation, afterLogin) {
  if (afterLogin === 'IlanVer') {
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'Main',
          state: {
            routes: [
              { name: 'Ana Sayfa' },
              { name: 'İlan Ver', state: { routes: [{ name: 'KategoriAna', params: { secimModu: true } }] } },
            ],
            index: 1,
          },
        },
      ],
    });
    return;
  }
  if (navigation.canGoBack()) {
    navigation.goBack();
  } else {
    navigation.replace('Main');
  }
}

export default function GirisScreen({ navigation, route }) {
  const afterLogin = route.params?.afterLogin;
  const [email, setEmail] = useState(route.params?.email || '');
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
      girisSonrasiGit(navigation, afterLogin);
    } catch (error) {
      const kod = error?.code || '';
      let mesaj = error?.message || 'Giriş yapılamadı.';
      if (kod === 'auth/invalid-credential' || kod === 'auth/wrong-password') {
        mesaj = 'E-posta veya şifre hatalı.';
      } else if (kod === 'auth/invalid-email') {
        mesaj = 'Geçerli bir e-posta adresi girin.';
      } else if (kod === 'auth/email-not-verified') {
        Alert.alert(
          'E-posta onayı gerekli',
          `${mesaj}\n\nNot: Daha önce oluşturduğunuz hesaplar için de bir kez onay gerekir (Sahibinden gibi). Gönderen: Firebase (noreply@...) — spam klasörünü kontrol edin.`,
          [
            { text: 'Tamam', style: 'cancel' },
            {
              text: 'Tekrar gönder',
              onPress: async () => {
                try {
                  setYukleniyor(true);
                  await resendVerificationEmail(email, sifre);
                Alert.alert(
                  'Gönderildi',
                  `${email.trim()} adresine onay maili gönderildi.\n\n• 2–10 dk bekleyin\n• Gelen kutusu + spam + Promosyonlar\n• Gönderen: noreply@... (Firebase)\n• Hâlâ yoksa 1 saat bekleyip tekrar deneyin (çok deneme engeli)`
                );
                } catch (e) {
                  Alert.alert('Hata', e?.message || 'Gönderilemedi.');
                } finally {
                  setYukleniyor(false);
                }
              },
            },
            {
              text: 'Onayladım',
              onPress: async () => {
                try {
                  setYukleniyor(true);
                  const onayli = await kontrolEmailOnaylandi(email, sifre);
                  if (onayli) {
                    Alert.alert('Başarılı', 'E-postanız onaylı. Şimdi Giriş yapın.');
                  } else {
                    Alert.alert(
                      'Henüz onay yok',
                      'Bağlantıya tıkladıysanız 1–2 dk bekleyip tekrar deneyin veya Tekrar gönder deyin.'
                    );
                  }
                } catch (e) {
                  Alert.alert('Hata', e?.message || 'Kontrol edilemedi.');
                } finally {
                  setYukleniyor(false);
                }
              },
            },
          ]
        );
        return;
      }
      Alert.alert('Giriş Hatası', mesaj);
    } finally {
      setYukleniyor(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.icerik} keyboardShouldPersistTaps="handled">
          <View style={styles.logoKutu}>
            <Text style={styles.tiklamaEmoji}>👆</Text>
          </View>

          <Text style={styles.baslik}>TekTıklaYayınla</Text>
          <Text style={styles.slogan}>İlanını bir kere gir, her yerde yayınla</Text>

          <View style={styles.formKart}>
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
              placeholder="Şifreniz"
              value={sifre}
              onChangeText={setSifre}
              secureTextEntry
            />
            <PrimaryButton title="Giriş Yap" icon="log-in-outline" onPress={girisYap} loading={yukleniyor} />
          </View>

          <TouchableOpacity style={styles.kayitLink} onPress={() => navigation.navigate('KayitEmail')}>
            <Ionicons name="person-add-outline" size={18} color={colors.primaryText} />
            <Text style={styles.kayitLinkText}>Hesap Oluştur</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.geriAna}
            onPress={() => (navigation.canGoBack() ? navigation.goBack() : navigation.replace('Main'))}
          >
            <Ionicons name="arrow-back" size={18} color={colors.primaryText} />
            <Text style={styles.geriAnaText}>Ana sayfaya dön</Text>
          </TouchableOpacity>

          <View style={styles.platformSatir}>
            {['storefront-outline', 'car-outline', 'cube-outline'].map((icon) => (
              <View key={icon} style={styles.platformIcon}>
                <Ionicons name={icon} size={22} color={colors.primaryText} />
              </View>
            ))}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.headerBg },
  flex: { flex: 1 },
  icerik: { flexGrow: 1, padding: spacing.xl, paddingTop: 40 },
  logoKutu: {
    width: 88,
    height: 88,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: spacing.lg,
    ...shadow.card,
  },
  tiklamaEmoji: { fontSize: 48 },
  baslik: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.primaryText,
    textAlign: 'center',
  },
  slogan: {
    fontSize: 15,
    color: colors.primaryText,
    opacity: 0.8,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: spacing.xl,
  },
  formKart: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadow.card,
  },
  kayitLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xl,
    gap: 8,
  },
  kayitLinkText: { color: colors.primaryText, fontSize: 16, fontWeight: '700' },
  geriAna: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
    gap: 6,
  },
  geriAnaText: { color: colors.primaryText, fontSize: 15, fontWeight: '600', opacity: 0.85 },
  platformSatir: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.lg,
    marginTop: spacing.xxl,
  },
  platformIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
