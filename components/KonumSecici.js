import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { mevcutKonumuAl, formatKonumEtiket } from '../utils/konum';
import { colors, radius, spacing } from '../constants/theme';

export default function KonumSecici({ konum, onKonumChange, zorunlu }) {
  const [yukleniyor, setYukleniyor] = useState(false);

  const konumIsaretle = async () => {
    try {
      setYukleniyor(true);
      const yeni = await mevcutKonumuAl();
      onKonumChange(yeni);
    } catch (e) {
      onKonumChange(null);
      Alert.alert('Konum alınamadı', e?.message || 'GPS veya izin kontrol edin.');
    } finally {
      setYukleniyor(false);
    }
  };

  const etiket = formatKonumEtiket(konum);

  return (
    <View style={styles.wrap}>
      <View style={styles.baslikSatir}>
        <Ionicons name="location-outline" size={20} color={colors.primary} />
        <Text style={styles.baslik}>
          Konum {zorunlu ? '*' : ''}
        </Text>
      </View>
      <Text style={styles.aciklama}>
        Alıcılar ilanın nerede olduğunu görsün. GPS ile bulunduğunuz nokta işaretlenir.
      </Text>

      {etiket ? (
        <View style={styles.seciliKutu}>
          <Ionicons name="pin" size={22} color={colors.primary} />
          <Text style={styles.seciliMetin} numberOfLines={3}>
            {etiket}
          </Text>
        </View>
      ) : (
        <View style={styles.bosKutu}>
          <Text style={styles.bosMetin}>Henüz konum seçilmedi</Text>
        </View>
      )}

      <TouchableOpacity
        style={[styles.btn, yukleniyor && styles.btnDisabled]}
        onPress={konumIsaretle}
        disabled={yukleniyor}
        activeOpacity={0.85}
      >
        {yukleniyor ? (
          <ActivityIndicator color={colors.primaryText} />
        ) : (
          <>
            <Ionicons
              name={etiket ? 'refresh-outline' : 'navigate-outline'}
              size={20}
              color={colors.primaryText}
            />
            <Text style={styles.btnText}>
              {etiket ? 'Konumu yeniden işaretle' : 'Konumumu işaretle'}
            </Text>
          </>
        )}
      </TouchableOpacity>

      {etiket ? (
        <TouchableOpacity style={styles.temizle} onPress={() => onKonumChange(null)}>
          <Text style={styles.temizleText}>Konumu kaldır</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.lg },
  baslikSatir: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: spacing.xs },
  baslik: { fontSize: 15, fontWeight: '700', color: colors.text },
  aciklama: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 19,
    marginBottom: spacing.md,
  },
  seciliKutu: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  seciliMetin: { flex: 1, fontSize: 15, fontWeight: '600', color: colors.text, lineHeight: 21 },
  bosKutu: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  bosMetin: { fontSize: 14, color: colors.textMuted, textAlign: 'center' },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: radius.md,
  },
  btnDisabled: { opacity: 0.7 },
  btnText: { fontSize: 15, fontWeight: '700', color: colors.primaryText },
  temizle: { alignItems: 'center', marginTop: spacing.sm, padding: spacing.sm },
  temizleText: { fontSize: 14, color: colors.danger, fontWeight: '600' },
});
