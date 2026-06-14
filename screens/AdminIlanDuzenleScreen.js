import React, { useState } from 'react';
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
import { adminUpdateIlan } from '../api';
import { AppInput, PrimaryButton, SectionTitle } from '../components/ui';
import { colors, radius, shadow, spacing, getKategoriMeta } from '../constants/theme';

const KATEGORILER = ['Emlak', 'Araç', 'İkinci El', 'İş Makineleri'];

const KATEGORI_ALANLARI = {
  Emlak: [
    { key: 'ilanTuru', label: 'İlan Türü', placeholder: 'Satılık / Kiralık', icon: 'pricetag-outline' },
    { key: 'emlakTipi', label: 'Emlak Tipi', placeholder: 'Daire / Villa...', icon: 'home-outline' },
    { key: 'metrekare', label: 'Metrekare (m²)', placeholder: '120', keyboard: 'numeric', icon: 'resize-outline' },
    { key: 'odaSayisi', label: 'Oda Sayısı', placeholder: '3+1', icon: 'bed-outline' },
    { key: 'binaYasi', label: 'Bina Yaşı', placeholder: '5', keyboard: 'numeric', icon: 'calendar-outline' },
    { key: 'kat', label: 'Kat', placeholder: '3', keyboard: 'numeric', icon: 'layers-outline' },
  ],
  Araç: [
    { key: 'aracTipi', label: 'Araç Tipi', placeholder: 'Otomobil', icon: 'car-outline' },
    { key: 'marka', label: 'Marka', placeholder: 'Toyota', icon: 'business-outline' },
    { key: 'model', label: 'Model', placeholder: 'Corolla', icon: 'construct-outline' },
    { key: 'yil', label: 'Yıl', placeholder: '2020', keyboard: 'numeric', icon: 'calendar-outline' },
    { key: 'kilometre', label: 'Kilometre', placeholder: '50000', keyboard: 'numeric', icon: 'speedometer-outline' },
    { key: 'yakit', label: 'Yakıt', placeholder: 'Benzin', icon: 'water-outline' },
    { key: 'vites', label: 'Vites', placeholder: 'Manuel', icon: 'cog-outline' },
  ],
  'İkinci El': [
    { key: 'urunTipi', label: 'Ürün Tipi', placeholder: 'Telefon', icon: 'cube-outline' },
    { key: 'marka', label: 'Marka', placeholder: 'Apple', icon: 'business-outline' },
    { key: 'durum', label: 'Durum', placeholder: 'İyi', icon: 'star-outline' },
  ],
  'İş Makineleri': [
    { key: 'marka', label: 'Marka', placeholder: 'Caterpillar', icon: 'business-outline' },
    { key: 'model', label: 'Model', placeholder: '320', icon: 'construct-outline' },
    { key: 'yil', label: 'Yıl', placeholder: '2018', keyboard: 'numeric', icon: 'calendar-outline' },
    { key: 'calismaSaati', label: 'Çalışma Saati', placeholder: '6800', keyboard: 'numeric', icon: 'time-outline' },
  ],
};

const PLATFORMLAR = ['Sahibinden', 'Arabam.com', 'Letgo', 'Emlakjet'];

function ekstraAlanlariCikar(ilan) {
  const alanlar = {};
  if (!ilan?.kategori) return alanlar;
  (KATEGORI_ALANLARI[ilan.kategori] || []).forEach((a) => {
    const deger = ilan[a.key] ?? ilan.detay?.[a.key];
    if (deger != null && deger !== '') {
      alanlar[a.key] = String(deger);
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
  const [kategoriId, setKategoriId] = useState(mevcut.kategoriId || '');
  const [kategoriEtiket, setKategoriEtiket] = useState(mevcut.kategoriEtiket || '');
  const [kaydediliyor, setKaydediliyor] = useState(false);

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
    setPlatformlar((prev) => (prev.includes(ad) ? prev.filter((p) => p !== ad) : [...prev, ad]));
  };

  const kaydet = async () => {
    if (!kategori || !baslik.trim() || !aciklama.trim() || !fiyat.trim()) {
      Alert.alert('Uyarı', 'Kategori, başlık, açıklama ve fiyat zorunludur.');
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
        kategoriId: kategoriId.trim() || mevcut.kategoriId || null,
        kategoriYolu: mevcut.kategoriYolu,
        kategoriEtiket: kategoriEtiket.trim() || mevcut.kategoriEtiket || null,
        kategoriKok: mevcut.kategoriKok,
        konum: mevcut.konum,
        ornek: mevcut.ornek,
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
        <View style={styles.ustNot}>
          <Ionicons name="shield-outline" size={14} color={colors.textMuted} />
          <Text style={styles.ustNotText}>
            Admin düzenleme — sahip: {mevcut.ownerId || '—'}
            {mevcut.ornek ? ' · ÖRNEK İLAN' : ''}
          </Text>
        </View>

        <SectionTitle icon="grid-outline" title="Kategori" />
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
                onPress={() => {
                  setKategori(isim);
                  setEkstraAlanlar({});
                }}
              >
                <Text style={styles.kategoriEmoji}>{meta.emoji}</Text>
                <Text style={styles.kategoriIsim}>{isim}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {kategori ? (
          <View style={styles.formKart}>
            <AppInput label="Başlık *" icon="text-outline" value={baslik} onChangeText={setBaslik} />
            <AppInput
              label="Açıklama *"
              icon="reader-outline"
              value={aciklama}
              onChangeText={setAciklama}
              multiline
              style={{ minHeight: 80, textAlignVertical: 'top' }}
            />
            <AppInput
              label="Fiyat (TL) *"
              icon="cash-outline"
              value={fiyat}
              onChangeText={fiyatGuncelle}
              keyboardType="number-pad"
            />
            <AppInput
              label="Kategori ID (daire, rezidans…)"
              icon="key-outline"
              placeholder="daire"
              value={kategoriId}
              onChangeText={setKategoriId}
            />
            <AppInput
              label="Kategori etiketi"
              icon="trail-sign-outline"
              placeholder="Emlak › Konut › Satılık › Daire"
              value={kategoriEtiket}
              onChangeText={setKategoriEtiket}
            />

            <Text style={styles.bolum}>Platformlar</Text>
            <View style={styles.platformWrap}>
              {PLATFORMLAR.map((p) => {
                const secili = platformlar.includes(p);
                return (
                  <TouchableOpacity
                    key={p}
                    style={[styles.platformChip, secili && styles.platformChipAktif]}
                    onPress={() => platformToggle(p)}
                  >
                    {secili ? (
                      <Ionicons name="checkmark" size={14} color={colors.primaryText} style={{ marginRight: 4 }} />
                    ) : null}
                    <Text style={[styles.platformChipText, secili && styles.platformChipTextAktif]}>{p}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {(KATEGORI_ALANLARI[kategori] || []).map((alan) => (
              <AppInput
                key={alan.key}
                label={alan.label}
                icon={alan.icon}
                placeholder={alan.placeholder}
                value={ekstraAlanlar[alan.key] || ''}
                onChangeText={(val) => ekstraGuncelle(alan.key, val)}
                keyboardType={alan.keyboard || 'default'}
              />
            ))}

            <PrimaryButton title="Kaydet" icon="save-outline" onPress={kaydet} loading={kaydediliyor} />
          </View>
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: 40 },
  ustNot: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: spacing.md },
  ustNotText: { fontSize: 12, color: colors.textMuted },
  kategoriSatir: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
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
  kategoriEmoji: { fontSize: 26 },
  kategoriIsim: { fontSize: 11, fontWeight: '700', marginTop: 4, textAlign: 'center' },
  formKart: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },
  bolum: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  platformWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: spacing.lg },
  platformChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  platformChipAktif: { backgroundColor: colors.primary, borderColor: colors.primaryDark },
  platformChipText: { fontSize: 13, color: colors.textSecondary, fontWeight: '600' },
  platformChipTextAktif: { color: colors.primaryText },
});
