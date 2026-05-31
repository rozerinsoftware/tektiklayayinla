import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { getFirebaseAuth, signOutUser } from '../auth';
import { isCurrentUserAdmin } from '../api';
import { kokNavigasyon } from '../utils/requireAuth';
import { Card, PrimaryButton, SecondaryButton } from '../components/ui';
import { colors, radius, shadow, spacing } from '../constants/theme';

export default function ProfilScreen({ navigation }) {
  const [admin, setAdmin] = useState(false);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [kullanici, setKullanici] = useState(getFirebaseAuth().currentUser);

  useFocusEffect(
    useCallback(() => {
      const auth = getFirebaseAuth();
      setKullanici(auth.currentUser);
      if (!auth.currentUser) {
        setAdmin(false);
        setYukleniyor(false);
        return;
      }
      let aktif = true;
      (async () => {
        try {
          setYukleniyor(true);
          const adminMi = await isCurrentUserAdmin();
          if (aktif) setAdmin(adminMi);
        } catch {
          if (aktif) setAdmin(false);
        } finally {
          if (aktif) setYukleniyor(false);
        }
      })();
      return () => {
        aktif = false;
      };
    }, [])
  );

  const rootNav = () => kokNavigasyon(navigation);

  const cikisYap = () => {
    Alert.alert('Çıkış', 'Hesabınızdan çıkmak istiyor musunuz?', [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Çıkış Yap',
        style: 'destructive',
        onPress: async () => {
          await signOutUser();
          setKullanici(null);
          setAdmin(false);
        },
      },
    ]);
  };

  if (!kullanici) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Card style={styles.profilKart}>
          <View style={styles.avatar}>
            <Ionicons name="person-outline" size={40} color={colors.textMuted} />
          </View>
          <Text style={styles.isim}>Hoş geldiniz</Text>
          <Text style={styles.misafirMetin}>
            İlan eklemek veya ilanlarınızı yönetmek için giriş yapın.
          </Text>
        </Card>
        <PrimaryButton
          title="Giriş Yap"
          icon="log-in-outline"
          onPress={() => rootNav().navigate('Giris')}
        />
        <SecondaryButton
          title="Hesap Oluştur"
          icon="person-add-outline"
          onPress={() => rootNav().navigate('Kayit')}
        />
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card style={styles.profilKart}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={40} color={colors.primaryText} />
        </View>
        <Text style={styles.isim}>{kullanici.displayName || 'Kullanıcı'}</Text>
        <View style={styles.emailSatir}>
          <Ionicons name="mail-outline" size={16} color={colors.textMuted} />
          <Text style={styles.email}>{kullanici.email || ''}</Text>
        </View>
        {admin ? (
          <View style={styles.adminBadge}>
            <Ionicons name="shield-checkmark" size={14} color="#856404" />
            <Text style={styles.adminBadgeText}>Admin</Text>
          </View>
        ) : null}
      </Card>

      {yukleniyor ? (
        <ActivityIndicator style={styles.loader} color={colors.primaryDark} />
      ) : admin ? (
        <PrimaryButton
          title="Admin Paneli"
          icon="settings-outline"
          onPress={() => navigation.navigate('AdminPanel')}
        />
      ) : null}

      <SecondaryButton title="Çıkış Yap" icon="log-out-outline" onPress={cikisYap} danger />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: 40 },
  profilKart: { alignItems: 'center' },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    ...shadow.soft,
  },
  isim: { fontSize: 22, fontWeight: '800', color: colors.text },
  misafirMetin: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  emailSatir: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  email: { fontSize: 14, color: colors.textSecondary },
  adminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: spacing.md,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  adminBadgeText: { color: '#92400E', fontWeight: '700', fontSize: 13 },
  loader: { marginVertical: spacing.lg },
});
