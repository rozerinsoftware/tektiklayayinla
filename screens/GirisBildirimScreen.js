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
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { signIn, resendVerificationEmail } from '../auth';
import { ensureUserProfile } from '../api';
import { colors, radius, spacing } from '../constants/theme';

function bildirimlerSonrasiGit(navigation) {
  navigation.reset({
    index: 0,
    routes: [
      {
        name: 'Main',
        state: {
          routes: [
            { name: 'Ana Sayfa' },
            { name: 'İlan Ver' },
            { name: 'Ara' },
            {
              name: 'Profilim',
              state: {
                routes: [{ name: 'Profil' }, { name: 'Bildirimler' }],
                index: 1,
              },
            },
          ],
          index: 3,
        },
      },
    ],
  });
}

export default function GirisBildirimScreen({ navigation, route }) {
  const [email, setEmail] = useState(route.params?.email || '');
  const [sifre, setSifre] = useState('');
  const [yukleniyor, setYukleniyor] = useState(false);

  const kapat = () => {
    if (navigation.canGoBack()) navigation.goBack();
    else navigation.replace('Main');
  };

  const girisYap = async () => {
    if (!email.trim() || !sifre) {
      Alert.alert('Uyarı', 'E-posta ve şifre girin.');
      return;
    }
    try {
      setYukleniyor(true);
      await signIn(email, sifre);
      await ensureUserProfile({ email });
      bildirimlerSonrasiGit(navigation);
    } catch (error) {
      const kod = error?.code || '';
      let mesaj = error?.message || 'Giriş yapılamadı.';
      if (kod === 'auth/invalid-credential' || kod === 'auth/wrong-password') {
        mesaj = 'E-posta veya şifre hatalı.';
      } else if (kod === 'auth/email-not-verified') {
        Alert.alert('E-posta onayı gerekli', mesaj, [
          { text: 'Tamam', style: 'cancel' },
          {
            text: 'Tekrar gönder',
            onPress: async () => {
              try {
                await resendVerificationEmail(email, sifre);
                Alert.alert('Gönderildi', 'Onay e-postası tekrar gönderildi.');
              } catch (e) {
                Alert.alert('Hata', e?.message || 'Gönderilemedi.');
              }
            },
          },
        ]);
        return;
      }
      Alert.alert('Giriş Hatası', mesaj);
    } finally {
      setYukleniyor(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.ustBar}>
          <Text style={styles.ustBaslik}>Bildirimleri görüntülemek için giriş yapın</Text>
          <TouchableOpacity onPress={kapat} hitSlop={12} style={styles.kapat}>
            <Ionicons name="close" size={28} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.etiket}>E-posta</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="E-posta adresiniz"
            placeholderTextColor={colors.textMuted}
            autoCapitalize="none"
            keyboardType="email-address"
            autoCorrect={false}
          />

          <Text style={styles.etiket}>Şifre</Text>
          <TextInput
            style={styles.input}
            value={sifre}
            onChangeText={setSifre}
            placeholder="Şifreniz"
            placeholderTextColor={colors.textMuted}
            secureTextEntry
          />

          <TouchableOpacity
            style={styles.sifremiUnuttum}
            onPress={() => Alert.alert('Yakında', 'Şifre sıfırlama e-postası yakında eklenecek.')}
          >
            <Text style={styles.sifremiUnuttumText}>Şifremi unuttum</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.girisBtn, yukleniyor && styles.btnDisabled]}
            onPress={girisYap}
            disabled={yukleniyor}
            activeOpacity={0.85}
          >
            <Text style={styles.girisBtnText}>{yukleniyor ? 'Giriş yapılıyor…' : 'Giriş yap'}</Text>
          </TouchableOpacity>

          <View style={styles.ayracSatir}>
            <View style={styles.ayracCizgi} />
          </View>

          <View style={styles.sosyalSatir}>
            <TouchableOpacity style={styles.sosyalBtn} disabled>
              <Text style={styles.sosyalG}>G</Text>
              <Text style={styles.sosyalText}>Google ile giriş yap</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sosyalBtn} disabled>
              <Ionicons name="logo-apple" size={20} color={colors.text} />
              <Text style={styles.sosyalText}>Apple ile giriş yap</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.hesapSoru}>Henüz hesabın yok mu?</Text>
          <TouchableOpacity
            style={styles.hesapAcBtn}
            onPress={() => navigation.replace('KayitEmail')}
            activeOpacity={0.85}
          >
            <Text style={styles.hesapAcBtnText}>Hesap aç</Text>
          </TouchableOpacity>

          <View style={styles.yasalSatir}>
            <TouchableOpacity
              onPress={() => navigation.navigate('KurumsalBilgi', { baslangic: 'sozlesme' })}
            >
              <Text style={styles.yasalLink}>Bireysel Hesap Sözleşmesi</Text>
            </TouchableOpacity>
            <Text style={styles.yasalAyraç}> · </Text>
            <TouchableOpacity onPress={() => navigation.navigate('KurumsalBilgi', { baslangic: 'kvkk' })}>
              <Text style={styles.yasalLink}>KVKK Aydınlatma Metni</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  flex: { flex: 1 },
  ustBar: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    gap: spacing.sm,
  },
  ustBaslik: {
    flex: 1,
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    lineHeight: 28,
  },
  kapat: { paddingTop: 2 },
  scroll: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  etiket: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
    marginTop: spacing.md,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.surface,
  },
  sifremiUnuttum: { alignSelf: 'flex-start', marginTop: spacing.sm },
  sifremiUnuttumText: { fontSize: 15, color: colors.link, fontWeight: '600' },
  girisBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  btnDisabled: { opacity: 0.7 },
  girisBtnText: { color: colors.primaryText, fontSize: 17, fontWeight: '700' },
  ayracSatir: { marginVertical: spacing.xl },
  ayracCizgi: { height: 1, backgroundColor: colors.border },
  sosyalSatir: { flexDirection: 'row', gap: spacing.md },
  sosyalBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: 14,
    opacity: 0.55,
  },
  sosyalG: { fontSize: 18, fontWeight: '800', color: '#4285F4' },
  sosyalText: { fontSize: 12, fontWeight: '600', color: colors.text },
  hesapSoru: {
    textAlign: 'center',
    fontSize: 15,
    color: colors.textSecondary,
    marginTop: spacing.xxl,
    marginBottom: spacing.md,
  },
  hesapAcBtn: {
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: 'center',
  },
  hesapAcBtnText: { color: colors.primary, fontSize: 16, fontWeight: '700' },
  yasalSatir: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: spacing.xxl,
    paddingHorizontal: spacing.sm,
  },
  yasalLink: { fontSize: 12, color: colors.link, fontWeight: '600' },
  yasalAyraç: { fontSize: 12, color: colors.textMuted },
});
