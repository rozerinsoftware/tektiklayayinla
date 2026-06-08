import React, { useEffect, useMemo, useCallback, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import {
  getKategoriById,
  getKategoriByYol,
  getKokKategori,
} from '../constants/kategoriler';
import KategoriListe from '../components/KategoriListe';
import { useIlanSayimlari } from '../hooks/useIlanSayimlari';
import { colors, spacing } from '../constants/theme';
import { openIlanListesi } from '../utils/navigationHelpers';
import { anaKategoriListesineDon } from '../utils/ilanNav';
import { isMakinesiFormYapragi } from '../constants/isMakineleriAlanlari';

export default function KategoriDetayScreen({ navigation, route }) {
  const kategoriId = route.params?.kategoriId;
  const ustYolIds = route.params?.ustYolIds || null;
  const secimModu = route.params?.secimModu === true;
  const bilgi =
    (Array.isArray(ustYolIds) && ustYolIds.length
      ? getKategoriByYol([...ustYolIds, kategoriId])
      : null) || getKategoriById(kategoriId);
  const { yukleniyor, yukle, say, cocukSayimlari } = useIlanSayimlari();

  useEffect(() => {
    yukle();
  }, [yukle]);

  const kategoriGeri = useCallback(() => {
    if (secimModu) {
      anaKategoriListesineDon(navigation);
      return;
    }
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }
    anaKategoriListesineDon(navigation);
  }, [navigation, secimModu]);

  useLayoutEffect(() => {
    if (!secimModu || !bilgi?.node?.baslik) return;
    navigation.setOptions({
      title: bilgi.node.baslik,
      headerStyle: { backgroundColor: colors.headerBg },
      headerTintColor: colors.primaryText,
      headerTitleStyle: { fontWeight: '700', color: colors.primaryText },
      headerLeft: () => (
        <TouchableOpacity onPress={kategoriGeri} hitSlop={8} style={styles.headerGeri}>
          <Ionicons name="arrow-back" size={24} color={colors.primaryText} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, bilgi, secimModu, kategoriGeri]);

  useFocusEffect(
    useCallback(() => {
      if (!secimModu) return undefined;
      const sub = BackHandler.addEventListener('hardwareBackPress', () => {
        kategoriGeri();
        return true;
      });
      return () => sub.remove();
    }, [secimModu, kategoriGeri])
  );

  useEffect(() => {
    if (!secimModu && bilgi?.node?.baslik) {
      navigation.setOptions({
        title: bilgi.node.baslik,
        headerStyle: { backgroundColor: colors.headerBg },
        headerTintColor: colors.primaryText,
        headerTitleStyle: { fontWeight: '700', color: colors.primaryText },
        headerLeft: undefined,
      });
    }
  }, [navigation, bilgi, secimModu]);

  const node = bilgi?.node;
  const cocuklar = node?.cocuklar || [];
  const ilgili = node?.ilgili || [];
  const sayimlar = useMemo(
    () => cocukSayimlari([...cocuklar, ...ilgili], bilgi?.yolIds || []),
    [cocuklar, ilgili, bilgi?.yolIds, cocukSayimlari]
  );
  const tumSayi = say(kategoriId, bilgi?.yolIds);

  if (!bilgi || !node) {
    return (
      <View style={styles.merkez}>
        <Text style={styles.hata}>Kategori bulunamadı</Text>
      </View>
    );
  }

  const ilanListesineGit = (filtreId, baslik, filtreYolu) => {
    openIlanListesi(navigation, {
      kategoriId: filtreId,
      kategoriYolu: filtreYolu,
      kategoriBaslik: baslik || bilgi.etiket,
    });
  };

  const cocukYolu = (cocuk) => [...bilgi.yolIds, cocuk.id];
  const cocukBilgi = (cocuk) => getKategoriByYol(cocukYolu(cocuk));

  const kategoriSecildi = (secimBilgi) => {
    const secim = secimBilgi || {
      kategoriId: bilgi.yolIds[bilgi.yolIds.length - 1],
      kategoriYolu: bilgi.yolIds,
      kategoriEtiket: bilgi.etiket,
      kategoriKok: bilgi.kokId,
    };
    if (secim.kategoriKok === 'vasita') {
      navigation.navigate('VasitaSecim', { secilenKategori: secim });
      return;
    }
    if (secim.kategoriKok === 'emlak') {
      navigation.navigate('EmlakTemelBilgi', { secilenKategori: secim });
      return;
    }
    if (secim.kategoriKok === 'ikinci-el') {
      navigation.navigate('IkinciElUrunOzellikleri', { secilenKategori: secim });
      return;
    }
    if (secim.kategoriKok === 'is-makineleri') {
      if (isMakinesiFormYapragi(secim.kategoriId, secim.kategoriYolu)) {
        navigation.navigate('IsMakineleriTemelBilgi', { secilenKategori: secim });
        return;
      }
    }
    navigation.navigate('IlanEkle', { secilenKategori: secim });
  };

  const cocugaBas = (cocuk) => {
    if (cocuk.hizmet) {
      if (secimModu) {
        const alt = cocukBilgi(cocuk);
        if (alt) {
          navigation.navigate('HizmetIlan', {
            secilenKategori: {
              kategoriId: cocuk.id,
              kategoriYolu: alt.yolIds,
              kategoriEtiket: alt.etiket,
              kategoriKok: 'hizmet',
            },
          });
        }
      } else {
        ilanListesineGit(cocuk.id, `${bilgi.node.baslik} › ${cocuk.baslik}`, cocukYolu(cocuk));
      }
      return;
    }
    if (secimModu && (cocuk.yaprak || !cocuk.cocuklar?.length)) {
      const alt = cocukBilgi(cocuk);
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
      ilanListesineGit(cocuk.id, `${bilgi.node.baslik} › ${cocuk.baslik}`, cocukYolu(cocuk));
      return;
    }
    navigation.push('KategoriDetay', {
      kategoriId: cocuk.id,
      secimModu,
      ustYolIds: bilgi.yolIds,
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

      {secimModu ? (
        <TouchableOpacity
          style={styles.kokGeriBanner}
          onPress={() => anaKategoriListesineDon(navigation)}
        >
          <Ionicons name="grid-outline" size={18} color={colors.primary} />
          <Text style={styles.kokGeriText}>Ana kategorilere dön (Emlak, Vasıta…)</Text>
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
  kokGeriBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  kokGeriText: { flex: 1, fontSize: 13, fontWeight: '600', color: colors.primary },
  headerGeri: { paddingHorizontal: 4, paddingVertical: 4 },
});
