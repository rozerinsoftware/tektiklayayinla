import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getFirebaseAuth, signOutUser } from '../auth';
import { isCurrentUserAdmin } from '../api';
import { colors, radius } from '../constants/theme';

export default function ProfilScreen({ navigation }) {
  const [admin, setAdmin] = useState(false);
  const [yukleniyor, setYukleniyor] = useState(true);

  const kullanici = getFirebaseAuth().currentUser;

  useFocusEffect(
    useCallback(() => {
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

  const kokNavigasyon = () => {
    let nav = navigation;
    while (nav.getParent()) nav = nav.getParent();
    return nav;
  };

  const cikisYap = () => {
    Alert.alert('Çıkış', 'Hesabınızdan çıkmak istiyor musunuz?', [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Çıkış Yap',
        style: 'destructive',
        onPress: async () => {
          await signOutUser();
          kokNavigasyon().reset({
            index: 0,
            routes: [{ name: 'Giris' }],
          });
        },
      },
    ]);
  };

  const adminPaneleGit = () => {
    navigation.navigate('AdminPanel');
  };

  return (
    <View style={styles.container}>
      <View style={styles.kart}>
        <Text style={styles.avatar}>👤</Text>
        <Text style={styles.isim}>{kullanici?.displayName || 'Kullanıcı'}</Text>
        <Text style={styles.email}>{kullanici?.email || ''}</Text>
        {admin && <Text style={styles.adminBadge}>Admin</Text>}
      </View>

      {yukleniyor ? (
        <ActivityIndicator style={styles.loader} color={colors.primaryDark} />
      ) : (
        admin && (
          <TouchableOpacity style={styles.adminButon} onPress={adminPaneleGit}>
            <Text style={styles.adminButonText}>🛡️ Admin Paneli</Text>
          </TouchableOpacity>
        )
      )}

      <TouchableOpacity style={styles.cikisButon} onPress={cikisYap}>
        <Text style={styles.cikisButonText}>Çıkış Yap</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 20 },
  kart: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 3,
  },
  avatar: { fontSize: 56, marginBottom: 12 },
  isim: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  email: { fontSize: 15, color: '#666', marginTop: 6 },
  adminBadge: {
    marginTop: 12,
    backgroundColor: '#fff3cd',
    color: '#856404',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    fontWeight: 'bold',
    overflow: 'hidden',
  },
  loader: { marginVertical: 20 },
  adminButon: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: radius.md,
    alignItems: 'center',
    marginBottom: 12,
  },
  adminButonText: { color: colors.primaryText, fontSize: 17, fontWeight: 'bold' },
  cikisButon: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e74c3c',
  },
  cikisButonText: { color: '#e74c3c', fontSize: 16, fontWeight: 'bold' },
});
