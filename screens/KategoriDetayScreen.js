import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  getKategoriById,
  getKokKategori,
} from '../constants/kategoriler';
import KategoriListe from '../components/KategoriListe';
import { useIlanSayimlari } from '../hooks/useIlanSayimlari';
import { colors, spacing } from '../constants/theme';
import { openIlanListesi } from '../utils/navigationHelpers';

export default function KategoriDetayScreen({ navigation, route }) {
  const kategoriId = route.params?.kategoriId;
  const secimModu = route.params?.secimModu === true;
  const bilgi = getKategoriById(kategoriId);
  const { yukleniyor, yukle, say, cocukSayimlari } = useIlanSayimlari();

  useEffect(() => {
    yukle();
  }, [yukle]);

  useEffect(() => {
    if (bilgi?.node?.baslik) {
      navigation.setOptions({
        title: bilgi.node.baslik,
        headerStyle: { backgroundColor: colors.headerBg },
        headerTintColor: colors.primaryText,
        headerTitleStyle: { fontWeight: '700', color: colors.primaryText },
      });
    }
  }, [navigation, bilgi]);

  const node = bilgi?.node;
  const cocuklar = node?.cocuklar || [];
  const ilgili = node?.ilgili || [];
  const sayimlar = useMemo(() => cocukSayimlari([...cocuklar, ...ilgili]), [cocuklar, ilgili, cocukSayimlari]);
  const tumSayi = say(kategoriId);

  if (!bilgi || !node) {
    return (
      <View style={styles.merkez}>
        <Text style={styles.hata}>Kategori bulunamadı</Text>
      </View>
    );
  }

  const ilanListesineGit = (filtreId, baslik) => {
    openIlanListesi(navigation, {
      kategoriId: filtreId,
      kategoriBaslik: baslik || bilgi.etiket,
    });
  };

  const kategoriSecildi = (secimBilgi) => {
    const secim = secimBilgi || {
      kategoriId: bilgi.yolIds[bilgi.yolIds.length - 1],
      kategoriYolu: bilgi.yolIds,
      kategoriEtiket: bilgi.etiket,
      kategoriKok: bilgi.kokId,
    };
    navigation.navigate('IlanEkle', { secilenKategori: secim });
    navigation.popToTop();
  };

  const cocugaBas = (cocuk) => {
    if (cocuk.hizmet) {
      Alert.alert('Bilgi', 'Bu kategori hizmet ilanları içindir. Yakında eklenecek.');
      return;
    }
    if (secimModu && (cocuk.yaprak || !cocuk.cocuklar?.length)) {
      const alt = getKategoriById(cocuk.id);
      if (alt) {
        kategoriSecildi({
          kategoriId: cocuk.id,
          kategoriYolu: alt.yolIds,
          kategoriEtiket: alt.etiket,
          kategoriKok: alt.kokId,
        });
      }
      return;
    }
    if (cocuk.yaprak || !cocuk.cocuklar?.length) {
      ilanListesineGit(cocuk.id, `${bilgi.node.baslik} › ${cocuk.baslik}`);
      return;
    }
    navigation.push('KategoriDetay', {
      kategoriId: cocuk.id,
      secimModu,
    });
  };

  const tumuneBas = () => {
    if (secimModu) {
      kategoriSecildi();
      return;
    }
    ilanListesineGit(kategoriId, bilgi.etiket);
  };

  const kok = getKokKategori(kategoriId);

  return (
    <View style={styles.container}>
      {secimModu ? (
        <TouchableOpacity style={styles.secimBanner} onPress={() => kategoriSecildi()}>
          <Ionicons name="checkmark-circle-outline" size={20} color={colors.primary} />
          <Text style={styles.secimBannerText}>Bu kategoriyi seç: {bilgi.etiket}</Text>
        </TouchableOpacity>
      ) : null}

      <KategoriListe
        baslik={node.baslik}
        tumBaslik={`Tüm '${node.baslik}' İlanları`}
        tumSayi={tumSayi}
        onTumuneBas={tumuneBas}
        cocuklar={cocuklar}
        ilgili={ilgili}
        sayimlar={sayimlar}
        yukleniyor={yukleniyor}
        onCocukBas={cocugaBas}
        onIlgiliBas={cocugaBas}
        listeHeader={
          kok ? (
            <View style={styles.yol}>
              <Text style={styles.yolText} numberOfLines={1}>
                {bilgi.yolBaslik.join(' › ')}
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  merkez: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  hata: { color: colors.textSecondary },
  yol: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.background,
  },
  yolText: { fontSize: 12, color: colors.textMuted },
  secimBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: spacing.md,
    backgroundColor: colors.primaryLight,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  secimBannerText: { flex: 1, fontSize: 14, fontWeight: '600', color: colors.primary },
});
