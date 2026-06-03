import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppInput, PrimaryButton } from '../../components/ui';
import IlanBreadcrumb from '../../components/ilan/IlanBreadcrumb';
import { colors, spacing, radius, shadow } from '../../constants/theme';
import { kokIdToMetaKey } from '../../constants/kategoriler';
import {
  getIkinciElProfil,
  ikinciElBreadcrumb,
  ikinciElDetayNormalize,
} from '../../constants/ikinciElAlanlari';

function AlanSatiri({ alan, deger, onSec, hata }) {
  if (alan.tip === 'text' || alan.tip === 'number') {
    return (
      <AppInput
        label={`${alan.label}${alan.zorunlu ? ' *' : ''}`}
        placeholder={alan.label}
        value={deger || ''}
        onChangeText={(t) =>
          onSec(alan.key, alan.tip === 'number' ? t.replace(/\D/g, '') : t)
        }
        keyboardType={alan.keyboard || 'default'}
      />
    );
  }
  return (
    <TouchableOpacity
      style={styles.secimSatir}
      onPress={() => onSec(alan.key, null, alan)}
      activeOpacity={0.7}
    >
      <View style={styles.secimSol}>
        <Text style={styles.secimLabel}>
          {alan.label}
          {alan.zorunlu ? ' *' : ''}
        </Text>
        {hata ? <Text style={styles.hataMetin}>Zorunlu alan</Text> : null}
      </View>
      <Text style={[styles.secimDeger, !deger && styles.secimBos]} numberOfLines={1}>
        {deger || 'Seçin'}
      </Text>
      <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
    </TouchableOpacity>
  );
}

export default function IkinciElTemelBilgiScreen({ navigation, route }) {
  const secilenKategori = route.params?.secilenKategori;
  const profil = useMemo(() => getIkinciElProfil(secilenKategori), [secilenKategori]);
  const breadcrumb = useMemo(
    () => [...ikinciElBreadcrumb(secilenKategori), 'TEMEL BİLGİLER'],
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
    if (!Number.isFinite(fiyatSayi) || fiyatSayi < 1) {
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
      Alert.alert('Eksik alan', 'Lütfen zorunlu ürün alanlarını doldurun.');
      return;
    }
    const detay = ikinciElDetayNormalize(alanDegerleri, profil);
    navigation.navigate('IlanKonumBaslangic', {
      taslakIlan: {
        baslik: baslik.trim(),
        aciklama: aciklama.trim(),
        fiyat: String(Math.round(fiyatSayi)),
        kategori: kokIdToMetaKey('ikinci-el'),
        kategoriId: secilenKategori.kategoriId,
        kategoriYolu: secilenKategori.kategoriYolu,
        kategoriEtiket: secilenKategori.kategoriEtiket,
        kategoriKok: 'ikinci-el',
        ...detay,
      },
      adim: 2,
      toplamAdim: 5,
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <IlanBreadcrumb parcalar={breadcrumb} />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.ekranBaslik}>Ürün Bilgilerini Giriniz</Text>

        <View style={styles.tipKart}>
          <View style={styles.tipIcon}>
            <Ionicons name="cube-outline" size={26} color="#7C3AED" />
          </View>
          <View style={styles.tipMetin}>
            <Text style={styles.tipBaslik}>{profil.urunTipi}</Text>
            <Text style={styles.tipAlt}>{secilenKategori?.kategoriEtiket}</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.degistir}>Değiştir</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.uyari}>
          Ürün durumunu ve fiyatı doğru girin. Yanıltıcı ilanlar kaldırılabilir.
        </Text>

        <AppInput
          label="İlan Başlığı *"
          icon="text-outline"
          placeholder="Örn. iPhone 14 Pro Max 256 GB"
          value={baslik}
          onChangeText={setBaslik}
        />
        <AppInput
          label="Açıklama *"
          icon="reader-outline"
          placeholder="Ürünün durumu, aksesuarları, garantisi…"
          value={aciklama}
          onChangeText={setAciklama}
          multiline
          style={{ minHeight: 80, textAlignVertical: 'top' }}
        />
        <AppInput
          label="Fiyat (TL) *"
          icon="cash-outline"
          placeholder="Fiyat girin"
          value={fiyat}
          onChangeText={fiyatGuncelle}
          keyboardType="number-pad"
        />

        {profil.alanlar.map((alan) => (
          <AlanSatiri
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
    backgroundColor: '#EDE9FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipMetin: { flex: 1 },
  tipBaslik: { fontSize: 16, fontWeight: '700', color: '#7C3AED' },
  tipAlt: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  degistir: { fontSize: 13, fontWeight: '600', color: colors.link },
  uyari: {
    fontSize: 11,
    color: colors.textMuted,
    lineHeight: 16,
    marginBottom: spacing.md,
  },
  secimSatir: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingVertical: 14,
    paddingHorizontal: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    marginBottom: 1,
  },
  secimSol: { flex: 1 },
  secimLabel: { fontSize: 15, color: colors.text },
  hataMetin: { fontSize: 11, color: colors.danger, marginTop: 2 },
  secimDeger: { fontSize: 14, fontWeight: '600', color: colors.text, maxWidth: '40%', marginRight: 4 },
  secimBos: { color: colors.textMuted, fontWeight: '400' },
  footer: { marginTop: spacing.lg },
  progressWrap: { marginBottom: spacing.md },
  progressText: { fontSize: 13, color: colors.textSecondary, marginBottom: 6 },
  progressBar: { height: 4, backgroundColor: colors.border, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#7C3AED' },
});
