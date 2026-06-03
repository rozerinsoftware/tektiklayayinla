import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getUygulamaAyarlari, setUygulamaAyarlari, DIL_SECENEKLERI } from '../../utils/profilStorage';
import { colors, spacing } from '../../constants/theme';

export default function DilSecScreen({ navigation }) {
  const [secili, setSecili] = useState('tr');

  useFocusEffect(
    useCallback(() => {
      let aktif = true;
      (async () => {
        const a = await getUygulamaAyarlari();
        if (aktif) setSecili(a.dil || 'tr');
      })();
      return () => {
        aktif = false;
      };
    }, [])
  );

  const sec = async (kod) => {
    setSecili(kod);
    const mevcut = await getUygulamaAyarlari();
    await setUygulamaAyarlari({ ...mevcut, dil: kod });
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.wrap}>
      <View style={styles.kutu}>
        {DIL_SECENEKLERI.map((d, i) => (
          <TouchableOpacity
            key={d.kod}
            style={[styles.satir, i === DIL_SECENEKLERI.length - 1 && styles.satirSon]}
            onPress={() => sec(d.kod)}
            activeOpacity={0.7}
          >
            <Text style={styles.satirBaslik}>{d.etiket}</Text>
            {secili === d.kod ? (
              <Ionicons name="checkmark" size={22} color={colors.primary} />
            ) : null}
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.not}>
        Dil tercihi cihazınızda saklanır. Arayüz metinleri şimdilik Türkçe gösterilmeye devam eder;
        ileride çoklu dil desteği eklenecek.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.background },
  kutu: {
    marginTop: 8,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  satir: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    minHeight: 52,
  },
  satirSon: { borderBottomWidth: 0 },
  satirBaslik: { fontSize: 16, fontWeight: '500', color: colors.text },
  not: {
    fontSize: 13,
    color: colors.textSecondary,
    padding: spacing.lg,
    lineHeight: 20,
  },
});
