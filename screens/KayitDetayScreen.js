import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { signUp, sendVerificationEmail, signOutUser } from '../auth';
import { createUserProfile } from '../api';
import { colors, radius, spacing } from '../constants/theme';

export default function KayitDetayScreen({ navigation, route }) {
  const email = route.params?.email || '';
  const [ad, setAd] = useState('');
  const [soyad, setSoyad] = useState('');
  const [sifre, setSifre] = useState('');
  const [sifreGoster, setSifreGoster] = useState(false);
  const [sozlesme, setSozlesme] = useState(false);
  const [iletisim, setIletisim] = useState(false);
  const [modal, setModal] = useState(false);
  const [yukleniyor, setYukleniyor] = useState(false);

  const kayitBaslat = () => {
    if (!ad.trim() || !soyad.trim()) {
      Alert.alert('Uyarı', 'Ad ve soyad girin.');
      return;
    }
    if (sifre.length < 6) {
      Alert.alert('Uyarı', 'Şifre en az 6 karakter olmalı.');
      return;
    }
    if (!sozlesme) {
      Alert.alert('Uyarı', 'Hesap sözleşmesini kabul etmelisiniz.');
      return;
    }
    setModal(true);
  };

  const kaydiTamamla = async () => {
    setModal(false);
    try {
      setYukleniyor(true);
      await signUp({ email, password: sifre, ad, soyad });
      await createUserProfile({ email, ad, soyad });
      try {
        await sendVerificationEmail();
      } catch (mailErr) {
        await signOutUser().catch(() => null);
        Alert.alert(
          'Onay e-postası gönderilemedi',
          mailErr?.message || 'Doğrulama e-postası gönderilemedi. Giriş ekranından tekrar deneyin.'
        );
        return;
      }
      await signOutUser();
      navigation.replace('KayitTamam', { email });
    } catch (error) {
      await signOutUser().catch(() => null);
      const kod = error?.code || '';
      let mesaj = error?.message || 'Kayıt oluşturulamadı.';
      if (kod === 'auth/email-already-in-use') mesaj = 'Bu e-posta zaten kayıtlı.';
      else if (kod === 'auth/invalid-email') mesaj = 'Geçerli bir e-posta girin.';
      Alert.alert('Kayıt Hatası', mesaj);
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
        <View style={styles.ustBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={8}>
            <Ionicons name="arrow-back" size={26} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.getParent()?.goBack?.() || navigation.navigate('Main')} hitSlop={8}>
            <Ionicons name="close" size={26} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Text style={styles.baslik}>Hesap aç</Text>

          <Text style={styles.emailGoster}>{email}</Text>

          <View style={styles.adSoyadSatir}>
            <TextInput
              style={[styles.input, styles.yarim]}
              placeholder="Ad"
              placeholderTextColor={colors.textMuted}
              value={ad}
              onChangeText={setAd}
            />
            <TextInput
              style={[styles.input, styles.yarim]}
              placeholder="Soyad"
              placeholderTextColor={colors.textMuted}
              value={soyad}
              onChangeText={setSoyad}
            />
          </View>

          <View style={styles.sifreWrap}>
            <TextInput
              style={[styles.input, styles.sifreInput]}
              placeholder="Şifre"
              placeholderTextColor={colors.textMuted}
              value={sifre}
              onChangeText={setSifre}
              secureTextEntry={!sifreGoster}
            />
            <TouchableOpacity style={styles.goz} onPress={() => setSifreGoster((v) => !v)}>
              <Ionicons
                name={sifreGoster ? 'eye-off-outline' : 'eye-outline'}
                size={22}
                color={colors.textMuted}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.checkSatir} onPress={() => setSozlesme((v) => !v)}>
            <Ionicons
              name={sozlesme ? 'checkbox' : 'square-outline'}
              size={22}
              color={sozlesme ? colors.primary : colors.textMuted}
            />
            <Text style={styles.checkMetin}>
              <Text style={styles.link}>Bireysel Hesap Sözleşmesi</Text>
              {' '}ve Ekleri'ni kabul ediyorum.
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.checkSatir} onPress={() => setIletisim((v) => !v)}>
            <Ionicons
              name={iletisim ? 'checkbox' : 'square-outline'}
              size={22}
              color={iletisim ? colors.primary : colors.textMuted}
            />
            <Text style={styles.checkMetin}>
              Kampanya ve bilgilendirme iletileri almak istiyorum (isteğe bağlı).
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.maviBtn, yukleniyor && styles.btnDisabled]}
            onPress={kayitBaslat}
            disabled={yukleniyor}
          >
            <Text style={styles.maviBtnText}>{yukleniyor ? 'Kaydediliyor…' : 'Hesap aç'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.girisLink} onPress={() => navigation.replace('Giris')}>
            <Text style={styles.girisLinkMetin}>
              Zaten hesabın var mı? <Text style={styles.link}>Giriş yap</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>

        <Modal visible={modal} transparent animationType="fade">
          <View style={styles.modalZemin}>
            <View style={styles.modalKutu}>
              <View style={styles.modalIkon}>
                <Ionicons name="information" size={32} color="#fff" />
              </View>
              <Text style={styles.modalBaslik}>Onay</Text>
              <Text style={styles.modalMetin}>
                Hesap talebinizi onaylamanız için size doğrulama e-postası göndereceğiz.
              </Text>
              <Text style={styles.modalEmail}>{email}</Text>
              <TouchableOpacity style={styles.maviBtn} onPress={kaydiTamamla}>
                <Text style={styles.maviBtnText}>E-Posta Adresim Doğru, Devam Et</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.outlineBtn} onPress={() => setModal(false)}>
                <Text style={styles.outlineBtnText}>Düzelt</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  flex: { flex: 1 },
  ustBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  scroll: { paddingHorizontal: spacing.xl, paddingBottom: 40 },
  baslik: { fontSize: 32, fontWeight: '800', color: colors.text, marginBottom: spacing.lg },
  emailGoster: {
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 14,
    marginBottom: spacing.md,
    backgroundColor: colors.background,
  },
  adSoyadSatir: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.surface,
  },
  yarim: { flex: 1 },
  sifreWrap: { position: 'relative', marginBottom: spacing.lg },
  sifreInput: { paddingRight: 48 },
  goz: { position: 'absolute', right: 12, top: 14 },
  checkSatir: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: spacing.md },
  checkMetin: { flex: 1, fontSize: 13, color: colors.textSecondary, lineHeight: 19 },
  link: { color: colors.link, fontWeight: '600' },
  maviBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  btnDisabled: { opacity: 0.7 },
  maviBtnText: { color: colors.primaryText, fontSize: 16, fontWeight: '700' },
  girisLink: { alignItems: 'center', marginTop: spacing.xl },
  girisLinkMetin: { fontSize: 15, color: colors.textSecondary },
  modalZemin: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  modalKutu: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xl,
    alignItems: 'center',
  },
  modalIkon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  modalBaslik: { fontSize: 22, fontWeight: '800', color: colors.text, marginBottom: spacing.sm },
  modalMetin: { fontSize: 15, color: colors.textSecondary, textAlign: 'center', lineHeight: 22 },
  modalEmail: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginVertical: spacing.lg,
    textAlign: 'center',
  },
  outlineBtn: {
    marginTop: spacing.md,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 14,
    paddingHorizontal: spacing.xl,
    width: '100%',
    alignItems: 'center',
  },
  outlineBtnText: { color: colors.primary, fontWeight: '700', fontSize: 15 },
});
