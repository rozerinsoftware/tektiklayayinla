import React, { useState } from 'react';
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
} from 'react-native';

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

export default function IlanEkleScreen({ navigation }) {
  const [kategori, setKategori] = useState(null);
  const [baslik, setBaslik] = useState('');
  const [aciklama, setAciklama] = useState('');
  const [fiyat, setFiyat] = useState('');
  const [ekstraAlanlar, setEkstraAlanlar] = useState({});

  const ekstraGuncelle = (key, value) => {
    setEkstraAlanlar(prev => ({ ...prev, [key]: value }));
  };

  const parseFiyatTl = (raw) => {
    let s = String(raw ?? '').trim().replace(/\s/g, '');
    if (!s) return NaN;
    const lastComma = s.lastIndexOf(',');
    const lastDot = s.lastIndexOf('.');
    let normalized;
    if (lastComma > lastDot) {
      normalized = s.replace(/\./g, '').replace(',', '.');
    } else {
      normalized = s.replace(/,/g, '');
    }
    const n = Number(normalized);
    return Number.isFinite(n) ? n : NaN;
  };

  const devamEt = () => {
    if (!kategori || !baslik.trim() || !aciklama.trim() || !String(fiyat).trim()) {
      Alert.alert('Hata', 'Lütfen tüm zorunlu alanları doldurun!');
      return;
    }
    const fiyatSayi = parseFiyatTl(fiyat);
    if (!Number.isFinite(fiyatSayi) || fiyatSayi <= 0) {
      Alert.alert('Hata', 'Fiyat geçerli bir pozitif sayı olmalı (örn: 15000 veya 1.500.000).');
      return;
    }
    if (fiyatSayi < 10) {
      Alert.alert('Hata', 'Fiyat en az 10 TL olmalı.');
      return;
    }
    if (fiyatSayi > 10_000_000_000) {
      Alert.alert('Hata', 'Fiyat çok büyük; kontrol edip tekrar girin.');
      return;
    }
    const fiyatMetin = String(Math.round(fiyatSayi));
    navigation.navigate('PlatformSec', {
      yeniIlan: { baslik: baslik.trim(), aciklama: aciklama.trim(), fiyat: fiyatMetin, kategori, ...ekstraAlanlar },
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
          <Text style={styles.baslik}>Kategori Seçin</Text>
          <View style={styles.kategoriSatir}>
            {KATEGORILER.map((k) => (
              <TouchableOpacity
                key={k.isim}
                style={[styles.kategoriKart, kategori === k.isim && { borderColor: k.renk, borderWidth: 2 }]}
                onPress={() => setKategori(k.isim)}
              >
                <Text style={styles.kategoriEmoji}>{k.emoji}</Text>
                <Text style={styles.kategoriIsim}>{k.isim}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {kategori && (
            <>
              <Text style={styles.baslik}>İlan Bilgileri</Text>

              <Text style={styles.label}>İlan Başlığı *</Text>
              <TextInput style={styles.input} placeholder="Örn: Satılık Daire" value={baslik} onChangeText={setBaslik} />

              <Text style={styles.label}>Açıklama *</Text>
              <TextInput
                style={[styles.input, styles.textarea]}
                placeholder="İlanınızı açıklayın"
                value={aciklama}
                onChangeText={setAciklama}
                multiline
              />

              <Text style={styles.label}>Fiyat (TL) *</Text>
              <TextInput
                style={styles.input}
                placeholder="Örn: 15000"
                value={fiyat}
                onChangeText={setFiyat}
                keyboardType="numeric"
              />

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

              <TouchableOpacity style={styles.buton} onPress={devamEt}>
                <Text style={styles.butonText}>Devam Et →</Text>
              </TouchableOpacity>
            </>
          )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 20, paddingBottom: 40 },
  baslik: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, marginTop: 10, color: '#333' },
  kategoriSatir: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  kategoriKart: { flex: 1, borderWidth: 1, borderColor: '#eee', borderRadius: 12, padding: 15, alignItems: 'center', marginHorizontal: 5, backgroundColor: '#f9f9f9' },
  kategoriEmoji: { fontSize: 30, marginBottom: 5 },
  kategoriIsim: { fontSize: 13, fontWeight: '600', color: '#333' },
  label: { fontSize: 15, fontWeight: '600', marginBottom: 5, color: '#333' },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8, marginBottom: 15, fontSize: 15 },
  textarea: { height: 80, textAlignVertical: 'top' },
  buton: { backgroundColor: '#1a73e8', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 5, marginBottom: 30 },
  butonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});