import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getUserProfile } from '../../api';
import { getFirebaseAuth } from '../../auth';
import { ProfilBilgiSatiri } from '../../components/ProfilBilgiSatiri';
import { varsayilanGorunenAd } from '../../utils/gorunenAd';
import { ensureUserProfile } from '../../api';
import { colors, spacing } from '../../constants/theme';

function kullaniciAdiUret(email) {
  const e = String(email || '').split('@')[0];
  return e || 'kullanici';
}

export default function KisiselBilgilerScreen({ navigation }) {
  const [profil, setProfil] = useState(null);

  useFocusEffect(
    useCallback(() => {
      let aktif = true;
      (async () => {
        try {
          await ensureUserProfile();
          const p = await getUserProfile();
          if (aktif) setProfil(p);
        } catch {
          if (aktif) setProfil(null);
        }
      })();
      return () => {
        aktif = false;
      };
    }, [])
  );

  const email = profil?.email || getFirebaseAuth().currentUser?.email || '';
  const adSoyad = `${profil?.ad || ''} ${profil?.soyad || ''}`.trim() || 'Belirtilmedi';
  const gorunen = varsayilanGorunenAd(profil?.ad, profil?.soyad, profil?.gorunenAd);

  return (
    <ScrollView style={styles.wrap} contentContainerStyle={styles.content}>
      <View style={styles.kutu}>
        <ProfilBilgiSatiri
          etiket="Kullanıcı adı"
          deger={profil?.kullaniciAdi || kullaniciAdiUret(email)}
          saltOkunur
        />
        <ProfilBilgiSatiri
          etiket="Ad soyad"
          deger={adSoyad}
          onPress={() => navigation.navigate('AdSoyadDuzenle')}
        />
        <ProfilBilgiSatiri
          etiket="Görünen ad"
          deger={gorunen}
          onPress={() => navigation.navigate('GorunenAd')}
        />
        <ProfilBilgiSatiri
          etiket="Cep telefonu numarası"
          deger={profil?.telefon || 'Eklenmedi'}
          onPress={() => navigation.navigate('TelefonDuzenle')}
        />
        <ProfilBilgiSatiri
          etiket="E-posta adresi"
          deger={email}
          onPress={() => navigation.navigate('EmailBilgi')}
          son
        />
      </View>
      <Text style={styles.altNot}>
        Kişisel verileriniz ilan ve hesap güvenliği için kullanılır.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: 32 },
  kutu: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  altNot: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: spacing.lg,
    lineHeight: 20,
    textAlign: 'center',
  },
});
