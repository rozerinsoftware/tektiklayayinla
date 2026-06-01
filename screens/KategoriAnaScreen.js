import React, { useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { KOK_KATEGORILER, getAltBaslikMetni } from '../constants/kategoriler';
import { KategoriKokSatiri } from '../components/KategoriListe';
import { colors, radius, spacing } from '../constants/theme';

export default function KategoriAnaScreen({ navigation }) {
  const [arama, setArama] = React.useState('');

  useEffect(() => {
    navigation.setOptions?.({ headerShown: false });
  }, [navigation]);

  const filtreli = KOK_KATEGORILER.filter((k) => {
    const q = arama.trim().toLowerCase();
    if (!q) return true;
    const alt = getAltBaslikMetni(k).toLowerCase();
    return k.baslik.toLowerCase().includes(q) || alt.includes(q);
  });

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerBaslik}>Arama</Text>
      </View>

      <View style={styles.aramaKutu}>
        <Ionicons name="search" size={20} color={colors.textMuted} style={styles.aramaIkon} />
        <TextInput
          style={styles.aramaInput}
          placeholder="Kelime veya ilan no. ile ara"
          placeholderTextColor={colors.textMuted}
          value={arama}
          onChangeText={setArama}
          selectionColor={colors.cursor}
          cursorColor={colors.cursor}
        />
        <Ionicons name="mic-outline" size={20} color={colors.textMuted} />
      </View>

      <FlatList
        data={filtreli}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <KategoriKokSatiri
            kategori={item}
            altMetin={getAltBaslikMetni(item)}
            onPress={() =>
              navigation.navigate('KategoriDetay', {
                kategoriId: item.id,
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
  header: {
    backgroundColor: colors.headerBg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  headerBaslik: { fontSize: 18, fontWeight: '700', color: colors.primaryText },
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
  liste: { paddingBottom: 24 },
});
