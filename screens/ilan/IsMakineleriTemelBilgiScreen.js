import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppInput, PrimaryButton } from '../../components/ui';
import IlanBreadcrumb from '../../components/ilan/IlanBreadcrumb';
import IlanAlanSatiri from '../../components/ilan/IlanAlanSatiri';
import { colors, spacing, radius, shadow } from '../../constants/theme';
import { kokIdToMetaKey } from '../../constants/kategoriler';
import {
  getIsMakinesiProfil,
  isMakineleriBreadcrumb,
  isMakineleriDetayNormalize,
} from '../../constants/isMakineleriAlanlari';

export default function IsMakineleriTemelBilgiScreen({ navigation, route }) {
  const secilenKategori = route.params?.secilenKategori;
  const profil = useMemo(() => getIsMakinesiProfil(secilenKategori), [secilenKategori]);
  const breadcrumb = useMemo(
    () => [...isMakineleriBreadcrumb(secilenKategori), 'TEMEL BİLGİLER'],
    [secilenKategori]
  );

  const [baslik, setBaslik] = useState(profil.otomatikBaslik);
  const [aciklama, setAciklama] = useState('');
  const [fiyat, setFiyat] = useState('');
  const [alanDegerleri, setAlanDegerleri] = useState(() => {
    const baslangic = {};
    profil.alanlar.forEach((a) => {
      if (a.varsayilan) baslangic[a.key] = a.varsayilan;
    });
    if (profil.markaOtomatik) baslangic.marka = profil.markaOtomatik;
    return baslangic;
  });
  const [hatalar, setHatalar] = useState({});

  const fiyatGuncelle = (text) => {
    if (/[a-zA-ZğüşıöçĞÜŞİÖÇ]/.test(text)) {
      Alert.alert('Fiyat hatalı', 'Fiyat alanına sadece rakam girebilirsiniz.');
    }
    setFiyat(text.replace(/\D/g, ''));
  };

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
    if (!baslik.trim() || !aciklama.trim() || !String(fiyat).trim()) {
      Alert.alert('Uyarı', 'Başlık, açıklama ve fiyat zorunludur.');
      return;
    }
    const fiyatSayi = Number(fiyat);
    if (!Number.isFinite(fiyatSayi) || fiyatSayi < 10) {
      Alert.alert('Fiyat hatalı', 'Geçerli bir fiyat girin.');
      return;
    }
    const yeniHatalar = {};
    profil.alanlar.forEach((a) => {
      if (a.zorunlu && !String(alanDegerleri[a.key] || '').trim()) {
        yeniHatalar[a.key] = true;
      }
    });
    if (Object.keys(yeniHatalar).length) {
      setHatalar(yeniHatalar);
      Alert.alert('Eksik alan', 'Lütfen zorunlu alanları doldurun.');
      return;
    }
    const detay = isMakineleriDetayNormalize(alanDegerleri, profil);
    navigation.navigate('IlanKonumBaslangic', {
      taslakIlan: {
        baslik: baslik.trim(),
        aciklama: aciklama.trim(),
        fiyat: String(Math.round(fiyatSayi)),
        kategori: kokIdToMetaKey('is-makineleri'),
        kategoriId: secilenKategori.kategoriId,
        kategoriYolu: secilenKategori.kategoriYolu,
        kategoriEtiket: secilenKategori.kategoriEtiket,
        kategoriKok: 'is-makineleri',
        ...detay,
      },
      adim: 2,
      toplamAdim: 5,
    });
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <IlanBreadcrumb parcalar={breadcrumb} />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.ekranBaslik}>Temel Bilgileri Giriniz</Text>

        <View style={styles.tipKart}>
          <View style={styles.tipIcon}>
            <Ionicons name="construct-outline" size={26} color="#B45309" />
          </View>
          <View style={styles.tipMetin}>
            <Text style={styles.tipBaslik}>{profil.makineTipi}</Text>
            <Text style={styles.tipAlt}>
              {[profil.ilanTuru, profil.marka].filter(Boolean).join(' › ')}
            </Text>
          </View>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.degistir}>Değiştir</Text>
          </TouchableOpacity>
        </View>

        <AppInput label="İlan Başlığı *" icon="text-outline" placeholder="Başlık girin" value={baslik} onChangeText={setBaslik} />
        <AppInput
          label="Açıklama *"
          icon="reader-outline"
          placeholder="Açıklama girin"
          value={aciklama}
          onChangeText={setAciklama}
          multiline
          style={{ minHeight: 80, textAlignVertical: 'top' }}
        />
        <AppInput
          label="Fiyat *"
          icon="cash-outline"
          placeholder="Fiyat girin"
          value={fiyat}
          onChangeText={fiyatGuncelle}
          keyboardType="number-pad"
        />

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
          <View style={styles.progressWrap}>
            <Text style={styles.progressText}>İlan Detayları 1 / 5</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '20%' }]} />
            </View>
          </View>
          <PrimaryButton title="Devam Et" icon="arrow-forward" onPress={devamEt} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
    width: 44,
    height: 44,
    borderRadius: radius.sm,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipMetin: { flex: 1 },
  tipBaslik: { fontSize: 16, fontWeight: '700', color: '#B45309' },
  tipAlt: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  degistir: { fontSize: 13, fontWeight: '600', color: colors.link },
  footer: { marginTop: spacing.lg },
  progressWrap: { marginBottom: spacing.md },
  progressText: { fontSize: 13, color: colors.textSecondary, marginBottom: 6 },
  progressBar: { height: 4, backgroundColor: colors.border, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#B45309' },
});
