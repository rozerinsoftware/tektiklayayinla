import React, { useCallback, useState } from 'react';
import { View, Text, Switch, StyleSheet, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getIkiAsamaliDogrulama, setIkiAsamaliDogrulama } from '../../utils/profilStorage';
import { getUserProfile } from '../../api';
import { colors, spacing } from '../../constants/theme';

export default function IkiAsamaliDogrulamaScreen() {
  const [acik, setAcik] = useState(false);
  const [dogrulanmis, setDogrulanmis] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let aktif = true;
      (async () => {
        const [iki, profil] = await Promise.all([
          getIkiAsamaliDogrulama(),
          getUserProfile().catch(() => ({ verified: false })),
        ]);
        if (!aktif) return;
        setAcik(iki || !!profil.verified);
        setDogrulanmis(!!profil.verified);
      })();
      return () => {
        aktif = false;
      };
    }, [])
  );

  const toggle = async (value) => {
    if (dogrulanmis && !value) {
      return;
    }
    setAcik(value);
    await setIkiAsamaliDogrulama(value);
  };

  return (
    <ScrollView style={styles.wrap} contentContainerStyle={styles.content}>
      <Text style={styles.bolumBaslik}>2 AŞAMALI DOĞRULAMA</Text>
      <View style={styles.kutu}>
        <Text style={styles.satirBaslik}>2 Aşamalı Doğrulama</Text>
        <Switch
          value={acik}
          onValueChange={toggle}
          trackColor={{ false: colors.border, true: colors.success }}
          disabled={dogrulanmis}
        />
      </View>
      <Text style={styles.aciklama}>
        Yeni bir cihazdan giriş yaptığınızda, şifrenize ek olarak cep telefonunuza veya e-posta
        adresinize doğrulama kodu gönderilmesini isteyebilirsiniz.
      </Text>
      {dogrulanmis ? (
        <Text style={styles.aciklama}>
          Hesabını doğrulayan kullanıcılarda bu özellik güvenlik için açık tutulur.
        </Text>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: 32 },
  bolumBaslik: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  kutu: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  satirBaslik: { fontSize: 16, fontWeight: '500', color: colors.text },
  aciklama: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 21,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
});
