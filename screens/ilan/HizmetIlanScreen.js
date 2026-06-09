import React, { useState } from 'react';
import { ScrollView, StyleSheet, Alert } from 'react-native';
import { AppInput, PrimaryButton } from '../../components/ui';
import IlanBreadcrumb from '../../components/ilan/IlanBreadcrumb';
import IlanFotografSec from '../../components/ilan/IlanFotografSec';
import KonumSecici from '../../components/KonumSecici';
import { colors, spacing } from '../../constants/theme';

export default function HizmetIlanScreen({ navigation, route }) {
  const { secilenKategori } = route.params || {};
  const [baslik, setBaslik] = useState('');
  const [aciklama, setAciklama] = useState('');
  const [fiyat, setFiyat] = useState('');
  const [telefon, setTelefon] = useState('');
  const [fotograflar, setFotograflar] = useState([]);
  const [konum, setKonum] = useState(null);

  const devam = () => {
    if (!baslik.trim() || !aciklama.trim()) {
      Alert.alert('Eksik', 'Başlık ve açıklama zorunludur.');
      return;
    }
    if (!konum?.latitude || !konum?.longitude) {
      Alert.alert('Konum gerekli', 'Hizmet verdiğiniz bölgeyi GPS veya listeden seçin.');
      return;
    }
    const fiyatSayi = Number(fiyat.replace(/\D/g, ''));
    if (!Number.isFinite(fiyatSayi) || fiyatSayi <= 0) {
      Alert.alert('Fiyat', 'Geçerli bir fiyat girin.');
      return;
    }
    const taslak = {
      baslik: baslik.trim(),
      aciklama: aciklama.trim(),
      fiyat: String(fiyatSayi),
      telefon: telefon.trim(),
      kategori: secilenKategori?.kategoriEtiket || 'Hizmet',
      kategoriId: secilenKategori?.kategoriId,
      kategoriYolu: secilenKategori?.kategoriYolu || [],
      kategoriEtiket: secilenKategori?.kategoriEtiket,
      kategoriKok: secilenKategori?.kategoriKok || 'hizmet',
      hizmet: true,
      fotograflar,
      konum,
    };
    navigation.navigate('PlatformSec', { yeniIlan: taslak });
  };

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.content}>
      <IlanBreadcrumb
        parcalar={
          secilenKategori?.kategoriEtiket
            ? secilenKategori.kategoriEtiket.split(' › ').map((p) => p.toUpperCase())
            : []
        }
      />
      <IlanFotografSec fotograflar={fotograflar} onChange={setFotograflar} />
      <AppInput label="İlan Başlığı *" value={baslik} onChangeText={setBaslik} placeholder="Başlık girin" />
      <AppInput
        label="Açıklama *"
        value={aciklama}
        onChangeText={setAciklama}
        placeholder="Hizmet açıklaması"
        multiline
      />
      <AppInput
        label="Fiyat (TL) *"
        keyboardType="number-pad"
        value={fiyat}
        onChangeText={(t) => setFiyat(t.replace(/\D/g, ''))}
        placeholder="Fiyat"
      />
      <AppInput
        label="İletişim telefonu"
        keyboardType="phone-pad"
        value={telefon}
        onChangeText={setTelefon}
        placeholder="05xx xxx xx xx"
      />
      <KonumSecici
        konum={konum}
        onKonumChange={setKonum}
        zorunlu
        aciklama="Hizmet verdiğiniz bölgeyi işaretleyin. Müşteriler yakınlığa göre arayabilir."
      />
      <PrimaryButton title="Devam Et" onPress={devam} icon="arrow-forward-outline" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: 40 },
});
