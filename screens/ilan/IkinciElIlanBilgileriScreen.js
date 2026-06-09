import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import IlanBreadcrumb from '../../components/ilan/IlanBreadcrumb';
import { AppInput, PrimaryButton } from '../../components/ui';
import { colors, spacing, radius } from '../../constants/theme';
import { kokIdToMetaKey } from '../../constants/kategoriler';
import KonumSecici from '../../components/KonumSecici';
import { ikinciElBreadcrumb } from '../../constants/ikinciElAlanlari';

const ILETISIM_SECENEKLERI = ['Telefon ve Soru Cevap', 'Sadece Telefon', 'Sadece Soru Cevap'];

export default function IkinciElIlanBilgileriScreen({ navigation, route }) {
  const { secilenKategori, taslakIlan, adim = 2, toplamAdim = 6 } = route.params || {};
  const breadcrumb = [...ikinciElBreadcrumb(secilenKategori), 'İLAN BİLGİLERİ'];

  const [baslik, setBaslik] = useState(taslakIlan?.baslikOneri || taslakIlan?.baslik || '');
  const [aciklama, setAciklama] = useState(taslakIlan?.aciklama || '');
  const [konum, setKonum] = useState(taslakIlan?.konum || null);
  const [iletisim, setIletisim] = useState(taslakIlan?.iletisimSecenekleri || 'Telefon ve Soru Cevap');
  const [fotograflar, setFotograflar] = useState(taslakIlan?.fotograflar || []);
  const [kurallar, setKurallar] = useState(false);

  const fotoEkle = async () => {
    if (fotograflar.length >= 10) {
      Alert.alert('Limit', 'En fazla 10 fotoğraf ekleyebilirsiniz.');
      return;
    }
    const izin = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!izin.granted) {
      Alert.alert('İzin gerekli', 'Galeri izni vermeniz gerekiyor.');
      return;
    }
    const sonuc = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!sonuc.canceled && sonuc.assets?.[0]?.uri) {
      setFotograflar((prev) => [...prev, sonuc.assets[0].uri]);
    }
  };

  const birlestir = () => ({
    ...taslakIlan,
    baslik: baslik.trim(),
    aciklama: aciklama.trim(),
    konum,
    iletisimSecenekleri: iletisim,
    fotograflar,
    kategori: kokIdToMetaKey('ikinci-el'),
    kategoriKok: 'ikinci-el',
  });

  const devamEt = () => {
    if (!baslik.trim() || !aciklama.trim()) {
      Alert.alert('Uyarı', 'Başlık ve açıklama zorunludur.');
      return;
    }
    if (!konum?.latitude || !konum?.longitude) {
      Alert.alert(
        'Konum gerekli',
        '2. el ilanlarda elden teslim için buluşma konumunuzu işaretleyin.'
      );
      return;
    }
    if (!kurallar) {
      Alert.alert('Kurallar', 'İlan verme kurallarını kabul etmelisiniz.');
      return;
    }
    navigation.navigate('IkinciElTeslimat', {
      secilenKategori,
      taslakIlan: birlestir(),
      adim: 4,
      toplamAdim,
    });
  };

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.content}>
      <IlanBreadcrumb parcalar={breadcrumb} />
      <Text style={styles.baslik}>İlan Bilgileri</Text>

      <Text style={styles.fotoLabel}>Fotoğraflar ({fotograflar.length}/10)</Text>
      <View style={styles.fotoSatir}>
        <TouchableOpacity style={styles.fotoEkle} onPress={fotoEkle}>
          <Ionicons name="add" size={28} color={colors.primary} />
          <Text style={styles.fotoEkleText}>Fotoğraf Ekle</Text>
        </TouchableOpacity>
        {fotograflar.map((uri, i) => (
          <Image key={uri + i} source={{ uri }} style={styles.fotoOnizleme} />
        ))}
      </View>

      <AppInput label="İlan Başlığı *" value={baslik} onChangeText={setBaslik} placeholder="Başlık girin" />
      <AppInput
        label="Açıklama *"
        value={aciklama}
        onChangeText={setAciklama}
        placeholder="Açıklama girin"
        multiline
        style={{ minHeight: 80, textAlignVertical: 'top' }}
      />

      <KonumSecici
        konum={konum}
        onKonumChange={setKonum}
        zorunlu
        aciklama="Elden teslim için alıcıyla buluşacağınız yakını işaretleyin. GPS ile konumunuz kaydedilir."
      />

      <TouchableOpacity
        style={styles.secimSatir}
        onPress={() =>
          Alert.alert('İletişim', '', [
            ...ILETISIM_SECENEKLERI.map((s) => ({ text: s, onPress: () => setIletisim(s) })),
            { text: 'İptal', style: 'cancel' },
          ])
        }
      >
        <Text style={styles.secimLabel}>İletişim Seçenekleri</Text>
        <Text style={styles.secimDeger}>{iletisim}</Text>
        <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.kuralSatir} onPress={() => setKurallar((v) => !v)}>
        <Ionicons
          name={kurallar ? 'checkmark-circle' : 'ellipse-outline'}
          size={22}
          color={kurallar ? colors.success : colors.textMuted}
        />
        <Text style={styles.kuralText}>İlan verme kurallarını kabul ediyorum.</Text>
      </TouchableOpacity>

      <PrimaryButton title="Devam Et" icon="arrow-forward" onPress={devamEt} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: 40 },
  baslik: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: spacing.md },
  fotoLabel: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: spacing.sm },
  fotoSatir: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.md },
  fotoEkle: {
    width: 88,
    height: 88,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  fotoEkleText: { fontSize: 10, color: colors.primary, marginTop: 4, fontWeight: '600' },
  fotoOnizleme: { width: 88, height: 88, borderRadius: radius.sm },
  secimSatir: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingVertical: 14,
    paddingHorizontal: spacing.md,
    marginBottom: 1,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  secimLabel: { flex: 1, fontSize: 15, color: colors.text },
  secimDeger: { fontSize: 14, fontWeight: '600', color: colors.textSecondary, marginRight: 4, maxWidth: '45%' },
  kuralSatir: { flexDirection: 'row', alignItems: 'center', gap: 8, marginVertical: spacing.lg },
  kuralText: { flex: 1, fontSize: 13, color: colors.textSecondary },
});
