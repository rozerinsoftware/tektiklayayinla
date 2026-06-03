import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getEngellenenler, setEngellenenler } from '../../utils/profilStorage';
import { colors, spacing } from '../../constants/theme';

export default function EngellenenHesaplarScreen() {
  const [liste, setListe] = useState([]);

  useFocusEffect(
    useCallback(() => {
      let aktif = true;
      (async () => {
        const data = await getEngellenenler();
        if (aktif) setListe(Array.isArray(data) ? data : []);
      })();
      return () => {
        aktif = false;
      };
    }, [])
  );

  const kaldir = async (id) => {
    const yeni = liste.filter((x) => x.id !== id);
    setListe(yeni);
    await setEngellenenler(yeni);
  };

  return (
    <FlatList
      style={styles.liste}
      data={liste}
      keyExtractor={(item) => String(item.id)}
      ListEmptyComponent={
        <View style={styles.bos}>
          <Text style={styles.bosMetin}>Engellediğiniz hesap sahibi bulunmamaktadır.</Text>
        </View>
      }
      renderItem={({ item }) => (
        <View style={styles.satir}>
          <Text style={styles.ad}>{item.ad || item.email || 'Kullanıcı'}</Text>
          <TouchableOpacity onPress={() => kaldir(item.id)}>
            <Text style={styles.kaldir}>Engeli kaldır</Text>
          </TouchableOpacity>
        </View>
      )}
      contentContainerStyle={liste.length === 0 ? styles.bosListe : undefined}
    />
  );
}

const styles = StyleSheet.create({
  liste: { flex: 1, backgroundColor: colors.background },
  bosListe: { flexGrow: 1 },
  bos: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xl, minHeight: 300 },
  bosMetin: { fontSize: 15, color: colors.textSecondary, textAlign: 'center' },
  satir: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  ad: { fontSize: 16, fontWeight: '500', color: colors.text, flex: 1 },
  kaldir: { fontSize: 14, color: colors.link, fontWeight: '600' },
});
