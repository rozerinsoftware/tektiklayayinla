import React, { useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import KonumSecici from '../../components/KonumSecici';
import { PrimaryButton } from '../../components/ui';
import { colors, spacing, radius } from '../../constants/theme';
import { mevcutKonumuAl } from '../../utils/konum';

export default function IlanKonumIsaretleScreen({ navigation, route }) {
  const { taslakIlan, konumModu = 'gps', adim = 2, toplamAdim = 5 } = route.params || {};
  const [konum, setKonum] = useState(null);
  const [yukleniyor, setYukleniyor] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({ title: 'Konumu İşaretleyiniz' });
  }, [navigation]);

  React.useEffect(() => {
    if (konumModu !== 'gps') return;
    (async () => {
      try {
        setYukleniyor(true);
        const k = await mevcutKonumuAl();
        setKonum(k);
      } catch (e) {
        Alert.alert('Konum', e?.message || 'GPS alınamadı. Manuel seçeneği deneyin.');
      } finally {
        setYukleniyor(false);
      }
    })();
  }, [konumModu]);

  const devamEt = () => {
    if (!konum?.latitude || !konum?.longitude) {
      Alert.alert('Konum gerekli', 'Haritada konumunuzu işaretleyin veya GPS ile alın.');
      return;
    }
    const birlesik = { ...taslakIlan, konum };
    const { sonrakiEkran, geriParams } = route.params || {};
    if (sonrakiEkran) {
      navigation.navigate(sonrakiEkran, {
        ...geriParams,
        taslakIlan: { ...(geriParams?.taslakIlan || taslakIlan), konum },
      });
      return;
    }
    navigation.navigate('PlatformSec', {
      yeniIlan: birlesik,
    });
  };

  const progressYuzde = `${Math.round((adim / toplamAdim) * 100)}%`;

  return (
    <View style={styles.container}>
      <View style={styles.haritaAlani}>
        {yukleniyor ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : (
          <>
            <Ionicons name="map" size={80} color={colors.primary} style={{ opacity: 0.35 }} />
            {konum ? (
              <View style={styles.pinWrap}>
                <Ionicons name="location" size={40} color={colors.danger} />
              </View>
            ) : null}
          </>
        )}
        <View style={styles.ipucu}>
          <Text style={styles.ipucuText}>
            Konumunuzu işaretlemek için aşağıdan GPS kullanın veya yeniden işaretleyin.
          </Text>
        </View>
      </View>

      <View style={styles.altPanel}>
        <KonumSecici konum={konum} onKonumChange={setKonum} zorunlu />
        <View style={styles.footer}>
          <View style={styles.progressWrap}>
            <Text style={styles.progressText}>
              Adres Bilgileri {adim} / {toplamAdim}
            </Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: progressYuzde }]} />
            </View>
          </View>
          <PrimaryButton title="Devam Et" icon="arrow-forward" onPress={devamEt} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  haritaAlani: {
    flex: 1,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  pinWrap: { position: 'absolute', marginTop: -20 },
  ipucu: {
    position: 'absolute',
    bottom: spacing.lg,
    left: spacing.md,
    right: spacing.md,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  ipucuText: { fontSize: 13, color: colors.textSecondary, textAlign: 'center' },
  altPanel: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footer: { marginTop: spacing.sm },
  progressWrap: { marginBottom: spacing.md },
  progressText: { fontSize: 13, color: colors.textSecondary, marginBottom: 6 },
  progressBar: { height: 4, backgroundColor: colors.border, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: colors.success },
});
