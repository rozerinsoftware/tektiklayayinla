import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import {
  getFavoriIlanlar,
  getFavoriAramalar,
  getFavoriSaticilar,
  setFavoriIlanlar,
  setFavoriAramalar,
  setFavoriSaticilar,
} from '../../utils/profilStorage';
import { colors, spacing } from '../../constants/theme';

const BOSLUK = {
  ilan: 'Favori ilanınız yok. Bir ilana girip sağ üstteki yıldıza dokunun.',
  arama: 'Favori aramanız yok. İlan listesinde arama yaptıktan sonra ⭐ ile kaydedin.',
  satici: 'Favori satıcınız yok. Bir ilan detayında satıcıyı favorilere ekleyin.',
};

async function veriGetir(tip) {
  if (tip === 'ilan') return getFavoriIlanlar();
  if (tip === 'arama') return getFavoriAramalar();
  return getFavoriSaticilar();
}

async function veriKaydet(tip, liste) {
  if (tip === 'ilan') return setFavoriIlanlar(liste);
  if (tip === 'arama') return setFavoriAramalar(liste);
  return setFavoriSaticilar(liste);
}

function aramayaGit(navigation, item) {
  const tabNav = navigation.getParent?.()?.getParent?.() || navigation.getParent?.();
  if (tabNav?.navigate) {
    tabNav.navigate('Ana Sayfa', {
      screen: 'IlanListesi',
      params: {
        aramaModu: true,
        kategoriId: item.kategoriId || null,
        kategoriBaslik: item.kategoriBaslik || null,
        initialArama: item.aramaMetni || '',
      },
    });
    return;
  }
  navigation.navigate('IlanListesi', {
    aramaModu: true,
    kategoriId: item.kategoriId || null,
    kategoriBaslik: item.kategoriBaslik || null,
    initialArama: item.aramaMetni || '',
  });
}

function saticiyaGit(navigation, item) {
  const tabNav = navigation.getParent?.()?.getParent?.() || navigation.getParent?.();
  if (tabNav?.navigate) {
    tabNav.navigate('Ana Sayfa', {
      screen: 'IlanListesi',
      params: {
        aramaModu: true,
        ownerId: item.id,
        kategoriBaslik: `${item.baslik || item.ad} — ilanları`,
      },
    });
    return;
  }
  navigation.navigate('IlanListesi', {
    aramaModu: true,
    ownerId: item.id,
    kategoriBaslik: `${item.baslik || item.ad} — ilanları`,
  });
}

export default function FavoriListeScreen({ navigation, route }) {
  const tip = route.params?.tip || 'ilan';
  const [liste, setListe] = useState([]);

  useFocusEffect(
    useCallback(() => {
      let aktif = true;
      (async () => {
        const data = await veriGetir(tip);
        if (aktif) setListe(Array.isArray(data) ? data : []);
      })();
      return () => {
        aktif = false;
      };
    }, [tip])
  );

  const sil = async (id) => {
    const yeni = liste.filter((x) => x.id !== id);
    setListe(yeni);
    await veriKaydet(tip, yeni);
  };

  const satiraBas = (item) => {
    if (tip === 'ilan' && item.ilan) {
      navigation.navigate('IlanDetay', { ilan: item.ilan });
      return;
    }
    if (tip === 'arama') {
      aramayaGit(navigation, item);
      return;
    }
    if (tip === 'satici') {
      saticiyaGit(navigation, item);
    }
  };

  return (
    <FlatList
      style={styles.liste}
      data={liste}
      keyExtractor={(item) => String(item.id)}
      ListEmptyComponent={
        <View style={styles.bos}>
          <Text style={styles.bosMetin}>{BOSLUK[tip]}</Text>
        </View>
      }
      renderItem={({ item }) => (
        <View style={styles.satir}>
          <TouchableOpacity style={styles.satirOrta} onPress={() => satiraBas(item)} activeOpacity={0.7}>
            <Text style={styles.baslik}>{item.baslik || item.ad || 'Kayıt'}</Text>
            {item.alt ? <Text style={styles.alt}>{item.alt}</Text> : null}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => sil(item.id)} hitSlop={8} style={styles.silBtn}>
            <Ionicons name="trash-outline" size={22} color={colors.danger} />
          </TouchableOpacity>
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </View>
      )}
      contentContainerStyle={liste.length === 0 ? styles.bosListe : undefined}
    />
  );
}

const styles = StyleSheet.create({
  liste: { flex: 1, backgroundColor: colors.background },
  bosListe: { flexGrow: 1 },
  bos: { flex: 1, justifyContent: 'center', padding: spacing.xl, minHeight: 280 },
  bosMetin: { fontSize: 15, color: colors.textSecondary, textAlign: 'center', lineHeight: 22 },
  satir: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingVertical: 14,
    paddingLeft: spacing.lg,
    paddingRight: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  satirOrta: { flex: 1 },
  baslik: { fontSize: 16, fontWeight: '600', color: colors.text },
  alt: { fontSize: 13, color: colors.textSecondary, marginTop: 4 },
  silBtn: { marginRight: spacing.sm },
});
