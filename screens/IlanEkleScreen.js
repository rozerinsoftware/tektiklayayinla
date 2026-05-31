import React, { useState, useCallback } from 'react';
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

const KATEGORILER = ['Emlak', 'Araç', 'İkinci El'];

const KATEGORI_ALANLARI = {
  Emlak: [
    { key: 'ilanTuru', label: 'İlan Türü', placeholder: 'Satılık / Kiralık', icon: 'pricetag-outline' },
    { key: 'emlakTipi', label: 'Emlak Tipi', placeholder: 'Daire / Villa / Arsa...', icon: 'home-outline' },
    { key: 'metrekare', label: 'Metrekare (m²)', placeholder: 'Örn: 120', keyboard: 'numeric', icon: 'resize-outline' },
    { key: 'odaSayisi', label: 'Oda Sayısı', placeholder: 'Örn: 3+1', icon: 'bed-outline' },
    { key: 'binaYasi', label: 'Bina Yaşı', placeholder: 'Örn: 5', keyboard: 'numeric', icon: 'calendar-outline' },
    { key: 'kat', label: 'Bulunduğu Kat', placeholder: 'Örn: 3', keyboard: 'numeric', icon: 'layers-outline' },
  ],
  Araç: [
    { key: 'aracTipi', label: 'Araç Tipi', placeholder: 'Otomobil / SUV...', icon: 'car-outline' },
    { key: 'marka', label: 'Marka', placeholder: 'Örn: Toyota', icon: 'business-outline' },
    { key: 'model', label: 'Model', placeholder: 'Örn: Corolla', icon: 'construct-outline' },
    { key: 'yil', label: 'Yıl', placeholder: 'Örn: 2020', keyboard: 'numeric', icon: 'calendar-outline' },
    { key: 'kilometre', label: 'Kilometre', placeholder: 'Örn: 50000', keyboard: 'numeric', icon: 'speedometer-outline' },
    { key: 'yakit', label: 'Yakıt Tipi', placeholder: 'Benzin / Dizel', icon: 'water-outline' },
    { key: 'vites', label: 'Vites', placeholder: 'Manuel / Otomatik', icon: 'cog-outline' },
  ],
  'İkinci El': [
    { key: 'urunTipi', label: 'Ürün Tipi', placeholder: 'Telefon / Bilgisayar...', icon: 'cube-outline' },
    { key: 'marka', label: 'Marka', placeholder: 'Örn: Apple', icon: 'business-outline' },
    { key: 'durum', label: 'Ürün Durumu', placeholder: 'Sıfır / İyi', icon: 'star-outline' },
  ],
};

export default function IlanEkleScreen({ navigation }) {
  useFocusEffect(
    useCallback(() => {
      if (!getCurrentUserId()) {
        girisIste(navigation);
        navigation.getParent()?.navigate('Ana Sayfa');
      }
    }, [navigation])
  );

  const [kategori, setKategori] = useState(null);
  const [baslik, setBaslik] = useState('');
  const [aciklama, setAciklama] = useState('');
  const [fiyat, setFiyat] = useState('');
  const [ekstraAlanlar, setEkstraAlanlar] = useState({});

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
    if (!kategori) {
      Alert.alert('Uyarı', 'Lütfen bir kategori seçin.');
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
        kategori,
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
        <SectionTitle icon="grid-outline" title="Kategori Seçin" subtitle="İlanınızın türünü belirleyin" />

        <View style={styles.kategoriSatir}>
          {KATEGORILER.map((isim) => {
            const meta = getKategoriMeta(isim);
            const secili = kategori === isim;
            return (
              <TouchableOpacity
                key={isim}
                style={[
                  styles.kategoriKart,
                  secili && { borderColor: meta.renk, borderWidth: 2, backgroundColor: meta.bg },
                ]}
                onPress={() => setKategori(isim)}
                activeOpacity={0.85}
              >
                <Text style={styles.kategoriEmoji}>{meta.emoji}</Text>
                <Text style={styles.kategoriIsim}>{isim}</Text>
                {secili ? (
                  <Ionicons name="checkmark-circle" size={20} color={meta.renk} style={styles.kategoriCheck} />
                ) : null}
              </TouchableOpacity>
            );
          })}
        </View>

        {kategori ? (
          <View style={styles.formKart}>
            <SectionTitle icon="document-text-outline" title="İlan Bilgileri" />

            <AppInput
              label="İlan Başlığı *"
              icon="text-outline"
              placeholder="Örn: Satılık Daire"
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

            {KATEGORI_ALANLARI[kategori].map((alan) => (
              <AppInput
                key={alan.key}
                label={`${alan.label} (isteğe bağlı)`}
                icon={alan.icon}
                placeholder={alan.placeholder}
                value={ekstraAlanlar[alan.key] || ''}
                onChangeText={(val) => ekstraGuncelle(alan.key, val)}
                keyboardType={alan.keyboard || 'default'}
              />
            ))}

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
  kategoriSatir: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.lg, gap: spacing.sm },
  kategoriKart: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    backgroundColor: colors.surface,
    ...shadow.card,
  },
  kategoriEmoji: { fontSize: 28, marginBottom: 4 },
  kategoriIsim: { fontSize: 12, fontWeight: '700', color: colors.text, textAlign: 'center' },
  kategoriCheck: { marginTop: 6 },
  formKart: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },
});
