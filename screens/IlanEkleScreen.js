import React, { useState, useCallback, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { getCurrentUserId } from '../auth';
import { girisIste } from '../utils/requireAuth';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppInput, PrimaryButton, SectionTitle } from '../components/ui';
import { colors, radius, shadow, spacing, getKategoriMeta } from '../constants/theme';
import { kokIdToMetaKey } from '../constants/kategoriler';

const KATEGORI_ALANLARI = {
  Emlak: [
    { key: 'metrekare', label: 'Metrekare (m²)', placeholder: 'Örn: 120', keyboard: 'numeric', icon: 'resize-outline' },
    { key: 'odaSayisi', label: 'Oda Sayısı', placeholder: 'Örn: 3+1', icon: 'bed-outline' },
    { key: 'binaYasi', label: 'Bina Yaşı', placeholder: 'Örn: 5', keyboard: 'numeric', icon: 'calendar-outline' },
    { key: 'kat', label: 'Bulunduğu Kat', placeholder: 'Örn: 3', keyboard: 'numeric', icon: 'layers-outline' },
  ],
  Araç: [
    { key: 'marka', label: 'Marka', placeholder: 'Örn: Toyota', icon: 'business-outline' },
    { key: 'model', label: 'Model', placeholder: 'Örn: Corolla', icon: 'construct-outline' },
    { key: 'yil', label: 'Yıl', placeholder: 'Örn: 2020', keyboard: 'numeric', icon: 'calendar-outline' },
    { key: 'kilometre', label: 'Kilometre', placeholder: 'Örn: 50000', keyboard: 'numeric', icon: 'speedometer-outline' },
  ],
  'İkinci El': [
    { key: 'marka', label: 'Marka', placeholder: 'Örn: Apple', icon: 'business-outline' },
    { key: 'durum', label: 'Ürün Durumu', placeholder: 'Sıfır / İyi', icon: 'star-outline' },
  ],
};

export default function IlanEkleScreen({ navigation, route }) {
  const [secilenKategori, setSecilenKategori] = useState(route.params?.secilenKategori || null);
  const [baslik, setBaslik] = useState('');
  const [aciklama, setAciklama] = useState('');
  const [fiyat, setFiyat] = useState('');
  const [ekstraAlanlar, setEkstraAlanlar] = useState({});

  useFocusEffect(
    useCallback(() => {
      if (!getCurrentUserId()) {
        girisIste(navigation);
        navigation.getParent()?.navigate('Ana Sayfa');
      }
    }, [navigation])
  );

  useEffect(() => {
    if (route.params?.secilenKategori) {
      setSecilenKategori(route.params.secilenKategori);
    }
  }, [route.params?.secilenKategori]);

  const metaKey = secilenKategori ? kokIdToMetaKey(secilenKategori.kategoriKok) : null;
  const meta = metaKey ? getKategoriMeta(metaKey) : null;

  const kategoriSec = () => {
    navigation.navigate('KategoriDetay', {
      kategoriId: secilenKategori?.kategoriKok || 'emlak',
      secimModu: true,
    });
  };

  const ekstraGuncelle = (key, value) => {
    setEkstraAlanlar((prev) => ({ ...prev, [key]: value }));
  };

  const fiyatGuncelle = (text) => {
    if (/[a-zA-ZğüşıöçĞÜŞİÖÇ]/.test(text)) {
      Alert.alert('Fiyat hatalı', 'Fiyat alanına sadece rakam girebilirsiniz.');
    }
    setFiyat(text.replace(/\D/g, ''));
  };

  const devamEt = () => {
    if (!getCurrentUserId()) {
      girisIste(navigation);
      return;
    }
    if (!secilenKategori?.kategoriId) {
      Alert.alert('Uyarı', 'Lütfen kategori seçin.');
      return;
    }
    if (!baslik.trim() || !aciklama.trim() || !String(fiyat).trim()) {
      Alert.alert('Uyarı', 'Başlık, açıklama ve fiyat zorunludur.');
      return;
    }
    const fiyatSayi = Number(fiyat);
    if (!Number.isFinite(fiyatSayi) || fiyatSayi < 10) {
      Alert.alert('Fiyat hatalı', 'Geçerli bir fiyat girin (en az 10 TL).');
      return;
    }
    navigation.navigate('PlatformSec', {
      yeniIlan: {
        baslik: baslik.trim(),
        aciklama: aciklama.trim(),
        fiyat: String(Math.round(fiyatSayi)),
        kategori: metaKey,
        kategoriId: secilenKategori.kategoriId,
        kategoriYolu: secilenKategori.kategoriYolu,
        kategoriEtiket: secilenKategori.kategoriEtiket,
        kategoriKok: secilenKategori.kategoriKok,
        ...ekstraAlanlar,
      },
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <SectionTitle icon="grid-outline" title="Kategori Seçin" subtitle="Sahibinden tarzı alt kategorilere inin" />

        <TouchableOpacity style={styles.kategoriSecKutu} onPress={kategoriSec} activeOpacity={0.85}>
          {secilenKategori ? (
            <>
              <View style={[styles.kategoriSecIcon, meta && { backgroundColor: meta.bg }]}>
                <Text style={styles.kategoriSecEmoji}>{meta?.emoji || '📋'}</Text>
              </View>
              <View style={styles.kategoriSecMetin}>
                <Text style={styles.kategoriSecEtiket} numberOfLines={2}>
                  {secilenKategori.kategoriEtiket}
                </Text>
                <Text style={styles.kategoriSecDegistir}>Değiştirmek için dokunun</Text>
              </View>
            </>
          ) : (
            <>
              <View style={styles.kategoriSecIcon}>
                <Text style={styles.tiklamaEmoji}>👆</Text>
              </View>
              <View style={styles.kategoriSecMetin}>
                <Text style={styles.kategoriSecBos}>Kategori seçin</Text>
                <Text style={styles.kategoriSecDegistir}>Emlak, Vasıta, İkinci El…</Text>
              </View>
            </>
          )}
          <Ionicons name="chevron-forward" size={22} color={colors.textMuted} />
        </TouchableOpacity>

        {secilenKategori ? (
          <View style={styles.formKart}>
            <SectionTitle icon="document-text-outline" title="İlan Bilgileri" />

            <AppInput
              label="İlan Başlığı *"
              icon="text-outline"
              placeholder="Örn: Satılık 3+1 Daire"
              value={baslik}
              onChangeText={setBaslik}
            />
            <AppInput
              label="Açıklama *"
              icon="reader-outline"
              placeholder="İlanınızı açıklayın"
              value={aciklama}
              onChangeText={setAciklama}
              multiline
              style={{ minHeight: 80, textAlignVertical: 'top' }}
            />
            <AppInput
              label="Fiyat (TL) *"
              icon="cash-outline"
              placeholder="Örn: 1500000"
              value={fiyat}
              onChangeText={fiyatGuncelle}
              keyboardType="number-pad"
              maxLength={12}
            />

            {metaKey && KATEGORI_ALANLARI[metaKey]
              ? KATEGORI_ALANLARI[metaKey].map((alan) => (
                  <AppInput
                    key={alan.key}
                    label={`${alan.label} (isteğe bağlı)`}
                    icon={alan.icon}
                    placeholder={alan.placeholder}
                    value={ekstraAlanlar[alan.key] || ''}
                    onChangeText={(val) => ekstraGuncelle(alan.key, val)}
                    keyboardType={alan.keyboard || 'default'}
                  />
                ))
              : null}

            <PrimaryButton title="Devam Et" icon="arrow-forward" onPress={devamEt} />
          </View>
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: 40 },
  kategoriSecKutu: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
    ...shadow.card,
  },
  kategoriSecIcon: {
    width: 52,
    height: 52,
    borderRadius: radius.sm,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  kategoriSecEmoji: { fontSize: 26 },
  tiklamaEmoji: { fontSize: 32 },
  kategoriSecMetin: { flex: 1 },
  kategoriSecEtiket: { fontSize: 14, fontWeight: '700', color: colors.text },
  kategoriSecBos: { fontSize: 16, fontWeight: '700', color: colors.text },
  kategoriSecDegistir: { fontSize: 12, color: colors.textSecondary, marginTop: 4 },
  formKart: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },
});
