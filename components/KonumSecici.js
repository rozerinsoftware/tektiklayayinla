import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Modal,
  FlatList,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  mevcutKonumuAl,
  formatKonumEtiket,
  KONUM_SECENEKLERI,
  konumSecenegiOlustur,
} from '../utils/konum';
import { colors, radius, spacing } from '../constants/theme';

export default function KonumSecici({ konum, onKonumChange, zorunlu, aciklama }) {
  const [yukleniyor, setYukleniyor] = useState(false);
  const [listeAcik, setListeAcik] = useState(false);

  const konumIsaretle = async () => {
    try {
      setYukleniyor(true);
      const yeni = await mevcutKonumuAl();
      onKonumChange(yeni);
    } catch (e) {
      onKonumChange(null);
      Alert.alert(
        'Konum alınamadı',
        (e?.message || 'GPS veya izin kontrol edin.') + '\n\nListeden il/ilçe seçebilirsiniz.'
      );
    } finally {
      setYukleniyor(false);
    }
  };

  const sehirSec = (secenek) => {
    onKonumChange(konumSecenegiOlustur(secenek));
    setListeAcik(false);
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
        {aciklama ||
          'Alıcılar ilanın nerede olduğunu görsün. GPS ile işaretleyin veya listeden il/ilçe seçin.'}
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
              {etiket ? 'GPS ile yenile' : 'Konumumu işaretle (GPS)'}
            </Text>
          </>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btnIkincil}
        onPress={() => setListeAcik(true)}
        activeOpacity={0.85}
      >
        <Ionicons name="list-outline" size={20} color={colors.primary} />
        <Text style={styles.btnIkincilText}>İl / ilçe seç</Text>
      </TouchableOpacity>

      {etiket ? (
        <TouchableOpacity style={styles.temizle} onPress={() => onKonumChange(null)}>
          <Text style={styles.temizleText}>Konumu kaldır</Text>
        </TouchableOpacity>
      ) : null}

      <Modal visible={listeAcik} animationType="slide" transparent onRequestClose={() => setListeAcik(false)}>
        <Pressable style={styles.modalArka} onPress={() => setListeAcik(false)}>
          <Pressable style={styles.modalKutu} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalBaslik}>
              <Text style={styles.modalBaslikText}>İl / ilçe seçin</Text>
              <TouchableOpacity onPress={() => setListeAcik(false)} hitSlop={8}>
                <Ionicons name="close" size={24} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={KONUM_SECENEKLERI}
              keyExtractor={(item) => item.etiket}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.listeSatir} onPress={() => sehirSec(item)} activeOpacity={0.7}>
                  <Ionicons name="location-outline" size={18} color={colors.primary} />
                  <Text style={styles.listeMetin}>{item.etiket}</Text>
                  <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
                </TouchableOpacity>
              )}
            />
          </Pressable>
        </Pressable>
      </Modal>
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
    marginBottom: spacing.sm,
  },
  btnDisabled: { opacity: 0.7 },
  btnText: { fontSize: 15, fontWeight: '700', color: colors.primaryText },
  btnIkincil: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: colors.surface,
  },
  btnIkincilText: { fontSize: 15, fontWeight: '700', color: colors.primary },
  temizle: { alignItems: 'center', marginTop: spacing.sm, padding: spacing.sm },
  temizleText: { fontSize: 14, color: colors.danger, fontWeight: '600' },
  modalArka: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modalKutu: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    maxHeight: '70%',
    paddingBottom: spacing.lg,
  },
  modalBaslik: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalBaslikText: { fontSize: 17, fontWeight: '700', color: colors.text },
  listeSatir: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  listeMetin: { flex: 1, fontSize: 15, color: colors.text },
});
