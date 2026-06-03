import React, { useState, useMemo } from 'react';
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
import { otomatikBaslik, secimdenDetay, vasitaBreadcrumb } from '../../utils/vasitaSecim';

const ARAC_DURUMLARI = ['Sıfır', 'İkinci El'];

export default function VasitaTemelBilgiScreen({ navigation, route }) {
  const { secilenKategori, secimler = {}, donanimKayit, manuelArac } = route.params || {};
  const ozet = useMemo(() => otomatikBaslik(secimler, donanimKayit), [secimler, donanimKayit]);
  const breadcrumb = useMemo(
    () => [...vasitaBreadcrumb(secilenKategori, secimler), 'TEMEL BİLGİLER'],
    [secilenKategori, secimler]
  );

  const [baslik, setBaslik] = useState(ozet || '');
  const [aciklama, setAciklama] = useState('');
  const [fiyat, setFiyat] = useState('');
  const [kilometre, setKilometre] = useState('');
  const [aracDurumu, setAracDurumu] = useState('İkinci El');
  const [plaka, setPlaka] = useState('Türkiye (TR) Plakalı');
  const [sasi, setSasi] = useState('');

  const fiyatGuncelle = (text) => {
    if (/[a-zA-ZğüşıöçĞÜŞİÖÇ]/.test(text)) {
      Alert.alert('Fiyat hatalı', 'Fiyat alanına sadece rakam girebilirsiniz.');
    }
    setFiyat(text.replace(/\D/g, ''));
  };

  const devamEt = () => {
    if (!baslik.trim() || !aciklama.trim() || !String(fiyat).trim()) {
      Alert.alert('Uyarı', 'Başlık, açıklama ve fiyat zorunludur.');
      return;
    }
    const fiyatSayi = Number(fiyat);
    if (!Number.isFinite(fiyatSayi) || fiyatSayi < 10) {
      Alert.alert('Fiyat hatalı', 'Geçerli bir fiyat girin (en az 10 TL).');
      return;
    }
    if (!kilometre.trim() && aracDurumu === 'İkinci El') {
      Alert.alert('Uyarı', 'İkinci el araçlar için kilometre girin.');
      return;
    }
    const detay = {
      ...secimdenDetay(secimler, donanimKayit, secilenKategori?.kategoriId),
      aracDurumu,
      kilometre: kilometre.trim() || null,
      plaka: plaka.trim() || null,
      sasi: sasi.trim() || null,
      manuelArac: !!manuelArac,
    };
    if (kilometre.trim()) detay.kilometre = kilometre.trim();

    navigation.navigate('IlanKonumBaslangic', {
      taslakIlan: {
        baslik: baslik.trim(),
        aciklama: aciklama.trim(),
        fiyat: String(Math.round(fiyatSayi)),
        kategori: kokIdToMetaKey('vasita'),
        kategoriId: secilenKategori.kategoriId,
        kategoriYolu: secilenKategori.kategoriYolu,
        kategoriEtiket: secilenKategori.kategoriEtiket,
        kategoriKok: 'vasita',
        vasitaSecimOzeti: secimler,
        ...detay,
      },
      adim: 1,
      toplamAdim: 5,
    });
  };

  const ozellikler = donanimKayit?.ozellikler || [];

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <IlanBreadcrumb parcalar={breadcrumb} />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.ekranBaslik}>Temel Bilgileri Giriniz</Text>

        {ozet ? (
          <View style={styles.aracKart}>
            <View style={styles.aracUst}>
              <Ionicons name="car-sport-outline" size={28} color={colors.primary} />
              <View style={styles.aracMetin}>
                <Text style={styles.aracBaslik}>{ozet}</Text>
                {secimler.yil ? (
                  <Text style={styles.aracAlt}>
                    {[secimler.yil, donanimKayit?.cc && `${donanimKayit.cc} cc`, donanimKayit?.hp && `${donanimKayit.hp} hp`]
                      .filter(Boolean)
                      .join(' · ')}
                  </Text>
                ) : null}
              </View>
              <TouchableOpacity onPress={() => navigation.navigate('VasitaSecim', { secilenKategori, secimler: {} })}>
                <Text style={styles.degistir}>Değiştir</Text>
              </TouchableOpacity>
            </View>
            {secimler.vites ? (
              <View style={styles.sabitSatir}>
                <Text style={styles.sabitLabel}>Vites</Text>
                <Text style={styles.sabitDeger}>{secimler.vites}</Text>
              </View>
            ) : null}
            {secimler.kasaTipi ? (
              <View style={styles.sabitSatir}>
                <Text style={styles.sabitLabel}>Kasa Tipi</Text>
                <Text style={styles.sabitDeger}>{secimler.kasaTipi}</Text>
              </View>
            ) : null}
            {ozellikler.length ? (
              <View style={styles.sabitSatir}>
                <Text style={styles.sabitLabel}>Özellikler</Text>
                <Text style={styles.sabitDeger} numberOfLines={3}>
                  {ozellikler.join(' · ')}
                </Text>
              </View>
            ) : null}
          </View>
        ) : null}

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

        <Text style={styles.alanLabel}>Araç Durumu *</Text>
        <View style={styles.chipRow}>
          {ARAC_DURUMLARI.map((d) => (
            <TouchableOpacity
              key={d}
              style={[styles.chip, aracDurumu === d && styles.chipSecili]}
              onPress={() => setAracDurumu(d)}
            >
              <Text style={[styles.chipText, aracDurumu === d && styles.chipTextSecili]}>{d}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <AppInput
          label="KM *"
          icon="speedometer-outline"
          placeholder="Kilometre"
          value={kilometre}
          onChangeText={(t) => setKilometre(t.replace(/\D/g, ''))}
          keyboardType="number-pad"
        />
        <AppInput label="Plaka / Uyruk" icon="card-outline" value={plaka} onChangeText={setPlaka} />
        <AppInput label="Şasi (isteğe bağlı)" icon="construct-outline" value={sasi} onChangeText={setSasi} />

        <View style={styles.footer}>
          <View style={styles.progressWrap}>
            <Text style={styles.progressText}>İlan Detayları 1 / 5</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '20%' }]} />
            </View>
          </View>
          <View style={styles.devamBtn}>
            <PrimaryButton title="Devam Et" icon="arrow-forward" onPress={devamEt} />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: 32 },
  ekranBaslik: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: spacing.md },
  aracKart: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },
  aracUst: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  aracMetin: { flex: 1 },
  aracBaslik: { fontSize: 15, fontWeight: '700', color: colors.link },
  aracAlt: { fontSize: 12, color: colors.textSecondary, marginTop: 4 },
  degistir: { fontSize: 13, fontWeight: '600', color: colors.link },
  sabitSatir: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    marginTop: spacing.sm,
  },
  sabitLabel: { fontSize: 14, color: colors.textSecondary },
  sabitDeger: { fontSize: 14, fontWeight: '600', color: colors.text, flex: 1, textAlign: 'right', marginLeft: spacing.md },
  alanLabel: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: spacing.sm },
  chipRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  chip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipSecili: { backgroundColor: colors.primaryLight, borderColor: colors.primary },
  chipText: { fontSize: 14, color: colors.textSecondary, fontWeight: '600' },
  chipTextSecili: { color: colors.primary },
  footer: { marginTop: spacing.lg },
  progressWrap: { marginBottom: spacing.md },
  progressText: { fontSize: 13, color: colors.textSecondary, marginBottom: 6 },
  progressBar: { height: 4, backgroundColor: colors.border, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: colors.success },
  devamBtn: { alignSelf: 'flex-end' },
});
