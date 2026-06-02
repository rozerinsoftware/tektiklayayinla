import React, { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { KOK_KATEGORILER, getAltBaslikMetni, getKokAciklama } from '../constants/kategoriler';
import { KategoriKokSatiri } from '../components/KategoriListe';
import { colors, radius, spacing } from '../constants/theme';

function IlanVerKategoriSatiri({ baslik, onPress }) {
  return (
    <TouchableOpacity style={styles.ilanVerSatir} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.ilanVerSatirText}>{baslik}</Text>
      <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
    </TouchableOpacity>
  );
}

export default function KategoriAnaScreen({ navigation, route }) {
  const secimModu = route.params?.secimModu === true;
  const [arama, setArama] = React.useState('');

  const anaSayfayaKapat = useCallback(() => {
    navigation.getParent()?.navigate('Ana Sayfa');
  }, [navigation]);

  useEffect(() => {
    if (secimModu) {
      navigation.setOptions({
        title: 'İlan Ver',
        headerShown: true,
        headerStyle: { backgroundColor: colors.headerBg },
        headerTintColor: colors.primaryText,
        headerTitleStyle: { fontWeight: '700', color: colors.primaryText },
        headerBackVisible: false,
        headerRight: () => (
          <TouchableOpacity onPress={anaSayfayaKapat} hitSlop={12} style={styles.kapatBtn}>
            <Ionicons name="close" size={26} color={colors.primaryText} />
          </TouchableOpacity>
        ),
      });
    } else {
      navigation.setOptions?.({ headerShown: false, headerRight: undefined });
    }
  }, [navigation, secimModu, anaSayfayaKapat]);

  const filtreli = KOK_KATEGORILER.filter((k) => {
    const q = arama.trim().toLowerCase();
    if (!q) return true;
    const alt = getAltBaslikMetni(k).toLowerCase();
    const aciklama = getKokAciklama(k.id).toLowerCase();
    return (
      k.baslik.toLowerCase().includes(q) ||
      alt.includes(q) ||
      aciklama.includes(q)
    );
  });

  if (secimModu) {
    return (
      <View style={styles.ilanVerWrap}>
        <View style={styles.ilanVerAramaKutu}>
          <Ionicons name="search" size={20} color={colors.textMuted} style={styles.aramaIkon} />
          <TextInput
            style={styles.aramaInput}
            placeholder="Ne satıyorsun/kiralıyorsun? (Ör: Daire, Otomobil)"
            placeholderTextColor={colors.textMuted}
            value={arama}
            onChangeText={setArama}
            selectionColor={colors.cursor}
            cursorColor={colors.cursor}
          />
        </View>

        <Text style={styles.adimBaslik}>ADIM ADIM KATEGORİ SEÇİMİ</Text>

        <FlatList
          data={filtreli}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <IlanVerKategoriSatiri
              baslik={item.baslik}
              onPress={() =>
                navigation.push('KategoriDetay', {
                  kategoriId: item.id,
                  secimModu: true,
                })
              }
            />
          )}
          ItemSeparatorComponent={() => <View style={styles.ilanVerAyrac} />}
          contentContainerStyle={styles.ilanVerListe}
        />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerBaslik}>Kategoriler</Text>
        <Text style={styles.headerAlt}>Emlak, vasıta, ikinci el ve iş makineleri</Text>
      </View>

      <View style={styles.aramaKutu}>
        <Ionicons name="search" size={20} color={colors.textMuted} style={styles.aramaIkon} />
        <TextInput
          style={styles.aramaInput}
          placeholder="Kategori ara..."
          placeholderTextColor={colors.textMuted}
          value={arama}
          onChangeText={setArama}
          selectionColor={colors.cursor}
          cursorColor={colors.cursor}
        />
      </View>

      <FlatList
        data={filtreli}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <Text style={styles.listeBaslik}>{filtreli.length} ana kategori</Text>
        }
        renderItem={({ item }) => (
          <KategoriKokSatiri
            kategori={item}
            altMetin={getKokAciklama(item.id) || getAltBaslikMetni(item)}
            onPress={() =>
              navigation.navigate('KategoriDetay', {
                kategoriId: item.id,
                secimModu: false,
              })
            }
          />
        )}
        contentContainerStyle={styles.liste}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  ilanVerWrap: { flex: 1, backgroundColor: colors.surface },
  kapatBtn: { marginRight: 4, padding: 4 },
  ilanVerAramaKutu: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    height: 48,
  },
  adimBaslik: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.4,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.background,
  },
  ilanVerListe: { paddingBottom: 24 },
  ilanVerSatir: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    minHeight: 52,
  },
  ilanVerSatirText: { flex: 1, fontSize: 16, fontWeight: '500', color: colors.text },
  ilanVerAyrac: { height: 1, backgroundColor: colors.border, marginLeft: spacing.lg },
  header: {
    backgroundColor: colors.headerBg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  headerBaslik: { fontSize: 18, fontWeight: '700', color: colors.primaryText },
  headerAlt: { fontSize: 13, color: colors.primaryText, opacity: 0.85, marginTop: 4 },
  aramaKutu: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    margin: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    height: 48,
  },
  aramaIkon: { marginRight: spacing.sm },
  aramaInput: { flex: 1, fontSize: 15, color: colors.text },
  listeBaslik: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.5,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
    textTransform: 'uppercase',
  },
  liste: { paddingBottom: 24 },
});
