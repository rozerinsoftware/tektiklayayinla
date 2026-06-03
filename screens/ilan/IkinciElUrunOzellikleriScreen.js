import React, { useCallback, useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import IlanBreadcrumb from '../../components/ilan/IlanBreadcrumb';
import IlanAlanSatiri from '../../components/ilan/IlanAlanSatiri';
import { PrimaryButton } from '../../components/ui';
import { colors, spacing, radius, shadow } from '../../constants/theme';
import {
  getIkinciElProfil,
  ikinciElBreadcrumb,
  ikinciElDetayNormalize,
} from '../../constants/ikinciElAlanlari';

export default function IkinciElUrunOzellikleriScreen({ navigation, route }) {
  const secilenKategori = route.params?.secilenKategori;
  const profil = useMemo(() => getIkinciElProfil(secilenKategori), [secilenKategori]);
  const breadcrumb = useMemo(
    () => [...ikinciElBreadcrumb(secilenKategori), 'ÜRÜN ÖZELLİKLERİ'],
    [secilenKategori]
  );

  const [alanDegerleri, setAlanDegerleri] = useState(() => {
    const baslangic = {};
    profil.alanlar.forEach((a) => {
      if (a.varsayilan) baslangic[a.key] = a.varsayilan;
    });
    if (profil.profilKey === 'laptop' && secilenKategori?.kategoriEtiket) {
      const parca = secilenKategori.kategoriEtiket.split(' › ');
      const marka = parca[parca.length - 1];
      if (marka && !baslangic.marka) baslangic.marka = marka;
    }
    return baslangic;
  });
  const [hatalar, setHatalar] = useState({});

  const alanSec = useCallback((key, deger, alanDef) => {
    if (alanDef?.tip === 'select') {
      Alert.alert(
        alanDef.label,
        '',
        [
          ...alanDef.secenekler.map((s) => ({
            text: s,
            onPress: () => {
              setAlanDegerleri((prev) => ({ ...prev, [key]: s }));
              setHatalar((prev) => ({ ...prev, [key]: false }));
            },
          })),
          { text: 'İptal', style: 'cancel' },
        ],
        { cancelable: true }
      );
      return;
    }
    setAlanDegerleri((prev) => ({ ...prev, [key]: deger }));
    if (deger) setHatalar((prev) => ({ ...prev, [key]: false }));
  }, []);

  const devamEt = () => {
    const yeniHatalar = {};
    profil.alanlar.forEach((a) => {
      if (a.zorunlu && !String(alanDegerleri[a.key] || '').trim()) {
        yeniHatalar[a.key] = true;
      }
    });
    if (Object.keys(yeniHatalar).length) {
      setHatalar(yeniHatalar);
      Alert.alert('Eksik alan', 'Lütfen zorunlu ürün özelliklerini doldurun.');
      return;
    }
    const detay = ikinciElDetayNormalize(alanDegerleri, profil);
    navigation.navigate('IkinciElIlanBilgileri', {
      secilenKategori,
      taslakIlan: {
        kategoriId: secilenKategori.kategoriId,
        kategoriYolu: secilenKategori.kategoriYolu,
        kategoriEtiket: secilenKategori.kategoriEtiket,
        kategoriKok: 'ikinci-el',
        baslikOneri: profil.otomatikBaslik,
        ...detay,
      },
      adim: 2,
      toplamAdim: 6,
    });
  };

  return (
    <View style={styles.flex}>
      <IlanBreadcrumb parcalar={breadcrumb} />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.ekranBaslik}>Ürün Özellikleri</Text>
        <View style={styles.tipKart}>
          <View style={styles.tipIcon}>
            <Ionicons name="cube-outline" size={24} color="#7C3AED" />
          </View>
          <Text style={styles.tipBaslik}>{profil.urunTipi}</Text>
        </View>
        {profil.alanlar.map((alan) => (
          <IlanAlanSatiri
            key={alan.key}
            alan={alan}
            deger={alanDegerleri[alan.key]}
            hata={hatalar[alan.key]}
            onSec={alanSec}
          />
        ))}
        <View style={styles.footer}>
          <Text style={styles.progressText}>İlan Detayları 1 / 6</Text>
          <PrimaryButton title="Devam Et" icon="arrow-forward" onPress={devamEt} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: 32 },
  ekranBaslik: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: spacing.md },
  tipKart: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },
  tipIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    backgroundColor: '#EDE9FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipBaslik: { fontSize: 16, fontWeight: '700', color: '#7C3AED', flex: 1 },
  footer: { marginTop: spacing.lg },
  progressText: { fontSize: 13, color: colors.textSecondary, marginBottom: spacing.md },
});
