import React, { useMemo, useCallback, useLayoutEffect, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  BackHandler,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import IlanBreadcrumb from '../../components/ilan/IlanBreadcrumb';
import { colors, spacing } from '../../constants/theme';
import {
  vasitaSecenekleri,
  vasitaDonanimListesi,
  vasitaSonrakiAdim,
  vasitaKatalogVarMi,
} from '../../constants/vasitaKatalog';
import { vasitaBreadcrumb } from '../../utils/vasitaSecim';
import { anaKategoriListesineDon } from '../../utils/ilanNav';

function SecimSatiri({ baslik, onPress, vurgulu }) {
  return (
    <TouchableOpacity style={styles.satir} onPress={onPress} activeOpacity={0.7}>
      <Text style={[styles.satirMetin, vurgulu && styles.satirVurgulu]} numberOfLines={2}>
        {baslik}
      </Text>
      <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
    </TouchableOpacity>
  );
}

export default function VasitaSecimScreen({ navigation, route }) {
  const secilenKategori = route.params?.secilenKategori;
  const secimler = route.params?.secimler || {};
  const aracTipId = secilenKategori?.kategoriId;

  const adim = vasitaSonrakiAdim(secimler);
  const breadcrumb = useMemo(
    () => vasitaBreadcrumb(secilenKategori, secimler),
    [secilenKategori, secimler]
  );

  const geri = useCallback(() => {
    const sira = ['yil', 'marka', 'model', 'yakit', 'kasaTipi', 'vites', 'donanim', 'onay'];
    const idx = sira.indexOf(adim);
    if (idx <= 0) {
      if (navigation.canGoBack()) navigation.goBack();
      else anaKategoriListesineDon(navigation);
      return;
    }
    const onceki = sira[idx - 1];
    const yeni = { ...secimler };
    for (let i = idx; i < sira.length; i += 1) delete yeni[sira[i]];
    navigation.replace('VasitaSecim', { secilenKategori, secimler: yeni });
  }, [navigation, adim, secimler, secilenKategori]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'İlan Ver',
      headerLeft: () => (
        <TouchableOpacity onPress={geri} hitSlop={8} style={styles.headerBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.primaryText} />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={() => anaKategoriListesineDon(navigation)} hitSlop={8} style={styles.headerBtn}>
          <Ionicons name="close" size={26} color={colors.primaryText} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, geri]);

  useFocusEffect(
    useCallback(() => {
      const sub = BackHandler.addEventListener('hardwareBackPress', () => {
        geri();
        return true;
      });
      return () => sub.remove();
    }, [geri])
  );

  const secimIlerle = (key, deger, donanimKayit) => {
    const yeni = { ...secimler, [key]: deger };
    if (donanimKayit) yeni._donanimKayit = donanimKayit;
    if (adim === 'onay') {
      navigation.navigate('VasitaHesapDogrulama', {
        secilenKategori,
        secimler: yeni,
        donanimKayit: donanimKayit || yeni._donanimKayit,
      });
      return;
    }
    navigation.push('VasitaSecim', { secilenKategori, secimler: yeni });
  };

  const listedeYok = () => {
    navigation.navigate('VasitaTemelBilgi', {
      secilenKategori,
      secimler,
      donanimKayit: null,
      manuelArac: true,
    });
  };

  useEffect(() => {
    if (!vasitaKatalogVarMi(aracTipId)) {
      navigation.replace('VasitaTemelBilgi', {
        secilenKategori,
        secimler: {},
        manuelArac: true,
      });
    }
  }, [aracTipId, navigation, secilenKategori]);

  if (!vasitaKatalogVarMi(aracTipId)) {
    return (
      <View style={styles.merkez}>
        <Text style={styles.hata}>Yönlendiriliyor…</Text>
      </View>
    );
  }

  if (adim === 'onay') {
    const donanimKayit = secimler._donanimKayit;
    const ozellikler = donanimKayit?.ozellikler || [];
    return (
      <View style={styles.container}>
        <IlanBreadcrumb parcalar={breadcrumb} />
        <View style={styles.onayListe}>
          <TouchableOpacity
            style={styles.onayKart}
            onPress={() =>
              secimIlerle('donanim', donanimKayit?.baslik || secimler.donanim, donanimKayit)
            }
            activeOpacity={0.85}
          >
            <Text style={styles.onayBaslik}>{donanimKayit?.baslik || secimler.donanim}</Text>
            {ozellikler.map((o) => (
              <View key={o} style={styles.onaySatir}>
                <View style={styles.onayNokta} />
                <Text style={styles.onayOzellik}>{o}</Text>
              </View>
            ))}
            <Ionicons name="chevron-forward" size={22} color={colors.textMuted} style={styles.onayOk} />
          </TouchableOpacity>
          <SecimSatiri baslik="Aracımı Listede Bulamadım" onPress={listedeYok} />
        </View>
      </View>
    );
  }

  if (adim === 'donanim') {
    const liste = vasitaDonanimListesi(aracTipId, secimler);
    return (
      <View style={styles.container}>
        <IlanBreadcrumb parcalar={breadcrumb} />
        <FlatList
          data={liste}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SecimSatiri
              baslik={item.baslik}
              onPress={() => secimIlerle('donanim', item.baslik, item)}
            />
          )}
          ListFooterComponent={<SecimSatiri baslik="Aracımı Listede Bulamadım" onPress={listedeYok} />}
        />
      </View>
    );
  }

  const secenekler = vasitaSecenekleri(aracTipId, secimler, adim);

  return (
    <View style={styles.container}>
      <IlanBreadcrumb parcalar={breadcrumb} />
      <FlatList
        data={secenekler}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SecimSatiri baslik={item.baslik} onPress={() => secimIlerle(adim, item.baslik)} />
        )}
        ListEmptyComponent={
          <View style={styles.merkez}>
            <Text style={styles.hata}>Seçenek bulunamadı</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  merkez: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xl },
  hata: { color: colors.textSecondary, fontSize: 15 },
  headerBtn: { paddingHorizontal: 4, paddingVertical: 4 },
  satir: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  satirMetin: { flex: 1, fontSize: 16, color: colors.text },
  satirVurgulu: { fontWeight: '700', color: colors.primary },
  onayListe: { flex: 1 },
  onayKart: {
    margin: spacing.md,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
  },
  onayBaslik: { fontSize: 17, fontWeight: '700', color: colors.link, marginBottom: spacing.sm },
  onaySatir: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  onayNokta: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F59E0B',
    marginRight: 8,
  },
  onayOzellik: { fontSize: 14, color: colors.textSecondary },
  onayOk: { position: 'absolute', right: spacing.md, top: spacing.lg },
});
