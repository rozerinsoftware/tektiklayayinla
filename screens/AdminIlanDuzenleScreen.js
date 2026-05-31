import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { adminUpdateIlan } from '../api';
import { colors, radius } from '../constants/theme';

const KATEGORILER = [
  { isim: 'Emlak', emoji: '🏠', renk: '#00B894' },
  { isim: 'Araç', emoji: '🚗', renk: '#FF4500' },
  { isim: 'İkinci El', emoji: '📦', renk: '#6C5CE7' },
];

const KATEGORI_ALANLARI = {
  Emlak: [
    { key: 'ilanTuru', label: 'İlan Türü', placeholder: 'Satılık / Kiralık' },
    { key: 'emlakTipi', label: 'Emlak Tipi', placeholder: 'Daire / Villa / Arsa...' },
    { key: 'metrekare', label: 'Metrekare (m²)', placeholder: 'Örn: 120', keyboard: 'numeric' },
    { key: 'odaSayisi', label: 'Oda Sayısı', placeholder: 'Örn: 3+1' },
    { key: 'binaYasi', label: 'Bina Yaşı', placeholder: 'Örn: 5', keyboard: 'numeric' },
    { key: 'kat', label: 'Bulunduğu Kat', placeholder: 'Örn: 3', keyboard: 'numeric' },
  ],
  Araç: [
    { key: 'aracTipi', label: 'Araç Tipi', placeholder: 'Otomobil / Motosiklet / SUV...' },
    { key: 'marka', label: 'Marka', placeholder: 'Örn: Toyota' },
    { key: 'model', label: 'Model', placeholder: 'Örn: Corolla' },
    { key: 'yil', label: 'Yıl', placeholder: 'Örn: 2020', keyboard: 'numeric' },
    { key: 'kilometre', label: 'Kilometre', placeholder: 'Örn: 50000', keyboard: 'numeric' },
    { key: 'yakit', label: 'Yakıt Tipi', placeholder: 'Benzin / Dizel / Elektrik' },
    { key: 'vites', label: 'Vites', placeholder: 'Manuel / Otomatik' },
  ],
  'İkinci El': [
    { key: 'urunTipi', label: 'Ürün Tipi', placeholder: 'Telefon / Bilgisayar / Giyim...' },
    { key: 'marka', label: 'Marka', placeholder: 'Örn: Apple' },
    { key: 'durum', label: 'Ürün Durumu', placeholder: 'Sıfır / Az Kullanılmış / İyi' },
  ],
};

const PLATFORMLAR = ['Sahibinden', 'Arabam.com', 'Letgo', 'Emlakjet'];

function ekstraAlanlariCikar(ilan) {
  const alanlar = {};
  if (!ilan || !ilan.kategori) return alanlar;
  const tanimlar = KATEGORI_ALANLARI[ilan.kategori] || [];
  tanimlar.forEach((a) => {
    if (ilan[a.key] != null && ilan[a.key] !== '') {
      alanlar[a.key] = String(ilan[a.key]);
    }
  });
  return alanlar;
}

export default function AdminIlanDuzenleScreen({ navigation, route }) {
  const mevcut = route.params?.ilan || {};
  const [kategori, setKategori] = useState(mevcut.kategori || null);
  const [baslik, setBaslik] = useState(mevcut.baslik || '');
  const [aciklama, setAciklama] = useState(mevcut.aciklama || '');
  const [fiyat, setFiyat] = useState(String(mevcut.fiyat || '').replace(/\D/g, ''));
  const [ekstraAlanlar, setEkstraAlanlar] = useState(() => ekstraAlanlariCikar(mevcut));
  const [platformlar, setPlatformlar] = useState(
    Array.isArray(mevcut.platformlar) ? [...mevcut.platformlar] : []
  );
  const [kaydediliyor, setKaydediliyor] = useState(false);

  useEffect(() => {
    navigation.setOptions({ title: 'İlanı Düzenle' });
  }, [navigation]);

  const ekstraGuncelle = (key, value) => {
    setEkstraAlanlar((prev) => ({ ...prev, [key]: value }));
  };

  const fiyatGuncelle = (text) => {
    if (/[a-zA-ZğüşıöçĞÜŞİÖÇ]/.test(text)) {
      Alert.alert('Fiyat hatalı', 'Fiyat alanına sadece rakam girebilirsiniz.');
    }
    setFiyat(text.replace(/\D/g, ''));
  };

  const platformToggle = (ad) => {
    setPlatformlar((prev) =>
      prev.includes(ad) ? prev.filter((p) => p !== ad) : [...prev, ad]
    );
  };

  const kaydet = async () => {
    if (!kategori) {
      Alert.alert('Uyarı', 'Kategori seçin.');
      return;
    }
    if (!baslik.trim() || !aciklama.trim() || !fiyat.trim()) {
      Alert.alert('Uyarı', 'Başlık, açıklama ve fiyat zorunludur.');
      return;
    }
    const fiyatSayi = Number(fiyat);
    if (!Number.isFinite(fiyatSayi) || fiyatSayi < 10) {
      Alert.alert('Fiyat hatalı', 'Geçerli bir fiyat girin.');
      return;
    }

    try {
      setKaydediliyor(true);
      await adminUpdateIlan(mevcut.id, {
        baslik: baslik.trim(),
        aciklama: aciklama.trim(),
        fiyat: String(Math.round(fiyatSayi)),
        kategori,
        platformlar,
        ...ekstraAlanlar,
      });
      Alert.alert('Başarılı', 'İlan güncellendi.', [
        { text: 'Tamam', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Hata', error?.message || 'İlan güncellenemedi.');
    } finally {
      setKaydediliyor(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.ustNot}>Admin düzenleme — sahip: {mevcut.ownerId || '—'}</Text>

        <Text style={styles.bolum}>Kategori</Text>
        <View style={styles.kategoriSatir}>
          {KATEGORILER.map((k) => (
            <TouchableOpacity
              key={k.isim}
              style={[styles.kategoriKart, kategori === k.isim && { borderColor: k.renk, borderWidth: 2 }]}
              onPress={() => {
                setKategori(k.isim);
                setEkstraAlanlar({});
              }}
            >
              <Text style={styles.kategoriEmoji}>{k.emoji}</Text>
              <Text style={styles.kategoriIsim}>{k.isim}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {kategori ? (
          <>
            <Text style={styles.label}>Başlık *</Text>
            <TextInput style={styles.input} value={baslik} onChangeText={setBaslik} />

            <Text style={styles.label}>Açıklama *</Text>
            <TextInput
              style={[styles.input, styles.textarea]}
              value={aciklama}
              onChangeText={setAciklama}
              multiline
            />

            <Text style={styles.label}>Fiyat (TL) *</Text>
            <TextInput
              style={styles.input}
              value={fiyat}
              onChangeText={fiyatGuncelle}
              keyboardType="number-pad"
            />

            <Text style={styles.bolum}>Platformlar</Text>
            <View style={styles.platformWrap}>
              {PLATFORMLAR.map((p) => (
                <TouchableOpacity
                  key={p}
                  style={[styles.platformChip, platformlar.includes(p) && styles.platformChipAktif]}
                  onPress={() => platformToggle(p)}
                >
                  <Text
                    style={[
                      styles.platformChipText,
                      platformlar.includes(p) && styles.platformChipTextAktif,
                    ]}
                  >
                    {platformlar.includes(p) ? '✓ ' : ''}
                    {p}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {KATEGORI_ALANLARI[kategori].map((alan) => (
              <View key={alan.key}>
                <Text style={styles.label}>{alan.label}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={alan.placeholder}
                  value={ekstraAlanlar[alan.key] || ''}
                  onChangeText={(val) => ekstraGuncelle(alan.key, val)}
                  keyboardType={alan.keyboard || 'default'}
                />
              </View>
            ))}

            <TouchableOpacity
              style={[styles.kaydetButon, kaydediliyor && styles.kaydetDisabled]}
              onPress={kaydet}
              disabled={kaydediliyor}
            >
              {kaydediliyor ? (
                <ActivityIndicator color={colors.primaryText} />
              ) : (
                <Text style={styles.kaydetText}>Kaydet</Text>
              )}
            </TouchableOpacity>
          </>
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingBottom: 40 },
  ustNot: { fontSize: 12, color: colors.textMuted, marginBottom: 12 },
  bolum: { fontSize: 17, fontWeight: '700', color: colors.text, marginBottom: 10, marginTop: 8 },
  kategoriSatir: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  kategoriKart: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    backgroundColor: colors.surface,
  },
  kategoriEmoji: { fontSize: 26 },
  kategoriIsim: { fontSize: 12, fontWeight: '600', marginTop: 4 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 6, color: colors.text },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: radius.sm,
    marginBottom: 14,
    fontSize: 15,
  },
  textarea: { height: 90, textAlignVertical: 'top' },
  platformWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  platformChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  platformChipAktif: { backgroundColor: colors.primary, borderColor: colors.primaryDark },
  platformChipText: { fontSize: 13, color: colors.textSecondary, fontWeight: '600' },
  platformChipTextAktif: { color: colors.primaryText },
  kaydetButon: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: radius.md,
    alignItems: 'center',
    marginTop: 8,
  },
  kaydetDisabled: { opacity: 0.7 },
  kaydetText: { color: colors.primaryText, fontSize: 16, fontWeight: '700' },
});
