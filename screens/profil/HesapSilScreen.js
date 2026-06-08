import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { AppInput, PrimaryButton } from '../../components/ui';
import { deleteAccount, signOutUser } from '../../auth';
import { colors, spacing } from '../../constants/theme';

export default function HesapSilScreen({ navigation }) {
  const [sifre, setSifre] = useState('');
  const [yukleniyor, setYukleniyor] = useState(false);

  const sil = () => {
    Alert.alert(
      'Hesabı sil',
      'Hesabınız ve oturumunuz kalıcı olarak silinecek. Emin misiniz?',
      [
        { text: 'Vazgeç', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            if (!sifre) {
              Alert.alert('Şifre', 'Onay için şifrenizi girin.');
              return;
            }
            try {
              setYukleniyor(true);
              await deleteAccount(sifre);
              await signOutUser();
              navigation.getParent()?.getParent()?.reset({
                index: 0,
                routes: [{ name: 'Giris' }],
              });
            } catch (e) {
              Alert.alert('Hata', e?.message || 'Hesap silinemedi.');
            } finally {
              setYukleniyor(false);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.content}>
      <Text style={styles.uyari}>
        Hesabınızı silmek geri alınamaz. Yayında ilanlarınız ve mesajlarınız erişilemez hale gelir.
      </Text>
      <AppInput
        label="Şifreniz"
        secureTextEntry
        value={sifre}
        onChangeText={setSifre}
        placeholder="Onay için şifre"
      />
      <PrimaryButton
        title="Hesabımı kalıcı olarak sil"
        onPress={sil}
        loading={yukleniyor}
        icon="trash-outline"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: 40 },
  uyari: { fontSize: 14, color: colors.textSecondary, lineHeight: 22, marginBottom: spacing.lg },
});
