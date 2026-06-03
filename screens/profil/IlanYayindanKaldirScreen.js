import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Switch } from 'react-native';
import { unpublishIlan, deleteIlan } from '../../api';
import { PrimaryButton } from '../../components/ui';
import { colors, spacing, radius } from '../../constants/theme';

const NEDENLER = [
  'Uygulama aracılığı ile sattım / kiraladım',
  'Uygulama harici bir kurumla sattım / kiraladım',
  'Satmaktan / kiralamaktan vazgeçtim',
];

export default function IlanYayindanKaldirScreen({ navigation, route }) {
  const ilan = route.params?.ilan;
  const [neden, setNeden] = useState(NEDENLER[0]);
  const [sonraSil, setSonraSil] = useState(false);
  const [yukleniyor, setYukleniyor] = useState(false);

  const onayla = async () => {
    try {
      setYukleniyor(true);
      await unpublishIlan(ilan.id, neden);
      if (sonraSil) {
        await deleteIlan(ilan.id);
      }
      Alert.alert('Tamam', sonraSil ? 'İlan yayından kaldırıldı ve silindi.' : 'İlan yayından kaldırıldı.', [
        { text: 'Tamam', onPress: () => navigation.popToTop?.() || navigation.navigate('Profil') },
      ]);
    } catch (e) {
      Alert.alert('Hata', e?.message || 'İşlem başarısız.');
    } finally {
      setYukleniyor(false);
    }
  };

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.content}>
      <View style={styles.uyariKutu}>
        <Text style={styles.uyariBaslik}>İlanınızı yayından kaldırmak üzeresiniz.</Text>
        <Text style={styles.uyariMetin}>
          Yayından kaldırılan ilanlar arama sonuçlarında görünmez. İsterseniz daha sonra yeniden yayınlayabilirsiniz.
        </Text>
      </View>

      <Text style={styles.bolumBaslik}>İLANI YAYINDAN KALDIRMA NEDENİ</Text>
      {NEDENLER.map((n) => (
        <TouchableOpacity key={n} style={styles.nedenSatir} onPress={() => setNeden(n)}>
          <View style={[styles.radio, neden === n && styles.radioSecili]}>
            {neden === n ? <View style={styles.radioIc} /> : null}
          </View>
          <Text style={styles.nedenText}>{n}</Text>
        </TouchableOpacity>
      ))}

      <View style={styles.switchSatir}>
        <Text style={styles.switchLabel}>İlanı kaldırdıktan sonra sil</Text>
        <Switch value={sonraSil} onValueChange={setSonraSil} />
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.vazgecBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.vazgecText}>Vazgeç</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <PrimaryButton
            title={yukleniyor ? 'İşleniyor…' : 'İlanı Yayından Kaldır'}
            onPress={onayla}
            loading={yukleniyor}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: 40 },
  uyariKutu: {
    borderWidth: 1,
    borderColor: '#FDBA74',
    backgroundColor: '#FFF7ED',
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  uyariBaslik: { fontSize: 15, fontWeight: '700', color: '#C2410C', marginBottom: 6 },
  uyariMetin: { fontSize: 13, color: '#9A3412', lineHeight: 18 },
  bolumBaslik: { fontSize: 12, fontWeight: '700', color: colors.textMuted, marginBottom: spacing.sm },
  nedenSatir: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSecili: { borderColor: colors.success },
  radioIc: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.success },
  nedenText: { flex: 1, fontSize: 15, color: colors.text },
  switchSatir: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  switchLabel: { fontSize: 15, color: colors.text, flex: 1, marginRight: spacing.md },
  footer: { flexDirection: 'row', gap: spacing.sm, alignItems: 'center' },
  vazgecBtn: {
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  vazgecText: { color: colors.primary, fontWeight: '700' },
});
